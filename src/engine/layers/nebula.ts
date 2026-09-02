import type { Aura } from '../../types/aura'
import { hexToRgba } from '../utils/color'
import { pseudoRandom } from '../utils/random'

interface NebulaOptions {
    ctx: CanvasRenderingContext2D
    aura: Aura
    width: number
    height: number
    time: number
}

export function drawNebula({ ctx, aura, width, height }: NebulaOptions): void {
    const scale = Math.min(width, height)

    ctx.save()
    ctx.globalCompositeOperation = 'screen'

    drawColorWash(ctx, aura, width, height)
    drawBlurredBlobs(ctx, aura, width, height)
    drawSoftHighlights(ctx, aura, width, height, scale)

    ctx.restore()
}

function drawColorWash(
    ctx: CanvasRenderingContext2D,
    aura: Aura,
    width: number,
    height: number
): void {
    const x = width * (0.35 + pseudoRandom(aura.seed + 3) * 0.3)
    const y = height * (0.35 + pseudoRandom(aura.seed + 5) * 0.3)
    const radius = Math.max(width, height) * 0.78
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)

    gradient.addColorStop(0, hexToRgba(aura.palette.accent, 0.14))
    gradient.addColorStop(0.3, hexToRgba(aura.palette.primary, 0.075))
    gradient.addColorStop(0.68, hexToRgba(aura.palette.secondary, 0.035))
    gradient.addColorStop(1, 'rgba(0,0,0,0)')

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
}

function drawBlurredBlobs(
    ctx: CanvasRenderingContext2D,
    aura: Aura,
    width: number,
    height: number
): void {
    const count = 7 + Math.floor(aura.composition.complexity * 4)
    const baseSize = Math.min(width, height)

    for (let index = 0; index < count; index++) {
        const seed = aura.seed + index * 42821
        const color = selectBlobColor(aura, index)
        const x = width * (-0.05 + pseudoRandom(seed + 1) * 1.1)
        const y = height * (-0.08 + pseudoRandom(seed + 2) * 1.16)
        const radiusX = baseSize * (0.18 + pseudoRandom(seed + 3) * 0.28)
        const radiusY = baseSize * (0.14 + pseudoRandom(seed + 4) * 0.24)
        const rotation = pseudoRandom(seed + 5) * Math.PI
        const intensity = color === aura.palette.accent
            ? 0.28 + aura.atmosphere.luminosity * 0.13
            : 0.16 + aura.atmosphere.luminosity * 0.09

        drawOrganicBlob(
            ctx,
            x,
            y,
            radiusX,
            radiusY,
            rotation,
            color,
            intensity
        )
    }
}

function selectBlobColor(aura: Aura, index: number): string {
    // Almost half of the large masses use the complementary accent.
    if (index % 2 === 0) return aura.palette.accent
    if (index % 4 === 1) return aura.palette.primary
    return aura.palette.secondary
}

function drawOrganicBlob(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radiusX: number,
    radiusY: number,
    rotation: number,
    color: string,
    alpha: number
): void {
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(rotation)
    ctx.scale(radiusX, radiusY)

    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 1)
    const saturatedAlpha = Math.min(0.62, alpha * 1.65)

    gradient.addColorStop(0, hexToRgba(color, saturatedAlpha))
    gradient.addColorStop(0.3, hexToRgba(color, alpha * 0.92))
    gradient.addColorStop(0.68, hexToRgba(color, alpha * 0.38))
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')

    ctx.fillStyle = gradient
    ctx.fillRect(-1, -1, 2, 2)
    ctx.restore()
}

function drawSoftHighlights(
    ctx: CanvasRenderingContext2D,
    aura: Aura,
    width: number,
    height: number,
    scale: number
): void {
    const count = 4 + Math.floor(aura.atmosphere.coreIntensity * 3)

    for (let index = 0; index < count; index++) {
        const seed = aura.seed + index * 68917
        const x = width * (0.12 + pseudoRandom(seed + 1) * 0.76)
        const y = height * (0.12 + pseudoRandom(seed + 2) * 0.76)
        const radius = scale * (0.035 + pseudoRandom(seed + 3) * 0.075)
        const color = index % 2 === 0 ? aura.palette.accent : aura.palette.primary
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)

        gradient.addColorStop(0, 'rgba(255,255,255,0.72)')
        gradient.addColorStop(0.035, hexToRgba(color, 0.72))
        gradient.addColorStop(0.2, hexToRgba(color, 0.24))
        gradient.addColorStop(1, 'rgba(0,0,0,0)')

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fill()
    }
}
