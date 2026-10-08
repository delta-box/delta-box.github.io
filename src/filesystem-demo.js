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
    <div class="fs-lane"><div class="fs-lane-head"><span>01 / ${copy.macos.liveLabel}</span><strong>${copy.macos.live}</strong></div><div class="fs-lane-body">${blockRow('mac-live')}<small>${copy.macos.liveHint}</small></div></div>
    <div class="fs-lane"><div class="fs-lane-head"><span>02 / ${copy.macos.baseLabel}</span><strong>${copy.macos.base}</strong></div><div class="fs-lane-body">${blockRow('mac-base')}<small>${copy.macos.baseHint}</small></div></div>
    <div class="fs-lane"><div class="fs-lane-head"><span>03 / ${copy.macos.eventsLabel}</span><strong>FSEvents</strong></div><div class="fs-lane-body"><span class="fs-path">greeting.py</span><small>${copy.macos.eventsHint}</small></div></div>
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
    if (next === 1) {
      const source = [...panel.querySelectorAll(platform === 'linux' ? '.linux-live-changed' : '.fs-lane:first-child .fs-block')]
      const target = [...panel.querySelectorAll(platform === 'linux' ? '.fs-old-blocks span' : '.fs-lane:nth-child(2) .fs-block')]
      moveBlocks(source.map((block, index) => [block, target[index]]), platform === 'linux' ? 'old' : 'base')
    }
    if (next === 2 && platform === 'linux') {
      const source = [...panel.querySelectorAll('.fs-write-blocks span')]
      const target = [...panel.querySelectorAll('.linux-live-changed')]
      moveBlocks(source.map((block, index) => [block, target[index]]), 'new')
    }
  }

  const animateAbort = () => {
    const panel = root.querySelector(platform === 'linux' ? '.fs-linux' : '.fs-macos')
    const source = [...panel.querySelectorAll(platform === 'linux' ? '.fs-old-blocks span' : '.mac-base-changed')]
    const target = [...panel.querySelectorAll(platform === 'linux' ? '.linux-live-changed' : '.mac-live-changed')]
    moveBlocks(source.map((block, index) => [block, target[index]]), platform === 'linux' ? 'old' : 'base')
  }

  const applyOutcome = (target) => {
    clearFlights()
    outcome = target
    render()
    if (target === 'abort') animateAbort()
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
    root.querySelectorAll('.fs-block.linux-live-changed, .fs-block.mac-live-changed, .fs-block.mac-base-changed').forEach((block) => {
      const changed = block.classList.contains('mac-base-changed')
        ? outcome === 'commit'
        : (step >= 2 && outcome !== 'abort')
      block.textContent = `${block.dataset.letter}${changed ? '′' : ''}`
    })
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
