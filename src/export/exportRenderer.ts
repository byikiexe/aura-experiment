import { createRandom } from '../core/random'
import { drawNebula } from '../engine/layers/nebula'
import { drawStarField } from '../engine/layers/starField'
import type { Aura } from '../types/aura'


export class AuraExportRenderer {

render(
    canvas: HTMLCanvasElement,
    aura: Aura
): void {

    const ctx =
        canvas.getContext('2d')

    if (!ctx) {
        throw new Error(
            'Canvas 2D is not supported'
        )
    }

    const width = canvas.width
    const height = canvas.height

    /*
     * BACKGROUND
     */

    ctx.fillStyle =
        aura.palette.background

    ctx.fillRect(
        0,
        0,
        width,
        height
    )

    /*
     * ARTWORK
     */

    this.drawArtwork(
        ctx,
        aura,
        createRandom(aura.seed),
        width,
        height
    )

    this.drawGrain(
    ctx,
    aura,
    width,
    height
)

    /*
     * EDITORIAL LAYER
     *
     * Important: always drawn LAST.
     */

    this.drawEditorialLayer(
        ctx,
        aura,
        width,
        height
    )
}

private drawGrain(
    ctx: CanvasRenderingContext2D,
    aura: Aura,
    width: number,
    height: number
): void {

    const random =
        createRandom(
            aura.seed ^ 0x9e3779b9
        )

    const amount =
        Math.floor(
            width *
            height *
            0.012
        )

    ctx.save()

    ctx.fillStyle =
        'rgba(255, 255, 255, 0.035)'


    for (
        let i = 0;
        i < amount;
        i++
    ) {

        const x =
            random() * width

        const y =
            random() * height

        const size =
            random() < 0.9
                ? 1
                : 2

        ctx.fillRect(
            x,
            y,
            size,
            size
        )
    }

    ctx.restore()
}

private drawArtwork(
    ctx: CanvasRenderingContext2D,
    aura: Aura,
    random: () => number,
    width: number,
    height: number
): void {

    // Shared artwork layers: these are the same calls, parameters and order
    // used by AuraRenderer on screen.
    drawNebula({
        ctx,
        aura,
        width,
        height,
        time: 0,
        blobCount: 8 + Math.floor(aura.composition.complexity * 4),
        blobScale: 1.18,
    })

    drawStarField({
        ctx,
        aura,
        width,
        height,
        time: 0,
    })

    return

    const baseSize =
        Math.sqrt(width * height)

    const glowCount =
        Math.floor(
            7 +
            aura.composition.density * 15
        )

    /*
     * LIGHT FIELDS
     */

    for (
        let i = 0;
        i < glowCount;
        i++
    ) {

        const x =
            random() * width

        const y =
            random() * height

        const radius =
            baseSize *
            (
                0.07 +
                random() *
                0.20 *
                aura.composition.complexity
            )

        const color =
            this.pickColor(
                aura,
                random()
            )

        const opacity =
            0.08 +
            random() * 0.18

        this.drawGlow(
            ctx,
            x,
            y,
            radius,
            color,
            opacity
        )
    }


    /*
     * STRUCTURE
     */

    const orbitCount =
        Math.floor(
            2 +
            aura.composition.complexity * 5
        )

    ctx.save()

    ctx.lineWidth =
        Math.max(
            0.7,
            width * 0.00065
        )

    for (
        let i = 0;
        i < orbitCount;
        i++
    ) {

        ctx.strokeStyle =
            this.withAlpha(
                aura.palette.accent,
                0.015 +
                random() * 0.035
            )

        ctx.beginPath()

        ctx.ellipse(
            width *
                (
                    0.25 +
                    random() * 0.5
                ),

            height *
                (
                    0.2 +
                    random() * 0.6
                ),

            width *
                (
                    0.1 +
                    random() * 0.35
                ),

            height *
                (
                    0.05 +
                    random() * 0.25
                ),

            random() * Math.PI,

            0,
            Math.PI * 2
        )

        ctx.stroke()
    }

    ctx.restore()
}

private drawEditorialLayer(
    ctx: CanvasRenderingContext2D,
    aura: Aura,
    width: number,
    height: number
): void {

    const margin =
        width * 0.065

    const white =
        '#F1EEE8'

    const muted =
        'rgba(241, 238, 232, 0.48)'

    const subtle =
        'rgba(241, 238, 232, 0.16)'


    /*
     * HEADER
     */

    ctx.textBaseline = 'top'

    ctx.textAlign = 'left'

    ctx.fillStyle = white

    ctx.font =
        `600 ${width * 0.014}px Inter, Arial, sans-serif`

    ctx.fillText(
        'A U R A',
        margin,
        margin
    )


    ctx.textAlign = 'right'

    ctx.fillStyle = muted

    ctx.font =
        `400 ${width * 0.011}px Inter, Arial, sans-serif`

    ctx.fillText(
        'EXPERIMENT / 001',
        width - margin,
        margin
    )


    /*
     * HEADER RULE
     */

    const headerRuleY =
        margin + width * 0.035

    ctx.strokeStyle = subtle

    ctx.lineWidth = 1

    ctx.beginPath()

    ctx.moveTo(
        margin,
        headerRuleY
    )

    ctx.lineTo(
        width - margin,
        headerRuleY
    )

    ctx.stroke()


    /*
     * THOUGHT
     */

const aspect = width / height

let titleScale = 0.074

if (aspect < 0.7) {
    titleScale = 0.082
} else if (aspect < 0.9) {
    titleScale = 0.078
}

const titleSize =
    width * titleScale

const lineHeight =
    titleSize * 0.93

    ctx.textAlign = 'left'

    ctx.fillStyle = white

    ctx.font =
        `400 ${titleSize}px "Instrument Serif", Georgia, serif`


    /*
     * Position changes naturally
     * depending on aspect ratio.
     */

    let thoughtY: number

    if (aspect < 0.7) {

        /*
         * 9:16
         */
        thoughtY = height * 0.52

    } else if (aspect < 0.9) {

        /*
         * 4:5
         */
        thoughtY = height * 0.54

    } else {

        /*
         * 1:1
         */
        thoughtY = height * 0.55
    }


    this.drawWrappedText(
        ctx,
        aura.thought,
        margin,
        thoughtY,
        width - margin * 2,
        lineHeight
    )


    /*
     * METADATA
     */

    const variation =
        aura.variation === 0

            ? 'ORIGINAL'

            : `VARIATION ${String(
                aura.variation
            ).padStart(2, '0')}`


    const footerY =
        height - margin


    ctx.textAlign = 'left'

    ctx.fillStyle = muted

    ctx.font =
        `400 ${width * 0.0095}px Inter, Arial, sans-serif`


    ctx.fillText(
        `AURA / ${aura.seedHex} / ${aura.palette.id.toUpperCase()}`,
        margin,
        footerY - width * 0.035
    )


    ctx.fillText(
        variation,
        margin,
        footerY - width * 0.018
    )


    /*
     * SIGNATURE
     */

    ctx.textAlign = 'right'

    ctx.fillText(
        'BY BYIKI.EXE',
        width - margin,
        footerY - width * 0.018
    )


    /*
     * FOOTER RULE
     */

    ctx.strokeStyle = subtle

    ctx.beginPath()

    ctx.moveTo(
        margin,
        footerY - width * 0.055
    )

    ctx.lineTo(
        width - margin,
        footerY - width * 0.055
    )

    ctx.stroke()
}

