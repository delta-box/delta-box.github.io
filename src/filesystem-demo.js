const stages = ['initial', 'save', 'write', 'pending']

const blockRow = (prefix) => `
  <div class="fs-blocks" aria-hidden="true">
    ${['A', 'B', 'C', 'D', 'E'].map((letter, index) => `<span class="fs-block ${index > 1 ? `${prefix}-changed` : ''}" data-letter="${letter}">${letter}</span>`).join('')}
  </div>
`

const linuxDiagram = (copy) => `
  <div class="fs-canvas fs-linux" data-platform="linux">
    <div class="fs-lane"><div class="fs-lane-head"><span>01 / ${copy.linux.inputLabel}</span><strong>${copy.linux.input}</strong></div><div class="fs-lane-body"><div class="fs-write-blocks" aria-hidden="true"><span>C′</span><span>D′</span><span>E′</span></div><small>${copy.linux.inputHint}</small></div></div>
    <div class="fs-lane"><div class="fs-lane-head"><span>02 / ${copy.linux.liveLabel}</span><strong>${copy.linux.live}</strong></div><div class="fs-lane-body">${blockRow('linux-live')}<small>${copy.linux.liveHint}</small></div></div>
    <div class="fs-lane"><div class="fs-lane-head"><span>03 / ${copy.linux.oldLabel}</span><strong>${copy.linux.old}</strong></div><div class="fs-lane-body"><div class="fs-old-blocks" aria-hidden="true"><span>C</span><span>D</span><span>E</span></div><small>${copy.linux.oldHint}</small></div></div>
  </div>
`

const macosDiagram = (copy) => `
  <div class="fs-canvas fs-macos" data-platform="macos">
    <div class="fs-mac-files">
      <div class="fs-mac-file fs-mac-live"><span class="fs-mac-kicker">01 / ${copy.macos.liveLabel}</span><strong>${copy.macos.live}</strong><span class="fs-mac-reference">${copy.macos.pointsTo} <b class="fs-mac-live-ref">${copy.macos.oldVersion}</b></span><small>${copy.macos.liveHint}</small></div>
      <div class="fs-mac-file fs-mac-base"><span class="fs-mac-kicker">02 / ${copy.macos.baseLabel}</span><strong>${copy.macos.base}</strong><span class="fs-mac-reference">${copy.macos.pointsTo} <b class="fs-mac-base-ref">${copy.macos.oldVersion}</b></span><small>${copy.macos.baseHint}</small></div>
    </div>
    <div class="fs-mac-pool">
      <div class="fs-mac-row fs-mac-shared"><span class="fs-mac-row-label">${copy.macos.shared}</span><div class="fs-blocks" aria-hidden="true"><span class="fs-block">A</span><span class="fs-block">B</span></div><span class="fs-mac-links"><i class="fs-mac-link-live">LIVE</i><i class="fs-mac-link-base">${copy.macos.baseShort}</i></span></div>
      <div class="fs-mac-row fs-mac-old"><span class="fs-mac-row-label">${copy.macos.oldVersion}</span><div class="fs-blocks" aria-hidden="true"><span class="fs-block">C</span><span class="fs-block">D</span><span class="fs-block">E</span></div><span class="fs-mac-links"><i class="fs-mac-link-live">LIVE</i><i class="fs-mac-link-base">${copy.macos.baseShort}</i></span></div>
      <div class="fs-mac-row fs-mac-new"><span class="fs-mac-row-label">${copy.macos.newVersion}</span><div class="fs-blocks" aria-hidden="true"><span class="fs-block mac-new-block">C′</span><span class="fs-block mac-new-block">D′</span><span class="fs-block mac-new-block">E′</span></div><span class="fs-mac-links"><i class="fs-mac-link-live">LIVE</i><i class="fs-mac-link-base">${copy.macos.baseShort}</i></span></div>
    </div>
    <div class="fs-mac-events"><span>03 / FSEvents</span><code>greeting.py</code><small>${copy.macos.eventsHint}</small></div>
  </div>
`

