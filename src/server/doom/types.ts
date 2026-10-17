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

export interface AchievementView {
    code: string
    name: string
    description: string
    earned: boolean
    earnedAt?: string
}
