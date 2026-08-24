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
      <a
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
    <canvas class="aura__canvas"></canvas>
  </div>
`
const canvas =
    document.querySelector<HTMLCanvasElement>(
        '.aura__canvas'
    )

const artwork =
    document.querySelector<HTMLDivElement>(
        '.aura__artwork'
    )

if (!canvas) {
    throw new Error('AURA canvas not found')
}

const renderer = new AuraRenderer(canvas)
const form = document.querySelector<HTMLFormElement>('.aura__form')
const input = document.querySelector<HTMLInputElement>('#thought')
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

function renderAura(
    thought: string
): void {

    const aura =
        generateAura(
            thought
        )

    currentAura = aura

    renderer.render(aura)

    artwork?.classList.add('is-visible')

    if (meta) {
        meta.textContent =
            `AURA / ${aura.seedHex} / ${aura.palette.id.toUpperCase()}`

        meta.classList.add('is-visible')
    }

}



form?.addEventListener(
    'submit',
    (event) => {

        event.preventDefault()

        const thought =
            input?.value.trim()

        if (!thought) {
            input?.focus()
            return
        }

        /*
         * A new thought always begins
         * from its original composition.
         */
        currentThought = thought

        renderAura(
            currentThought
        )

    }
)

exportControl?.classList.add(
    'is-visible'
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
