import type { LevelStat } from './statdump'

const BASE = '/api/x_417611_doom/doom'

export interface PlayerProfile {
    callsign: string
    rank: string
    runsCompleted: number
    levelsCleared: number
    totalKills: number
    totalItems: number
    totalSecrets: number
    bestScore: number
    totalScore: number
    playtimeSeconds: number
    doomguySteps: number
    doomguyShots: number
}

export interface Achievement {
    code: string
    name: string
    description: string
    earned: boolean
    earnedAt?: string
}

export interface Me {
    player: PlayerProfile
    achievements: Achievement[]
    skills: { value: number; label: string }[]
    doomguyEnabled: boolean
}

export interface LeaderboardEntry {
    callsign: string
    rank: string
    bestScore: number
    totalKills: number
    runsCompleted: number
}

export interface FinishResult {
    state: 'completed' | 'abandoned' | 'rejected'
    score: number
    integrity: 'verified' | 'suspect'
    integrityNotes: string
    levelsCompleted: number
    newAchievements: { code: string; name: string }[]
    player: PlayerProfile
}

declare global {
    interface Window {
        g_ck?: string
    }
}

/** g_ck lives on the window that owns the session: this page, or (when hosted in a frame) a same-origin ancestor. */
function findSessionToken(): string | undefined {
    let win: Window = window
    for (let depth = 0; depth < 6; depth++) {
        try {
            const token = (win as Window).g_ck
            if (token) return token
            if (win.parent === win) break
            win = win.parent
        } catch {
            break // cross-origin ancestor
        }
    }
    return undefined
}

let tokenProvider: () => string | undefined = findSessionToken

/** Lets a caller that isn't the page owning the session (e.g. a top-window overlay) supply g_ck. */
export function setTokenProvider(provider: () => string | undefined): void {
    tokenProvider = provider
}

function headers(): Record<string, string> {
    const h: Record<string, string> = { Accept: 'application/json', 'Content-Type': 'application/json' }
    const token = tokenProvider()
    if (token) h['X-UserToken'] = token
    return h
}

async function call<T>(method: string, path: string, body?: unknown, keepalive = false): Promise<T> {
    const res = await fetch(BASE + path, {
        method,
        headers: headers(),
        credentials: 'same-origin',
        body: body === undefined ? undefined : JSON.stringify(body),
        keepalive,
    })
    if (!res.ok) {
        let detail = res.statusText
        try {
            detail = (await res.json())?.error?.message ?? detail
        } catch {
            /* non-JSON error body */
        }
        throw new Error(`${method} ${path} failed (${res.status}): ${detail}`)
    }
    return ((await res.json()) as { result: T }).result
}

export const getMe = () => call<Me>('GET', '/me')
export const getLeaderboard = (limit = 10) => call<LeaderboardEntry[]>('GET', `/leaderboard?limit=${limit}`)
export const startRun = (episode: number, skill: number) =>
    call<{ runId: string; number: string }>('POST', '/runs', { episode, skill })
export const finishRun = (runId: string, levels: LevelStat[], clientSeconds: number) =>
    call<FinishResult>('POST', `/runs/${runId}/finish`, { levels, clientSeconds })
export const abandonRun = (runId: string) => call<void>('POST', `/runs/${runId}/abandon`, {}, true)
export type DoomguyMode = 'auto' | 'manual'
export const getDoomguy = () => call<{ enabled: boolean; mode?: DoomguyMode }>('GET', '/doomguy')
export const setDoomguy = (enabled: boolean) => call<{ enabled: boolean }>('PUT', '/doomguy', { enabled })
export const setDoomguyMode = (mode: DoomguyMode) => call<{ mode: DoomguyMode }>('PUT', '/doomguy', { mode })
export const sendDoomguyTelemetry = (steps: number, shots: number) =>
    call<void>('POST', '/doomguy/telemetry', { steps, shots }, true)
