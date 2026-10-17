import type { DoomguyController } from '../doomguy'

const COPY = {
    on: { title: 'Doomguy is on the loose', button: 'DISMISS DOOMGUY' },
    off: { title: 'Doomguy is sleeping', button: 'SUMMON DOOMGUY' },
}

/** Wires up the Doomguy settings page: one big switch plus live step and shot counters. */
export async function initSettingsPage(
    root: HTMLElement,
    getController: () => Promise<DoomguyController>
): Promise<void> {
    const title = root.querySelector<HTMLElement>('#dg-title')!
    const button = root.querySelector<HTMLButtonElement>('#dg-toggle')!
    const stats = root.querySelector<HTMLElement>('#dg-stats')!
    const modeButton = root.querySelector<HTMLButtonElement>('#dg-mode')!
    const modeNote = root.querySelector<HTMLElement>('#dg-mode-note')!
    const error = root.querySelector<HTMLElement>('#dg-error')!

    let controller: DoomguyController
    try {
        controller = await getController()
    } catch (e) {
        error.textContent = e instanceof Error ? e.message : String(e)
        return
    }

    const render = (): void => {
        const copy = controller.enabled ? COPY.on : COPY.off
        title.textContent = copy.title
        button.textContent = copy.button
        button.className = controller.enabled ? '' : 'primary'
        button.disabled = false
        const { steps, shots, kills, blasts } = controller.stats()
        stats.textContent =
            `${steps.toLocaleString()} steps, ${shots.toLocaleString()} shots, ` +
            `${kills.toLocaleString()} demons slain, ${blasts.toLocaleString()} things blasted this session`
        const auto = controller.mode === 'auto'
        modeButton.textContent = auto ? 'SWITCH TO MANUAL CONTROL' : 'SWITCH TO AUTOPILOT'
        modeNote.textContent = auto
            ? 'Autopilot: he wanders, fights the odd imp and blasts record links on the page (they respawn). Press any movement key to take over.'
            : 'Manual: only your keyboard moves him (shots can still blast links and monsters).'
    }

    button.addEventListener('click', () => {
        button.disabled = true
        void controller.toggle().then(render)
    })
    modeButton.addEventListener('click', () => {
        controller.toggleMode()
        render()
    })
    controller.onChange(render)
    window.setInterval(render, 1000)
    render()
}
