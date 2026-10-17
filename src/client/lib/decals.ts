// Bullet holes, scorch marks and saw cuts left on the page. Each one is a tiny absolutely positioned,
// click-through <div> added to the document under the shot, so it scrolls with the content. They fade
// after DECAL_MS and vanish with the page; nothing about the page's own elements is changed.
import { frameOffset } from './elements'
import type { Point } from './autopilot'

export type DecalKind = 'hole' | 'scorch' | 'cut'

interface Decal {
    el: HTMLElement
    born: number
    owner: HTMLElement | null
}

export const DECAL_MS = 90000
const FADE_MS = 4000
const MAX_DECALS = 180

const STYLE: Record<DecalKind, (size: number) => string> = {
    hole: (size) =>
        `width:${size}px;height:${size}px;border-radius:50%;` +
        'background:radial-gradient(circle,#000 0 30%,#2a1c14 31% 55%,rgba(255,255,255,.55) 56% 66%,rgba(0,0,0,0) 67%);',
    scorch: (size) =>
        `width:${size}px;height:${size}px;border-radius:50%;` +
        'background:radial-gradient(circle,rgba(0,0,0,.6) 0,rgba(30,14,6,.45) 36%,rgba(70,30,8,.2) 60%,rgba(0,0,0,0) 72%);',
    cut: (size) =>
        `width:${size}px;height:3px;border-radius:2px;background:linear-gradient(90deg,rgba(0,0,0,0),#000 20%,#000 80%,rgba(0,0,0,0));`,
}

export class Decals {
    private decals: Decal[] = []
    private readonly host: Window

    constructor(host: Window) {
        this.host = host
    }

    get count(): number {
        return this.decals.length
    }

    /** Marks the page at a point in top-window coordinates, in whichever frame (or the top page) is under it. */
    add(kind: DecalKind, at: Point, size: number, now: number, frames: Window[], owner: HTMLElement | null = null): void {
        const target = this.windowAt(at, frames)
        if (!target) return
        try {
            const doc = target.win.document
            const parent = doc.body ?? doc.documentElement
            const el = doc.createElement('div')
            const x = at.x - target.origin.x + target.win.pageXOffset
            const y = at.y - target.origin.y + target.win.pageYOffset
            const rotation = kind === 'cut' ? `rotate(${Math.round(Math.random() * 180)}deg)` : ''
            const height = kind === 'cut' ? 3 : size
            el.setAttribute('data-x-doom-decal', kind)
            el.setAttribute(
                'style',
                `position:absolute;left:${Math.round(x - size / 2)}px;top:${Math.round(y - height / 2)}px;` +
                    `z-index:2147482000;pointer-events:none;transition:opacity ${FADE_MS}ms linear;` +
                    (rotation ? `transform:${rotation};` : '') +
                    STYLE[kind](size)
            )
            parent.appendChild(el)
            this.decals.push({ el, born: now, owner })
            while (this.decals.length > MAX_DECALS) this.remove(this.decals.shift()!)
        } catch {
            /* frame navigating away or cross-origin */
        }
    }

    /** Drops the marks that were on one element (it has been blasted away, so they would float in space). */
    removeFor(owner: HTMLElement): void {
        this.decals = this.decals.filter((d) => {
            if (d.owner !== owner) return true
            this.remove(d)
            return false
        })
    }

    /** Fades and removes old marks, and forgets ones whose page has gone. */
    update(now: number): void {
        this.decals = this.decals.filter((d) => {
            if (!d.el.isConnected) return false
            const age = now - d.born
            if (age > DECAL_MS) {
                this.remove(d)
                return false
            }
            if (age > DECAL_MS - FADE_MS) d.el.style.opacity = '0'
            return true
        })
    }

    clear(): void {
        for (const d of this.decals) this.remove(d)
        this.decals = []
    }

    private remove(d: Decal): void {
        try {
            d.el.remove()
        } catch {
            /* ignore */
        }
    }

    /** The innermost same-origin frame containing a point, or the top window when none does. */
    private windowAt(at: Point, frames: Window[]): { win: Window; origin: Point } | null {
        let best: { win: Window; origin: Point; area: number } | null = null
        for (const win of new Set(frames)) {
            if (win === this.host) continue
            try {
                const frame = win.frameElement
                if (!frame || !frame.isConnected || win.closed) continue
                const origin = frameOffset(win, this.host)
                if (!origin) continue
                const rect = frame.getBoundingClientRect()
                if (rect.width === 0 || rect.height === 0) continue
                const inside = at.x >= origin.x && at.y >= origin.y && at.x <= origin.x + rect.width && at.y <= origin.y + rect.height
                const area = rect.width * rect.height
                if (inside && (!best || area < best.area)) best = { win, origin, area }
            } catch {
                /* cross-origin */
            }
        }
        if (best) return { win: best.win, origin: best.origin }
        return { win: this.host, origin: { x: 0, y: 0 } }
    }
}