    private drawGlow(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        radius: number,
        color: string,
        opacity: number
    ): void {

        const gradient =
            ctx.createRadialGradient(
                x,
                y,
                0,
                x,
                y,
                radius
            )

        gradient.addColorStop(
            0,
            this.withAlpha(
                color,
                opacity
            )
        )

        gradient.addColorStop(
            0.45,
            this.withAlpha(
                color,
                opacity * 0.55
            )
        )

        gradient.addColorStop(
            1,
            this.withAlpha(
                color,
                0
            )
        )

        ctx.fillStyle = gradient

        ctx.beginPath()

        ctx.arc(
            x,
            y,
            radius,
            0,
            Math.PI * 2
        )

        ctx.fill()
    }


    private pickColor(
        aura: Aura,
        value: number
    ): string {

        if (value < 0.45) {
            return aura.palette.primary
        }

        if (value < 0.8) {
            return aura.palette.secondary
        }

        return aura.palette.accent
    }


    private withAlpha(
        hex: string,
        alpha: number
    ): string {

        const value =
            hex.replace('#', '')

        const r =
            parseInt(
                value.slice(0, 2),
                16
            )

        const g =
            parseInt(
                value.slice(2, 4),
                16
            )

        const b =
            parseInt(
                value.slice(4, 6),
                16
            )

        return `rgba(${r}, ${g}, ${b}, ${alpha})`
    }

private drawWrappedText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
): void {

    const words =
        text
            .trim()
            .split(/\s+/)

    const lines: string[] = []

    let line = ''

    for (const word of words) {

        const test =
            line
                ? `${line} ${word}`
                : word

        if (
            ctx.measureText(test).width >
                maxWidth &&
            line
        ) {

            lines.push(line)

            line = word

        } else {

            line = test
        }
    }

    if (line) {
        lines.push(line)
    }


    /*
     * Limit the composition to 4 lines.
     */

    const visibleLines =
        lines.slice(0, 4)


    visibleLines.forEach(
        (currentLine, index) => {

            ctx.fillText(
                currentLine,
                x,
                y +
                    index *
                    lineHeight
            )
        }
    )
}
}
