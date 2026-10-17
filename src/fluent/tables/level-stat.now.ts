import { Table, StringColumn, IntegerColumn, ReferenceColumn } from '@servicenow/sdk/core'

/** End-of-level statistics as reported by the engine's -statdump output, one row per level in a run. */
export const x_417611_doom_level_stat = Table({
    name: 'x_417611_doom_level_stat',
    label: 'Doom Level Stat',
    display: 'map',
    allowWebServiceAccess: true,
    schema: {
        run: ReferenceColumn({ label: 'Run', referenceTable: 'x_417611_doom_run', mandatory: true, cascadeRule: 'delete' }),
        map: StringColumn({ label: 'Map', maxLength: 20, mandatory: true }),
        kills: IntegerColumn({ label: 'Kills', default: 0 }),
        kills_max: IntegerColumn({ label: 'Kills (max)', default: 0 }),
        items: IntegerColumn({ label: 'Items', default: 0 }),
        items_max: IntegerColumn({ label: 'Items (max)', default: 0 }),
        secrets: IntegerColumn({ label: 'Secrets', default: 0 }),
        secrets_max: IntegerColumn({ label: 'Secrets (max)', default: 0 }),
        time_seconds: IntegerColumn({ label: 'Time (seconds)', default: 0 }),
        par_seconds: IntegerColumn({ label: 'Par (seconds)', default: 0 }),
        score: IntegerColumn({ label: 'Score', default: 0 }),
    },
})
