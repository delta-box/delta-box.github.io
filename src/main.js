import './style.css'
import './hero.css'
import './effects.css'
import './integrations.css'
import './filesystem-demo.css'
import { initFilesystemDemo } from './filesystem-demo.js'

const github = 'https://github.com/Ddnirvana/deltabox-lite'
const film = '/media/deltabox-lite-v4.mp4'

document.querySelector('#app').innerHTML = `
  <header class="site-header">
    <a class="brand" href="#top" aria-label="DeltaBox 首页"><span class="brand-mark">Δ</span><span>DeltaBox<span class="brand-lite"> Lite</span></span></a>
    <nav aria-label="主导航">
      <a href="#workflow">工作方式</a><a href="#performance">性能</a><a href="#film">宣传片</a><a href="#integrations">接入</a>
    </nav>
    <a class="header-link" href="${github}" target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a>
  </header>

  <main id="top">
    <section class="hero section-wrap">
      <div class="hero-copy">
        <div class="eyebrow"><span class="signal"></span> AGENT-NATIVE SANDBOX · LINUX / macOS</div>
        <h1>DeltaBox<span> Lite</span></h1>
        <p class="hero-lead">让 Agent 的每一次改动，<br>都有选择。</p>
        <p class="hero-description">给 AI 编码 Agent 一个可控的工作区。先看清它改了什么，再决定保留结果，或撤销这次尝试。</p>
        <div class="hero-actions"><a class="button primary" href="#workflow">了解工作方式 <span aria-hidden="true">↗</span></a><a class="button ghost" href="#film">观看宣传片 <span aria-hidden="true">↗</span></a></div>
      </div>
      <div class="hero-media" aria-label="DeltaBox 宣传片画面">
        <img src="/media/01-intro.jpg" alt="DeltaBox Lite 宣传片中的文件改动演示" fetchpriority="high">
        <div class="media-bottom"><span>01 / REVIEW THE CHANGE</span><span>DIFF · COMMIT · ABORT</span></div>
      </div>
      <div class="hero-index"><span>01 — 05</span><span>SCROLL TO EXPLORE ↓</span></div>
    </section>

    <section class="manifesto" id="workflow">
      <div class="section-wrap">
        <div class="section-label">01 / THE WORKFLOW</div>
        <div class="manifesto-grid reveal"><h2>让 AI 动手。<br><em>由你决定结果。</em></h2><p>DeltaBox Lite 把 Agent 的工作变成清晰的决策流程：运行任务，查看改动，然后接受或撤销。每一步都围绕实际文件状态展开。</p></div>
        <div class="flow-demo reveal" aria-label="交互式事务流程">
          <div class="flow-rail" aria-hidden="true"><span class="flow-pulse"></span></div>
          <div class="flow-nodes">
            <button class="flow-node is-active" data-stage="run" type="button" aria-pressed="true"><span class="node-index">01</span><strong>RUN</strong><small>执行任务</small></button>
            <button class="flow-node" data-stage="diff" type="button" aria-pressed="false"><span class="node-index">02</span><strong>DIFF</strong><small>审查改动</small></button>
            <button class="flow-node" data-stage="commit" type="button" aria-pressed="false"><span class="node-index">03A</span><strong>COMMIT</strong><small>接受结果</small></button>
            <button class="flow-node" data-stage="abort" type="button" aria-pressed="false"><span class="node-index">03B</span><strong>ABORT</strong><small>撤销尝试</small></button>
          </div>
          <div class="flow-detail" aria-live="polite"><span id="flow-code">$ deltabox exec "$SESSION" -- sh -c 'edit files'</span><p id="flow-description">Agent 在受约束的工作区中完成真实文件操作。</p></div>
        </div>
        <div class="steps">
          <article class="reveal"><span class="step-number">01 / RUN</span><h3>自由执行</h3><p>Agent 在受约束的文件系统视图中运行命令，完成实际的代码与文件操作。</p></article>
          <article class="reveal"><span class="step-number">02 / DIFF</span><h3>看清改动</h3><p>审查文本差异，并识别二进制与大文件变更；在做决定前，先看到结果。</p></article>
          <article class="reveal"><span class="step-number">03 / DECIDE</span><h3>保留，或撤销</h3><p>使用 commit 接受当前状态；使用 abort 恢复到选择的检查点。</p></article>
        </div>
      </div>
    </section>

    <section class="performance-section" id="performance">
      <div class="section-wrap">
        <div class="performance-intro reveal"><div class="section-label">02 / MEASURED PERFORMANCE</div><h2>写入更少搬运，<br><em>结果有据可查。</em></h2><p>在以下两项写入测试中，比较 <code>cbcow-through</code> 与原始 Sandlock 的 p50 耗时。条形越短，耗时越低。</p></div>
        <div class="bench-legend"><span><i class="legend-delta"></i> DeltaBox <code>cbcow-through</code></span><span><i class="legend-raw"></i> 原始 Sandlock</span></div>
        <div class="bench-list">
          <article class="bench-item reveal" style="--delta-width:28%;--raw-width:100%"><div class="bench-title"><h3>已有 256 MiB 文件，写入 4 KiB</h3><strong>约 3.6× <small>更快</small></strong></div><div class="bar-row"><span>DeltaBox</span><div class="bar-track"><div class="bar-fill delta"></div></div><b>46.4 ms</b></div><div class="bar-row"><span>Sandlock</span><div class="bar-track"><div class="bar-fill raw"></div></div><b>166.0 ms</b></div></article>
          <article class="bench-item reveal" style="--delta-width:10.6%;--raw-width:100%"><div class="bench-title"><h3>16 条命令，每个 32 MiB 文件写入 4 KiB，最后提交</h3><strong>约 9.4× <small>更快</small></strong></div><div class="bar-row"><span>DeltaBox</span><div class="bar-track"><div class="bar-fill delta"></div></div><b>509.0 ms</b></div><div class="bar-row"><span>Sandlock</span><div class="bar-track"><div class="bar-fill raw"></div></div><b>4809.5 ms</b></div></article>
        </div>
        <p class="bench-note">x86-server · Linux 6.18 · ext4 · release build · p50。原始 Sandlock 不提供跨命令持久会话，第二项测试逐条命令独立提交。空命令场景 DeltaBox p50 为 13.7–14.3 ms，原始 Sandlock 为 8.1–8.2 ms。<a href="${github}#performance" target="_blank" rel="noopener noreferrer">完整测试与 p95 数据 ↗</a></p>
      </div>
    </section>

    <section class="film-section" id="film">
      <div class="section-wrap">
        <div class="section-heading reveal"><div><div class="section-label">03 / SEE IT IN ACTION</div><h2>改动，尽在掌控。</h2></div><p>从一次文件写入，到 Harness 与 Pi 中的真实审查流程。</p></div>
        <div class="film-frame"><video controls preload="none" poster="/media/05-save.jpg" playsinline aria-label="DeltaBox Lite 宣传片"><source src="${film}" type="video/mp4">浏览器不支持视频播放。</video></div>
        <div class="film-caption"><span>DELTABox LITE / PRODUCT FILM</span><span>约 1 分 49 秒 · 中文旁白</span></div>
      </div>
    </section>

    <section class="inside-section" id="inside">
      <div class="section-wrap">
        <div class="inside-heading reveal"><div class="section-label">04 / UNDER THE HOOD</div><h2>从文件系统开始，<br>建立可撤销的工作流。</h2><p>同一套 diff、commit、abort 体验，由不同平台的原生能力支撑。</p></div>
        <div id="filesystem-demo" class="fs-demo reveal" aria-label="文件状态交互演示"></div>
        <p class="fs-disclaimer">逻辑状态示意，非磁盘物理布局或实际执行速度。此图展示 host 可立即看见改动的 <code>cbcow-through</code> 模式。<a href="${github}#how-it-works" target="_blank" rel="noopener noreferrer">阅读技术说明 ↗</a></p>
      </div>
    </section>

    <section class="integrations-section" id="integrations">
      <div class="section-wrap">
        <div class="section-label">05 / START BUILDING</div>
        <h2>选择你的使用方式。</h2>
        <p class="integration-intro">独立运行，或把审查与回滚接进 DSH、Pi。</p>
        <div class="integration-grid">
          <article class="integration-path reveal">
            <div class="path-meta"><span>01 / STANDALONE</span><span>CLI</span></div>
            <h3>独立使用</h3>
            <p>在命令行或自己的 Agent 流程中控制 diff、commit 和 abort。</p>
            <div class="command-label">发布后安装</div>
            <pre><code>npm install -g deltabox-lite</code></pre>
          </article>
          <article class="integration-path reveal">
            <div class="path-meta"><span>02 / DEEPSEEK HARNESS</span><span>DSH</span></div>
            <h3>接入 DSH</h3>
            <p>在 Harness 的审批面板审查改动，选择保留或撤销。</p>
            <div class="command-label">计划中的 npm 插件命令</div>
            <pre><code>dsh plugin --profile web add npm:dsh-deltabox</code></pre>
          </article>
          <article class="integration-path reveal">
            <div class="path-meta"><span>03 / PI EXTENSION</span><span>PI</span></div>
            <h3>接入 Pi</h3>
            <p>在 Pi 中用 <code>/sandbox-review</code>、<code>/sandbox-commit</code> 和 <code>/sandbox-abort</code> 做决定。</p>
            <div class="command-label">发布后安装</div>
            <pre><code>pi install npm:pi-deltabox</code></pre>
          </article>
        </div>
        <p class="availability-note">以上是发布后的目标命令，目前尚不可安装；DSH 的 <code>npm:</code> 插件来源还需在发布时验证。当前可从源码使用，详见项目 README 和插件文档。</p>
        <div class="footer-cta"><p>给每一次尝试，留下选择。</p><a class="button primary" href="${github}" target="_blank" rel="noopener noreferrer">查看 GitHub <span aria-hidden="true">↗</span></a></div>
      </div>
    </section>
  </main>
  <footer class="site-footer section-wrap"><a class="brand" href="#top"><span class="brand-mark">Δ</span><span>DeltaBox Lite</span></a><span>Agent-native sandboxing with diff · commit · abort.</span><a href="${github}" target="_blank" rel="noopener noreferrer">SOURCE ↗</a></footer>
`

initFilesystemDemo(document.querySelector('#filesystem-demo'))

const stageContent = {
  run: ["$ deltabox exec \"$SESSION\" -- sh -c 'edit files'", 'Agent 在受约束的工作区中完成真实文件操作。'],
  diff: ['$ deltabox diff "$SESSION"', '查看文本差异，以及二进制和大文件的变更标记。'],
  commit: ['$ deltabox commit "$SESSION"', '接受当前文件状态，继续下一步工作。'],
  abort: ['$ deltabox abort "$SESSION"', '使用保存的旧值，把工作区恢复到检查点。'],
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
