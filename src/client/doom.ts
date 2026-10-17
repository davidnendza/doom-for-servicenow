import {
    abandonRun,
    finishRun,
    getLeaderboard,
    getMe,
    startRun,
    type FinishResult,
    type LeaderboardEntry,
    type Me,
    type PlayerProfile,
} from './lib/api'
import { startEngine, type Engine } from './lib/engine'
import { parseStatDump } from './lib/statdump'

const $ = <T extends HTMLElement>(id: string): T => document.getElementById(id) as T

const canvas = $<HTMLCanvasElement>('canvas')
const overlay = $('overlay')
const overlayTitle = $('overlay-title')
const overlayText = $('overlay-text')
const overlayBody = $('overlay-body')
const statusEl = $('status')
const startButton = $<HTMLButtonElement>('btn-start')
const finishButton = $<HTMLButtonElement>('btn-finish')
const skillSelect = $<HTMLSelectElement>('skill')

type Phase = 'idle' | 'loading' | 'playing' | 'submitting' | 'done'
let phase: Phase = 'idle'
let engine: Engine | undefined
let runId = ''
let runStartedAt = 0

function setStatus(text: string, kind: '' | 'err' | 'ok' = ''): void {
    statusEl.textContent = text
    statusEl.className = kind
}

function el(tag: string, text?: string, className?: string): HTMLElement {
    const node = document.createElement(tag)
    if (text !== undefined) node.textContent = text
    if (className) node.className = className
    return node
}

const fmtNumber = (n: number): string => n.toLocaleString()

function fmtDuration(totalSeconds: number): string {
    const h = Math.floor(totalSeconds / 3600)
    const m = Math.floor((totalSeconds % 3600) / 60)
    return h > 0 ? `${h}h ${m}m` : `${m}m ${totalSeconds % 60}s`
}

function renderPlayer(player: PlayerProfile): void {
    $('callsign').textContent = player.callsign
    $('rank').textContent = player.rank
    const rows: [string, string][] = [
        ['Best score', fmtNumber(player.bestScore)],
        ['Total score', fmtNumber(player.totalScore)],
        ['Runs finished', fmtNumber(player.runsCompleted)],
        ['Levels cleared', fmtNumber(player.levelsCleared)],
        ['Demons slain', fmtNumber(player.totalKills)],
        ['Secrets found', fmtNumber(player.totalSecrets)],
        ['Time in hell', fmtDuration(player.playtimeSeconds)],
        ['Doomguy steps', fmtNumber(player.doomguySteps)],
        ['Doomguy shots', fmtNumber(player.doomguyShots)],
    ]
    const stats = $('stats')
    stats.replaceChildren(...rows.flatMap(([k, v]) => [el('dt', k), el('dd', v)]))
}

function renderLeaderboard(entries: LeaderboardEntry[]): void {
    const list = $('leaderboard')
    if (entries.length === 0) {
        list.replaceChildren(el('li', 'No runs yet. Be the first.'))
        return
    }
    list.replaceChildren(
        ...entries.map((entry, i) => {
            const li = el('li', undefined, 'lb')
            li.append(
                el('span', String(i + 1), 'n'),
                el('span', entry.callsign),
                el('span', fmtNumber(entry.bestScore))
            )
            li.title = `${entry.rank} - ${fmtNumber(entry.totalKills)} kills, ${entry.runsCompleted} runs`
            return li
        })
    )
}

function renderAchievements(me: Me): void {
    $('achievements').replaceChildren(
        ...me.achievements.map((a) => {
            const li = el('li', a.name, a.earned ? 'ach earned' : 'ach')
            li.title = a.description
            return li
        })
    )
}

async function refreshSidebar(): Promise<void> {
    const [me, leaderboard] = await Promise.all([getMe(), getLeaderboard(10)])
    renderPlayer(me.player)
    renderAchievements(me)
    renderLeaderboard(leaderboard)
}

function showOverlay(title: string, text: string, body: HTMLElement[] = []): void {
    overlayTitle.textContent = title
    overlayText.textContent = text
    overlayBody.replaceChildren(...body)
    overlay.classList.remove('hidden')
}

