import { Record } from '@servicenow/sdk/core'

// Starter achievements. Admins can add, tune or retire them in the x_doom_achievement table.

Record({
    $id: Now.ID['ach-first-blood'],
    table: 'x_doom_achievement',
    data: {
        code: 'first_blood',
        name: 'First Blood',
        description: 'Kill your first demon.',
        metric: 'total_kills',
        threshold: 1,
        sort_order: 100,
        active: true,
    },
})

Record({
    $id: Now.ID['ach-hangar'],
    table: 'x_doom_achievement',
    data: {
        code: 'hangar_cleared',
        name: 'Hangar Cleared',
        description: 'Finish a level.',
        metric: 'levels_cleared',
        threshold: 1,
        sort_order: 200,
        active: true,
    },
})

Record({
    $id: Now.ID['ach-rip-tear'],
    table: 'x_doom_achievement',
    data: {
        code: 'rip_and_tear',
        name: 'Rip and Tear',
        description: 'Kill 100 demons.',
        metric: 'total_kills',
        threshold: 100,
        sort_order: 300,
        active: true,
    },
})

Record({
    $id: Now.ID['ach-perfectionist'],
    table: 'x_doom_achievement',
    data: {
        code: 'perfectionist',
        name: 'Perfectionist',
        description: 'Finish a level with 100% kills, items and secrets.',
        metric: 'perfect_levels',
        threshold: 1,
        sort_order: 400,
        active: true,
    },
})

Record({
    $id: Now.ID['ach-speed-demon'],
    table: 'x_doom_achievement',
    data: {
        code: 'speed_demon',
        name: 'Speed Demon',
        description: 'Finish a level under its par time.',
        metric: 'par_beaten',
        threshold: 1,
        sort_order: 500,
        active: true,
    },
})

Record({
    $id: Now.ID['ach-secret-agent'],
    table: 'x_doom_achievement',
    data: {
        code: 'secret_agent',
        name: 'Secret Agent',
        description: 'Find 5 secrets.',
        metric: 'total_secrets',
        threshold: 5,
        sort_order: 600,
        active: true,
    },
})

Record({
    $id: Now.ID['ach-five-figures'],
    table: 'x_doom_achievement',
    data: {
        code: 'five_figures',
        name: 'Five Figures',
        description: 'Score 10,000 points in a single run.',
        metric: 'run_score',
        threshold: 10000,
        sort_order: 700,
        active: true,
    },
})

Record({
    $id: Now.ID['ach-slayer'],
    table: 'x_doom_achievement',
    data: {
        code: 'doom_slayer',
        name: 'Doom Slayer',
        description: 'Kill 1,000 demons.',
        metric: 'total_kills',
        threshold: 1000,
        sort_order: 800,
        active: true,
    },
})

Record({
    $id: Now.ID['ach-marathon'],
    table: 'x_doom_achievement',
    data: {
        code: 'marathon_marine',
        name: 'Marathon Marine',
        description: 'Take 2,000 steps with Doomguy.',
        metric: 'doomguy_steps',
        threshold: 2000,
        sort_order: 900,
        active: true,
    },
})

Record({
    $id: Now.ID['ach-trigger'],
    table: 'x_doom_achievement',
    data: {
        code: 'trigger_happy',
        name: 'Trigger Happy',
        description: 'Fire 500 shots with Doomguy.',
        metric: 'doomguy_shots',
        threshold: 500,
        sort_order: 1000,
        active: true,
    },
})
