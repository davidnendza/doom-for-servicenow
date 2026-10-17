import { GlideDateTime, GlideRecord, gs } from '@servicenow/glide'
import { evaluateAchievements } from './achievements.ts'
import { int } from './players.ts'
import { isPerfect, rankFor } from './scoring.ts'

/** Before insert on x_417611_doom_player: callsign defaults to the user's display name. */
export function defaultCallsign(current: GlideRecord): void {
    if (current.getValue('callsign')) return
    const user = new GlideRecord('sys_user')
    const name = user.get(current.getValue('user')) ? user.getValue('name') || user.getValue('user_name') : ''
    current.setValue('callsign', name || 'Unknown Marine')
}

/** Before insert/update on x_417611_doom_player: the rank follows lifetime kills, whoever edits the row. */
export function updateRank(current: GlideRecord): void {
    current.setValue('rank_title', rankFor(int(current, 'total_kills')))
}

/** Before update on x_417611_doom_run: a run that has left "playing" can never go back to it. */
export function lockClosedRuns(current: GlideRecord, previous: GlideRecord): void {
    if (previous.getValue('state') !== 'playing') {
        gs.addErrorMessage('A closed Doom run cannot be reopened.')
        current.setAbortAction(true)
    }
}

/**
 * After update on x_417611_doom_run, when state changes to "completed": rolls the run into the player's
 * lifetime totals (kills, best score, perfect levels, ...) and then grants any achievements earned.
 */
export function completeRun(current: GlideRecord): void {
    const player = new GlideRecord('x_417611_doom_player')
    if (!player.get(current.getValue('player'))) return

    let perfect = 0
    let underPar = 0
    const levels = new GlideRecord('x_417611_doom_level_stat')
    levels.addQuery('run', current.getUniqueValue())
    levels.query()
    while (levels.next()) {
        const level = {
            map: levels.getValue('map'),
            kills: int(levels, 'kills'),
            killsMax: int(levels, 'kills_max'),
            items: int(levels, 'items'),
            itemsMax: int(levels, 'items_max'),
            secrets: int(levels, 'secrets'),
            secretsMax: int(levels, 'secrets_max'),
            timeSec: int(levels, 'time_seconds'),
            parSec: int(levels, 'par_seconds'),
        }
        if (isPerfect(level)) perfect += 1
        if (level.parSec > 0 && level.timeSec > 0 && level.timeSec < level.parSec) underPar += 1
    }

    const score = int(current, 'score')
    const add = (field: string, amount: number): void => player.setValue(field, int(player, field) + amount)
    add('runs_completed', 1)
    add('levels_cleared', int(current, 'levels_completed'))
    add('total_kills', int(current, 'kills'))
    add('total_items', int(current, 'items'))
    add('total_secrets', int(current, 'secrets'))
    add('perfect_levels', perfect)
    add('par_beaten', underPar)
    add('total_score', score)
    add('playtime_seconds', int(current, 'duration_seconds'))
    if (score > int(player, 'best_score')) player.setValue('best_score', score)
    player.setValue('last_played', new GlideDateTime().getValue())
    player.update() // fires updateRank

    evaluateAchievements(player, {
        runId: current.getUniqueValue(),
        runKills: int(current, 'kills'),
        runScore: score,
    })
}
