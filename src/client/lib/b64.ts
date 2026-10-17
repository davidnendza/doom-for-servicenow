/** Decodes base64 to bytes. */
export function b64ToBytes(b64: string): Uint8Array {
    const bin = atob(b64)
    const out = new Uint8Array(bin.length)
    for (let i = 0; i < bin.length; i += 1) out[i] = bin.charCodeAt(i)
    return out
}

export const textToBytes = (text: string): Uint8Array => new TextEncoder().encode(text)

/** Decodes base64 and inflates the gzip stream inside it (see scripts/fetch-doom-assets.mjs). */
export async function gunzipB64(b64: string): Promise<Uint8Array> {
    const stream = new Blob([b64ToBytes(b64)]).stream().pipeThrough(new DecompressionStream('gzip'))
    return new Uint8Array(await new Response(stream).arrayBuffer())
}
