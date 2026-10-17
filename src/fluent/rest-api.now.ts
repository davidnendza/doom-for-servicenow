import { RestApi } from '@servicenow/sdk/core'
import {
    abandonRun,
    finishRun,
    getDoomguy,
    getLeaderboard,
    getMe,
    postDoomguyTelemetry,
    putDoomguy,
    startRun,
} from '../server/doom/api'

// Base URL: /api/x_417611_doom/doom
RestApi({
    $id: Now.ID['rest-doom'],
    name: 'Doom',
    serviceId: 'doom',
    shortDescription: 'Runs, scores, leaderboard and Doomguy settings for the Doom application.',
    consumes: 'application/json',
    produces: 'application/json',
    routes: [
        { $id: Now.ID['rest-me'], name: 'Get player profile', method: 'GET', path: '/me', script: getMe },
        {
            $id: Now.ID['rest-leaderboard'],
            name: 'Get leaderboard',
            method: 'GET',
            path: '/leaderboard',
            script: getLeaderboard,
            parameters: [{ $id: Now.ID['rest-leaderboard-limit'], name: 'limit', exampleValue: '10' }],
        },
        { $id: Now.ID['rest-run-start'], name: 'Start a run', method: 'POST', path: '/runs', script: startRun },
        {
            $id: Now.ID['rest-run-finish'],
            name: 'Finish a run',
            method: 'POST',
            path: '/runs/{id}/finish',
            script: finishRun,
        },
        {
            $id: Now.ID['rest-run-abandon'],
            name: 'Abandon a run',
            method: 'POST',
            path: '/runs/{id}/abandon',
            script: abandonRun,
        },
        {
            $id: Now.ID['rest-doomguy-get'],
            name: 'Get Doomguy setting',
            method: 'GET',
            path: '/doomguy',
            script: getDoomguy,
        },
        {
            $id: Now.ID['rest-doomguy-put'],
            name: 'Set Doomguy setting',
            method: 'PUT',
            path: '/doomguy',
            script: putDoomguy,
        },
        {
            $id: Now.ID['rest-doomguy-telemetry'],
            name: 'Report Doomguy activity',
            method: 'POST',
            path: '/doomguy/telemetry',
            script: postDoomguyTelemetry,
        },
    ],
})
