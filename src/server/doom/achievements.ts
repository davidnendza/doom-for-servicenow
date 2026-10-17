import { GlideDateTime, GlideRecord } from '@servicenow/glide'
import { int } from './players'
import type { AchievementView } from './types'

export interface RunContext {
    runId?: string
    runKills?: number
    runScore?: number
}

function metricValue(player: GlideRecord, context: RunContext, metric: string): number {
    switch (metric) {
        case 'run_kills':
            return context.runKills ?? 0
        case 'run_score':
            return context.runScore ?? 0
        default:
            // Remaining metrics are lifetime counters held on the player row under the same name.
            return int(player, metric)
    }
}

function earnedIds(playerId: string): Set<string> {
    const earned = new Set<string>()
    const rows = new GlideRecord('x_doom_player_achievement')
    rows.addQuery('player', playerId)
    rows.query()
    while (rows.next()) earned.add(rows.getValue('achievement'))
    return earned
}

/**
 * Grants every active achievement the player now qualifies for and returns the newly earned ones.
 * Definitions live in x_doom_achievement, so admins can add or tune them without a deploy.
 */
export function evaluateAchievements(player: GlideRecord, context: RunContext = {}): { code: string; name: string }[] {
    const playerId = player.getUniqueValue()
    const already = earnedIds(playerId)
    const granted: { code: string; name: string }[] = []

    const definitions = new GlideRecord('x_doom_achievement')
    definitions.addQuery('active', true)
    definitions.orderBy('sort_order')
    definitions.query()
    while (definitions.next()) {
        const id = definitions.getUniqueValue()
        if (already.has(id)) continue
        if (metricValue(player, context, definitions.getValue('metric')) < int(definitions, 'threshold')) continue

        const award = new GlideRecord('x_doom_player_achievement')
        award.initialize()
        award.setValue('player', playerId)
        award.setValue('achievement', id)
        award.setValue('earned_at', new GlideDateTime().getValue())
        if (context.runId) award.setValue('run', context.runId)
        award.insert()
        granted.push({ code: definitions.getValue('code'), name: definitions.getValue('name') })
    }
    return granted
}

export function listAchievements(player: GlideRecord): AchievementView[] {
    const earned = new Map<string, string>()
    const rows = new GlideRecord('x_doom_player_achievement')
    rows.addQuery('player', player.getUniqueValue())
    rows.query()
    while (rows.next()) earned.set(rows.getValue('achievement'), rows.getValue('earned_at'))

    const views: AchievementView[] = []
    const definitions = new GlideRecord('x_doom_achievement')
    definitions.addQuery('active', true)
    definitions.orderBy('sort_order')
    definitions.query()
    while (definitions.next()) {
        const at = earned.get(definitions.getUniqueValue())
        views.push({
            code: definitions.getValue('code'),
            name: definitions.getValue('name'),
            description: definitions.getValue('description') || '',
            earned: at !== undefined,
            earnedAt: at,
        })
    }
    return views
}
