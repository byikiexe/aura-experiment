export type RandomGenerator = () => number

/**
 * Creates a deterministic pseudo-random number generator.
 *
 * Returns values between 0 (inclusive) and 1 (exclusive).
 */
export function createRandom(seed: number): RandomGenerator {
    let state = seed >>> 0

    return (): number => {
        state += 0x6d2b79f5

        let value = state

        value = Math.imul(value ^ (value >>> 15), value | 1)
        value ^= value + Math.imul(value ^ (value >>> 7), value | 61)

        return ((value ^ (value >>> 14)) >>> 0) / 4294967296
    }
}

export function randomBetween(
    random: RandomGenerator,
    min: number,
    max: number
): number {
    return min + random() * (max - min)
}


export function randomInt(
    random: RandomGenerator,
    min: number,
    max: number
): number {
    return Math.floor(randomBetween(random, min, max + 1))
}


export function randomItem<T>(
    random: RandomGenerator,
    items: readonly T[]
): T {
    return items[randomInt(random, 0, items.length - 1)]
}
