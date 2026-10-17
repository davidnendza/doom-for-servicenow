// Minimal reader for id Software's WAD format, enough to pull sprites and sounds out of the
// (unmodified) shareware DOOM1.WAD at runtime. Nothing decoded here is stored or redistributed.

export interface Sprite {
    image: HTMLCanvasElement
    width: number
    height: number
    /** Pixels from the left edge of the image to the sprite origin. */
    left: number
    /** Pixels from the top edge of the image to the sprite origin (the feet, for a character). */
    top: number
}

export interface Sound {
    rate: number
    samples: Float32Array
}

export class Wad {
    private readonly lumps = new Map<string, { pos: number; size: number }>()

    constructor(private readonly bytes: Uint8Array) {
        const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
        const magic = String.fromCharCode(...bytes.subarray(0, 4))
        if (magic !== 'IWAD' && magic !== 'PWAD') throw new Error('Not a WAD file')
        const count = view.getInt32(4, true)
        const directory = view.getInt32(8, true)
        for (let i = 0; i < count; i += 1) {
            const at = directory + i * 16
            let name = ''
            for (let c = 0; c < 8 && bytes[at + 8 + c]; c += 1) name += String.fromCharCode(bytes[at + 8 + c]!)
            this.lumps.set(name, { pos: view.getInt32(at, true), size: view.getInt32(at + 4, true) })
        }
    }

    get(name: string): Uint8Array | undefined {
        const lump = this.lumps.get(name)
        return lump && this.bytes.subarray(lump.pos, lump.pos + lump.size)
    }

    names(): string[] {
        return [...this.lumps.keys()]
    }
}

/** Decodes a Doom "patch" (column-based, palettised, transparent where no post covers a pixel). */
export function decodePatch(data: Uint8Array, palette: Uint8Array, mirrored = false): Sprite {
    const view = new DataView(data.buffer, data.byteOffset, data.byteLength)
    const width = view.getUint16(0, true)
    const height = view.getUint16(2, true)
    const left = view.getInt16(4, true)
    const top = view.getInt16(6, true)

    const image = document.createElement('canvas')
    image.width = width
    image.height = height
    const ctx = image.getContext('2d')!
    const pixels = ctx.createImageData(width, height)

    for (let x = 0; x < width; x += 1) {
        let p = view.getUint32(8 + x * 4, true)
        const column = mirrored ? width - 1 - x : x
        for (;;) {
            const topDelta = data[p++]!
            if (topDelta === 0xff) break
            const length = data[p++]!
            p += 1 // unused pad byte
            for (let j = 0; j < length; j += 1) {
                const y = topDelta + j
                const colour = data[p + j]! * 3
                if (y < height) {
                    const o = (y * width + column) * 4
                    pixels.data[o] = palette[colour]!
                    pixels.data[o + 1] = palette[colour + 1]!
                    pixels.data[o + 2] = palette[colour + 2]!
                    pixels.data[o + 3] = 255
                }
            }
            p += length + 1 // pixels plus trailing pad byte
        }
    }
    ctx.putImageData(pixels, 0, 0)
    return { image, width, height, left: mirrored ? width - left : left, top }
}

/**
 * Loads every sprite lump with the given four-letter prefix, keyed by frame letter + rotation,
 * e.g. "A1" (frame A facing the viewer) or "H0" (frame H, the same from every angle).
 * A lump such as PLAYA2A8 supplies rotation 2 as stored and rotation 8 mirrored.
 */
export function loadSpriteSet(wad: Wad, prefix: string, palette: Uint8Array): Map<string, Sprite> {
    const set = new Map<string, Sprite>()
    for (const name of wad.names()) {
        // Frame letter + rotation digit, optionally followed by a mirrored pair (PLAYA2A8).
        if (!name.startsWith(prefix) || !/^.{4}[A-Z]\d([A-Z]\d)?$/.test(name)) continue
        const data = wad.get(name)
        if (!data) continue
        set.set(name.slice(4, 6), decodePatch(data, palette))
        if (name.length >= 8) set.set(name.slice(6, 8), decodePatch(data, palette, true))
    }
    return set
}

/** Decodes a DMX sound lump: 8-bit unsigned mono PCM behind an 8-byte header and 16 pad bytes. */
export function decodeSound(data: Uint8Array): Sound | undefined {
    if (data.length < 32) return undefined
    const view = new DataView(data.buffer, data.byteOffset, data.byteLength)
    if (view.getUint16(0, true) !== 3) return undefined
    const rate = view.getUint16(2, true)
    const count = Math.min(view.getUint32(4, true), data.length - 8) - 32
    if (count <= 0) return undefined
    const samples = new Float32Array(count)
    for (let i = 0; i < count; i += 1) samples[i] = (data[24 + i]! - 128) / 128
    return { rate, samples }
}
