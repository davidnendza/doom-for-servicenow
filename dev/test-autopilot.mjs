// Tests for the marine's autopilot brain. Run: npm run test:client
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { Autopilot } from '../src/client/lib/autopilot.ts'

const BOUNDS = { minX: 50, maxX: 1150, minY: 120, maxY: 760 }

/** A seeded, repeatable random source. */
function rng(seed = 1) {
    let s = seed
    return () => {
        s = (s * 1664525 + 1013904223) % 4294967296
        return s / 4294967296
    }
}

function target(id, kind, x, y) {
    const t = { id, kind, x, y, dead: false, position: () => ({ x: t.x, y: t.y }), alive: () => !t.dead }
    return t
}

/** Runs the brain for `seconds` of fake time, moving the marine the way the game does. */
function simulate(brain, { pos, targets, seconds, onTick }) {
    const dt = 1 / 30
    let now = 1000
    const seen = { fired: 0, states: new Set(), aimed: [] }
    for (let i = 0; i < seconds * 30; i += 1) {
        now += dt * 1000
        const intent = brain.update(now, pos, targets, BOUNDS)
        const speed = intent.run ? 400 : 230
        const length = Math.hypot(intent.dx, intent.dy) || 1
        pos.x += (intent.dx / length) * speed * dt * (intent.dx || intent.dy ? 1 : 0)
        pos.y += (intent.dy / length) * speed * dt * (intent.dx || intent.dy ? 1 : 0)
        if (intent.fire) {
            seen.fired += 1
            if (intent.aim) seen.aimed.push(intent.aim)
        }
        seen.states.add(brain.current().state)
        if (onTick) onTick(now, intent, seen)
    }
    return seen
}

describe('autopilot', () => {
    it('wanders around when there is nothing to shoot, staying inside the screen', () => {
        const brain = new Autopilot(rng(7))
        const pos = { x: 600, y: 400 }
        let minX = 1e9
        let maxX = -1e9
        const seen = simulate(brain, {
            pos,
            targets: [],
            seconds: 40,
            onTick: () => {
                minX = Math.min(minX, pos.x)
                maxX = Math.max(maxX, pos.x)
            },
        })
        assert.ok(seen.states.has('wander'))
        assert.equal(seen.fired, 0)
        assert.ok(maxX - minX > 150, 'should actually travel')
        assert.ok(pos.x >= BOUNDS.minX - 5 && pos.x <= BOUNDS.maxX + 5)
    })

    it('walks up to an element, stands off, and shoots it', () => {
        const brain = new Autopilot(rng(3))
        const link = target('INC0010308', 'element', 900, 300)
        const pos = { x: 100, y: 600 }
        let hits = 0
        const seen = simulate(brain, { pos, targets: [link], seconds: 30, onTick: (_n, intent) => {
            // The game kills the element after a few hits; emulate that here.
            if (intent.fire && !link.dead && ++hits >= 40) link.dead = true
        } })
        assert.ok(seen.states.has('approach'))
        assert.ok(seen.states.has('attack'))
        assert.ok(seen.fired > 0)
        for (const aim of seen.aimed) assert.deepEqual(aim, { x: 900, y: 300 })
    })

    it('keeps a firing distance rather than walking into the target', () => {
        const brain = new Autopilot(rng(5))
        const link = target('INC0000031', 'element', 700, 400)
        const pos = { x: 100, y: 400 }
        let closest = 1e9
        simulate(brain, { pos, targets: [link], seconds: 12, onTick: (_n, intent) => {
            if (intent.fire) closest = Math.min(closest, Math.hypot(pos.x - 700, pos.y - 400))
        } })
        assert.ok(closest > 120, `stood ${closest}px away`)
        assert.ok(closest < 300, `stood ${closest}px away`)
    })

    it('goes idle again once its target is destroyed', () => {
        const brain = new Autopilot(rng(11))
        const link = target('a', 'element', 400, 300)
        const pos = { x: 380, y: 300 }
        simulate(brain, { pos, targets: [link], seconds: 3 })
        link.dead = true
        const seen = simulate(brain, { pos, targets: [link], seconds: 1 })
        assert.equal(seen.fired, 0)
        assert.equal(brain.current().target, null)
    })

    it('drops what it is doing to fight a monster that comes close', () => {
        const brain = new Autopilot(rng(2))
        const link = target('INC1', 'element', 1000, 600)
        const imp = target('imp', 'monster', 300, 400)
        const pos = { x: 200, y: 400 }
        simulate(brain, { pos, targets: [link], seconds: 2 })
        const seen = simulate(brain, { pos, targets: [link, imp], seconds: 10 })
        assert.ok(seen.fired > 0)
        assert.ok(seen.aimed.every((a) => a.x === 300 && a.y === 400), 'shot at the imp, not the link')
    })

    it('ignores targets that are already dead', () => {
        const brain = new Autopilot(rng(4))
        const dead = target('corpse', 'monster', 300, 400)
        dead.dead = true
        const seen = simulate(brain, { pos: { x: 200, y: 400 }, targets: [dead], seconds: 10 })
        assert.equal(seen.fired, 0)
    })
})
