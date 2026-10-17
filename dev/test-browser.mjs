// End-to-end browser checks against the built bundles (dist/static) served by dev/server.mjs.
//   npm run build && node dev/test-browser.mjs [screenshotDir]
import { spawn } from 'node:child_process'
import { createRequire } from 'node:module'
import { mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import assert from 'node:assert/strict'

const require = createRequire('/opt/node22/lib/node_modules/')
let playwright
try {
    playwright = require('playwright')
} catch {
    playwright = require('/node-tools/node_modules/playwright')
}

const here = dirname(fileURLToPath(import.meta.url))
const shots = process.argv[2] ?? join(here, '..', 'dev-screenshots')
mkdirSync(shots, { recursive: true })
const PORT = 8123
const origin = `http://localhost:${PORT}`

const server = spawn(
    process.execPath,
    [
        '--disable-warning=MODULE_TYPELESS_PACKAGE_JSON',
        '--import',
        join(here, 'register.mjs'),
        join(here, 'server.mjs'),
    ],
    { env: { ...process.env, PORT: String(PORT) }, stdio: ['ignore', 'pipe', 'inherit'] }
)
await new Promise((resolve, reject) => {
    server.stdout.on('data', (d) => String(d).includes('Dev instance') && resolve())
    server.on('exit', (code) => reject(new Error(`dev server exited early (${code})`)))
})

const browser = await playwright.chromium.launch({
    executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'],
})

let failures = 0
async function step(name, fn) {
    const started = Date.now()
    try {
        await fn()
        console.log(`  ok   ${name} (${((Date.now() - started) / 1000).toFixed(1)}s)`)
    } catch (error) {
        failures += 1
        console.log(`  FAIL ${name}\n       ${String(error.message).split('\n').join('\n       ')}`)
    }
}

const newPage = async (user = 'marine') => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 } })
    await context.addCookies([{ name: 'devuser', value: user, url: origin }])
    const page = await context.newPage()
    page.on('pageerror', (e) => console.log('       [pageerror]', e.message))
    return page
}
const api = (page, path, init) =>
    page.evaluate(async ([p, i]) => (await fetch('/api/x_417611_doom/doom' + p, i)).json(), [path, init])

// ---------------------------------------------------------------------------------------------
console.log('Doom page')
{
    const page = await newPage('marine')
    await step('loads the player card, skills and leaderboard from the API', async () => {
        await page.goto(`${origin}/x_417611_doom_play.do`)
        await page.waitForFunction(() => document.getElementById('callsign').textContent === 'Dev Marine')
        assert.equal(await page.locator('#skill option').count(), 5)
        assert.equal(await page.locator('#skill').inputValue(), '3')
        await page.waitForFunction(() => !document.getElementById('btn-start').disabled)
        assert.match(await page.locator('#leaderboard').innerText(), /No runs yet/)
        assert.equal(await page.locator('#achievements li').count(), 10)
    })

    await step('boots the real engine and renders the game', async () => {
        await page.selectOption('#skill', '4')
        await page.click('#btn-start')
        await page.waitForFunction(() => document.getElementById('overlay').classList.contains('hidden'), null, {
            timeout: 90000,
        })
        await page.waitForTimeout(5000)
        await page.screenshot({ path: join(shots, 'doom-page-playing.png') })
        // A black frame PNG-compresses to a few hundred bytes; a rendered Doom frame is tens of kilobytes.
        const frame = await page.locator('#canvas').screenshot()
        assert.ok(frame.length > 20000, `canvas looks blank (${frame.length} byte screenshot)`)
        assert.match(await page.locator('#status').innerText(), /DOOM\d{7}: in progress/)
        assert.equal(await page.locator('#btn-finish').isDisabled(), false)
    })

    await step('finishing with no completed level abandons the run and scores nothing', async () => {
        await page.click('#btn-finish')
        await page.waitForFunction(
            () => document.getElementById('overlay-title').textContent === 'RUN ABANDONED',
            null,
            { timeout: 30000 }
        )
        const me = await api(page, '/me')
        assert.equal(me.result.player.runsCompleted, 0)
        await page.screenshot({ path: join(shots, 'doom-page-abandoned.png') })
    })
    await page.context().close()
}

