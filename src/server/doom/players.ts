import { GlideRecord, gs } from '@servicenow/glide'
import type { PlayerProfile } from './types'

export const int = (record: GlideRecord, field: string): number => parseInt(record.getValue(field) || '0', 10) || 0

/** Finds the caller's player row, creating it on first contact. The callsign is defaulted by a business rule. */
export function ensurePlayer(userId: string): GlideRecord {
    const existing = new GlideRecord('x_doom_player')
    existing.addQuery('user', userId)
    existing.setLimit(1)
    existing.query()
    if (existing.next()) return existing

    const created = new GlideRecord('x_doom_player')
    created.initialize()
    created.setValue('user', userId)
    created.insert()
    return created
}

export function toProfile(player: GlideRecord): PlayerProfile {
    return {
        callsign: player.getValue('callsign') || '',
        rank: player.getValue('rank_title') || '',
        runsCompleted: int(player, 'runs_completed'),
        levelsCleared: int(player, 'levels_cleared'),
        totalKills: int(player, 'total_kills'),
        totalItems: int(player, 'total_items'),
        totalSecrets: int(player, 'total_secrets'),
        bestScore: int(player, 'best_score'),
        totalScore: int(player, 'total_score'),
        playtimeSeconds: int(player, 'playtime_seconds'),
        doomguySteps: int(player, 'doomguy_steps'),
        doomguyShots: int(player, 'doomguy_shots'),
    }
}

export const prefName = 'x_doom.doomguy.enabled'

export function doomguyEnabled(): boolean {
    const fallback = gs.getProperty('x_doom.doomguy.default_enabled', 'false')
    return gs.getPreference(prefName, fallback) === 'true'
}
