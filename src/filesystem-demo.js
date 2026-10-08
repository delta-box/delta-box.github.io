const stages = [
  { id: 'initial', label: '原始状态' },
  { id: 'save', label: '保留基线' },
  { id: 'write', label: '写入新值' },
  { id: 'pending', label: '等待决定' },
]

const platforms = {
  linux: {
    label: 'Linux / DeltaFS',
    description: '覆盖前保存旧范围；新值写入 LIVE 后，待你审查。',
    lines: [
      'LIVE 中保留原始文件，尚无待审查改动。',
      'DeltaFS 先记录即将被覆盖的 C、D、E。',
      '新值写入 LIVE，旧范围仍可用于撤销。',
      '查看 diff，然后从同一待决状态选择结果。',
      'Commit 接受 LIVE 的新状态，旧值记录可退役。',
      'Abort 利用旧值记录，将 LIVE 恢复到原始状态。',
    ],
  },
  macos: {
    label: 'macOS / APFS',
    description: 'APFS 克隆保留已接受基线；FSEvents 提供待核对路径。',
    lines: [
      '项目与已接受基线一致，尚无待审查改动。',
      'APFS 克隆的已接受基线为后续回滚提供依据。',
      'Agent 修改项目；FSEvents 标识需要核对的路径。',
      '核对路径并查看 diff，再选择保留或撤销。',
      'Commit 将当前项目状态接受为新的基线。',
      'Abort 用已接受基线恢复项目中的改动。',
    ],
  },
}

const blockRow = (prefix) => `
  <div class="fs-blocks" aria-hidden="true">
    ${['A', 'B', 'C', 'D', 'E'].map((letter, index) => `<span class="fs-block ${index > 1 ? `${prefix}-changed` : ''}" data-letter="${letter}">${letter}</span>`).join('')}
  </div>
`

const linuxDiagram = `
  <div class="fs-canvas fs-linux" data-platform="linux">
    <div class="fs-lane"><div class="fs-lane-head"><span>01 / INPUT</span><strong>Agent 写入</strong></div><div class="fs-lane-body"><div class="fs-write-blocks" aria-hidden="true"><span>C′</span><span>D′</span><span>E′</span></div><small>覆盖 C · D · E</small></div></div>
    <div class="fs-lane"><div class="fs-lane-head"><span>02 / WORKSPACE</span><strong>LIVE 文件</strong></div><div class="fs-lane-body">${blockRow('linux-live')}<small>当前工作区状态</small></div></div>
    <div class="fs-lane"><div class="fs-lane-head"><span>03 / UNDO</span><strong>旧值记录</strong></div><div class="fs-lane-body"><div class="fs-old-blocks" aria-hidden="true"><span>C</span><span>D</span><span>E</span></div><small>覆盖前保存的逻辑范围</small></div></div>
  </div>
`

const macosDiagram = `
  <div class="fs-canvas fs-macos" data-platform="macos">
    <div class="fs-lane"><div class="fs-lane-head"><span>01 / PROJECT</span><strong>项目 LIVE</strong></div><div class="fs-lane-body">${blockRow('mac-live')}<small>Agent 直接修改的项目</small></div></div>
    <div class="fs-lane"><div class="fs-lane-head"><span>02 / BASELINE</span><strong>APFS 已接受基线</strong></div><div class="fs-lane-body">${blockRow('mac-base')}<small>克隆保留的回滚依据</small></div></div>
    <div class="fs-lane"><div class="fs-lane-head"><span>03 / EVENTS</span><strong>FSEvents</strong></div><div class="fs-lane-body"><span class="fs-path">greeting.py</span><small>标识待核对路径；不是写入日志</small></div></div>
  </div>
`

export function initFilesystemDemo(root) {
  let platform = 'linux'
  let step = 0
  let outcome = null
  let playing = false
  let timer = null
  let branchTimer = null
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

  root.innerHTML = `
    <div class="fs-topbar"><div class="fs-tabs" role="tablist" aria-label="文件系统平台"><button type="button" role="tab" id="fs-tab-linux" aria-controls="fs-panel-linux" aria-selected="true" data-platform="linux">Linux / DeltaFS</button><button type="button" role="tab" id="fs-tab-macos" aria-controls="fs-panel-macos" aria-selected="false" data-platform="macos">macOS / APFS</button></div><div class="fs-status"><span class="fs-status-dot"></span><span id="fs-status-text">原始状态</span></div></div>
    <div class="fs-platform-copy" id="fs-platform-copy">${platforms.linux.description}</div>
    <div id="fs-panel-linux" role="tabpanel" aria-labelledby="fs-tab-linux">${linuxDiagram}</div>
    <div id="fs-panel-macos" role="tabpanel" aria-labelledby="fs-tab-macos" hidden>${macosDiagram}</div>
    <div class="fs-stage-row" role="group" aria-label="演示阶段">${stages.map((stage, index) => `<button type="button" class="fs-stage" data-step="${index}" aria-current="${index === 0 ? 'step' : 'false'}"><span>0${index + 1}</span><strong>${stage.label}</strong></button>`).join('')}</div>
    <div class="fs-bottom"><div class="fs-controls"><button type="button" id="fs-prev" aria-label="上一步" title="上一步">←</button><button type="button" id="fs-play" aria-label="播放" title="播放">▶</button><button type="button" id="fs-next" aria-label="下一步" title="下一步">→</button><span id="fs-counter">01 / 04</span></div><div class="fs-decision"><button type="button" data-outcome="commit">Commit <span>接受新值</span></button><button type="button" data-outcome="abort">Abort <span>恢复旧值</span></button></div></div>
    <p class="fs-narration" id="fs-narration" aria-live="polite"></p>
  `

  const stop = () => {
    playing = false
    window.clearInterval(timer)
    window.clearTimeout(branchTimer)
    root.querySelector('#fs-play').textContent = '▶'
    root.querySelector('#fs-play').setAttribute('aria-label', '播放')
    root.querySelector('#fs-play').title = '播放'
  }

  const render = () => {
    root.dataset.platform = platform
    root.dataset.phase = outcome || stages[step].id
    root.querySelector('#fs-platform-copy').textContent = platforms[platform].description
    root.querySelector('#fs-narration').textContent = platforms[platform].lines[outcome === 'commit' ? 4 : outcome === 'abort' ? 5 : step]
    root.querySelector('#fs-status-text').textContent = outcome === 'commit' ? '已接受' : outcome === 'abort' ? '已撤销' : stages[step].label
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
    outcome = null
    step = Math.max(0, Math.min(stages.length - 1, next))
    render()
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
      branchTimer = window.setTimeout(() => { outcome = target; render() }, reducedMotion.matches ? 0 : 350)
    } else {
      outcome = target
      render()
    }
  }))
  root.querySelector('#fs-play').addEventListener('click', () => {
    if (playing) { stop(); return }
    if (outcome || step === stages.length - 1) setStep(0)
    playing = true
    root.querySelector('#fs-play').textContent = 'Ⅱ'
    root.querySelector('#fs-play').setAttribute('aria-label', '暂停')
    root.querySelector('#fs-play').title = '暂停'
    timer = window.setInterval(() => {
      if (step < stages.length - 1) setStep(step + 1)
      else { outcome = 'commit'; render(); stop() }
    }, 1700)
  })

  render()
}
