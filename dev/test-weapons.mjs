// Tests for the arsenal, monsters and pickups. Run: npm run test:client
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { chooseWeapon, DROPPABLE, ELEMENT_HP, pelletAngles, PREFERENCE, WEAPONS } from '../src/client/lib/weapons.ts'
import { Monsters, SPECS } from '../src/client/lib/monsters.ts'
import { Pickups, GRAB_RADIUS } from '../src/client/lib/pickups.ts'
import { Autopilot } from '../src/client/lib/autopilot.ts'

function rng(seed = 1) {
    let s = seed
    return () => {
        s = (s * 1664525 + 1013904223) % 4294967296
        return s / 4294967296
    }
}

const BOUNDS = { minX: 50, maxX: 1150, minY: 120, maxY: 760 }

describe('weapons', () => {
    it('only offers weapons the shareware WAD has sprites for', () => {
        for (const id of DROPPABLE) assert.ok(WEAPONS[id].pickup, `${id} needs a pickup sprite`)
        assert.equal(WEAPONS.pistol.pickup, null)
        assert.equal(WEAPONS.pistol.ammo, Infinity)
    })

    it('has a distinct way of wrecking things for each kind of weapon', () => {
        assert.equal(WEAPONS.rocket.kind, 'rocket')
        assert.ok(WEAPONS.rocket.splash >= 100, 'rockets take out an area')
        assert.ok(WEAPONS.rocket.elementDamage >= ELEMENT_HP, 'one rocket destroys an element outright')
        assert.ok(WEAPONS.pistol.elementDamage < ELEMENT_HP, 'bullets wear things down and leave holes first')
        assert.ok(WEAPONS.chainsaw.range < 100, 'the chainsaw is melee')
        assert.ok(WEAPONS.shotgun.pellets > 1 && WEAPONS.chaingun.cooldown < WEAPONS.pistol.cooldown)
    })

    it('fires a shotgun as a spread and a pistol as a single ray', () => {
        const spread = pelletAngles(WEAPONS.shotgun, 1, rng(3))
        assert.equal(spread.length, WEAPONS.shotgun.pellets)
        for (const a of spread) assert.ok(Math.abs(a - 1) <= WEAPONS.shotgun.spread, `pellet at ${a}`)
        assert.ok(new Set(spread.map((a) => a.toFixed(3))).size > 1, 'pellets differ')
        const single = pelletAngles(WEAPONS.pistol, 2, rng(3))
        assert.equal(single.length, 1)
        assert.ok(Math.abs(single[0] - 2) <= WEAPONS.pistol.spread)
    })

    it('falls back to the best weapon that still has ammo', () => {
        assert.equal(chooseWeapon('pistol', {}), 'pistol')
        assert.equal(chooseWeapon('shotgun', { shotgun: 5 }), 'shotgun')
        assert.equal(chooseWeapon('shotgun', { shotgun: 0, chaingun: 30 }), 'chaingun')
        assert.equal(chooseWeapon('rocket', { rocket: 0, shotgun: 0, chaingun: 0, chainsaw: 0 }), 'pistol')
        assert.deepEqual(PREFERENCE.at(-1), 'pistol')
    })
})

describe('monsters', () => {
    it('can spawn every kind, with the rare baron only one at a time', () => {
        const monsters = new Monsters(rng(9))
        const seen = new Set()
        for (let i = 0; i < 400; i += 1) {
            const m = monsters.spawn(BOUNDS, 0)
            seen.add(m.kind)
            if (monsters.alive.filter((x) => x.kind === 'baron').length > 1) assert.fail('two barons')
            monsters.clear()
        }
        for (const kind of Object.keys(SPECS)) assert.ok(seen.has(kind), `never spawned a ${kind}`)
        monsters.clear()
        const first = monsters.spawn(BOUNDS, 0)
        assert.ok(first.hp > 0)
    })

    it('takes several hits, and a big hit splatters it', () => {
        const monsters = new Monsters(() => 0.99) // never the lucky 20% gib
        const a = monsters.spawn(BOUNDS, 0)
        a.kind = 'imp'
        a.hp = SPECS.imp.hp
        assert.equal(monsters.hit(a, 0, 1), 'pain')
        assert.equal(monsters.hit(a, 0, 1), 'pain')
        assert.equal(monsters.hit(a, 0, 1), 'killed')
        const b = monsters.spawn(BOUNDS, 0)
        b.kind = 'imp'
        b.hp = SPECS.imp.hp
        assert.equal(monsters.hit(b, 0, 9), 'gibbed')
        const c = monsters.spawn(BOUNDS, 0)
        c.kind = 'imp'
        c.hp = SPECS.imp.hp
        assert.equal(monsters.hit(c, 0, 1, true), 'pain')
        assert.equal(monsters.hit(c, 0, 5, true), 'gibbed')
    })

    it('finds the monsters inside a blast radius', () => {
        const monsters = new Monsters(rng(2))
        const near = monsters.spawn(BOUNDS, 0)
        near.x = 500
        near.y = 440
        const far = monsters.spawn(BOUNDS, 0)
        far.x = 1000
        far.y = 700
        const hit = monsters.inRadius({ x: 500, y: 400 }, 150)
        assert.deepEqual(hit.map((m) => m.id), [near.id])
    })

    it('leaves weapons behind: shotgunners their shotgun, the baron a rocket launcher', () => {
        assert.equal(SPECS.shotgunner.drop.weapon, 'shotgun')
        assert.equal(SPECS.baron.drop.weapon, 'rocket')
        assert.equal(SPECS.baron.drop.chance, 1)
        for (const spec of Object.values(SPECS)) if (spec.drop) assert.ok(WEAPONS[spec.drop.weapon])
    })
})

