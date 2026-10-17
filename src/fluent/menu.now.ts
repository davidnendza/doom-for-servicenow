import { ApplicationMenu, Record } from '@servicenow/sdk/core'

export const doomMenu = ApplicationMenu({
    $id: Now.ID['menu-doom'],
    title: 'Doom',
    hint: 'Rip and tear, with the records to prove it',
    description: 'Play shareware DOOM; every run, level and achievement lands in ServiceNow tables.',
    active: true,
    order: 9000,
})

Record({
    $id: Now.ID['mod-play'],
    table: 'sys_app_module',
    data: {
        application: doomMenu,
        active: true,
        order: 100,
        title: 'Play Doom',
        link_type: 'DIRECT',
        query: 'x_doom_play.do',
        hint: 'Start a run',
    },
})

Record({
    $id: Now.ID['mod-doomguy'],
    table: 'sys_app_module',
    data: {
        application: doomMenu,
        active: true,
        order: 200,
        title: 'Doomguy',
        link_type: 'DIRECT',
        query: 'x_doom_doomguy.do',
        hint: 'Switch the roaming marine on or off (Ctrl+Alt+D)',
    },
})

Record({
    $id: Now.ID['mod-sep-records'],
    table: 'sys_app_module',
    data: {
        application: doomMenu,
        active: true,
        order: 300,
        title: 'Records',
        link_type: 'SEPARATOR',
    },
})

Record({
    $id: Now.ID['mod-leaderboard'],
    table: 'sys_app_module',
    data: {
        application: doomMenu,
        active: true,
        order: 400,
        title: 'Leaderboard',
        link_type: 'FILTER',
        name: 'x_doom_player',
        filter: 'best_score>0^ORDERBYDESCbest_score',
    },
})

Record({
    $id: Now.ID['mod-my-runs'],
    table: 'sys_app_module',
    data: {
        application: doomMenu,
        active: true,
        order: 500,
        title: 'My runs',
        link_type: 'FILTER',
        name: 'x_doom_run',
        filter: 'player.user=javascript:gs.getUserID()^ORDERBYDESCstarted_at',
    },
})

Record({
    $id: Now.ID['mod-all-runs'],
    table: 'sys_app_module',
    data: {
        application: doomMenu,
        active: true,
        order: 600,
        title: 'All runs',
        link_type: 'LIST',
        name: 'x_doom_run',
    },
})

Record({
    $id: Now.ID['mod-level-stats'],
    table: 'sys_app_module',
    data: {
        application: doomMenu,
        active: true,
        order: 700,
        title: 'Level stats',
        link_type: 'LIST',
        name: 'x_doom_level_stat',
    },
})

Record({
    $id: Now.ID['mod-players'],
    table: 'sys_app_module',
    data: {
        application: doomMenu,
        active: true,
        order: 800,
        title: 'Players',
        link_type: 'LIST',
        name: 'x_doom_player',
    },
})

Record({
    $id: Now.ID['mod-sep-config'],
    table: 'sys_app_module',
    data: {
        application: doomMenu,
        active: true,
        order: 900,
        title: 'Configuration',
        link_type: 'SEPARATOR',
        roles: ['x_doom.admin'],
    },
})

Record({
    $id: Now.ID['mod-achievements'],
    table: 'sys_app_module',
    data: {
        application: doomMenu,
        active: true,
        order: 1000,
        title: 'Achievement definitions',
        link_type: 'LIST',
        name: 'x_doom_achievement',
        roles: ['x_doom.admin'],
    },
})

Record({
    $id: Now.ID['mod-earned'],
    table: 'sys_app_module',
    data: {
        application: doomMenu,
        active: true,
        order: 1100,
        title: 'Earned achievements',
        link_type: 'LIST',
        name: 'x_doom_player_achievement',
        roles: ['x_doom.admin'],
    },
})
