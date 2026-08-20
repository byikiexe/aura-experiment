export type AuraGeometry =
    | 'orbital'
    | 'organic'
    | 'flow'
    | 'particles'


export interface AuraPalette {
    id: string

    background: string
    primary: string
    secondary: string
    accent: string
}


export interface AuraComposition {
    density: number
    complexity: number
    symmetry: number
    distortion: number
}


export interface AuraMotion {
    speed: number
    amplitude: number
}


export interface Aura {
    thought: string

    seed: number
    seedHex: string
    variation: number

    geometry: AuraGeometry

    palette: AuraPalette

    composition: AuraComposition

    motion: AuraMotion

    noise: number
}
