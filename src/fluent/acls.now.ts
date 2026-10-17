import { Acl } from '@servicenow/sdk/core'
import { admin } from './roles.now'

// Everyone signed in can read Doom data (it powers the leaderboard). Writes belong to the Doom API,
// which runs server-side and is not subject to these ACLs, so only admins may edit rows by hand.

Acl({
    $id: Now.ID['x_doom_player-read'],
    type: 'record',
    table: 'x_doom_player',
    operation: 'read',
    decisionType: 'allow',
    localOrExisting: 'Existing',
    securityAttribute: 'user_is_authenticated',
    description: 'Any signed-in user can read x_doom_player.',
})

Acl({
    $id: Now.ID['x_doom_player-write'],
    type: 'record',
    table: 'x_doom_player',
    operation: 'write',
    decisionType: 'allow',
    roles: [admin],
    description: 'Only Doom admins can write x_doom_player directly.',
})

Acl({
    $id: Now.ID['x_doom_player-create'],
    type: 'record',
    table: 'x_doom_player',
    operation: 'create',
    decisionType: 'allow',
    roles: [admin],
    description: 'Only Doom admins can create x_doom_player directly.',
})

Acl({
    $id: Now.ID['x_doom_player-delete'],
    type: 'record',
    table: 'x_doom_player',
    operation: 'delete',
    decisionType: 'allow',
    roles: [admin],
    description: 'Only Doom admins can delete x_doom_player directly.',
})

Acl({
    $id: Now.ID['x_doom_run-read'],
    type: 'record',
    table: 'x_doom_run',
    operation: 'read',
    decisionType: 'allow',
    localOrExisting: 'Existing',
    securityAttribute: 'user_is_authenticated',
    description: 'Any signed-in user can read x_doom_run.',
})

Acl({
    $id: Now.ID['x_doom_run-write'],
    type: 'record',
    table: 'x_doom_run',
    operation: 'write',
    decisionType: 'allow',
    roles: [admin],
    description: 'Only Doom admins can write x_doom_run directly.',
})

Acl({
    $id: Now.ID['x_doom_run-create'],
    type: 'record',
    table: 'x_doom_run',
    operation: 'create',
    decisionType: 'allow',
    roles: [admin],
    description: 'Only Doom admins can create x_doom_run directly.',
})

Acl({
    $id: Now.ID['x_doom_run-delete'],
    type: 'record',
    table: 'x_doom_run',
    operation: 'delete',
    decisionType: 'allow',
    roles: [admin],
    description: 'Only Doom admins can delete x_doom_run directly.',
})

Acl({
    $id: Now.ID['x_doom_level_stat-read'],
    type: 'record',
    table: 'x_doom_level_stat',
    operation: 'read',
    decisionType: 'allow',
    localOrExisting: 'Existing',
    securityAttribute: 'user_is_authenticated',
    description: 'Any signed-in user can read x_doom_level_stat.',
})

Acl({
    $id: Now.ID['x_doom_level_stat-write'],
    type: 'record',
    table: 'x_doom_level_stat',
    operation: 'write',
    decisionType: 'allow',
    roles: [admin],
    description: 'Only Doom admins can write x_doom_level_stat directly.',
})

Acl({
    $id: Now.ID['x_doom_level_stat-create'],
    type: 'record',
    table: 'x_doom_level_stat',
    operation: 'create',
    decisionType: 'allow',
    roles: [admin],
    description: 'Only Doom admins can create x_doom_level_stat directly.',
})

Acl({
    $id: Now.ID['x_doom_level_stat-delete'],
    type: 'record',
    table: 'x_doom_level_stat',
    operation: 'delete',
    decisionType: 'allow',
    roles: [admin],
    description: 'Only Doom admins can delete x_doom_level_stat directly.',
})

Acl({
    $id: Now.ID['x_doom_achievement-read'],
    type: 'record',
    table: 'x_doom_achievement',
    operation: 'read',
    decisionType: 'allow',
    localOrExisting: 'Existing',
    securityAttribute: 'user_is_authenticated',
    description: 'Any signed-in user can read x_doom_achievement.',
})

Acl({
    $id: Now.ID['x_doom_achievement-write'],
    type: 'record',
    table: 'x_doom_achievement',
    operation: 'write',
    decisionType: 'allow',
    roles: [admin],
    description: 'Only Doom admins can write x_doom_achievement directly.',
})

Acl({
    $id: Now.ID['x_doom_achievement-create'],
    type: 'record',
    table: 'x_doom_achievement',
    operation: 'create',
    decisionType: 'allow',
    roles: [admin],
    description: 'Only Doom admins can create x_doom_achievement directly.',
})

Acl({
    $id: Now.ID['x_doom_achievement-delete'],
    type: 'record',
    table: 'x_doom_achievement',
    operation: 'delete',
    decisionType: 'allow',
    roles: [admin],
    description: 'Only Doom admins can delete x_doom_achievement directly.',
})

Acl({
    $id: Now.ID['x_doom_player_achievement-read'],
    type: 'record',
    table: 'x_doom_player_achievement',
    operation: 'read',
    decisionType: 'allow',
    localOrExisting: 'Existing',
    securityAttribute: 'user_is_authenticated',
    description: 'Any signed-in user can read x_doom_player_achievement.',
})

Acl({
    $id: Now.ID['x_doom_player_achievement-write'],
    type: 'record',
    table: 'x_doom_player_achievement',
    operation: 'write',
    decisionType: 'allow',
    roles: [admin],
    description: 'Only Doom admins can write x_doom_player_achievement directly.',
})

Acl({
    $id: Now.ID['x_doom_player_achievement-create'],
    type: 'record',
    table: 'x_doom_player_achievement',
    operation: 'create',
    decisionType: 'allow',
    roles: [admin],
    description: 'Only Doom admins can create x_doom_player_achievement directly.',
})

Acl({
    $id: Now.ID['x_doom_player_achievement-delete'],
    type: 'record',
    table: 'x_doom_player_achievement',
    operation: 'delete',
    decisionType: 'allow',
    roles: [admin],
    description: 'Only Doom admins can delete x_doom_player_achievement directly.',
})
