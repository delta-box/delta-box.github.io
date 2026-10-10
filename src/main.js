import './style.css'
import './hero.css'
import './effects.css'
import './integrations.css'
import './members.css'
import './filesystem-demo.css'
import './language.css'
import { initFilesystemDemo } from './filesystem-demo.js'
import { applyMetadata, getLocale, messages, switchLocale } from './i18n.js'

const github = 'https://github.com/Ddnirvana/deltabox-lite'
const film = '/media/deltabox-lite-v4.mp4'
const locale = getLocale()
const copy = messages[locale]
applyMetadata(locale)

document.querySelector('#app').innerHTML = `
  <header class="site-header">
    <a class="brand" href="#top" aria-label="${copy.nav.home}"><span class="brand-mark">Δ</span><span>DeltaBox<span class="brand-lite"> Lite</span></span></a>
    <nav aria-label="${copy.nav.aria}">
      <a href="#workflow">${copy.nav.workflow}</a><a href="#performance">${copy.nav.performance}</a><a href="#film">${copy.nav.film}</a><a href="#integrations">${copy.nav.integrations}</a><a href="#members">${copy.nav.members}</a>
    </nav>
    <div class="header-actions"><div class="language-switch" role="group" aria-label="${copy.nav.language}"><button type="button" data-lang="zh" aria-pressed="${locale === 'zh'}">中文</button><button type="button" data-lang="en" aria-pressed="${locale === 'en'}">EN</button></div><a class="header-link" href="${github}" target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a></div>
  </header>

  <main id="top">
    <section class="hero section-wrap">
      <div class="hero-copy">
        <div class="eyebrow"><span class="signal"></span> ${copy.hero.eyebrow}</div>
        <h1>DeltaBox<span> Lite</span></h1>
        <p class="hero-lead">${copy.hero.lead1}<br>${copy.hero.lead2}</p>
        <p class="hero-description">${copy.hero.description}</p>
        <div class="hero-actions"><a class="button primary" href="#workflow">${copy.hero.workflow} <span aria-hidden="true">↗</span></a><a class="button ghost" href="#film">${copy.hero.film} <span aria-hidden="true">↗</span></a></div>
      </div>
      <div class="hero-media" aria-label="${copy.hero.imageAria}">
        <img src="/media/01-intro.jpg" alt="${copy.hero.imageAlt}" fetchpriority="high">
        <div class="media-bottom"><span>01 / REVIEW THE CHANGE</span><span>DIFF · COMMIT · ABORT</span></div>
      </div>
      <div class="hero-index"><span>01 — 05</span><span>${copy.hero.scroll}</span></div>
    </section>

    <section class="manifesto" id="workflow">
      <div class="section-wrap">
        <div class="section-label">${copy.workflow.label}</div>
        <div class="manifesto-grid reveal"><h2>${copy.workflow.title1}<br><em>${copy.workflow.title2}</em></h2><p>${copy.workflow.intro}</p></div>
        <div class="flow-demo reveal" aria-label="${copy.workflow.demoAria}">
          <div class="flow-rail" aria-hidden="true"><span class="flow-pulse"></span></div>
          <div class="flow-nodes">
            <button class="flow-node is-active" data-stage="run" type="button" aria-pressed="true"><span class="node-index">01</span><strong>RUN</strong><small>${copy.workflow.run}</small></button>
            <button class="flow-node" data-stage="diff" type="button" aria-pressed="false"><span class="node-index">02</span><strong>DIFF</strong><small>${copy.workflow.diff}</small></button>
            <button class="flow-node" data-stage="commit" type="button" aria-pressed="false"><span class="node-index">03A</span><strong>COMMIT</strong><small>${copy.workflow.commit}</small></button>
            <button class="flow-node" data-stage="abort" type="button" aria-pressed="false"><span class="node-index">03B</span><strong>ABORT</strong><small>${copy.workflow.abort}</small></button>
          </div>
          <div class="flow-detail" aria-live="polite"><span id="flow-code">$ deltabox exec "$SESSION" -- sh -c 'edit files'</span><p id="flow-description">${copy.flow.run}</p></div>
        </div>
        <div class="steps">
          ${copy.workflow.steps.map((step, index) => `<article class="reveal"><span class="step-number">0${index + 1} / ${['RUN', 'DIFF', 'DECIDE'][index]}</span><h3>${step.title}</h3><p>${step.text}</p></article>`).join('')}
        </div>
      </div>
    </section>

    <section class="performance-section" id="performance">
      <div class="section-wrap">
        <div class="performance-intro reveal"><div class="section-label">${copy.performance.label}</div><h2>${copy.performance.title1}<br><em>${copy.performance.title2}</em></h2><p>${copy.performance.intro1}<code>cbcow-through</code>${copy.performance.intro2}</p></div>
        <div class="bench-legend"><span><i class="legend-delta"></i> DeltaBox <code>cbcow-through</code></span><span><i class="legend-raw"></i> ${copy.performance.raw}</span></div>
        <div class="bench-list">
          <article class="bench-item reveal" style="--delta-width:28%;--raw-width:100%"><div class="bench-title"><h3>${copy.performance.case1}</h3><strong>3.6× <small>${copy.performance.faster}</small></strong></div><div class="bar-row"><span>DeltaBox</span><div class="bar-track"><div class="bar-fill delta"></div></div><b>46.4 ms</b></div><div class="bar-row"><span>Sandlock</span><div class="bar-track"><div class="bar-fill raw"></div></div><b>166.0 ms</b></div></article>
          <article class="bench-item reveal" style="--delta-width:10.6%;--raw-width:100%"><div class="bench-title"><h3>${copy.performance.case2}</h3><strong>9.4× <small>${copy.performance.faster}</small></strong></div><div class="bar-row"><span>DeltaBox</span><div class="bar-track"><div class="bar-fill delta"></div></div><b>509.0 ms</b></div><div class="bar-row"><span>Sandlock</span><div class="bar-track"><div class="bar-fill raw"></div></div><b>4809.5 ms</b></div></article>
        </div>
        <p class="bench-note">${copy.performance.note} <a href="${github}#performance" target="_blank" rel="noopener noreferrer">${copy.performance.source}</a></p>
        <div class="workflow-benchmark reveal">
          <div class="workflow-benchmark-heading"><h3>${copy.performance.workflowTitle}</h3></div>
          <div class="bench-legend workflow-bench-legend"><span><i class="legend-delta"></i>${copy.performance.workflowCbcow}</span><span><i class="legend-raw"></i>${copy.performance.workflowGit}</span></div>
          <div class="bench-list workflow-bench-list">${copy.performance.workflowRows.map((row) => `<article class="bench-item reveal" style="--delta-width:${row.deltaWidth};--raw-width:100%"><div class="bench-title"><h3>${row.label}</h3><strong>${row.result} <small>${copy.performance.faster}</small></strong></div><div class="bar-row"><span>CB-CoW</span><div class="bar-track"><div class="bar-fill delta"></div></div><b>${row.cbcow}</b></div><div class="bar-row"><span>Git</span><div class="bar-track"><div class="bar-fill raw"></div></div><b>${row.git}</b></div></article>`).join('')}</div>
          <p class="bench-note"><a href="${github}/blob/a38e850/docs/native-mode-performance.md" target="_blank" rel="noopener noreferrer">${copy.performance.workflowSourceAbort}</a> · <a href="${github}/blob/a38e850/docs/native-mode-commit-performance.md" target="_blank" rel="noopener noreferrer">${copy.performance.workflowSourceCommit}</a></p>
        </div>
      </div>
    </section>

    <section class="film-section" id="film">
      <div class="section-wrap">
        <div class="section-heading reveal"><div><div class="section-label">${copy.film.label}</div><h2>${copy.film.title}</h2></div><p>${copy.film.intro}</p></div>
        <div class="film-frame"><video controls preload="none" poster="/media/05-save.jpg" playsinline aria-label="${copy.film.aria}"><source src="${film}" type="video/mp4">${copy.film.fallback}</video></div>
        <div class="film-caption"><span>${copy.film.brandCaption}</span><span>${copy.film.caption}</span></div>
      </div>
    </section>

    <section class="inside-section" id="inside">
      <div class="section-wrap">
        <div class="inside-heading reveal"><div class="section-label">${copy.inside.label}</div><h2>${copy.inside.title1}<br>${copy.inside.title2}</h2><p>${copy.inside.intro}</p></div>
        <div id="filesystem-demo" class="fs-demo reveal" aria-label="${copy.inside.demoAria}"></div>
        <p class="fs-disclaimer">${copy.inside.disclaimer1}<code>cbcow-through</code>${copy.inside.disclaimer2} <a href="${github}#how-it-works" target="_blank" rel="noopener noreferrer">${copy.inside.source}</a></p>
      </div>
    </section>

    <section class="integrations-section" id="integrations">
      <div class="section-wrap">
        <div class="section-label">${copy.integrations.label}</div>
        <h2>${copy.integrations.title}</h2>
        <p class="integration-intro">${copy.integrations.intro}</p>
        <div class="integration-grid">
          <article class="integration-path reveal">
            <div class="path-meta"><span>01 / STANDALONE</span><span>CLI</span></div>
            <h3>${copy.integrations.cliTitle}</h3>
            <p>${copy.integrations.cliText}</p>
            <div class="command-label">${copy.integrations.afterRelease}</div>
            <pre><code>npm install -g deltabox-lite</code></pre>
          </article>
          <article class="integration-path reveal">
            <div class="path-meta"><span>02 / DEEPSEEK HARNESS</span><span>DSH</span></div>
            <h3>${copy.integrations.dshTitle}</h3>
            <p>${copy.integrations.dshText}</p>
            <div class="command-label">${copy.integrations.plannedCommand}</div>
            <pre><code>dsh plugin --profile web add npm:dsh-deltabox</code></pre>
          </article>
          <article class="integration-path reveal">
            <div class="path-meta"><span>03 / PI EXTENSION</span><span>PI</span></div>
            <h3>${copy.integrations.piTitle}</h3>
            <p>${copy.integrations.piBefore}<code>/sandbox-review</code>${copy.integrations.piSeparator}<code>/sandbox-commit</code>${copy.integrations.piLastSeparator}<code>/sandbox-abort</code>${copy.integrations.piAfter}</p>
            <div class="command-label">${copy.integrations.afterRelease}</div>
            <pre><code>pi install npm:pi-deltabox</code></pre>
          </article>
        </div>
        <p class="availability-note">${copy.integrations.availability}</p>
        <div class="footer-cta"><p>${copy.integrations.cta}</p><a class="button primary" href="${github}" target="_blank" rel="noopener noreferrer">${copy.integrations.github} <span aria-hidden="true">↗</span></a></div>
      </div>
    </section>
    <section class="members-section" id="members">
      <div class="section-wrap">
        <div class="section-label">${copy.members.label}</div>
        <h2>${copy.members.title}</h2>
        <p class="members-intro">${copy.members.intro}</p>
        <div class="members-grid">
          <a class="member-card" href="https://github.com/Ddnirvana" target="_blank" rel="noopener noreferrer">
            <img src="https://github.com/Ddnirvana.png?size=128" alt="Dong Du" loading="lazy">
            <span class="member-name">Dong Du</span><span class="member-handle">@Ddnirvana <span aria-hidden="true">↗</span></span>
          </a>
          <a class="member-card" href="https://github.com/He-Jingkai" target="_blank" rel="noopener noreferrer">
            <img src="https://github.com/He-Jingkai.png?size=128" alt="Jingkai He" loading="lazy">
            <span class="member-name">Jingkai He</span><span class="member-handle">@He-Jingkai <span aria-hidden="true">↗</span></span>
          </a>
          <a class="member-card" href="https://github.com/xeonliu" target="_blank" rel="noopener noreferrer">
            <img src="https://github.com/xeonliu.png?size=128" alt="Liu Shiqi" loading="lazy">
            <span class="member-name">Liu Shiqi</span><span class="member-handle">@xeonliu <span aria-hidden="true">↗</span></span>
          </a>
          <a class="member-card" href="https://github.com/papersii" target="_blank" rel="noopener noreferrer">
            <img src="https://github.com/papersii.png?size=128" alt="papersii" loading="lazy">
            <span class="member-name">papersii</span><span class="member-handle">@papersii <span aria-hidden="true">↗</span></span>
          </a>
        </div>
      </div>
    </section>
  </main>
  <footer class="site-footer section-wrap"><a class="brand" href="#top"><span class="brand-mark">Δ</span><span>DeltaBox Lite</span></a><span>${copy.footer}</span><a href="${github}" target="_blank" rel="noopener noreferrer">${copy.footerSource}</a></footer>
`

