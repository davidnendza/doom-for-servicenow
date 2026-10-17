// Pure scoring and validation rules, kept free of Glide APIs so they can be unit tested with plain Node.

export interface LevelInput {
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

export interface LevelScore {
    score: number
    perfect: boolean
    underPar: boolean
}

export interface Validation {
    levels: LevelInput[]
    problems: string[]
}

export const SKILLS = [
    { value: 1, label: "I'm too young to die", multiplier: 0.5 },
    { value: 2, label: 'Hey, not too rough', multiplier: 0.75 },
    { value: 3, label: 'Hurt me plenty', multiplier: 1 },
    { value: 4, label: 'Ultra-Violence', multiplier: 1.5 },
    { value: 5, label: 'Nightmare!', multiplier: 2 },
]

const RANKS = [
    { minKills: 0, title: 'Imp Fodder' },
    { minKills: 10, title: 'Rookie Marine' },
    { minKills: 50, title: 'Hangar Hero' },
    { minKills: 150, title: 'Demon Hunter' },
    { minKills: 400, title: 'Hell Walker' },
    { minKills: 1000, title: 'Doom Slayer' },
    { minKills: 3000, title: "Icon of Sin's Nightmare" },
]

/** Shareware episode 1 only: E1M1 to E1M9. */
const MAP_NAME = /^E1M[1-9]$/
const MAX_COUNT = 10000
const MAX_LEVELS_PER_RUN = 9
/** Lenient grace for rounding and clock skew when comparing game time to wall-clock time. */
const TIME_GRACE_SECONDS = 30

export const skillMultiplier = (skill: number): number => SKILLS.find((s) => s.value === skill)?.multiplier ?? 1

export function rankFor(totalKills: number): string {
    let title = RANKS[0]!.title
    for (const rank of RANKS) if (totalKills >= rank.minKills) title = rank.title
    return title
}

export function isPerfect(level: LevelInput): boolean {
    const total = level.killsMax + level.itemsMax + level.secretsMax
    return (
        total > 0 && level.kills >= level.killsMax && level.items >= level.itemsMax && level.secrets >= level.secretsMax
    )
}

/** Kills 100, items 20, secrets 500, 1000 for finishing, +2500 if perfect, +10 per second under par; times skill. */
export function scoreLevel(level: LevelInput, skill: number): LevelScore {
    const perfect = isPerfect(level)
    const underPar = level.parSec > 0 && level.timeSec > 0 && level.timeSec < level.parSec
    const parBonus = underPar ? (level.parSec - level.timeSec) * 10 : 0
    const base = level.kills * 100 + level.items * 20 + level.secrets * 500 + 1000
    const bonus = (perfect ? 2500 : 0) + parBonus
    return { score: Math.round((base + bonus) * skillMultiplier(skill)), perfect, underPar }
}

const isCount = (value: unknown): value is number =>
    typeof value === 'number' && Number.isFinite(value) && Number.isInteger(value) && value >= 0 && value <= MAX_COUNT

/**
 * Checks what the browser reported against what is physically possible. The game runs on the
 * client, so this only catches careless tampering; see the README for the trust model.
 *
 * @param elapsedSeconds wall-clock seconds between the server creating the run and receiving the result
 * @param minLevelSeconds fastest plausible level time
 */
export function validateLevels(raw: unknown, elapsedSeconds: number, minLevelSeconds: number): Validation {
    const problems: string[] = []
    const levels: LevelInput[] = []

    if (!Array.isArray(raw)) return { levels, problems: ['levels must be an array'] }
    if (raw.length > MAX_LEVELS_PER_RUN) problems.push(`more than ${MAX_LEVELS_PER_RUN} levels in one run`)

    for (const item of raw.slice(0, MAX_LEVELS_PER_RUN)) {
        const l = (item ?? {}) as Record<string, unknown>
        const map = typeof l['map'] === 'string' ? l['map'] : ''
        if (!MAP_NAME.test(map)) {
            problems.push(`unknown map "${map.slice(0, 20)}"`)
            continue
        }
        const numbers = ['kills', 'killsMax', 'items', 'itemsMax', 'secrets', 'secretsMax', 'timeSec', 'parSec']
        if (!numbers.every((key) => isCount(l[key]))) {
            problems.push(`${map}: statistics are not whole numbers in range`)
            continue
        }
        const level: LevelInput = {
            map,
            kills: l['kills'] as number,
            killsMax: l['killsMax'] as number,
            items: l['items'] as number,
            itemsMax: l['itemsMax'] as number,
            secrets: l['secrets'] as number,
            secretsMax: l['secretsMax'] as number,
            timeSec: l['timeSec'] as number,
            parSec: l['parSec'] as number,
        }
        if (level.kills > level.killsMax || level.items > level.itemsMax || level.secrets > level.secretsMax) {
            problems.push(`${map}: more kills, items or secrets than the level contains`)
        }
        if (level.timeSec < minLevelSeconds)
            problems.push(`${map}: finished in ${level.timeSec}s, faster than possible`)
        levels.push(level)
    }

    const gameSeconds = levels.reduce((sum, level) => sum + level.timeSec, 0)
    if (gameSeconds > elapsedSeconds + TIME_GRACE_SECONDS) {
        problems.push(
            `reported ${gameSeconds}s of game time but only ${Math.round(elapsedSeconds)}s passed since the run began`
        )
    }
    return { levels, problems }
}
