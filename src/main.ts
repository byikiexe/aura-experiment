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

form?.addEventListener('submit', (event) => {
    event.preventDefault()

    const thought = input?.value.trim()

    if (!thought) {
        input?.focus()
        return
    }

    const aura = generateAura(thought)
    if (meta) {
    meta.textContent =
        `AURA / ${aura.seedHex} / ${aura.palette.id.toUpperCase()}`

    meta.classList.add('is-visible')
}
    renderer.render(aura)

    artwork?.classList.add('is-visible')

    console.table({
        thought: aura.thought,
        seed: aura.seedHex,
        geometry: aura.geometry,
        palette: aura.palette.id,
        density: aura.composition.density,
        complexity: aura.composition.complexity,
        symmetry: aura.composition.symmetry,
        distortion: aura.composition.distortion,
        speed: aura.motion.speed,
        amplitude: aura.motion.amplitude,
        noise: aura.noise,
    })
})
