// The arsenal. Each weapon wrecks the page differently:
//   bullet  - leaves bullet holes where it lands and wears an element down before it shatters
//   rocket  - explodes: everything text-like inside the blast radius is blown away, leaving a scorch mark
//   melee   - the chainsaw: short range, shreds whatever it touches
// Only the weapons that ship in the shareware WAD are here (no plasma rifle or BFG).

export type WeaponId = 'pistol' | 'shotgun' | 'chaingun' | 'rocket' | 'chainsaw'
export type WeaponKind = 'bullet' | 'rocket' | 'melee'

export interface WeaponSpec {
    id: WeaponId
    name: string
    kind: WeaponKind
    /** ms between shots. */
    cooldown: number
    /** Rays per shot (the shotgun fires a spread). */
    pellets: number
    /** Total spread in radians across all pellets. */
    spread: number
    /** How far it reaches, in px. */
    range: number
    /** How far from the target the autopilot likes to stand, in px. */
    standOff: number
    /** Ammo given by one pickup (Infinity = never runs out). */
    ammo: number
    /** Damage to a monster per pellet. */
    monsterDamage: number
    /** Damage to a page element per pellet; elements have ELEMENT_HP. */
    elementDamage: number
    /** Blast radius in px for rockets. */
    splash: number
    sound: string
    /** Play the firing sound at most this often (ms), so a fast gun rattles instead of buzzing. */
    soundEvery: number
    /** Sprite lump prefix for the pickup on the floor. */
    pickup: string | null
}

export const ELEMENT_HP = 4

export const WEAPONS: Record<WeaponId, WeaponSpec> = {
    pistol: {
        id: 'pistol', name: 'PISTOL', kind: 'bullet', cooldown: 280, pellets: 1, spread: 0.04, range: 520, standOff: 190,
        ammo: Infinity, monsterDamage: 1, elementDamage: 1, splash: 0, sound: 'pistol', soundEvery: 0, pickup: null,
    },
    shotgun: {
        id: 'shotgun', name: 'SHOTGUN', kind: 'bullet', cooldown: 760, pellets: 7, spread: 0.3, range: 400, standOff: 170,
        ammo: 14, monsterDamage: 1, elementDamage: 1, splash: 0, sound: 'shotgun', soundEvery: 0, pickup: 'SHOT',
    },
    chaingun: {
        id: 'chaingun', name: 'CHAINGUN', kind: 'bullet', cooldown: 105, pellets: 1, spread: 0.09, range: 560, standOff: 230,
        ammo: 60, monsterDamage: 1, elementDamage: 1, splash: 0, sound: 'pistol', soundEvery: 230, pickup: 'MGUN',
    },
    rocket: {
        id: 'rocket', name: 'ROCKET LAUNCHER', kind: 'rocket', cooldown: 950, pellets: 1, spread: 0.01, range: 700, standOff: 320,
        ammo: 8, monsterDamage: 5, elementDamage: 99, splash: 150, sound: 'rocket', soundEvery: 0, pickup: 'LAUN',
    },
    chainsaw: {
        id: 'chainsaw', name: 'CHAINSAW', kind: 'melee', cooldown: 90, pellets: 1, spread: 0, range: 78, standOff: 40,
        ammo: 70, monsterDamage: 1, elementDamage: 1, splash: 0, sound: 'sawhit', soundEvery: 520, pickup: 'CSAW',
    },
}

/** Order of preference when the current weapon runs dry: the next best thing that still has ammo. */
export const PREFERENCE: WeaponId[] = ['rocket', 'chaingun', 'shotgun', 'chainsaw', 'pistol']

export const DROPPABLE: WeaponId[] = ['shotgun', 'chaingun', 'rocket', 'chainsaw']

/** One angle per pellet, spread evenly across the weapon's cone with a little jitter. */
export function pelletAngles(spec: WeaponSpec, aim: number, rng: () => number = Math.random): number[] {
    if (spec.pellets === 1) return [aim + (rng() - 0.5) * spec.spread]
    const angles: number[] = []
    for (let i = 0; i < spec.pellets; i += 1) {
        const slot = i / (spec.pellets - 1) - 0.5 // -0.5 .. 0.5
        angles.push(aim + slot * spec.spread + (rng() - 0.5) * (spec.spread / spec.pellets))
    }
    return angles
}

/** Which weapon to use now: the preferred one if it has ammo, otherwise the best one that does. */
export function chooseWeapon(preferred: WeaponId, ammo: Partial<Record<WeaponId, number>>): WeaponId {
    if (preferred === 'pistol' || (ammo[preferred] ?? 0) > 0) return preferred
    return PREFERENCE.find((id) => id === 'pistol' || (ammo[id] ?? 0) > 0) ?? 'pistol'
}
