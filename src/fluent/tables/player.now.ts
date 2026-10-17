import { Table, StringColumn, IntegerColumn, ReferenceColumn, DateTimeColumn } from '@servicenow/sdk/core'

/** One row per ServiceNow user who has played; created on first contact with the Doom API. */
export const x_417611_doom_player = Table({
    name: 'x_417611_doom_player',
    label: 'Doom Player',
    display: 'callsign',
    allowWebServiceAccess: true,
    schema: {
        user: ReferenceColumn({ label: 'User', referenceTable: 'sys_user', mandatory: true, cascadeRule: 'delete' }),
        callsign: StringColumn({ label: 'Callsign', maxLength: 60, mandatory: true }),
        rank_title: StringColumn({ label: 'Rank', maxLength: 60, default: 'Imp Fodder', readOnly: true }),
        runs_completed: IntegerColumn({ label: 'Runs completed', default: 0, readOnly: true }),
        levels_cleared: IntegerColumn({ label: 'Levels cleared', default: 0, readOnly: true }),
        total_kills: IntegerColumn({ label: 'Total kills', default: 0, readOnly: true }),
        total_items: IntegerColumn({ label: 'Total items', default: 0, readOnly: true }),
        total_secrets: IntegerColumn({ label: 'Total secrets', default: 0, readOnly: true }),
        perfect_levels: IntegerColumn({ label: 'Perfect levels', default: 0, readOnly: true }),
        par_beaten: IntegerColumn({ label: 'Levels under par', default: 0, readOnly: true }),
        best_score: IntegerColumn({ label: 'Best score', default: 0, readOnly: true }),
        total_score: IntegerColumn({ label: 'Total score', default: 0, readOnly: true }),
        playtime_seconds: IntegerColumn({ label: 'Playtime (seconds)', default: 0, readOnly: true }),
        doomguy_steps: IntegerColumn({ label: 'Doomguy steps', default: 0, readOnly: true }),
        doomguy_shots: IntegerColumn({ label: 'Doomguy shots', default: 0, readOnly: true }),
        last_played: DateTimeColumn({ label: 'Last played', readOnly: true }),
    },
    index: [{ name: 'x_417611_doom_player_user', unique: true, element: 'user' }],
})