describe('pickups', () => {
    it('are collected by standing on them, once', () => {
        const pickups = new Pickups()
        const p = pickups.spawn('shotgun', { x: 300, y: 300 }, 0)
        assert.equal(pickups.take({ x: 300 + GRAB_RADIUS + 5, y: 300 }), null)
        assert.equal(pickups.take({ x: 310, y: 305 }), p)
        assert.equal(pickups.take({ x: 310, y: 305 }), null)
        assert.equal(p.target.alive(), false)
    })

    it('expire if nobody comes for them, and are capped', () => {
        const pickups = new Pickups()
        for (let i = 0; i < 3; i += 1) pickups.spawn('rocket', { x: i * 100, y: 100 }, 0)
        assert.equal(pickups.canSpawn(), false)
        pickups.update(60000)
        assert.equal(pickups.items.length, 0)
    })
})

describe('autopilot and loot', () => {
    function simulate(brain, pos, targets, seconds, standOff) {
        let now = 1000
        let fired = 0
        for (let i = 0; i < seconds * 30; i += 1) {
            now += 1000 / 30
            const intent = brain.update(now, pos, targets, BOUNDS, standOff)
            const moving = intent.dx || intent.dy
            pos.x += (intent.dx || 0) * (intent.run ? 400 : 230) / 30 * (moving ? 1 : 0)
            pos.y += (intent.dy || 0) * (intent.run ? 400 : 230) / 30 * (moving ? 1 : 0)
            if (intent.fire) fired += 1
        }
        return fired
    }

    it('walks onto a weapon lying on the floor, ahead of blasting links', () => {
        const brain = new Autopilot(rng(6))
        const loot = { id: 'gun', kind: 'pickup', x: 800, y: 500, taken: false, position() { return { x: this.x, y: this.y } }, alive() { return !this.taken } }
        const link = { id: 'inc', kind: 'element', position: () => ({ x: 200, y: 300 }), alive: () => true }
        const pos = { x: 150, y: 300 }
        let reached = false
        let now = 1000
        for (let i = 0; i < 30 * 40 && !reached; i += 1) {
            now += 1000 / 30
            const intent = brain.update(now, pos, [loot, link], BOUNDS)
            const len = Math.hypot(intent.dx, intent.dy)
            if (len) {
                pos.x += (intent.dx / len) * (intent.run ? 400 : 230) / 30
                pos.y += (intent.dy / len) * (intent.run ? 400 : 230) / 30
            }
            if (Math.hypot(pos.x - loot.x, pos.y - loot.y) < GRAB_RADIUS) {
                loot.taken = true
                reached = true
            }
        }
        assert.ok(reached, 'never reached the weapon')
    })

    it('stands closer for the chainsaw than for the rocket launcher', () => {
        const distanceWhenFiring = (standOff) => {
            const brain = new Autopilot(rng(4))
            const link = { id: 'a', kind: 'element', position: () => ({ x: 700, y: 400 }), alive: () => true }
            const pos = { x: 100, y: 400 }
            let nearest = Infinity
            let now = 1000
            for (let i = 0; i < 30 * 25; i += 1) {
                now += 1000 / 30
                const intent = brain.update(now, pos, [link], BOUNDS, standOff)
                const len = Math.hypot(intent.dx, intent.dy)
                if (len) {
                    pos.x += (intent.dx / len) * (intent.run ? 400 : 230) / 30
                    pos.y += (intent.dy / len) * (intent.run ? 400 : 230) / 30
                }
                if (intent.fire) nearest = Math.min(nearest, Math.hypot(700 - pos.x, 400 - pos.y))
            }
            return nearest
        }
        const saw = distanceWhenFiring(WEAPONS.chainsaw.standOff)
        const rocket = distanceWhenFiring(WEAPONS.rocket.standOff)
        assert.ok(saw < 130, `chainsaw fired from ${saw}`)
        assert.ok(rocket > 220, `rocket fired from ${rocket}`)
    })
})
