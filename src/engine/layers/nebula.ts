import type { Aura } from '../../types/aura'

interface NebulaOptions {
    ctx: CanvasRenderingContext2D
    aura: Aura
    width: number
    height: number
    time: number
}

export function drawNebula({
    ctx,
    aura,
    width,
    height,
    time,
}: NebulaOptions): void {

    const {
        luminosity,
        turbulence,
    } = aura.atmosphere

    const centerX =
        width * (
            0.42 +
            Math.sin(aura.seed * 0.001) * 0.08
        )

    const centerY =
        height * (
            0.5 +
            Math.cos(aura.seed * 0.0013) * 0.08
        )

    const diagonal =
        Math.sqrt(
            width * width +
            height * height
        )

    const radius =
        diagonal * 0.48

    ctx.save()

    /*
     * Screen makes overlapping light fields
     * accumulate instead of simply covering
     * each other.
     */
    ctx.globalCompositeOperation = 'screen'

    drawAtmosphericField(
        ctx,
        aura,
        centerX,
        centerY,
        radius,
        luminosity
    )

    drawNebulaVeils(
        ctx,
        aura,
        centerX,
        centerY,
        radius,
        turbulence,
        luminosity,
        time
    )

    ctx.restore()
}

function drawAtmosphericField(
    ctx: CanvasRenderingContext2D,
    aura: Aura,
    centerX: number,
    centerY: number,
    radius: number,
    luminosity: number
): void {

    const gradient =
        ctx.createRadialGradient(
            centerX,
            centerY,
            0,
            centerX,
            centerY,
            radius
        )

    gradient.addColorStop(
        0,
        hexToRgba(
            aura.palette.primary,
            0.14 * luminosity
        )
    )

    gradient.addColorStop(
        0.35,
        hexToRgba(
            aura.palette.secondary,
            0.08 * luminosity
        )
    )

    gradient.addColorStop(
        0.7,
        hexToRgba(
            aura.palette.primary,
            0.025 * luminosity
        )
    )

    gradient.addColorStop(
        1,
        'rgba(0, 0, 0, 0)'
    )

    ctx.fillStyle = gradient

    ctx.fillRect(
        0,
        0,
        ctx.canvas.width,
        ctx.canvas.height
    )
}
function drawNebulaVeils(
    ctx: CanvasRenderingContext2D,
    aura: Aura,
    centerX: number,
    centerY: number,
    radius: number,
    turbulence: number,
    luminosity: number,
    time: number
): void {

    const ribbonCount =
        2 +
        Math.floor(
            aura.composition.complexity * 2
        )

    for (
        let index = 0;
        index < ribbonCount;
        index++
    ) {

        drawNebulaRibbon(
            ctx,
            aura,
            centerX,
            centerY,
            radius,
            turbulence,
            luminosity,
            time,
            index,
            ribbonCount
        )
    }
}

function drawNebulaRibbon(
    ctx: CanvasRenderingContext2D,
    aura: Aura,
    centerX: number,
    centerY: number,
    radius: number,
    turbulence: number,
    luminosity: number,
    time: number,
    index: number,
    count: number
): void {

    const progress =
        index / Math.max(1, count - 1)

    const seedPhase =
        aura.seed * 0.00017 +
        index * 2.173

    const motion =
        time *
        aura.motion.speed *
        0.000025

    const verticalOffset =
        (
            progress - 0.5
        ) *
        radius *
        0.7

    const startX =
        centerX - radius * 0.9

    const startY =
        centerY +
        verticalOffset +
        Math.sin(
            seedPhase + motion
        ) *
        radius *
        0.12

    const endX =
        centerX + radius * 0.9

    const endY =
        centerY +
        verticalOffset +
        Math.cos(
            seedPhase * 1.37 + motion
        ) *
        radius *
        0.16

    const bend =
        radius *
        (
            0.18 +
            turbulence * 0.35
        )

    const control1X =
        centerX - radius * 0.3

    const control1Y =
        centerY +
        verticalOffset +
        Math.sin(
            seedPhase * 1.91 + motion
        ) *
        bend

    const control2X =
        centerX + radius * 0.3

    const control2Y =
        centerY +
        verticalOffset +
        Math.cos(
            seedPhase * 1.53 - motion
        ) *
        bend

    const color =
        index % 3 === 0
            ? aura.palette.accent
            : index % 2 === 0
                ? aura.palette.primary
                : aura.palette.secondary

    drawRibbonPasses(
        ctx,
        color,
        luminosity,
        startX,
        startY,
        control1X,
        control1Y,
        control2X,
        control2Y,
        endX,
        endY,
        radius,
        progress
    )

}
function drawRibbonPasses(
    ctx: CanvasRenderingContext2D,
    color: string,
    luminosity: number,
    startX: number,
    startY: number,
    control1X: number,
    control1Y: number,
    control2X: number,
    control2Y: number,
    endX: number,
    endY: number,
    radius: number,
    progress: number
): void {

    const baseWidth =
        radius *
        (
            0.055 +
            progress * 0.035
        )

    /*
     * Atmospheric outer glow
     */

    drawRibbonPath(
        ctx,
        color,
        0.018 * luminosity,
        baseWidth * 7,
        45,
        startX,
        startY,
        control1X,
        control1Y,
        control2X,
        control2Y,
        endX,
        endY
    )

    /*
     * Coloured body
     */

    drawRibbonPath(
        ctx,
        color,
        0.032 * luminosity,
        baseWidth * 3.5,
        30,
        startX,
        startY,
        control1X,
        control1Y,
        control2X,
        control2Y,
        endX,
        endY
    )

}


