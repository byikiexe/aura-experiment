import { hashString } from './hash'
import { createRandom, type RandomGenerator } from './random'

export interface SeedContext {
    seed: number
    hex: string
    random: RandomGenerator
}

/**
 * Normalizes user input before creating its seed.
 */
export function normalizeThought(thought: string): string {
    return thought
        .trim()
        .replace(/\s+/g, ' ')
        .toLowerCase()
}

/**
 * Creates a deterministic seed from a thought and variation.
 */
export function createSeed(
    thought: string,
    variation = 0
): SeedContext {
    const normalized = normalizeThought(thought)

    const source = `${normalized}::${variation}`

    const seed = hashString(source)

    return {
        seed,
        hex: seed.toString(16).padStart(8, '0').toUpperCase(),
        random: createRandom(seed),
    }
}
