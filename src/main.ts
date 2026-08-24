import './styles/variables.css'
import './styles/reset.css'
import './styles/main.css'
import { generateAura } from './engine/generateAura'
import { AuraRenderer } from './engine/renderer'
import type { Aura } from './types/aura'
import { exportAura } from './export/exportAura'
import type { ExportFormat } from './export/formats'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <main class="aura">
    <header class="aura__header">
      <span class="aura__logo">AURA</span>
      <span class="aura__number">001</span>
    </header>

    <section class="aura__intro">

      <div class="aura__statement">
        <p class="aura__eyebrow">GENERATIVE STUDY / 001</p>

        <h1>
            Turn a thought<br>
            into something<br>
            <em>you can see.</em>
        </h1>
      </div>

      <form class="aura__form">
        <label for="thought">
          Give AURA a thought
        </label>

        <input
          id="thought"
          name="thought"
          type="text"
          autocomplete="off"
          maxlength="120"
          placeholder="places I only remember in dreams"
        >

        <button type="submit">
          Generate
          <span aria-hidden="true">→</span>
        </button>

        <div class="aura__meta" aria-live="polite"></div>

<div class="aura__export">

  <button
    class="aura__export-trigger"
    type="button"
  >
    EXPORT
  </button>

  <div class="aura__export-options">

    <button
      type="button"
      data-format="square"
    >
      1:1
    </button>

    <button
      type="button"
      data-format="portrait"
    >
      4:5
    </button>

    <button
      type="button"
      data-format="story"
    >
      9:16
    </button>

  </div>

</div>
      </form>

    </section>

    <footer class="aura__footer">
      <span>CODE × ART × EMOTION</span>
      <a class="aura__signature"
            href="https://byikiexe.com/"
            target="_blank"
            rel="noopener noreferrer"
        >
            BY BYIKI<span style="color: var(--accent-sky-aqua);">.EXE</span>
        </a>
    </footer>
  </main>

  <div class="aura__grain" aria-hidden="true"></div>

  <div class="aura__artwork" aria-hidden="true">
    <canvas class="aura__canvas aura__canvas--a"></canvas>
    <canvas class="aura__canvas aura__canvas--b"></canvas>
  </div>
`

function getCanvas(
    selector: string
): HTMLCanvasElement {

    const canvas =
        document.querySelector<HTMLCanvasElement>(
            selector
        )

    if (!canvas) {
        throw new Error(
            `AURA canvas not found: ${selector}`
        )
    }

    return canvas
}

const canvasA =
    getCanvas('.aura__canvas--a')

const canvasB =
    getCanvas('.aura__canvas--b')

const rendererA =
    new AuraRenderer(canvasA)

const rendererB =
    new AuraRenderer(canvasB)


const form = document.querySelector<HTMLFormElement>('.aura__form')
const input = document.querySelector<HTMLInputElement>('#thought')

const generateButton =
    document.querySelector<HTMLButtonElement>(
        '.aura__form button[type="submit"]'
    )

const meta =
    document.querySelector<HTMLDivElement>(
        '.aura__meta'
    )

const exportControl =
    document.querySelector<HTMLDivElement>(
        '.aura__export'
    )

const exportTrigger =
    document.querySelector<HTMLButtonElement>(
        '.aura__export-trigger'
    )

const exportOptions =
    document.querySelectorAll<HTMLButtonElement>(
        '.aura__export-options button'
    )

let currentThought = ''
let currentAura: Aura | null = null
let activeCanvas:
    'a' | 'b' = 'a'

let isGenerating = false

const MATERIALIZATION_DURATION = 3000


function renderAura(
    thought: string
): void {

    const aura =
        generateAura(thought)

    const isFirstAura =
        currentAura === null


    /*
     * FIRST GENERATION
     */

    if (isFirstAura) {

        rendererA.render(aura)

        canvasA.classList.add(
            'is-active'
        )

        activeCanvas = 'a'

    } else {

        /*
         * CROSSFADE
         *
         * Render the new AURA into the
         * currently hidden canvas.
         */

        const nextCanvas =
            activeCanvas === 'a'
                ? canvasB
                : canvasA

        const currentCanvas =
            activeCanvas === 'a'
                ? canvasA
                : canvasB

        const nextRenderer =
            activeCanvas === 'a'
                ? rendererB
                : rendererA


        /*
         * Render BEFORE making the
         * canvas visible.
         */

        nextRenderer.render(aura)


        /*
         * Start the transition on the
         * next animation frame.
         */

        nextRenderer.render(aura)

        nextCanvas.classList.add(
            'is-materializing'
        )

        requestAnimationFrame(
            () => {

                currentCanvas.classList.remove(
                    'is-active'
                )

                nextCanvas.classList.add(
                    'is-active'
                )
            }
        )

        window.setTimeout(
            () => {
                nextCanvas.classList.remove(
                    'is-materializing'
                )
            },
            MATERIALIZATION_DURATION
        )

        activeCanvas =
            activeCanvas === 'a'
                ? 'b'
                : 'a'
    }


    currentAura = aura


    /*
     * METADATA
     */

    if (meta) {

        meta.textContent =
            `AURA / ${aura.seedHex} / ${aura.palette.id.toUpperCase()}`

        meta.classList.add(
            'is-visible'
        )
    }


    /*
     * Reset export menu.
     */

    exportControl?.classList.remove(
        'is-open'
    )
}


form?.addEventListener(
    'submit',
    (event) => {

        event.preventDefault()

        if (isGenerating) {
            return
        }

        const thought =
            input?.value.trim()

        if (!thought) {
            if (input) {
                input.classList.remove(
                    'is-empty'
                )
                void input.offsetWidth
                input.classList.add(
                    'is-empty'
                )
                input.focus()
            }
            return
        }

        isGenerating = true

        generateButton?.setAttribute(
            'aria-disabled',
            'true'
        )

        /*
         * A new thought always begins
         * from its original composition.
         */
        currentThought = thought

        renderAura(
            currentThought
        )

        window.setTimeout(
            () => {
                isGenerating = false

                generateButton?.removeAttribute(
                    'aria-disabled'
                )
            },
            MATERIALIZATION_DURATION
        )

    }
)

exportControl?.classList.add(
    'is-visible'
)

input?.addEventListener(
    'animationend',
    () => {
        input.classList.remove(
            'is-empty'
        )
    }
)

exportTrigger?.addEventListener(
    'click',
    () => {

        exportControl?.classList.toggle(
            'is-open'
        )
    }
)

exportOptions.forEach(
    (button) => {

        button.addEventListener(
            'click',
            async () => {

                if (!currentAura) {
                    return
                }

                const format =
                    button.dataset
                        .format as ExportFormat

                try {

                    await exportAura(
                        currentAura,
                        format
                    )

                    exportControl
                        ?.classList
                        .remove(
                            'is-open'
                        )

                } catch (error) {

                    console.error(
                        'AURA export failed',
                        error
                    )
                }
            }
        )
    }
)