function cubicBezierPoint(
    t: number,
    startX: number,
    startY: number,
    control1X: number,
    control1Y: number,
    control2X: number,
    control2Y: number,
    endX: number,
    endY: number
): {
    x: number
    y: number
} {

    const inverse =
        1 - t

    const x =
        inverse ** 3 * startX +
        3 *
        inverse ** 2 *
        t *
        control1X +
        3 *
        inverse *
        t ** 2 *
        control2X +
        t ** 3 * endX

    const y =
        inverse ** 3 * startY +
        3 *
        inverse ** 2 *
        t *
        control1Y +
        3 *
        inverse *
        t ** 2 *
        control2Y +
        t ** 3 * endY

    return {
        x,
        y,
    }
}

function drawRibbonPath(
    ctx: CanvasRenderingContext2D,
    color: string,
    alpha: number,
    lineWidth: number,
    blur: number,
    startX: number,
    startY: number,
    control1X: number,
    control1Y: number,
    control2X: number,
    control2Y: number,
    endX: number,
    endY: number
): void {

    const segments = 36

    let previous =
        cubicBezierPoint(
            0,
            startX,
            startY,
            control1X,
            control1Y,
            control2X,
            control2Y,
            endX,
            endY
        )

    ctx.save()

    ctx.globalCompositeOperation =
        'screen'

    ctx.lineCap = 'round'

    ctx.lineJoin = 'round'

    ctx.shadowColor =
        hexToRgba(
            color,
            alpha
        )

    ctx.shadowBlur = blur

    for (
        let segment = 1;
        segment <= segments;
        segment++
    ) {

        const t =
            segment / segments

        const current =
            cubicBezierPoint(
                t,
                startX,
                startY,
                control1X,
                control1Y,
                control2X,
                control2Y,
                endX,
                endY
            )

        /*
         * Bell-shaped envelope:
         *
         * 0 → 1 → 0
         *
         * Makes the ribbon emerge from
         * darkness and dissolve again.
         */
        const envelope =
            Math.sin(
                Math.PI * t
            )

        const shapedEnvelope =
            envelope ** 1.6

        ctx.strokeStyle =
            hexToRgba(
                color,
                alpha *
                shapedEnvelope
            )

        ctx.lineWidth =
            Math.max(
                0.01,
                lineWidth *
                shapedEnvelope
            )

        ctx.beginPath()

        ctx.moveTo(
            previous.x,
            previous.y
        )

        ctx.lineTo(
            current.x,
            current.y
        )

        ctx.stroke()

        previous = current
    }

    ctx.restore()
}

function hexToRgba(
    hex: string,
    alpha: number
): string {

    const normalized =
        hex.replace('#', '')

    const value =
        Number.parseInt(
            normalized,
            16
        )

    const r =
        (value >> 16) & 255

    const g =
        (value >> 8) & 255

    const b =
        value & 255

    return `rgba(${r}, ${g}, ${b}, ${alpha})`
}


