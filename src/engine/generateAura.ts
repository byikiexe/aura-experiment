import { createSeed } from '../core/seed'

import {
    randomBetween,
    randomItem,
} from '../core/random'

import { palettes } from '../palettes/palettes'

import type {
    Aura,
    AuraGeometry,
} from '../types/aura'


const geometries: readonly AuraGeometry[] = [
    'orbital',
    'organic',
    'flow',
    'particles',
]


export function generateAura(
    thought: string,
    variation = 0
): Aura {
    const {
        seed,
        hex,
        random,
    } = createSeed(thought, variation)


    return {

        thought: thought.trim(),
        seed,
        seedHex: hex,
        variation,
        geometry:
            randomItem(random, geometries),
        palette:
            randomItem(random, palettes),
        composition: {
            density:
                randomBetween(random, 0.25, 0.9),
            complexity:
                randomBetween(random, 0.2, 1),
            symmetry:
                randomBetween(random, 0, 1),
            distortion:
                randomBetween(random, 0.05, 0.8),
        },
        atmosphere: {
            luminosity:
                randomBetween(random, 0.45, 1),

            turbulence:
                randomBetween(random, 0.2, 1),

            filamentDensity:
                randomBetween(random, 0.35, 1),

            particleDensity:
                randomBetween(random, 0.25, 1),

            coreIntensity:
                randomBetween(random, 0.4, 1),

            orbitalInfluence:
                randomBetween(random, 0.1, 0.9),
        },
        motion: {
            speed:
                randomBetween(random, 0.1, 0.7),
            amplitude:
                randomBetween(random, 0.1, 1),
        },
        noise:
            randomBetween(random, 0.05, 0.5),
    }
}
