import { Record } from '@servicenow/sdk/core'

// A "global" UI Script is included by every classic UI page, so Doomguy can follow the user around.
Record({
    $id: Now.ID['ui-script-doomguy-loader'],
    table: 'sys_ui_script',
    data: {
        name: 'x_417611_doom.doomguy_loader',
        description:
            'Loads the Doomguy controller into the top window. Doomguy stays asleep until the user switches him on.',
        global: true,
        active: true,
        script: Now.include('../scripts/ui-script/doomguy-loader.client.js'),
    },
})
