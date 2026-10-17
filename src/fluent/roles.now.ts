import { Role } from '@servicenow/sdk/core'

export const admin = Role({
    name: 'x_417611_doom.admin',
    description: 'Manage Doom runs, players and achievement definitions.',
    grantable: true,
    containsRoles: [],
})
