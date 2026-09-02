import type { Aura } from '../types/aura'
import { drawNebula } from './layers/nebula'
import { drawStarField } from './layers/starField'

export class AuraRenderer {

    private readonly canvas: HTMLCanvasElement
    private readonly context: CanvasRenderingContext2D

    private aura: Aura | null = null

    constructor(canvas: HTMLCanvasElement) {
        const context = canvas.getContext('2d')

        if (!context) {
            throw new Error('Canvas 2D is not supported')
        }

        this.canvas = canvas
        this.context = context
    }

    render(aura: Aura): void {

        this.aura = aura

        // Render once. A permanent frame loop made both canvases keep doing
        // expensive compositing even while one of them was invisible.
        this.renderFrame(0)
    }

    private resize(): {
        width: number
        height: number
    } {

        const rect =
            this.canvas.getBoundingClientRect()

        const width =
            Math.max(
                1,
                Math.floor(rect.width)
            )

        const height =
            Math.max(
                1,
                Math.floor(rect.height)
            )

        const dpr =
            Math.min(
                window.devicePixelRatio || 1,
                2
            )

        const targetWidth =
            Math.floor(
                width * dpr
            )

        const targetHeight =
            Math.floor(
                height * dpr
            )

        if (
            this.canvas.width !==
            targetWidth ||

            this.canvas.height !==
            targetHeight
        ) {

            this.canvas.width =
                targetWidth

            this.canvas.height =
                targetHeight
        }

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

    private renderFrame(
        time: number
    ): void {

        const aura = this.aura

        if (!aura) {
            return
        }

        const {
            width,
            height,
        } = this.resize()

        const ctx = this.context

        /*
         * Clear previous frame.
         */
        ctx.clearRect(
            0,
            0,
            width,
            height
        )

        /*
         * Background.
         */
        ctx.fillStyle =
            aura.palette.background

        ctx.fillRect(
            0,
            0,
            width,
            height
        )

        drawNebula({
            ctx,
            aura,
            width,
            height,
            time,
        })

        drawStarField({
            ctx,
            aura,
            width,
            height,
            time,
        })
    }

}
