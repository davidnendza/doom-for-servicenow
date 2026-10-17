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
        const { steps, shots } = controller.stats()
        stats.textContent = `${steps.toLocaleString()} steps, ${shots.toLocaleString()} shots this session`
    }

    button.addEventListener('click', () => {
        button.disabled = true
        void controller.toggle().then(render)
    })
    controller.onChange(render)
    window.setInterval(render, 1000)
    render()
}
