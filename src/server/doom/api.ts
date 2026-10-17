import { GlideDateTime, GlideRecord, gs } from '@servicenow/glide'
import { ServiceError } from '@servicenow/glide/sn_ws_err'
import type { RESTAPIRequest, RESTAPIResponse } from '@servicenow/glide/sn_ws_int'
import { evaluateAchievements, listAchievements } from './achievements.ts'
import { doomguyEnabled, doomguyMode, doomguySound, ensurePlayer, int, modePrefName, prefName, soundPrefName, toProfile } from './players.ts'
import { SKILLS, scoreLevel, validateLevels } from './scoring.ts'

type Json = Record<string, unknown>

function fail(response: RESTAPIResponse, status: number, message: string): void {
    response.setError(new ServiceError().setStatus(status).setMessage(message))
}

function ok(response: RESTAPIResponse, result: unknown, status = 200): void {
    response.setStatus(status)
    // The platform wraps whatever is set here in { result: ... } itself.
    response.setBody(result as object)
}

/** Parses the JSON body ourselves: the platform's pre-parsed `body.data` does not always yield real arrays. */
function parseBody(request: RESTAPIRequest): Json {
    const text = request.body?.dataString
    if (!text) return {}
    const parsed = JSON.parse(text)
    return parsed && typeof parsed === 'object' ? (parsed as Json) : {}
}

function queryParam(request: RESTAPIRequest, name: string): string | undefined {
    const value = request.queryParams?.[name]
    if (value === undefined || value === null) return undefined
    return typeof value === 'string' ? value : String(value[0] ?? value)
}

/** Runs a handler so unexpected errors become a generic 500 and the detail goes to the system log. */
function guarded(request: RESTAPIRequest, response: RESTAPIResponse, handler: () => void): void {
    try {
        handler()
    } catch (error) {
        gs.error(`[x_417611_doom] ${request.uri} failed: ${error}`)
        fail(response, 500, 'The Doom service hit an unexpected error.')
    }
}

const minLevelSeconds = (): number => parseInt(gs.getProperty('x_417611_doom.min_level_seconds', '8'), 10) || 0
const rejectSuspect = (): boolean => gs.getProperty('x_417611_doom.reject_suspect_runs', 'true') === 'true'

// ---- profile ---------------------------------------------------------------------------------

export function getMe(request: RESTAPIRequest, response: RESTAPIResponse): void {
    guarded(request, response, () => {
        const player = ensurePlayer(gs.getUserID())
        ok(response, {
            player: toProfile(player),
            achievements: listAchievements(player),
            skills: SKILLS.map(({ value, label }) => ({ value, label })),
            doomguyEnabled: doomguyEnabled(),
        })
    })
}

export function getLeaderboard(request: RESTAPIRequest, response: RESTAPIResponse): void {
    guarded(request, response, () => {
        const limit = Math.min(50, Math.max(1, parseInt(queryParam(request, 'limit') ?? '10', 10) || 10))
        const board = new GlideRecord('x_417611_doom_player')
        board.addQuery('best_score', '>', 0)
        board.orderByDesc('best_score')
        board.setLimit(limit)
        board.query()
        const entries: Json[] = []
        while (board.next()) {
            entries.push({
                callsign: board.getValue('callsign'),
                rank: board.getValue('rank_title'),
                bestScore: int(board, 'best_score'),
                totalKills: int(board, 'total_kills'),
                runsCompleted: int(board, 'runs_completed'),
            })
        }
        ok(response, entries)
    })
}

// ---- runs ------------------------------------------------------------------------------------

export function startRun(request: RESTAPIRequest, response: RESTAPIResponse): void {
    guarded(request, response, () => {
        const body = parseBody(request)
        const skill = Number(body['skill'])
        const episode = Number(body['episode'])
        if (!Number.isInteger(skill) || skill < 1 || skill > 5)
            return fail(response, 400, 'skill must be a whole number from 1 to 5')
        if (episode !== 1) return fail(response, 400, 'Only episode 1 ships in the shareware WAD')

        const player = ensurePlayer(gs.getUserID())

        // A player has at most one run in progress; anything left over was abandoned (closed tab, crash).
        const stale = new GlideRecord('x_417611_doom_run')
        stale.addQuery('player', player.getUniqueValue())
        stale.addQuery('state', 'playing')
        stale.query()
        while (stale.next()) {
            stale.setValue('state', 'abandoned')
            stale.setValue('ended_at', new GlideDateTime().getValue())
            stale.update()
        }

        const run = new GlideRecord('x_417611_doom_run')
        // newRecord(), not initialize(): only newRecord() runs the number column's javascript: default.
        run.newRecord()
        run.setValue('player', player.getUniqueValue())
        run.setValue('state', 'playing')
        run.setValue('episode', episode)
        run.setValue('skill', String(skill))
        run.setValue('started_at', new GlideDateTime().getValue())
        run.insert()
        ok(response, { runId: run.getUniqueValue(), number: run.getValue('number') }, 201)
    })
}

function loadOwnRun(runId: string): GlideRecord | undefined {
    const run = new GlideRecord('x_417611_doom_run')
    if (!run.get(runId)) return undefined
    const player = new GlideRecord('x_417611_doom_player')
    if (!player.get(run.getValue('player')) || player.getValue('user') !== gs.getUserID()) return undefined
    return run
}

