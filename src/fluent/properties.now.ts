import { Property } from '@servicenow/sdk/core'
import { admin } from './roles.now'

Property({
    $id: Now.ID['prop-reject-suspect'],
    name: 'x_417611_doom.reject_suspect_runs',
    type: 'boolean',
    value: true,
    description:
        'Reject runs whose reported statistics are impossible (more kills than the level has, faster than possible, more game time than wall-clock time). When false they are kept but flagged suspect.',
    roles: { read: [admin], write: [admin] },
})

Property({
    $id: Now.ID['prop-min-level-seconds'],
    name: 'x_417611_doom.min_level_seconds',
    type: 'integer',
    value: 8,
    description: 'Fastest plausible time, in seconds, to finish a level. Anything quicker marks the run suspect.',
    roles: { read: [admin], write: [admin] },
})

Property({
    $id: Now.ID['prop-doomguy-default'],
    name: 'x_417611_doom.doomguy.default_enabled',
    type: 'boolean',
    value: false,
    description: 'Whether Doomguy starts switched on for users who have never toggled him.',
    roles: { read: [admin], write: [admin] },
})
