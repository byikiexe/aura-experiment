import { createRandom } from '../core/random'
import type { Aura } from '../types/aura'

interface AuraGlow {
    x: number
    y: number

    radius: number

    color: string
    opacity: number

    phase: number

    driftX: number
    driftY: number

    breathe: number
}

interface AuraOrbit {
    x: number
    y: number

    radiusX: number
    radiusY: number

    rotation: number
    phase: number

    opacity: number
}

export class AuraRenderer {

    private readonly canvas: HTMLCanvasElement
    private readonly context: CanvasRenderingContext2D

    private aura: Aura | null = null

    private glows: AuraGlow[] = []
    private orbits: AuraOrbit[] = []

    private animationFrame: number | null = null

    private startTime = 0

    private prefersReducedMotion =
        window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches

    constructor(canvas: HTMLCanvasElement) {
        const context = canvas.getContext('2d')

        if (!context) {
            throw new Error('Canvas 2D is not supported')
        }

        this.canvas = canvas
        this.context = context
    }

    render(aura: Aura): void {

        this.stop()

        this.aura = aura

        this.createScene(aura)

        this.startTime = performance.now()

        /*
        * Accessibility:
        * users requesting reduced motion
        * receive the deterministic static artwork.
        */
        if (this.prefersReducedMotion) {

            this.renderFrame(0)

            return
        }

        this.animationFrame =
            requestAnimationFrame(
                this.animate
            )
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

    private drawAnimatedStructure(
        aura: Aura,
        time: number,
        width: number,
        height: number
    ): void {

        const ctx = this.context

        const speed =
            0.015 +
            aura.motion.speed * 0.025

        const amplitude =
            aura.motion.amplitude

        ctx.save()

        ctx.lineWidth = 0.45

        for (
            const orbit of this.orbits
        ) {

            /*
             * Rotation is intentionally
             * extremely slow.
             */
            const rotation =
                orbit.rotation +
                Math.sin(
                    time * speed +
                    orbit.phase
                ) *
                0.12 *
                amplitude

            /*
             * Tiny expansion / contraction.
             */
            const breathe =
                1 +
                Math.sin(
                    time *
                    speed *
                    1.7 +
                    orbit.phase
                ) *
                0.025 *
                amplitude

            ctx.strokeStyle =
                this.withAlpha(
                    aura.palette.accent,
                    orbit.opacity
                )

            ctx.beginPath()

            ctx.ellipse(
                orbit.x * width,
                orbit.y * height,

                orbit.radiusX *
                width *
                breathe,

                orbit.radiusY *
                height *
                breathe,

                rotation,

                0,
                Math.PI * 2
            )

            ctx.stroke()
        }

        ctx.restore()
    }

    private createScene(aura: Aura): void {

        const random =
            createRandom(aura.seed)

        this.glows = []
        this.orbits = []

        /*
         * GLOWS
         */

        const glowCount =
            Math.floor(
                7 +
                aura.composition.density * 15
            )

        for (
            let i = 0;
            i < glowCount;
            i++
        ) {

            this.glows.push({

                /*
                 * Normalized coordinates.
                 *
                 * 0 → left/top
                 * 1 → right/bottom
                 */
                x: random(),
                y: random(),

                radius:
                    0.05 +
                    random() *
                    0.16 *
                    aura.composition.complexity,

                color:
                    this.pickColor(
                        aura,
                        random()
                    ),

                opacity:
                    0.08 +
                    random() * 0.18,

                phase:
                    random() *
                    Math.PI *
                    2,

                driftX:
                    (random() - 0.5) *
                    0.08,

                driftY:
                    (random() - 0.5) *
                    0.08,

                breathe:
                    0.05 +
                    random() * 0.12,

            })
        }


        /*
         * ORBITAL STRUCTURE
         */

        const orbitCount =
            Math.floor(
                2 +
                aura.composition.complexity * 5
            )

        for (
            let i = 0;
            i < orbitCount;
            i++
        ) {

            this.orbits.push({

                x:
                    0.25 +
                    random() * 0.5,

                y:
                    0.2 +
                    random() * 0.6,

                radiusX:
                    0.1 +
                    random() * 0.35,

                radiusY:
                    0.05 +
                    random() * 0.25,

                rotation:
                    random() *
                    Math.PI,

                phase:
                    random() *
                    Math.PI *
                    2,

                opacity:
                    0.015 +
                    random() * 0.035,

            })
        }
    }

    private animate = (
        timestamp: number
    ): void => {

        if (!this.aura) {
            return
        }

        const elapsed =
            (timestamp - this.startTime) /
            1000

        this.renderFrame(elapsed)

        this.animationFrame =
            requestAnimationFrame(
                this.animate
            )
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


        /*
         * Motion characteristics come directly
         * from the generated Aura.
         */
        const speed =
            0.08 +
            aura.motion.speed * 0.22

        const amplitude =
            aura.motion.amplitude


        /*
         * LIGHT FIELDS
         */

        for (
            const glow of this.glows
        ) {

            const wave =
                time * speed +
                glow.phase

            /*
             * Slow drifting.
             */
            const offsetX =
                Math.sin(wave) *
                glow.driftX *
                amplitude

            const offsetY =
                Math.cos(
                    wave * 0.83
                ) *
                glow.driftY *
                amplitude

            /*
             * Breathing radius.
             */
            const breath =
                1 +
                Math.sin(
                    wave * 0.72
                ) *
                glow.breathe *
                amplitude

            /*
             * Very subtle light pulsation.
             */
            const opacity =
                glow.opacity *
                (
                    0.9 +
                    Math.sin(
                        wave * 0.55
                    ) *
                    0.1 *
                    amplitude
                )

            const x =
                (
                    glow.x +
                    offsetX
                ) *
                width

            const y =
                (
                    glow.y +
                    offsetY
                ) *
                height

            const radius =
                glow.radius *
                width *
                breath

            this.drawGlow(
                x,
                y,
                radius,
                glow.color,
                opacity
            )
        }


        /*
         * STRUCTURE
         */

        this.drawAnimatedStructure(
            aura,
            time,
            width,
            height
        )
    }

    private stop(): void {

        if (
            this.animationFrame !== null
        ) {

            cancelAnimationFrame(
                this.animationFrame
            )

            this.animationFrame = null
        }
    }
}