initFilesystemDemo(document.querySelector('#filesystem-demo'), copy.fs)

document.querySelectorAll('[data-lang]').forEach((button) => button.addEventListener('click', () => switchLocale(button.dataset.lang)))

const stageContent = {
  run: ["$ deltabox exec \"$SESSION\" -- sh -c 'edit files'", copy.flow.run],
  diff: ['$ deltabox diff "$SESSION"', copy.flow.diff],
  commit: ['$ deltabox commit "$SESSION"', copy.flow.commit],
  abort: ['$ deltabox abort "$SESSION"', copy.flow.abort],
}

document.querySelectorAll('.flow-node').forEach((node) => {
  node.addEventListener('click', () => {
    document.querySelectorAll('.flow-node').forEach((item) => {
      const active = item === node
      item.classList.toggle('is-active', active)
      item.setAttribute('aria-pressed', String(active))
    })
    document.querySelector('.flow-demo').dataset.stage = node.dataset.stage
    const [command, description] = stageContent[node.dataset.stage]
    document.querySelector('#flow-code').textContent = command
    document.querySelector('#flow-description').textContent = description
  })
})

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
if (reducedMotion || !('IntersectionObserver' in window)) {
  document.querySelectorAll('.reveal').forEach((item) => item.classList.add('visible'))
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.12 })
  document.querySelectorAll('.reveal').forEach((item) => observer.observe(item))
}
