/**
 * Converts a string into a deterministic unsigned 32-bit integer.
 *
 * Same input = same hash.
 */
export function hashString(value: string): number {
    let hash = 2166136261

    for (let i = 0; i < value.length; i++) {
        hash ^= value.charCodeAt(i)

        hash = Math.imul(hash, 16777619)
    }

    return hash >>> 0
}