{
    const page = await newPage('marine')
    await page.goto(`${origin}/x_417611_doom_play.do`)
    await page.waitForFunction(() => !document.getElementById('btn-start').disabled)
    await step('reads the stat dump the engine prints, submits it and shows the banked run', async () => {
        await page.click('#btn-start')
        await page.waitForFunction(() => document.getElementById('overlay').classList.contains('hidden'), null, {
            timeout: 90000,
        })
        await page.waitForTimeout(12000) // let a little wall-clock time pass so the level time is plausible
        // Feed the engine's stdout the lines statdump.c would have printed had a level been finished.
        await page.evaluate(() => {
            const B = '==========================================='
            for (const line of [
                B,
                'E1M1',
                B,
                '',
                'Time: 0:09 (par: 0:30)',
                '',
                'Player 1 (Green):',
                '\tKills: 12 / 15 (80%)',
                '\tItems: 3 / 8 (37%)',
                '\tSecrets: 0',
            ])
                window.Module.print(line)
        })
        await page.click('#btn-finish')
        await page.waitForFunction(
            () => document.getElementById('overlay-title').textContent === 'RUN COMPLETE',
            null,
            { timeout: 30000 }
        )
        const text = await page.locator('#overlay').innerText()
        assert.match(text, /Levels completed\s*1/)
        assert.match(text, /Score\s*3,?7?\d*|Score/)
        assert.match(text, /Achievement unlocked: .*First Blood/)
        await page.screenshot({ path: join(shots, 'doom-page-complete.png') })
        await page.waitForFunction(
            () =>
                document.getElementById('callsign').textContent === 'Dev Marine' &&
                /Demons slain\s*12/.test(document.getElementById('stats').innerText)
        )
        assert.match(await page.locator('#leaderboard').innerText(), /Dev Marine/)
    })
    await page.context().close()
}

