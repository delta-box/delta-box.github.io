import './style.css'
import './hero.css'

const github = 'https://github.com/Ddnirvana/deltabox-lite'
const film = '/media/deltabox-lite-v4.mp4'

document.querySelector('#app').innerHTML = `
  <header class="site-header">
    <a class="brand" href="#top" aria-label="DeltaBox 首页"><span class="brand-mark">Δ</span><span>DeltaBox<span class="brand-lite"> Lite</span></span></a>
    <nav aria-label="主导航">
      <a href="#workflow">工作方式</a><a href="#film">宣传片</a><a href="#integrations">接入</a>
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
      <div class="hero-index"><span>01 — 04</span><span>SCROLL TO EXPLORE ↓</span></div>
    </section>

    <section class="manifesto" id="workflow">
      <div class="section-wrap">
        <div class="section-label">01 / THE WORKFLOW</div>
        <div class="manifesto-grid"><h2>让 AI 动手。<br><em>由你决定结果。</em></h2><p>DeltaBox Lite 把 Agent 的工作变成清晰的决策流程：运行任务，查看改动，然后接受或撤销。每一步都围绕实际文件状态展开。</p></div>
        <div class="steps">
          <article><span class="step-number">01 / RUN</span><h3>自由执行</h3><p>Agent 在受约束的文件系统视图中运行命令，完成实际的代码与文件操作。</p></article>
          <article><span class="step-number">02 / DIFF</span><h3>看清改动</h3><p>审查文本差异，并识别二进制与大文件变更；在做决定前，先看到结果。</p></article>
          <article><span class="step-number">03 / DECIDE</span><h3>保留，或撤销</h3><p>使用 commit 接受当前状态；使用 abort 恢复到选择的检查点。</p></article>
        </div>
      </div>
    </section>

    <section class="film-section" id="film">
      <div class="section-wrap">
        <div class="section-heading"><div><div class="section-label">02 / SEE IT IN ACTION</div><h2>改动，尽在掌控。</h2></div><p>从一次文件写入，到 Harness 与 Pi 中的真实审查流程。</p></div>
        <div class="film-frame"><video controls preload="none" poster="/media/05-save.jpg" playsinline aria-label="DeltaBox Lite 宣传片"><source src="${film}" type="video/mp4">浏览器不支持视频播放。</video></div>
        <div class="film-caption"><span>DELTABox LITE / PRODUCT FILM</span><span>约 1 分 49 秒 · 中文旁白</span></div>
      </div>
    </section>

    <section class="inside-section" id="inside">
      <div class="section-wrap inside-grid"><div><div class="section-label">03 / UNDER THE HOOD</div><h2>从文件系统开始，<br>建立可撤销的工作流。</h2><p>Linux 上，DeltaFS 在覆盖前保存旧数据，使当前改动立即可见，并为撤销留下依据。macOS 使用 APFS clone 与 FSEvents。具体模式可按可见性和隔离需求选择。</p><a class="text-link" href="${github}#how-it-works" target="_blank" rel="noopener noreferrer">阅读技术说明 <span aria-hidden="true">↗</span></a></div><img src="/media/05-save.jpg" alt="DeltaFS 保存旧数据范围的原理画面" loading="lazy"></div>
    </section>

    <section class="integrations-section" id="integrations"><div class="section-wrap"><div class="section-label">04 / START BUILDING</div><h2>接入现有工作流。</h2><p class="integration-intro">从命令行开始，也可以通过适配器接入 Agent。</p><div class="install-grid"><div><div class="install-head"><span>CLI</span><span>01</span></div><code>npm install --global deltabox-lite</code><p>安装独立命令行工具与 Node-API addon。</p></div><div><div class="install-head"><span>PI EXTENSION</span><span>02</span></div><code>pi install npm:pi-deltabox</code><p>在 Pi 的任务流程里审查、提交或撤销改动。</p></div></div><div class="footer-cta"><p>给每一次尝试，留下选择。</p><a class="button primary" href="${github}" target="_blank" rel="noopener noreferrer">查看 GitHub <span aria-hidden="true">↗</span></a></div></div></section>
  </main>
  <footer class="site-footer section-wrap"><a class="brand" href="#top"><span class="brand-mark">Δ</span><span>DeltaBox Lite</span></a><span>Agent-native sandboxing with diff · commit · abort.</span><a href="${github}" target="_blank" rel="noopener noreferrer">SOURCE ↗</a></footer>
`
