import { BusinessRule } from '@servicenow/sdk/core'
import { completeRun, defaultCallsign, lockClosedRuns, updateRank } from '../server/doom/rules'

BusinessRule({
    $id: Now.ID['br-player-callsign'],
    name: 'Doom: default callsign',
    table: 'x_doom_player',
    when: 'before',
    action: ['insert'],
    order: 100,
    active: true,
    script: defaultCallsign,
    description: "New players are named after the user's display name.",
})

BusinessRule({
    $id: Now.ID['br-player-rank'],
    name: 'Doom: rank follows kills',
    table: 'x_doom_player',
    when: 'before',
    action: ['insert', 'update'],
    order: 200,
    active: true,
    script: updateRank,
    description: 'Keeps rank_title in step with total_kills no matter who edits the row.',
})

BusinessRule({
    $id: Now.ID['br-run-lock'],
    name: 'Doom: closed runs stay closed',
    table: 'x_doom_run',
    when: 'before',
    action: ['update'],
    order: 100,
    active: true,
    filterCondition: 'stateCHANGESTOplaying',
    script: lockClosedRuns,
    description: 'Blocks moving a completed, abandoned or rejected run back to Playing.',
})

BusinessRule({
    $id: Now.ID['br-run-complete'],
    name: 'Doom: bank completed run',
    table: 'x_doom_run',
    when: 'after',
    action: ['update'],
    order: 100,
    active: true,
    filterCondition: 'stateCHANGESTOcompleted',
    script: completeRun,
    description: "Rolls a completed run into the player's totals, then grants achievements.",
})
