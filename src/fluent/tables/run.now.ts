import { Table, StringColumn, IntegerColumn, ChoiceColumn, ReferenceColumn, DateTimeColumn } from '@servicenow/sdk/core'

/** A single attempt at the game, from "Start run" to the engine's exit. Mutated only by the Doom API. */
export const x_417611_doom_run = Table({
    name: 'x_417611_doom_run',
    label: 'Doom Run',
    display: 'number',
    allowWebServiceAccess: true,
    autoNumber: { prefix: 'DOOM', number: 1000, numberOfDigits: 7 },
    schema: {
        number: StringColumn({
            label: 'Number',
            maxLength: 40,
            default: 'javascript:global.getNextObjNumberPadded();',
            readOnly: true,
        }),
        player: ReferenceColumn({
            label: 'Player',
            referenceTable: 'x_417611_doom_player',
            mandatory: true,
            cascadeRule: 'delete',
        }),
        state: ChoiceColumn({
            label: 'State',
            default: 'playing',
            choices: {
                playing: { label: 'Playing', sequence: 100 },
                completed: { label: 'Completed', sequence: 200 },
                abandoned: { label: 'Abandoned', sequence: 300 },
                rejected: { label: 'Rejected', sequence: 400 },
            },
        }),
        episode: IntegerColumn({ label: 'Episode', default: 1 }),
        skill: ChoiceColumn({
            label: 'Skill',
            default: '3',
            choices: {
                '1': { label: "I'm too young to die", sequence: 100 },
                '2': { label: 'Hey, not too rough', sequence: 200 },
                '3': { label: 'Hurt me plenty', sequence: 300 },
                '4': { label: 'Ultra-Violence', sequence: 400 },
                '5': { label: 'Nightmare!', sequence: 500 },
            },
        }),
        started_at: DateTimeColumn({ label: 'Started' }),
        ended_at: DateTimeColumn({ label: 'Ended' }),
        duration_seconds: IntegerColumn({ label: 'Duration (seconds)', default: 0 }),
        levels_completed: IntegerColumn({ label: 'Levels completed', default: 0 }),
        kills: IntegerColumn({ label: 'Kills', default: 0 }),
        items: IntegerColumn({ label: 'Items', default: 0 }),
        secrets: IntegerColumn({ label: 'Secrets', default: 0 }),
        score: IntegerColumn({ label: 'Score', default: 0 }),
        integrity: ChoiceColumn({
            label: 'Integrity',
            default: 'verified',
            choices: {
                verified: { label: 'Verified', sequence: 100 },
                suspect: { label: 'Suspect', sequence: 200 },
            },
        }),
        integrity_notes: StringColumn({ label: 'Integrity notes', maxLength: 1000 }),
    },
})
