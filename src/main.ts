import './styles/variables.css'
import './styles/reset.css'
import './styles/main.css'

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
      </form>

    </section>

    <footer class="aura__footer">
      <span>CODE × ART × EMOTION</span>
      <span>BY BYIKI.EXE</span>
    </footer>
  </main>

  <div class="aura__grain" aria-hidden="true"></div>
`
