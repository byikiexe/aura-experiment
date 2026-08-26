import type { Aura } from '../../types/aura'
import { pseudoRandom } from '../utils/random'
import { hexToRgba } from '../utils/color'

interface EnergyCoresOptions {
    ctx: CanvasRenderingContext2D
    aura: Aura
    width: number
    height: number
    time: number
}

export function drawEnergyCores({
    ctx,
    aura,
    width,
    height,
    time,
}: EnergyCoresOptions): void {

    const count =
        2 +
        Math.floor(
            aura.atmosphere.coreIntensity * 3
        )

    ctx.save()

    ctx.globalCompositeOperation =
        'screen'

    for (
        let index = 0;
        index < count;
        index++
    ) {
        drawEnergyCore(
            ctx,
            aura,
            width,
            height,
            time,
            index,
            count
        )
    }

    ctx.restore()
}

function drawEnergyCore(
    ctx: CanvasRenderingContext2D,
    aura: Aura,
    width: number,
    height: number,
    time: number,
    index: number,
    count: number
): void {

    const phase =
        aura.seed * 0.00013 +
        index * 2.399

    const progress =
        (index + 1) /
        (count + 1)

    /*
     * Distribute cores through the central
     * region rather than across the entire
     * viewport.
     */

    const anchorX =
        width *
        (
            0.16 +
            progress * 0.68
        )

    const anchorY =
        height *
        (
            0.5 +
            Math.sin(
                phase * 1.71
            ) *
            0.28
        )

    /*
     * Very subtle motion.
     */

    const motion =
        time *
        aura.motion.speed *
        0.000015

    const x =
        anchorX +
        Math.cos(
            phase + motion
        ) *
        width *
        0.012 *
        aura.motion.amplitude

    const y =
        anchorY +
        Math.sin(
            phase * 1.3 + motion
        ) *
        height *
        0.014 *
        aura.motion.amplitude

    const scale =
        Math.min(
            width,
            height
        )

    const sizeVariation =
        pseudoRandom(
            aura.seed +
            index * 48121
        )

    const radius =
        scale *
        (
            0.002 +
            sizeVariation * 0.0025
        )

    const color =
        selectCoreColor(
            aura,
            index
        )

    drawOuterHalo(
        ctx,
        color,
        x,
        y,
        radius,
        aura.atmosphere.coreIntensity
    )

    drawChromaticCorona(
        ctx,
        color,
        x,
        y,
        radius,
        aura.atmosphere.coreIntensity
    )

    drawWhiteCore(
        ctx,
        color,
        x,
        y,
        radius,
        aura.atmosphere.coreIntensity
    )
}

function drawOuterHalo(
    ctx: CanvasRenderingContext2D,
    color: string,
    x: number,
    y: number,
    radius: number,
    intensity: number
): void {

    const haloRadius =
        radius * 18

    const gradient =
        ctx.createRadialGradient(
            x,
            y,
            0,
            x,
            y,
            haloRadius
        )

    gradient.addColorStop(
        0,
        hexToRgba(
            color,
            0.32 * intensity
        )
    )

    gradient.addColorStop(
        0.16,
        hexToRgba(
            color,
            0.18 * intensity
        )
    )

    gradient.addColorStop(
        0.48,
        hexToRgba(
            color,
            0.045 * intensity
        )
    )

    gradient.addColorStop(
        1,
        'rgba(0, 0, 0, 0)'
    )

    ctx.fillStyle = gradient

    ctx.beginPath()

    ctx.arc(
        x,
        y,
        haloRadius,
        0,
        Math.PI * 2
    )

    ctx.fill()
}
function drawChromaticCorona(
    ctx: CanvasRenderingContext2D,
    color: string,
    x: number,
    y: number,
    radius: number,
    intensity: number
): void {

    const coronaRadius =
        radius * 4.5

    const gradient =
        ctx.createRadialGradient(
            x,
            y,
            0,
            x,
            y,
            coronaRadius
        )

    gradient.addColorStop(
        0,
        `rgba(255, 255, 255, ${0.98 * intensity
        })`
    )

    gradient.addColorStop(
        0.12,
        `rgba(255, 255, 255, ${0.75 * intensity
        })`
    )

    gradient.addColorStop(
        0.32,
        hexToRgba(
            color,
            0.85 * intensity
        )
    )

    gradient.addColorStop(
        0.7,
        hexToRgba(
            color,
            0.18 * intensity
        )
    )

    gradient.addColorStop(
        1,
        'rgba(0, 0, 0, 0)'
    )

    ctx.fillStyle = gradient

    ctx.beginPath()

    ctx.arc(
        x,
        y,
        coronaRadius,
        0,
        Math.PI * 2
    )

    ctx.fill()
}

function drawWhiteCore(
    ctx: CanvasRenderingContext2D,
    color: string,
    x: number,
    y: number,
    radius: number,
    intensity: number
): void {

    ctx.save()

    ctx.shadowColor = color

    ctx.shadowBlur =
        radius * 5

    ctx.fillStyle =
        `rgba(255, 255, 255, ${0.95 * intensity
        })`

    ctx.beginPath()

    ctx.arc(
        x,
        y,
        Math.max(
            0.75,
            radius * 0.55
        ),
        0,
        Math.PI * 2
    )

    ctx.fill()

    ctx.restore()
}

function selectCoreColor(
    aura: Aura,
    index: number
): string {

    if (index % 3 === 0) {
        return aura.palette.accent
    }

    if (index % 2 === 0) {
        return aura.palette.primary
    }

    return aura.palette.secondary
}
