import { Form, List, default_view } from '@servicenow/sdk/core'

Form({
    table: 'x_417611_doom_player',
    view: default_view,
    sections: [
        {
            caption: 'Marine',
            content: [
                {
                    layout: 'two-column',
                    leftElements: [
                        { field: 'user', type: 'table_field' },
                        { field: 'callsign', type: 'table_field' },
                        { field: 'rank_title', type: 'table_field' },
                        { field: 'last_played', type: 'table_field' },
                    ],
                    rightElements: [
                        { field: 'best_score', type: 'table_field' },
                        { field: 'total_score', type: 'table_field' },
                        { field: 'runs_completed', type: 'table_field' },
                        { field: 'levels_cleared', type: 'table_field' },
                    ],
                },
                {
                    layout: 'two-column',
                    leftElements: [
                        { field: 'total_kills', type: 'table_field' },
                        { field: 'total_items', type: 'table_field' },
                        { field: 'total_secrets', type: 'table_field' },
                    ],
                    rightElements: [
                        { field: 'perfect_levels', type: 'table_field' },
                        { field: 'par_beaten', type: 'table_field' },
                        { field: 'playtime_seconds', type: 'table_field' },
                    ],
                },
                {
                    layout: 'two-column',
                    leftElements: [{ field: 'doomguy_steps', type: 'table_field' }],
                    rightElements: [{ field: 'doomguy_shots', type: 'table_field' }],
                },
            ],
        },
    ],
})

List({
    table: 'x_417611_doom_player',
    view: default_view,
    columns: ['callsign', 'rank_title', 'best_score', 'total_kills', 'runs_completed', 'last_played'],
})

Form({
    table: 'x_417611_doom_run',
    view: default_view,
    sections: [
        {
            caption: 'Run',
            content: [
                {
                    layout: 'two-column',
                    leftElements: [
                        { field: 'number', type: 'table_field' },
                        { field: 'player', type: 'table_field' },
                        { field: 'state', type: 'table_field' },
                        { field: 'skill', type: 'table_field' },
                    ],
                    rightElements: [
                        { field: 'episode', type: 'table_field' },
                        { field: 'started_at', type: 'table_field' },
                        { field: 'ended_at', type: 'table_field' },
                        { field: 'duration_seconds', type: 'table_field' },
                    ],
                },
                {
                    layout: 'two-column',
                    leftElements: [
                        { field: 'levels_completed', type: 'table_field' },
                        { field: 'kills', type: 'table_field' },
                        { field: 'items', type: 'table_field' },
                    ],
                    rightElements: [
                        { field: 'secrets', type: 'table_field' },
                        { field: 'score', type: 'table_field' },
                        { field: 'integrity', type: 'table_field' },
                    ],
                },
                { layout: 'one-column', elements: [{ field: 'integrity_notes', type: 'table_field' }] },
            ],
        },
    ],
})

List({
    table: 'x_417611_doom_run',
    view: default_view,
    columns: ['number', 'player', 'state', 'skill', 'levels_completed', 'kills', 'score', 'integrity', 'started_at'],
})

Form({
    table: 'x_417611_doom_level_stat',
    view: default_view,
    sections: [
        {
            caption: 'Level',
            content: [
                {
                    layout: 'two-column',
                    leftElements: [
                        { field: 'run', type: 'table_field' },
                        { field: 'map', type: 'table_field' },
                        { field: 'time_seconds', type: 'table_field' },
                        { field: 'par_seconds', type: 'table_field' },
                        { field: 'score', type: 'table_field' },
                    ],
                    rightElements: [
                        { field: 'kills', type: 'table_field' },
                        { field: 'kills_max', type: 'table_field' },
                        { field: 'items', type: 'table_field' },
                        { field: 'items_max', type: 'table_field' },
                        { field: 'secrets', type: 'table_field' },
                        { field: 'secrets_max', type: 'table_field' },
                    ],
                },
            ],
        },
    ],
})

List({
    table: 'x_417611_doom_level_stat',
    view: default_view,
    columns: ['run', 'map', 'kills', 'kills_max', 'items', 'secrets', 'time_seconds', 'par_seconds', 'score'],
})

Form({
    table: 'x_417611_doom_achievement',
    view: default_view,
    sections: [
        {
            caption: 'Achievement',
            content: [
                {
                    layout: 'two-column',
                    leftElements: [
                        { field: 'code', type: 'table_field' },
                        { field: 'name', type: 'table_field' },
                        { field: 'active', type: 'table_field' },
                    ],
                    rightElements: [
                        { field: 'metric', type: 'table_field' },
                        { field: 'threshold', type: 'table_field' },
                        { field: 'sort_order', type: 'table_field' },
                    ],
                },
                { layout: 'one-column', elements: [{ field: 'description', type: 'table_field' }] },
            ],
        },
    ],
})

List({
    table: 'x_417611_doom_achievement',
    view: default_view,
    columns: ['sort_order', 'name', 'code', 'metric', 'threshold', 'active'],
})

Form({
    table: 'x_417611_doom_player_achievement',
    view: default_view,
    sections: [
        {
            caption: 'Earned',
            content: [
                {
                    layout: 'two-column',
                    leftElements: [
                        { field: 'player', type: 'table_field' },
                        { field: 'achievement', type: 'table_field' },
                    ],
                    rightElements: [
                        { field: 'run', type: 'table_field' },
                        { field: 'earned_at', type: 'table_field' },
                    ],
                },
            ],
        },
    ],
})

List({
    table: 'x_417611_doom_player_achievement',
    view: default_view,
    columns: ['player', 'achievement', 'earned_at', 'run'],
})
