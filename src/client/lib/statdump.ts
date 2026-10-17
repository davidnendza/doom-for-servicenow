export interface LevelStat {
    /** Map lump name, e.g. E1M1 */
    map: string
    kills: number
    killsMax: number
    items: number
    itemsMax: number
    secrets: number
    secretsMax: number
    timeSec: number
    parSec: number
}

const LEVEL_NAME = /^(E\d+M\d+|MAP\d+)(?: \/ MAP\d+)?$/
const TIME = /^Time:\s*(\d+):(\d+)\s*\(par:\s*(\d+):(\d+)\)/
const COUNTER = /^\s*(Kills|Items|Secrets):\s*(\d+)(?:\s*\/\s*(\d+))?/

/**
 * Parses the text the engine writes for `-statdump -` (Chocolate Doom's statdump.c format):
 *
 *   ===========================================
 *   E1M1
 *   ===========================================
 *
 *   Time: 1:23 (par: 0:30)
 *
 *   Player 1 (Green):
 *           Kills: 12 / 15 (80%)
 *           Items: 3 / 8 (37%)
 *           Secrets: 0
 *
 * Only player 1 is read. A total of zero is printed as a bare "0".
 */
export function parseStatDump(lines: string[]): LevelStat[] {
    const levels: LevelStat[] = []
    let current: LevelStat | undefined
    let inPlayerOne = false

    for (const raw of lines) {
        const line = raw.replace(/\r$/, '')
        const trimmed = line.trim()

        const name = LEVEL_NAME.exec(trimmed)
        if (name) {
            current = {
                map: name[1]!,
                kills: 0,
                killsMax: 0,
                items: 0,
                itemsMax: 0,
                secrets: 0,
                secretsMax: 0,
                timeSec: 0,
                parSec: 0,
            }
            levels.push(current)
            inPlayerOne = false
            continue
        }
        if (!current) continue

        const time = TIME.exec(trimmed)
        if (time) {
            current.timeSec = Number(time[1]) * 60 + Number(time[2])
            current.parSec = Number(time[3]) * 60 + Number(time[4])
            continue
        }

        if (/^Player \d+/.test(trimmed)) {
            inPlayerOne = /^Player 1\b/.test(trimmed)
            continue
        }

        const counter = COUNTER.exec(line)
        if (counter && inPlayerOne) {
            const value = Number(counter[2])
            const max = counter[3] === undefined ? 0 : Number(counter[3])
            if (counter[1] === 'Kills') [current.kills, current.killsMax] = [value, max]
            else if (counter[1] === 'Items') [current.items, current.itemsMax] = [value, max]
            else [current.secrets, current.secretsMax] = [value, max]
        }
    }
    return levels
}