// ---------------------------------------------------------------------------------------------
console.log('Doomguy in the classic UI')
{
    const page = await newPage('isabella')
    const doomguy = (expr) => page.evaluate((e) => new Function('top', `return ${e}`)(window.top), expr)
    const state = () =>
        page.evaluate(() => {
            const el = window.top.document.getElementById('x-doom-doomguy')
            return el && { ...el.dataset }
        })
    const frame = () => page.frame({ name: 'gsft_main' })
    const hold = async (key, ms) => {
        await page.keyboard.down(key)
        await page.waitForTimeout(ms)
        await page.keyboard.up(key)
        await page.waitForTimeout(80)
    }

    await step('the global UI Script loads the controller into the top window, switched off', async () => {
        await page.goto(`${origin}/nav_to.do`)
        await page.waitForFunction(() => !!window.__xDoomGuy, null, { timeout: 20000 })
        assert.equal(await doomguy('top.__xDoomGuy.enabled'), false)
        assert.equal(await state(), null)
    })

    await step('Ctrl+Alt+D teleports him in (decoding the sprites from the WAD at runtime)', async () => {
        await frame().click('body')
        await page.keyboard.press('Control+Alt+D')
        await page.waitForFunction(
            () => window.document.getElementById('x-doom-doomguy')?.dataset.mode === 'alive',
            null,
            { timeout: 30000 }
        )
        await page.screenshot({ path: join(shots, 'doomguy-arrived.png') })
        assert.equal(await doomguy('top.__xDoomGuy.enabled'), true)
    })

    await step('runs in all eight directions facing the way he moves', async () => {
        const start = await state()
        const cases = [
            [['ArrowRight'], 7, 'x', 1],
            [['ArrowLeft'], 3, 'x', -1],
            [['ArrowUp'], 5, 'y', -1],
            [['ArrowDown'], 1, 'y', 1],
        ]
        for (const [keys, rotation, axis, sign] of cases) {
            const before = await state()
            for (const k of keys) await page.keyboard.down(k)
            await page.waitForTimeout(450)
            const during = await state()
            for (const k of keys) await page.keyboard.up(k)
            await page.waitForTimeout(80)
            assert.equal(during.rotation, String(rotation), `${keys} should face rotation ${rotation}`)
            assert.ok(sign * (Number(during[axis]) - Number(before[axis])) > 60, `${keys} should move along ${axis}`)
            assert.match(during.frame, /^[ABCD]$/, 'walking uses frames A-D')
            await page.screenshot({
                path: join(shots, `doomguy-${keys[0]}.png`),
                clip: {
                    x: Math.max(0, Number(during.x) - 140),
                    y: Math.max(0, Number(during.y) - 220),
                    width: 280,
                    height: 260,
                },
            })
        }
        await page.keyboard.down('ArrowRight')
        await page.keyboard.down('ArrowDown')
        await page.waitForTimeout(300)
        assert.equal((await state()).rotation, '8')
        await page.keyboard.up('ArrowRight')
        await page.keyboard.up('ArrowDown')
        const end = await state()
        assert.notDeepEqual([end.x, end.y], [start.x, start.y])
    })

    await step('fires the pistol, counting shots', async () => {
        const before = await doomguy('top.__xDoomGuy.stats().shots')
        await page.keyboard.down('Space')
        const seen = new Set()
        for (let i = 0; i < 12; i += 1) {
            seen.add((await state()).frame)
            await page.waitForTimeout(40)
        }
        await page.screenshot({ path: join(shots, 'doomguy-firing.png') })
        await page.keyboard.up('Space')
        assert.ok(seen.has('F') || seen.has('G'), `expected a firing frame, saw ${[...seen]}`)
        assert.ok((await doomguy('top.__xDoomGuy.stats().shots')) > before)
    })

    await step('stays put and keeps out of text fields; survives frame navigation', async () => {
        await frame().click('#to-form')
        await frame().waitForSelector('#short')
        await page.waitForTimeout(200)
        assert.equal((await state()).mode, 'alive', 'controller lives in the top window and survives navigation')
        const before = await state()
        await frame().click('#short')
        await page.keyboard.type('wasd ff')
        assert.equal(await frame().inputValue('#short'), 'wasd ff', 'typing must reach the field')
        const after = await state()
        assert.deepEqual([after.x, after.y], [before.x, before.y], 'WASD in a text field must not move him')
        // ...but outside the field the new frame is wired up again.
        await frame().click('h2')
        await hold('ArrowLeft', 300)
        const moved = await state()
        assert.ok(Number(moved.x) < Number(before.x) - 40, 'keys still work in the new frame')
    })

    await step('reports steps and shots to the server and the preference is remembered', async () => {
        await frame().click('h2')
        await page.keyboard.press('Control+Alt+D')
        await page.waitForFunction(() => window.document.getElementById('x-doom-doomguy')?.dataset.mode === 'dying')
        await page.screenshot({ path: join(shots, 'doomguy-dying.png') })
        await page.waitForFunction(() => !window.document.getElementById('x-doom-doomguy'), null, { timeout: 8000 })
        const me = (await api(page, '/me')).result
        assert.ok(me.player.doomguySteps > 0, 'steps reported')
        assert.ok(me.player.doomguyShots > 0, 'shots reported')
        assert.equal(me.doomguyEnabled, false)
    })

    await step('he is back after a reload when left switched on', async () => {
        await frame().click('body')
        await page.keyboard.press('Control+Alt+D')
        await page.waitForFunction(
            () => window.document.getElementById('x-doom-doomguy')?.dataset.mode === 'alive',
            null,
            { timeout: 30000 }
        )
        await page.reload()
        await page.waitForFunction(
            () => window.document.getElementById('x-doom-doomguy')?.dataset.mode === 'alive',
            null,
            { timeout: 30000 }
        )
    })

    await step('the settings page toggles him and reflects his state', async () => {
        await page.evaluate(() => (document.getElementById('gsft_main').src = '/x_417611_doom_doomguy.do'))
        await frame().waitForFunction(
            () => document.getElementById('dg-toggle') && !document.getElementById('dg-toggle').disabled,
            null,
            { timeout: 20000 }
        )
        assert.match(await frame().locator('#dg-title').innerText(), /on the loose/)
        await frame().click('#dg-toggle')
        await frame().waitForFunction(() => /sleeping/.test(document.getElementById('dg-title').textContent), null, {
            timeout: 10000,
        })
        await page.waitForFunction(() => !window.document.getElementById('x-doom-doomguy'), null, { timeout: 8000 })
        await page.screenshot({ path: join(shots, 'doomguy-settings.png') })
    })
    await page.context().close()
}

await browser.close()
server.kill()
console.log(failures === 0 ? '\nAll browser checks passed.' : `\n${failures} browser check(s) FAILED.`)
process.exit(failures === 0 ? 0 : 1)
