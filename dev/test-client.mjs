// Unit tests for the browser-side stat-dump parser. Run: npm run test:client
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { parseStatDump } from '../src/client/lib/statdump.ts'

const BANNER = '==========================================='
// Laid out exactly as statdump.c prints it (PrintStats / PrintPlayerStats / PrintPercentage).
const sample = [
    'Statistics captured for 2 level(s)',
    BANNER,
    'E1M1',
    BANNER,
    '',
    'Time: 1:23 (par: 0:30)',
    '',
    'Player 1 (Green):',
    '\tKills: 12 / 15 (80%)',
    '\tItems: 3 / 8 (37%)',
    '\tSecrets: 0',
    '',
    BANNER,
    'E1M2',
    BANNER,
    '',
    'Time: 10:05 (par: 1:15)',
    '',
    'Player 1 (Green):',
    '\tKills: 40 / 40 (100%)',
    '\tItems: 20 / 20 (100%)',
    '\tSecrets: 2 / 3 (66%)',
    '',
]

describe('parseStatDump', () => {
    it('reads every level for player 1', () => {
        const levels = parseStatDump(sample)
        assert.equal(levels.length, 2)
        assert.deepEqual(levels[0], {
            map: 'E1M1',
            kills: 12,
            killsMax: 15,
            items: 3,
            itemsMax: 8,
            secrets: 0,
            secretsMax: 0,
            timeSec: 83,
            parSec: 30,
        })
        assert.deepEqual(levels[1], {
            map: 'E1M2',
            kills: 40,
            killsMax: 40,
            items: 20,
            itemsMax: 20,
            secrets: 2,
            secretsMax: 3,
            timeSec: 605,
            parSec: 75,
        })
    })

    it('treats a bare "0" total as zero of zero', () => {
        const [level] = parseStatDump([
            'E1M3',
            'Time: 0:45 (par: 2:00)',
            'Player 1 (Green):',
            '\tKills: 0',
            '\tItems: 0',
            '\tSecrets: 0',
        ])
        assert.equal(level.killsMax, 0)
        assert.equal(level.timeSec, 45)
    })

    it('accepts the ambiguous "E1M1 / MAP01" heading', () => {
        assert.equal(parseStatDump(['E1M1 / MAP01', 'Time: 0:10 (par: 0:30)'])[0].map, 'E1M1')
    })

    it('ignores other players and returns nothing when no level was completed', () => {
        const coop = [...sample.slice(0, 11), 'Player 2 (Indigo):', '\tKills: 99 / 99 (100%)']
        assert.equal(parseStatDump(coop)[0].kills, 12)
        assert.deepEqual(parseStatDump(['Statistics captured for 0 level(s)']), [])
    })

    it('copes with engine chatter and Windows line endings', () => {
        const noisy = ['I_Init: Setting up machine state.', ...sample.map((l) => l + '\r'), 'M_SaveDefaults']
        assert.equal(parseStatDump(noisy).length, 2)
    })
})