function showResult(result: FinishResult): void {
    const rows: [string, string][] = [
        ['Levels completed', String(result.levelsCompleted)],
        ['Score', fmtNumber(result.score)],
        ['Integrity', result.integrity],
    ]
    const summary = el('dl')
    summary.append(...rows.flatMap(([k, v]) => [el('dt', k), el('dd', v)]))

    const body: HTMLElement[] = [summary]
    if (result.integrityNotes) body.push(el('p', result.integrityNotes))
    if (result.newAchievements.length > 0) {
        body.push(el('p', `Achievement unlocked: ${result.newAchievements.map((a) => a.name).join(', ')}`, 'new-ach'))
    }
    // The Emscripten runtime is a singleton, so a second run needs a fresh page.
    const again = el('button', 'PLAY AGAIN', 'primary') as HTMLButtonElement
    again.addEventListener('click', () => window.location.reload())
    body.push(again)

    overlayBody.className = 'result'
    const title =
        result.state === 'completed' ? 'RUN COMPLETE' : result.state === 'rejected' ? 'RUN REJECTED' : 'RUN ABANDONED'
    const text =
        result.state === 'completed'
            ? 'Your run has been recorded in ServiceNow.'
            : result.state === 'rejected'
              ? 'The server did not accept these statistics.'
              : 'No level was completed, so nothing was scored.'
    showOverlay(title, text, body)
    overlayBody.className = 'result'
}

async function finalizeRun(): Promise<void> {
    if (phase === 'submitting' || phase === 'done' || !engine) return
    phase = 'submitting'
    finishButton.disabled = true
    setStatus('Submitting run to ServiceNow...')
    try {
        const levels = parseStatDump(engine.lines)
        const seconds = Math.round((Date.now() - runStartedAt) / 1000)
        const result = await finishRun(runId, levels, seconds)
        phase = 'done'
        showResult(result)
        setStatus(`Run recorded. Score ${fmtNumber(result.score)}.`, 'ok')
        await refreshSidebar()
    } catch (error) {
        phase = 'done'
        setStatus(error instanceof Error ? error.message : String(error), 'err')
        showOverlay('SUBMISSION FAILED', 'The run could not be recorded. Check the connection and try again.')
    }
}

async function onStart(): Promise<void> {
    if (phase !== 'idle') return
    phase = 'loading'
    startButton.disabled = true
    skillSelect.disabled = true
    try {
        setStatus('Reserving a run record...')
        const run = await startRun(1, Number(skillSelect.value))
        runId = run.runId
        setStatus(`${run.number}: loading the engine...`)
        showOverlay('LOADING', 'Unpacking the engine and WAD. This takes a few seconds the first time.')

        engine = await startEngine({
            canvas,
            episode: 1,
            map: 1,
            skill: Number(skillSelect.value),
            onExit: () => {
                // The player quit from Doom's own menu.
                if (phase === 'playing') void finalizeRun()
            },
        })
        runStartedAt = Date.now()
        phase = 'playing'
        overlay.classList.add('hidden')
        finishButton.disabled = false
        canvas.focus()
        setStatus(`${run.number}: in progress. Finish the level to bank your kills, items and secrets.`)
    } catch (error) {
        phase = 'idle'
        startButton.disabled = false
        skillSelect.disabled = false
        setStatus(error instanceof Error ? error.message : String(error), 'err')
        showOverlay('COULD NOT START', 'Something went wrong starting the run.', [startButton])
    }
}

async function onFinish(): Promise<void> {
    if (phase !== 'playing' || !engine) return
    finishButton.disabled = true
    setStatus('Leaving the game and collecting statistics...')
    await engine.quit()
    await finalizeRun()
}

// Keep the arrow keys and Space for the game rather than scrolling the surrounding page.
canvas.addEventListener('keydown', (event) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(event.key)) event.preventDefault()
})
canvas.addEventListener('click', () => canvas.focus())

window.addEventListener('beforeunload', (event) => {
    if (phase === 'playing') event.preventDefault()
})
window.addEventListener('pagehide', () => {
    if (phase === 'playing' && runId) void abandonRun(runId).catch(() => undefined)
})

startButton.addEventListener('click', () => void onStart())
finishButton.addEventListener('click', () => void onFinish())

void (async () => {
    try {
        const me = await getMe()
        skillSelect.replaceChildren(
            ...me.skills.map((s) => {
                const option = document.createElement('option')
                option.value = String(s.value)
                option.textContent = s.label
                option.selected = s.value === 3
                return option
            })
        )
        await refreshSidebar()
        startButton.disabled = false
        setStatus('Ready.')
    } catch (error) {
        setStatus(error instanceof Error ? error.message : String(error), 'err')
        overlayText.textContent =
            'The Doom service is not reachable. Check that the application is installed and you are signed in.'
    }
})()
