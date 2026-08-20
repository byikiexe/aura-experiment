import './styles/variables.css'
import './styles/reset.css'
import './styles/main.css'
import { generateAura } from './engine/generateAura'
import { AuraRenderer } from './engine/renderer'

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
        <div class="aura__variations" aria-hidden="true">

  <button
    class="aura__variation-button aura__variation-button--previous"
    type="button"
    aria-label="Previous variation"
  >
    ←
  </button>

  <div class="aura__variation-status">
    <span class="aura__variation-index">
      <span class="aura__variation-number">00</span>
      <span class="aura__variation-total">/ 12</span>
    </span>

    <span class="aura__variation-label">
      ORIGINAL
    </span>
  </div>

  <button
    class="aura__variation-button aura__variation-button--next"
    type="button"
    aria-label="Next variation"
  >
    →
  </button>

</div>
      </form>

    </section>

    <footer class="aura__footer">
      <span>CODE × ART × EMOTION</span>
      <span>BY BYIKI.EXE</span>
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

const variations =
    document.querySelector<HTMLDivElement>(
        '.aura__variations'
    )

const previousVariation =
    document.querySelector<HTMLButtonElement>(
        '.aura__variation-button--previous'
    )

const nextVariation =
    document.querySelector<HTMLButtonElement>(
        '.aura__variation-button--next'
    )

const variationLabel =
    document.querySelector<HTMLSpanElement>(
        '.aura__variation-label'
    )

const variationNumber =
    document.querySelector<HTMLSpanElement>(
        '.aura__variation-number'
    )

const MAX_VARIATIONS = 12

let currentThought = ''
let currentVariation = 0
let variationTransition:
    number | null = null

function renderAura(
    thought: string,
    variation: number
): void {

    const aura =
        generateAura(
            thought,
            variation
        )

    renderer.render(aura)

    artwork?.classList.add('is-visible')

    if (meta) {
        meta.textContent =
            `AURA / ${aura.seedHex} / ${aura.palette.id.toUpperCase()}`

        meta.classList.add('is-visible')
    }

    updateVariationUI(variation)
}

function updateVariationUI(
    variation: number
): void {

    if (
        !variationLabel ||
        !variationNumber
    ) {
        return
    }

    if (nextVariation) {
        nextVariation.disabled =
            variation >= MAX_VARIATIONS
    }

    if (variation === 0) {

        variationLabel.textContent =
            'ORIGINAL'

        variationNumber.textContent =
            '00'

    } else {

        variationLabel.textContent =
            'VARIATION'

        variationNumber.textContent =
            String(variation)
                .padStart(2, '0')
    }

    if (previousVariation) {
        previousVariation.disabled =
            variation === 0
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
        currentVariation = 0

        renderAura(
            currentThought,
            currentVariation
        )

        variations?.classList.add(
            'is-visible'
        )

        variations?.setAttribute(
            'aria-hidden',
            'false'
        )
    }
)

nextVariation?.addEventListener(
    'click',
    () => {

        if (
            !currentThought ||
            currentVariation >=
            MAX_VARIATIONS
        ) {
            return
        }

        currentVariation++

        transitionToVariation()
    }
)

previousVariation?.addEventListener(
    'click',
    () => {

        if (
            !currentThought ||
            currentVariation === 0
        ) {
            return
        }

        currentVariation--

        transitionToVariation()
    }
)

function transitionToVariation(): void {

    if (
        !artwork ||
        !currentThought
    ) {
        return
    }

    if (
        variationTransition !== null
    ) {

        window.clearTimeout(
            variationTransition
        )
    }

    artwork.classList.add(
        'is-transitioning'
    )

    variationTransition =
        window.setTimeout(
            () => {

                renderAura(
                    currentThought,
                    currentVariation
                )

                artwork.classList.remove(
                    'is-transitioning'
                )

                variationTransition = null

            },
            650
        )
}


window.addEventListener(
    'keydown',
    (event) => {

        /*
         * Don't hijack arrows while
         * the user is writing.
         */
        if (
            document.activeElement === input
        ) {
            return
        }


        if (
            event.key ===
            'ArrowRight' &&
            currentVariation <
            MAX_VARIATIONS
        ) {

            currentVariation++

            transitionToVariation()
        }


        if (
            event.key ===
            'ArrowLeft' &&
            currentVariation > 0
        ) {

            currentVariation--

            transitionToVariation()
        }
    }
)
