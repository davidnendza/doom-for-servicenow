import { Table, StringColumn, IntegerColumn, ChoiceColumn, BooleanColumn } from '@servicenow/sdk/core'

/**
 * Admin-maintained achievement definitions. An achievement is earned when the player's value for
 * `metric` reaches `threshold`; add rows to introduce new ones without touching code.
 */
export const x_doom_achievement = Table({
    name: 'x_doom_achievement',
    label: 'Doom Achievement',
    display: 'name',
    allowWebServiceAccess: true,
    schema: {
        code: StringColumn({ label: 'Code', maxLength: 40, mandatory: true, unique: true }),
        name: StringColumn({ label: 'Name', maxLength: 80, mandatory: true }),
        description: StringColumn({ label: 'Description', maxLength: 255 }),
        metric: ChoiceColumn({
            label: 'Metric',
            mandatory: true,
            choices: {
                total_kills: { label: 'Lifetime kills', sequence: 100 },
                runs_completed: { label: 'Runs completed', sequence: 200 },
                levels_cleared: { label: 'Levels cleared', sequence: 300 },
                total_secrets: { label: 'Lifetime secrets', sequence: 400 },
                run_kills: { label: 'Kills in a single run', sequence: 500 },
                run_score: { label: 'Score in a single run', sequence: 600 },
                perfect_levels: { label: 'Perfect levels (100% kills, items, secrets)', sequence: 700 },
                par_beaten: { label: 'Levels finished under par', sequence: 800 },
                doomguy_steps: { label: 'Doomguy steps', sequence: 900 },
                doomguy_shots: { label: 'Doomguy shots', sequence: 1000 },
            },
        }),
        threshold: IntegerColumn({ label: 'Threshold', default: 1, mandatory: true }),
        sort_order: IntegerColumn({ label: 'Order', default: 100 }),
        active: BooleanColumn({ label: 'Active', default: true }),
    },
})