export function initFilesystemDemo(root, copy) {
  let platform = 'linux'
  let step = 0
  let outcome = null
  let playing = false
  let timer = null
  let branchTimer = null
  let flights = []
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

  root.innerHTML = `
    <div class="fs-topbar"><div class="fs-tabs" role="tablist" aria-label="${copy.tabsAria}"><button type="button" role="tab" id="fs-tab-linux" aria-controls="fs-panel-linux" aria-selected="true" data-platform="linux">Linux / DeltaFS</button><button type="button" role="tab" id="fs-tab-macos" aria-controls="fs-panel-macos" aria-selected="false" data-platform="macos">macOS / APFS</button></div><div class="fs-status"><span class="fs-status-dot"></span><span id="fs-status-text">${copy.stages[0]}</span></div></div>
    <div class="fs-platform-copy" id="fs-platform-copy">${copy.linux.description}</div>
    <div id="fs-panel-linux" role="tabpanel" aria-labelledby="fs-tab-linux">${linuxDiagram(copy)}</div>
    <div id="fs-panel-macos" role="tabpanel" aria-labelledby="fs-tab-macos" hidden>${macosDiagram(copy)}</div>
    <div class="fs-stage-row" role="group" aria-label="${copy.stageAria}">${stages.map((stage, index) => `<button type="button" class="fs-stage" data-step="${index}" aria-current="${index === 0 ? 'step' : 'false'}"><span>0${index + 1}</span><strong>${copy.stages[index]}</strong></button>`).join('')}</div>
    <div class="fs-bottom"><div class="fs-controls"><button type="button" id="fs-prev" aria-label="${copy.previous}" title="${copy.previous}">←</button><button type="button" id="fs-play" aria-label="${copy.play}" title="${copy.play}">▶</button><button type="button" id="fs-next" aria-label="${copy.next}" title="${copy.next}">→</button><span id="fs-counter">01 / 04</span></div><div class="fs-decision"><button type="button" data-outcome="commit">Commit <span>${copy.commit}</span></button><button type="button" data-outcome="abort">Abort <span>${copy.abort}</span></button></div></div>
    <p class="fs-narration" id="fs-narration" aria-live="polite"></p>
  `

  const stop = () => {
    playing = false
    window.clearInterval(timer)
    window.clearTimeout(branchTimer)
    root.querySelector('#fs-play').textContent = '▶'
    root.querySelector('#fs-play').setAttribute('aria-label', copy.play)
    root.querySelector('#fs-play').title = copy.play
  }

  const clearFlights = () => {
    flights.forEach(({ animation, element, target }) => {
      animation.cancel()
      element.remove()
      target.classList.remove('fs-arrival')
    })
    flights = []
  }

  const moveBlocks = (pairs, color) => {
    if (reducedMotion.matches || !Element.prototype.animate) return
    pairs.forEach(([source, target], index) => {
      const start = source.getBoundingClientRect()
      const end = target.getBoundingClientRect()
      const bounds = root.getBoundingClientRect()
      const dx = end.left - start.left
      const dy = end.top - start.top
      const element = document.createElement('span')
      element.className = `fs-flight fs-flight-${color}`
      element.textContent = target.textContent
      element.style.left = `${start.left - bounds.left}px`
      element.style.top = `${start.top - bounds.top}px`
      element.style.width = `${start.width}px`
      element.style.height = `${start.height}px`
      target.classList.add('fs-arrival')
      root.append(element)
      const animation = element.animate([
        { transform: 'translate(0, 0) scale(1)', opacity: 1, offset: 0 },
        { transform: `translate(${dx * 1.04}px, ${dy * 1.04}px) scale(1.06)`, opacity: 1, offset: .83 },
        { transform: `translate(${dx}px, ${dy}px) scale(1)`, opacity: 1, offset: 1 },
      ], { duration: 1100, delay: index * 120, fill: 'forwards', easing: 'cubic-bezier(.25,.15,.2,1)' })
      const flight = { animation, element, target }
      flights.push(flight)
      animation.finished.then(() => {
        element.remove()
        target.classList.remove('fs-arrival')
        flights = flights.filter((item) => item !== flight)
      }).catch(() => {})
    })
  }

  const animateStep = (next) => {
    const panel = root.querySelector(platform === 'linux' ? '.fs-linux' : '.fs-macos')
    if (next === 1 && platform === 'linux') {
      const source = [...panel.querySelectorAll('.linux-live-changed')]
      const target = [...panel.querySelectorAll('.fs-old-blocks span')]
      moveBlocks(source.map((block, index) => [block, target[index]]), 'old')
    }
    if (next === 2 && platform === 'linux') {
      const source = [...panel.querySelectorAll('.fs-write-blocks span')]
      const target = [...panel.querySelectorAll('.linux-live-changed')]
      moveBlocks(source.map((block, index) => [block, target[index]]), 'new')
    }
    if (next === 2 && platform === 'macos') {
      panel.querySelectorAll('.mac-new-block').forEach((block, index) => {
        if (reducedMotion.matches || !Element.prototype.animate) return
        block.animate([
          { transform: 'translateY(34px) scale(.7)', opacity: 0 },
          { transform: 'translateY(-5px) scale(1.07)', opacity: 1, offset: .8 },
          { transform: 'translateY(0) scale(1)', opacity: 1 },
        ], { duration: 780, delay: index * 130, easing: 'cubic-bezier(.2,.8,.2,1)' })
      })
    }
  }

  const animateAbort = () => {
    const panel = root.querySelector(platform === 'linux' ? '.fs-linux' : '.fs-macos')
    if (platform === 'macos') {
      const source = panel.querySelector('.fs-mac-base')
      const target = panel.querySelector('.fs-mac-live')
      if (reducedMotion.matches || !Element.prototype.animate) return
      const start = source.getBoundingClientRect()
      const end = target.getBoundingClientRect()
      const bounds = root.getBoundingClientRect()
      const card = source.cloneNode(true)
      card.classList.add('fs-mac-restore')
      card.querySelector('strong').textContent = copy.macos.restore
      card.style.left = `${start.left - bounds.left}px`
      card.style.top = `${start.top - bounds.top}px`
      card.style.width = `${start.width}px`
      card.style.height = `${start.height}px`
      root.append(card)
      const animation = card.animate([
        { transform: 'translate(0,0) scale(1)', opacity: 1 },
        { transform: `translate(${(end.left - start.left) * 1.04}px,${(end.top - start.top) * 1.04}px) scale(1.04)`, opacity: 1, offset: .82 },
        { transform: `translate(${end.left - start.left}px,${end.top - start.top}px) scale(1)`, opacity: 0 },
      ], { duration: 1050, easing: 'cubic-bezier(.25,.15,.2,1)' })
      flights.push({ animation, element: card, target })
      animation.finished.then(() => { card.remove(); flights = flights.filter((item) => item.element !== card) }).catch(() => {})
      return
    }
    const source = [...panel.querySelectorAll('.fs-old-blocks span')]
    const target = [...panel.querySelectorAll('.linux-live-changed')]
    moveBlocks(source.map((block, index) => [block, target[index]]), 'old')
  }

  const applyOutcome = (target) => {
    clearFlights()
    outcome = target
    render()
    if (target === 'abort') animateAbort()
    if (target === 'commit' && platform === 'macos') {
      const panel = root.querySelector('.fs-macos')
      moveBlocks([[panel.querySelector('.fs-mac-live-ref'), panel.querySelector('.fs-mac-base-ref')]], 'new')
    }
  }

  const render = () => {
    root.dataset.platform = platform
    root.dataset.phase = outcome || stages[step]
    root.querySelector('#fs-platform-copy').textContent = copy[platform].description
    root.querySelector('#fs-narration').textContent = copy[platform].lines[outcome === 'commit' ? 4 : outcome === 'abort' ? 5 : step]
    root.querySelector('#fs-status-text').textContent = outcome === 'commit' ? copy.accepted : outcome === 'abort' ? copy.aborted : copy.stages[step]
    root.querySelector('#fs-counter').textContent = `${String(step + 1).padStart(2, '0')} / 04`
    root.querySelectorAll('.fs-stage').forEach((button, index) => button.setAttribute('aria-current', String(index === step ? 'step' : false)))
    root.querySelectorAll('.fs-tabs button').forEach((button) => button.setAttribute('aria-selected', String(button.dataset.platform === platform)))
    root.querySelector('#fs-panel-linux').hidden = platform !== 'linux'
    root.querySelector('#fs-panel-macos').hidden = platform !== 'macos'
    root.querySelector('#fs-prev').disabled = step === 0 && !outcome
    root.querySelector('#fs-next').disabled = step === stages.length - 1 && !outcome
    root.querySelectorAll('[data-outcome]').forEach((button) => {
      button.disabled = step !== stages.length - 1 && !outcome
      button.setAttribute('aria-pressed', String(outcome === button.dataset.outcome))
    })
    root.querySelectorAll('.fs-block.linux-live-changed').forEach((block) => {
      block.textContent = `${block.dataset.letter}${step >= 2 && outcome !== 'abort' ? '′' : ''}`
    })
    const mac = root.querySelector('.fs-macos')
    mac.querySelector('.fs-mac-live-ref').textContent = step >= 2 && outcome !== 'abort' ? copy.macos.newVersion : copy.macos.oldVersion
    mac.querySelector('.fs-mac-base-ref').textContent = outcome === 'commit' ? copy.macos.newVersion : copy.macos.oldVersion
  }

  const setStep = (next) => {
    const previous = step
    clearFlights()
    outcome = null
    step = Math.max(0, Math.min(stages.length - 1, next))
    render()
    if (step === previous + 1 && (step === 1 || step === 2)) animateStep(step)
  }

  root.querySelectorAll('.fs-tabs button').forEach((button) => button.addEventListener('click', () => {
    stop()
    platform = button.dataset.platform
    setStep(0)
  }))
  root.querySelector('.fs-tabs').addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
    event.preventDefault()
    const next = platform === 'linux' ? 'macos' : 'linux'
    root.querySelector(`#fs-tab-${next}`).click()
    root.querySelector(`#fs-tab-${next}`).focus()
  })
  root.querySelectorAll('.fs-stage').forEach((button) => button.addEventListener('click', () => {
    stop()
    setStep(Number(button.dataset.step))
  }))
  root.querySelector('#fs-prev').addEventListener('click', () => { stop(); setStep(outcome ? 3 : step - 1) })
  root.querySelector('#fs-next').addEventListener('click', () => { stop(); setStep(outcome ? 0 : step + 1) })
  root.querySelectorAll('[data-outcome]').forEach((button) => button.addEventListener('click', () => {
    stop()
    const target = button.dataset.outcome
    if (outcome) {
      setStep(3)
      branchTimer = window.setTimeout(() => applyOutcome(target), reducedMotion.matches ? 0 : 350)
    } else {
      applyOutcome(target)
    }
  }))
  root.querySelector('#fs-play').addEventListener('click', () => {
    if (playing) { stop(); return }
    if (outcome || step === stages.length - 1) setStep(0)
    playing = true
    root.querySelector('#fs-play').textContent = 'Ⅱ'
    root.querySelector('#fs-play').setAttribute('aria-label', copy.pause)
    root.querySelector('#fs-play').title = copy.pause
    timer = window.setInterval(() => {
      if (step < stages.length - 1) setStep(step + 1)
      else { applyOutcome('commit'); stop() }
    }, 1700)
  })

  render()
}