export function finishRun(request: RESTAPIRequest, response: RESTAPIResponse): void {
    guarded(request, response, () => {
        const run = loadOwnRun(request.pathParams.id)
        if (!run) return fail(response, 404, 'No such run')
        if (run.getValue('state') !== 'playing') return fail(response, 409, 'This run has already been closed')

        const body = parseBody(request)
        const now = new GlideDateTime()
        const startedMs = new GlideDateTime(run.getValue('started_at')).getNumericValue()
        const elapsedSeconds = Math.max(0, Math.round((now.getNumericValue() - startedMs) / 1000))
        const skill = parseInt(run.getValue('skill'), 10) || 3

        const { levels, problems } = validateLevels(body['levels'], elapsedSeconds, minLevelSeconds())
        const suspect = problems.length > 0

        let state: 'completed' | 'abandoned' | 'rejected' = 'completed'
        if (levels.length === 0 && !suspect) state = 'abandoned'
        else if (suspect && rejectSuspect()) state = 'rejected'

        let kills = 0
        let items = 0
        let secrets = 0
        let score = 0
        for (const level of levels) {
            // Rejected runs keep their level rows for audit but score nothing.
            const levelScore = state === 'rejected' ? 0 : scoreLevel(level, skill).score
            const row = new GlideRecord('x_417611_doom_level_stat')
            row.initialize()
            row.setValue('run', run.getUniqueValue())
            row.setValue('map', level.map)
            row.setValue('kills', level.kills)
            row.setValue('kills_max', level.killsMax)
            row.setValue('items', level.items)
            row.setValue('items_max', level.itemsMax)
            row.setValue('secrets', level.secrets)
            row.setValue('secrets_max', level.secretsMax)
            row.setValue('time_seconds', level.timeSec)
            row.setValue('par_seconds', level.parSec)
            row.setValue('score', levelScore)
            row.insert()
            kills += level.kills
            items += level.items
            secrets += level.secrets
            score += levelScore
        }

        run.setValue('state', state)
        run.setValue('ended_at', now.getValue())
        run.setValue('duration_seconds', elapsedSeconds)
        run.setValue('levels_completed', levels.length)
        run.setValue('kills', kills)
        run.setValue('items', items)
        run.setValue('secrets', secrets)
        run.setValue('score', score)
        run.setValue('integrity', suspect ? 'suspect' : 'verified')
        run.setValue('integrity_notes', problems.join('; ').slice(0, 1000))
        // Player totals, rank and achievements are handled by the business rules on this update.
        run.update()

        const player = new GlideRecord('x_417611_doom_player')
        player.get(run.getValue('player'))

        const newAchievements: { code: string; name: string }[] = []
        const awards = new GlideRecord('x_417611_doom_player_achievement')
        awards.addQuery('run', run.getUniqueValue())
        awards.query()
        while (awards.next()) {
            const definition = new GlideRecord('x_417611_doom_achievement')
            if (definition.get(awards.getValue('achievement'))) {
                newAchievements.push({ code: definition.getValue('code'), name: definition.getValue('name') })
            }
        }

        ok(response, {
            state,
            score,
            integrity: suspect ? 'suspect' : 'verified',
            integrityNotes: problems.join('; '),
            levelsCompleted: levels.length,
            newAchievements,
            player: toProfile(player),
        })
    })
}

export function abandonRun(request: RESTAPIRequest, response: RESTAPIResponse): void {
    guarded(request, response, () => {
        const run = loadOwnRun(request.pathParams.id)
        if (!run) return fail(response, 404, 'No such run')
        if (run.getValue('state') === 'playing') {
            run.setValue('state', 'abandoned')
            run.setValue('ended_at', new GlideDateTime().getValue())
            run.update()
        }
        ok(response, {})
    })
}

// ---- doomguy ---------------------------------------------------------------------------------

export function getDoomguy(request: RESTAPIRequest, response: RESTAPIResponse): void {
    guarded(request, response, () => ok(response, { enabled: doomguyEnabled(), mode: doomguyMode(), sound: doomguySound() }))
}

export function putDoomguy(request: RESTAPIRequest, response: RESTAPIResponse): void {
    guarded(request, response, () => {
        const body = parseBody(request)
        // Each field is optional so the on/off switch and the mode can be changed independently.
        if (typeof body['enabled'] === 'boolean') gs.getUser().savePreference(prefName, body['enabled'] ? 'true' : 'false')
        if (body['mode'] === 'auto' || body['mode'] === 'manual') gs.getUser().savePreference(modePrefName, body['mode'])
        if (typeof body['sound'] === 'boolean') gs.getUser().savePreference(soundPrefName, body['sound'] ? 'true' : 'false')
        ok(response, { enabled: doomguyEnabled(), mode: doomguyMode(), sound: doomguySound() })
    })
}

/** Steps and shots are self-reported by the browser, so each call is capped. */
export function postDoomguyTelemetry(request: RESTAPIRequest, response: RESTAPIResponse): void {
    guarded(request, response, () => {
        const body = parseBody(request)
        const clamp = (value: unknown, max: number): number => {
            const n = Number(value)
            return Number.isFinite(n) ? Math.min(max, Math.max(0, Math.floor(n))) : 0
        }
        const steps = clamp(body['steps'], 5000)
        const shots = clamp(body['shots'], 1000)

        const player = ensurePlayer(gs.getUserID())
        player.setValue('doomguy_steps', int(player, 'doomguy_steps') + steps)
        player.setValue('doomguy_shots', int(player, 'doomguy_shots') + shots)
        player.update()
        evaluateAchievements(player)
        ok(response, {})
    })
}
