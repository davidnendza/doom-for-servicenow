// Exercises the real src/server/doom/* handlers (and the business rules declared in the Fluent
// sources) against the in-memory Glide emulator. Run: npm run test:server
import { before, beforeEach, describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { boot, db, handle, reset, tableRows } from './platform.mjs'
import { GlideDateTime, GlideRecord, setUser } from './mock-glide.mjs'

const BASE = '/api/x_417611_doom/doom'
const call = (method, path, options = {}) => handle({ method, path: BASE + path, ...options })
const result = (response) => {
    assert.ok(response.status < 300, `unexpected ${response.status}: ${JSON.stringify(response.body)}`)
    return response.body.result
}
const advance = (seconds) => (GlideDateTime.offsetMs = (GlideDateTime.offsetMs ?? 0) + seconds * 1000)

const level = (overrides = {}) => ({
    map: 'E1M1',
    kills: 10,
    killsMax: 12,
    items: 5,
    itemsMax: 8,
    secrets: 1,
    secretsMax: 3,
    timeSec: 95,
    parSec: 30,
    ...overrides,
})

function playRun(user, levels, { skill = 3, seconds = 600 } = {}) {
    const run = result(call('POST', '/runs', { user, body: { episode: 1, skill } }))
    advance(seconds)
    const response = call('POST', `/runs/${run.runId}/finish`, { user, body: { levels, clientSeconds: seconds } })
    return { run, response }
}

before(boot)
beforeEach(() => {
    reset()
    GlideDateTime.offsetMs = 0
})

describe('profile', () => {
    it('creates the player on first contact, named after the user, with every achievement unearned', () => {
        const me = result(call('GET', '/me'))
        assert.equal(me.player.callsign, 'Dev Marine')
        assert.equal(me.player.rank, 'Imp Fodder')
        assert.equal(me.achievements.length, 10)
        assert.ok(me.achievements.every((a) => !a.earned))
        assert.deepEqual(
            me.skills.map((s) => s.value),
            [1, 2, 3, 4, 5]
        )
        assert.equal(me.doomguyEnabled, false)
        assert.equal(tableRows('x_417611_doom_player').size, 1)
    })

    it('does not create a second player row for the same user', () => {
        call('GET', '/me')
        call('GET', '/me')
        assert.equal(tableRows('x_417611_doom_player').size, 1)
    })

    it('enforces the unique index on player.user', () => {
        call('GET', '/me')
        const dupe = new GlideRecord('x_417611_doom_player')
        dupe.initialize()
        dupe.setValue('user', 'u_marine')
        assert.equal(dupe.insert(), null)
    })
})

describe('runs', () => {
    it('starts a numbered run in the playing state', () => {
        const run = result(call('POST', '/runs', { body: { episode: 1, skill: 4 } }))
        assert.match(run.number, /^DOOM\d{7}$/)
        const row = tableRows('x_417611_doom_run').get(run.runId)
        assert.equal(row.state, 'playing')
        assert.equal(row.skill, '4')
    })

    it('abandons a previous run that is still in progress when a new one starts', () => {
        const first = result(call('POST', '/runs', { body: { episode: 1, skill: 3 } }))
        result(call('POST', '/runs', { body: { episode: 1, skill: 3 } }))
        assert.equal(tableRows('x_417611_doom_run').get(first.runId).state, 'abandoned')
    })

    it('rejects bad input', () => {
        assert.equal(call('POST', '/runs', { body: { episode: 1, skill: 9 } }).status, 400)
        assert.equal(call('POST', '/runs', { body: { episode: 2, skill: 3 } }).status, 400)
    })

    it('banks a completed run: scores levels, updates totals, rank and the leaderboard', () => {
        const levels = [
            level(),
            level({
                map: 'E1M2',
                kills: 20,
                killsMax: 20,
                items: 8,
                itemsMax: 8,
                secrets: 2,
                secretsMax: 2,
                timeSec: 60,
                parSec: 90,
            }),
        ]
        const { response } = playRun('marine', levels)
        const done = result(response)

        // E1M1: 10*100 + 5*20 + 1*500 + 1000 = 2600. E1M2: perfect, 20*100 + 8*20 + 2*500 + 1000 + 2500 + 30s under par * 10 = 7000 + ... see below.
        const e1m2 = 20 * 100 + 8 * 20 + 2 * 500 + 1000 + 2500 + (90 - 60) * 10
        assert.equal(done.state, 'completed')
        assert.equal(done.integrity, 'verified')
        assert.equal(done.levelsCompleted, 2)
        assert.equal(done.score, 2600 + e1m2)

        const player = done.player
        assert.equal(player.runsCompleted, 1)
        assert.equal(player.levelsCleared, 2)
        assert.equal(player.totalKills, 30)
        assert.equal(player.totalItems, 13)
        assert.equal(player.totalSecrets, 3)
        assert.equal(player.bestScore, done.score)
        assert.equal(player.rank, 'Rookie Marine') // 30 kills

        const codes = done.newAchievements.map((a) => a.code).sort()
        assert.deepEqual(codes, ['first_blood', 'hangar_cleared', 'perfectionist', 'speed_demon'].sort())
        assert.equal(tableRows('x_417611_doom_level_stat').size, 2)
    })

    it('does not grant the same achievement twice', () => {
        playRun('marine', [level()])
        const second = result(playRun('marine', [level()]).response)
        assert.deepEqual(second.newAchievements, [])
        assert.equal(second.player.runsCompleted, 2)
    })

    it('applies the skill multiplier', () => {
        const easy = result(playRun('marine', [level()], { skill: 1 }).response)
        reset()
        const nightmare = result(playRun('marine', [level()], { skill: 5 }).response)
        assert.equal(nightmare.score / easy.score, 4) // 2.0x versus 0.5x
    })

    it('records a run with no completed levels as abandoned and leaves the player untouched', () => {
        const { response } = playRun('marine', [])
        const done = result(response)
        assert.equal(done.state, 'abandoned')
        assert.equal(done.player.runsCompleted, 0)
    })

    it('can only be finished once, and only by its owner', () => {
        const run = result(call('POST', '/runs', { user: 'marine', body: { episode: 1, skill: 3 } }))
        advance(600)
        const body = { levels: [level()], clientSeconds: 600 }
        assert.equal(call('POST', `/runs/${run.runId}/finish`, { user: 'isabella', body }).status, 404)
        assert.equal(call('POST', `/runs/${run.runId}/finish`, { user: 'marine', body }).status, 200)
        assert.equal(call('POST', `/runs/${run.runId}/finish`, { user: 'marine', body }).status, 409)
    })

    it('abandon only affects the owner and only a run in progress', () => {
        const run = result(call('POST', '/runs', { user: 'marine', body: { episode: 1, skill: 3 } }))
        assert.equal(call('POST', `/runs/${run.runId}/abandon`, { user: 'isabella', body: {} }).status, 404)
        assert.equal(call('POST', `/runs/${run.runId}/abandon`, { user: 'marine', body: {} }).status, 200)
        assert.equal(tableRows('x_417611_doom_run').get(run.runId).state, 'abandoned')
    })
})

describe('integrity checks', () => {
    const cases = [
        ['more kills than the level holds', [level({ kills: 13 })], /more kills, items or secrets/],
        ['a level finished faster than possible', [level({ timeSec: 3 })], /faster than possible/],
        ['an unknown map', [level({ map: 'MAP01' })], /unknown map/],
        ['non-numeric statistics', [level({ kills: '10' })], /whole numbers/],
        ['negative statistics', [level({ items: -1 })], /whole numbers/],
        ['more game time than wall-clock time', [level({ timeSec: 5000 })], /game time/],
    ]
    for (const [name, levels, pattern] of cases) {
        it(`rejects ${name}`, () => {
            const done = result(playRun('mallory', levels, { seconds: 120 }).response)
            assert.equal(done.state, 'rejected')
            assert.equal(done.score, 0)
            assert.equal(done.integrity, 'suspect')
            assert.match(done.integrityNotes, pattern)
            assert.equal(done.player.runsCompleted, 0)
            assert.equal(done.player.totalKills, 0)
            assert.deepEqual(done.newAchievements, [])
        })
    }

    it('keeps a suspect run, flagged, when the property says not to reject', () => {
        db.properties.set('x_417611_doom.reject_suspect_runs', 'false')
        const done = result(playRun('mallory', [level({ kills: 13 })]).response)
        assert.equal(done.state, 'completed')
        assert.equal(done.integrity, 'suspect')
        assert.ok(done.score > 0)
    })

    it('rejected runs are kept for audit and never reach the leaderboard', () => {
        playRun('mallory', [level({ kills: 13 })])
        assert.equal(tableRows('x_417611_doom_level_stat').size, 1)
        assert.deepEqual(result(call('GET', '/leaderboard')), [])
    })
})

describe('business rules', () => {
    it('a closed run cannot be reopened', () => {
        const { run } = playRun('marine', [level()])
        const gr = new GlideRecord('x_417611_doom_run')
        assert.ok(gr.get(run.runId))
        gr.setValue('state', 'playing')
        assert.equal(gr.update(), null)
        assert.equal(tableRows('x_417611_doom_run').get(run.runId).state, 'completed')
        assert.match(db.messages.at(-1), /cannot be reopened/)
    })

    it('rank follows total_kills even when an admin edits the row', () => {
        call('GET', '/me')
        const gr = new GlideRecord('x_417611_doom_player')
        gr.query()
        assert.ok(gr.next())
        gr.setValue('total_kills', 60)
        gr.update()
        assert.equal(gr.getValue('rank_title'), 'Hangar Hero')
        gr.setValue('total_kills', 1500)
        gr.update()
        assert.equal(gr.getValue('rank_title'), 'Doom Slayer')
    })

    it('completing a run only fires the banking rule on the change to completed', () => {
        const { run } = playRun('marine', [level()])
        const gr = new GlideRecord('x_417611_doom_run')
        gr.get(run.runId)
        gr.setValue('integrity_notes', 'touched by an admin')
        gr.update()
        const me = result(call('GET', '/me'))
        assert.equal(me.player.runsCompleted, 1)
    })
})

describe('leaderboard', () => {
    it('orders players by best score and honours the limit', () => {
        playRun('marine', [level()])
        playRun('isabella', [level({ kills: 12, items: 8, secrets: 3 })])
        playRun('mallory', [level({ kills: 99 })]) // rejected, never listed
        const board = result(call('GET', '/leaderboard'))
        assert.deepEqual(
            board.map((e) => e.callsign),
            ['Isabella Hellwalker', 'Dev Marine']
        )
        assert.equal(result(call('GET', '/leaderboard', { query: { limit: '1' } })).length, 1)
    })
})

describe('doomguy', () => {
    it('stores the toggle per user', () => {
        assert.equal(result(call('GET', '/doomguy')).enabled, false)
        result(call('PUT', '/doomguy', { body: { enabled: true } }))
        assert.equal(result(call('GET', '/doomguy')).enabled, true)
        assert.equal(result(call('GET', '/doomguy', { user: 'isabella' })).enabled, false)
        result(call('PUT', '/doomguy', { body: { enabled: false } }))
        assert.equal(result(call('GET', '/doomguy')).enabled, false)
    })

    it('stores the autopilot/manual mode per user, defaulting to auto, independently of the switch', () => {
        assert.equal(result(call('GET', '/doomguy')).mode, 'auto')
        result(call('PUT', '/doomguy', { body: { mode: 'manual' } }))
        const after = result(call('GET', '/doomguy'))
        assert.equal(after.mode, 'manual')
        assert.equal(after.enabled, false) // untouched
        result(call('PUT', '/doomguy', { body: { enabled: true } }))
        assert.equal(result(call('GET', '/doomguy')).mode, 'manual') // untouched
        assert.equal(result(call('GET', '/doomguy', { user: 'isabella' })).mode, 'auto')
        result(call('PUT', '/doomguy', { body: { mode: 'nonsense' } }))
        assert.equal(result(call('GET', '/doomguy')).mode, 'manual')
    })

    it('uses the system property as the default for users who never chose', () => {
        db.properties.set('x_417611_doom.doomguy.default_enabled', 'true')
        assert.equal(result(call('GET', '/doomguy', { user: 'isabella' })).enabled, true)
    })

    it('accumulates steps and shots, caps each report, and awards the achievements', () => {
        result(call('POST', '/doomguy/telemetry', { body: { steps: 1500, shots: 400 } }))
        let me = result(call('GET', '/me'))
        assert.equal(me.player.doomguySteps, 1500)
        assert.equal(me.achievements.filter((a) => a.earned).length, 0)

        result(call('POST', '/doomguy/telemetry', { body: { steps: 1e9, shots: 1e9 } })) // capped at 5000 / 1000
        me = result(call('GET', '/me'))
        assert.equal(me.player.doomguySteps, 6500)
        assert.equal(me.player.doomguyShots, 1400)
        assert.deepEqual(
            me.achievements
                .filter((a) => a.earned)
                .map((a) => a.code)
                .sort(),
            ['marathon_marine', 'trigger_happy']
        )
    })

    it('ignores garbage telemetry', () => {
        result(call('POST', '/doomguy/telemetry', { body: { steps: 'lots', shots: -5 } }))
        assert.equal(result(call('GET', '/me')).player.doomguySteps, 0)
    })
})

describe('robustness', () => {
    it('turns an unexpected failure into a generic 500 without leaking details', () => {
        setUser('u_marine')
        const response = {}
        response.setStatus = (code) => (response.status = code)
        response.setBody = (body) => (response.body = body)
        response.setError = (error) => (
            (response.status = error.status), (response.body = { error: { message: error.message } })
        )
        const originalError = console.error
        console.error = () => undefined
        try {
            // Dispatch directly so a syntactically invalid body reaches the handler.
            handle({ method: 'GET', path: BASE + '/me' }) // make sure the user exists first
            const routeResponse = handleRaw('POST', '/runs', '{not json')
            assert.equal(routeResponse.status, 500)
            assert.equal(routeResponse.body.error.message, 'The Doom service hit an unexpected error.')
        } finally {
            console.error = originalError
        }
    })
})

import { startRun } from '../src/server/doom/api.ts'
function handleRaw(method, path, rawBody) {
    setUser('u_marine')
    const response = {}
    response.setStatus = (code) => (response.status = code)
    response.setBody = (body) => (response.body = body)
    response.setError = (error) => {
        response.status = error.status
        response.body = { error: { message: error.message } }
    }
    startRun({ body: { dataString: rawBody }, pathParams: {}, queryParams: {}, uri: BASE + path }, response)
    return response
}
