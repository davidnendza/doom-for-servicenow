import { UiPage } from '@servicenow/sdk/core'
import doomPage from '../client/doom.html'
import doomguyPage from '../client/doomguy.html'

export const play = UiPage({
    $id: Now.ID['ui-page-play'],
    endpoint: 'x_doom_play.do',
    category: 'general',
    description: 'Plays shareware DOOM in the browser and records every run in ServiceNow.',
    html: doomPage,
    direct: true,
})

export const doomguySettings = UiPage({
    $id: Now.ID['ui-page-doomguy'],
    endpoint: 'x_doom_doomguy.do',
    category: 'general',
    description: 'Switch Doomguy on or off. Also serves the script the global UI Script loads.',
    html: doomguyPage,
    direct: true,
})
