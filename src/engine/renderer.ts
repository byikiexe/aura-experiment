import { createRandom } from '../core/random'
import type { Aura } from '../types/aura'

export class AuraRenderer {

    private readonly canvas: HTMLCanvasElement
    private readonly context: CanvasRenderingContext2D

    constructor(canvas: HTMLCanvasElement) {
        const context = canvas.getContext('2d')

        if (!context) {
            throw new Error('Canvas 2D is not supported')
        }

        this.canvas = canvas
        this.context = context
    }

    render(aura: Aura): void {
        const {
            width,
            height,
        } = this.resize()

        const ctx = this.context
        const random = createRandom(aura.seed)

        /*
         * Background
         */
        ctx.fillStyle = aura.palette.background
        ctx.fillRect(0, 0, width, height)

        /*
         * Number of forms is controlled by density.
         */
        const formCount = Math.floor(
            7 + aura.composition.density * 15
        )

        for (let i = 0; i < formCount; i++) {

            const x = random() * width
            const y = random() * height

            const radius =
                width *
                (
                    0.05 +
                    random() *
                    0.16 *
                    aura.composition.complexity
                )

            const color = this.pickColor(
                aura,
                random()
            )

            this.drawGlow(
                x,
                y,
                radius,
                color,
                0.08 + random() * 0.18
            )

            this.drawStructure(
                aura,
                random,
                width,
                height
            )
        }
    }

    private drawGlow(
        x: number,
        y: number,
        radius: number,
        color: string,
        opacity: number
    ): void {

        const ctx = this.context

        const gradient = ctx.createRadialGradient(
            x,
            y,
            0,
            x,
            y,
            radius
        )

        gradient.addColorStop(
            0,
            this.withAlpha(color, opacity)
        )

        gradient.addColorStop(
            0.45,
            this.withAlpha(color, opacity * 0.55)
        )

        gradient.addColorStop(
            1,
            this.withAlpha(color, 0)
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

        const value = hex.replace('#', '')

        const r = parseInt(value.slice(0, 2), 16)
        const g = parseInt(value.slice(2, 4), 16)
        const b = parseInt(value.slice(4, 6), 16)

        return `rgba(${r}, ${g}, ${b}, ${alpha})`
    }

    private resize(): {
        width: number
        height: number
    } {

        const rect =
            this.canvas.getBoundingClientRect()

        const width = rect.width
        const height = rect.height

        const dpr = Math.min(
            window.devicePixelRatio || 1,
            2
        )

        this.canvas.width =
            Math.floor(width * dpr)

        this.canvas.height =
            Math.floor(height * dpr)

        this.context.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        )

        return {
            width,
            height,
        }
    }

    private drawStructure(
    aura: Aura,
    random: () => number,
    width: number,
    height: number
    ): void {

        const ctx = this.context

        const lineCount =
            Math.floor(
                2 +
                aura.composition.complexity * 5
            )

        ctx.save()

        ctx.lineWidth = 0.45

        for (let i = 0; i < lineCount; i++) {

            const centerX =
                width *
                (
                    0.25 +
                    random() * 0.5
                )

            const centerY =
                height *
                (
                    0.2 +
                    random() * 0.6
                )

            const radiusX =
                width *
                (
                    0.1 +
                    random() * 0.35
                )

            const radiusY =
                height *
                (
                    0.05 +
                    random() * 0.25
                )

            ctx.strokeStyle =
                this.withAlpha(
                    aura.palette.accent,
                    0.015 + random() * 0.035
                )

            ctx.beginPath()

            ctx.ellipse(
                centerX,
                centerY,
                radiusX,
                radiusY,
                random() * Math.PI,
                0,
                Math.PI * 2
            )

            ctx.stroke()
        }

        ctx.restore()
    }
}
