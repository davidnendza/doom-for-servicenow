import { Table, ReferenceColumn, DateTimeColumn } from '@servicenow/sdk/core'

/** Join between players and the achievements they have earned. */
export const x_doom_player_achievement = Table({
    name: 'x_doom_player_achievement',
    label: 'Doom Player Achievement',
    display: 'achievement',
    allowWebServiceAccess: true,
    schema: {
        player: ReferenceColumn({
            label: 'Player',
            referenceTable: 'x_doom_player',
            mandatory: true,
            cascadeRule: 'delete',
        }),
        achievement: ReferenceColumn({
            label: 'Achievement',
            referenceTable: 'x_doom_achievement',
            mandatory: true,
            cascadeRule: 'delete',
        }),
        run: ReferenceColumn({ label: 'Earned in run', referenceTable: 'x_doom_run', cascadeRule: 'clear' }),
        earned_at: DateTimeColumn({ label: 'Earned' }),
    },
    index: [{ name: 'x_doom_pa_unique', unique: true, element: ['player', 'achievement'] }],
})
