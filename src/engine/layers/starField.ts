import type { Aura } from '../../types/aura'

interface StarFieldOptions {
    ctx: CanvasRenderingContext2D
    aura: Aura
    width: number
    height: number
    time: number
}

export function drawStarField({
    ctx,
    aura,
    width,
    height,
    time,
}: StarFieldOptions): void {

    const count =
        70 +
        Math.floor(
            aura.atmosphere.particleDensity *
            130
        )

    ctx.save()

    ctx.globalCompositeOperation =
        'screen'

    for (
        let index = 0;
        index < count;
        index++
    ) {
        drawStar(
            ctx,
            aura,
            width,
            height,
            time,
            index
        )
    }

    ctx.restore()
}

function drawStar(
    ctx: CanvasRenderingContext2D,
    aura: Aura,
    width: number,
    height: number,
    time: number,
    index: number
): void {

    const xRandom =
        pseudoRandom(
            aura.seed +
            index * 92821
        )

    const yRandom =
        pseudoRandom(
            aura.seed +
            index * 68917
        )

    const sizeRandom =
        pseudoRandom(
            aura.seed +
            index * 31337
        )

    const brightnessRandom =
        pseudoRandom(
            aura.seed +
            index * 74149
        )

    const x =
        xRandom * width

    const baseY =
        yRandom * height

    /*
     * Extremely subtle vertical drift.
     */

    const drift =
        Math.sin(
            time * 0.00008 *
            aura.motion.speed +
            index
        ) *
        2 *
        aura.motion.amplitude

    const y =
        baseY + drift

    const radius =
        0.25 +
        sizeRandom * 1.15

    const alpha =
        0.12 +
        brightnessRandom * 0.48

    drawStarPoint(
        ctx,
        aura,
        x,
        y,
        radius,
        alpha,
        brightnessRandom
    )
}

function drawStarPoint(
    ctx: CanvasRenderingContext2D,
    aura: Aura,
    x: number,
    y: number,
    radius: number,
    alpha: number,
    brightness: number
): void {

    const isBright =
        brightness > 0.92

    ctx.save()

    if (isBright) {
        ctx.shadowColor =
            aura.palette.accent

        ctx.shadowBlur =
            radius * 8
    }

    ctx.fillStyle =
        `rgba(255, 255, 255, ${alpha})`

    ctx.beginPath()

    ctx.arc(
        x,
        y,
        isBright
            ? radius * 1.4
            : radius,
        0,
        Math.PI * 2
    )

    ctx.fill()

    ctx.restore()
}

function pseudoRandom(
    seed: number
): number {

    const value =
        Math.sin(seed * 12.9898) *
        43758.5453

    return (
        value -
        Math.floor(value)
    )
}
