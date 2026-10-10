export const messages = {
  zh: {
    meta: {
      title: 'DeltaBox Lite',
      description: 'DeltaBox Lite 为 AI 编码 Agent 提供可审查、可提交、可撤销的工作区改动。',
    },
    nav: { aria: '主导航', workflow: '工作方式', performance: '性能', film: '宣传片', integrations: '接入', members: '成员', home: 'DeltaBox 首页', language: '语言' },
    hero: {
      eyebrow: '支持 MacOS 与 Linux',
      lead1: '让 Agent 的每一次改动，', lead2: '都有选择。',
      description: '给 AI 编码 Agent 一个可控的工作区。每轮对话查看文件变更，决定保留结果，或撤销尝试。',
      workflow: '了解工作方式', film: '观看宣传片', imageAria: 'DeltaBox 宣传片画面', imageAlt: 'DeltaBox Lite 宣传片中的文件改动演示', scroll: '向下探索 ↓',
    },
    workflow: {
      label: '01 / 工作流', title1: '放手让 AI 执行，', title2: '由你决定结果。',
      intro: 'DeltaBox Lite 把 Agent 的工作变成清晰的决策流程：运行任务，查看改动，然后接受或撤销。工作区文件均受管理。',
      demoAria: '交互式事务流程', run: '执行任务', diff: '审查改动', commit: '接受结果', abort: '撤销尝试',
      steps: [
        { title: '执行命令', text: 'Agent 在受约束的文件系统视图中运行命令，完成实际的代码与文件操作。' },
        { title: '查看改动', text: '审查文本差异与大文件变更，依据变更决定。' },
        { title: '保留，或撤销', text: '使用 commit 接受当前状态，使用 abort 恢复到选择的检查点。' },
      ],
    },
    flow: {
      run: 'Agent 在受约束的工作区中完成真实文件操作。',
      diff: '查看文本差异，以及二进制和大文件的变更标记。',
      commit: '接受当前文件状态，继续下一步工作。',
      abort: '使用保存的旧值，把工作区恢复到检查点。',
    },
    performance: {
      label: '02 / 性能', title1: '文件写入更快，', title2: '高性能文件管理。',
      intro1: '在以下两项写入测试中，比较 ', intro2: ' 与原始 Sandlock 的 p50 耗时。条形越短，耗时越低。',
      raw: '原始 Sandlock', faster: '更快',
      case1: '256 MiB 文件，写入 4 KiB', case2: '16 条命令，每个 32 MiB 文件写入 4 KiB，最后提交',
      note: '在 ext4 文件系统上测试。原始 Sandlock 不提供跨命令持久会话，第二项测试逐条命令独立提交。',
      source: '完整测试数据 ↗',
      workflowTitle: '审查流程性能',
      workflowCbcow: 'CB-CoW + DeltaBox', workflowGit: 'Git + Bubblewrap',
      workflowRows: [
        { label: '新建 1 KiB 文件 · abort', cbcow: '6.37 ms', git: '44.42 ms', result: '7.0×', deltaWidth: '14.4%' },
        { label: '改写 1 KiB 文件 · commit', cbcow: '6.94 ms', git: '51.90 ms', result: '7.5×', deltaWidth: '13.4%' },
      ],
      workflowSourceAbort: 'Abort 测试 ↗', workflowSourceCommit: 'Commit 测试 ↗',
    },
    film: {
      label: '03 / 实际演示', title: '改动，尽在掌控。', intro: '从一次文件写入，到 DeepSeek Harness 与 Pi 中的真实审查流程。',
      aria: 'DeltaBox Lite 宣传片', fallback: '浏览器不支持视频播放。', brandCaption: '宣传片', caption: '',
    },
    inside: {
      label: '04 / 工作原理', title1: '深入文件系统，', title2: '建立可撤销的工作流。',
      intro: '同一套 diff、commit、abort 体验，由不同平台的原生能力支撑。', demoAria: '文件状态交互演示',
      disclaimer1: '逻辑状态示意，非磁盘物理布局或实际执行速度。此图展示宿主可立即看见改动的 ', disclaimer2: ' 模式。', source: '阅读技术说明 ↗',
    },
    integrations: {
      label: '05 / 开始使用', title: '支持多种使用方式。', intro: '独立运行，或接入 DeepSeek Harness、Pi。',
      cliTitle: '独立使用', cliText: '在命令行或自己的 Agent 流程中控制 diff、commit 和 abort。',
      dshTitle: '接入 DeepSeek Harness', dshText: '在网页端的审批面板审查改动，选择保留或撤销。',
      piTitle: '接入 Pi', piBefore: '在 Pi 中用 ', piSeparator: '、', piLastSeparator: ' 和 ', piAfter: '命令。',
      afterRelease: '', plannedCommand: '',
      availability: '也可从源码构建，详见项目 README。',
      cta: '让每一次尝试，都有选择。', github: '查看 GitHub',
    },
    members: { label: '06 / 成员', title: '一起构建 DeltaBox。', intro: '感谢所有通过代码提交参与项目的贡献者。' },
    footer: 'delta-box @ IPADS 2026', footerSource: '源码 ↗',
    fs: {
      aria: '文件状态交互演示', tabsAria: '文件系统平台', stageAria: '演示阶段',
      stages: ['原始状态', '保留基线', '写入新值', '等待决定'], accepted: '已接受', aborted: '已撤销',
      previous: '上一步', next: '下一步', play: '播放', pause: '暂停', commit: '接受新值', abort: '恢复旧值',
      linux: {
        description: '覆盖前保存旧范围；新值写入 LIVE 后，待你审查。',
        lines: ['LIVE 中保留原始文件，尚无待审查改动。', 'DeltaFS 先记录即将被覆盖的 C、D、E。', '新值写入 LIVE，旧范围仍可用于撤销。', '查看 diff，然后从同一待决状态选择结果。', 'Commit 接受 LIVE 的新状态，旧值记录可退役。', 'Abort 利用旧值记录，将 LIVE 恢复到原始状态。'],
        inputLabel: '输入', liveLabel: '工作区', oldLabel: '撤销依据',
        input: 'Agent 写入', inputHint: '覆盖 C · D · E', live: 'LIVE 文件', liveHint: '当前工作区状态', old: '旧值记录', oldHint: '覆盖前保存的逻辑范围',
      },
      macos: {
        description: '项目与克隆基线可共享数据；FSEvents 标识待核对路径。',
        lines: ['项目文件指向旧版本，尚无待审查改动。', '克隆创建独立的基线文件，初始共享旧版本数据。', 'Agent 写入新内容；基线继续保留旧版本的引用。', '查看 diff，再从同一待决状态选择结果。', 'Commit 更新已接受基线，项目文件已是新版本。', 'Abort 克隆旧版本并替换项目文件路径。'],
        liveLabel: '项目', baseLabel: '基线', eventsLabel: '事件',
        live: '项目 LIVE', liveHint: 'Agent 直接修改的文件', base: '已接受基线', baseHint: '独立文件，初始共享数据', eventsHint: '待核对路径，不承载文件内容',
        pointsTo: '引用 →', shared: '共享 A/B', oldVersion: '旧 C/D/E', newVersion: '新 C′/D′/E′', baseShort: '基线', restore: '恢复克隆',
      },
    },
  },
  en: {
    meta: {
      title: 'DeltaBox Lite — Keep or undo every change',
      description: 'DeltaBox Lite gives AI coding agents a confined workspace with reviewable changes and explicit commit or abort decisions.',
    },
    nav: { aria: 'Main navigation', workflow: 'How it works', performance: 'Performance', film: 'Film', integrations: 'Integrations', members: 'Members', home: 'DeltaBox home', language: 'Language' },
    hero: {
      eyebrow: 'Linux & macOS Support',
      lead1: 'Let agents make changes.', lead2: 'You decide what stays.',
      description: 'Give AI coding agents a controlled workspace. Review what changed, then accept the result or roll back the attempt.',
      workflow: 'How it works', film: 'Watch the film', imageAria: 'DeltaBox product film still', imageAlt: 'A file change illustrated in the DeltaBox Lite product film', scroll: 'SCROLL TO EXPLORE ↓',
    },
    workflow: {
      label: '01 / THE WORKFLOW', title1: 'Let the agent work.', title2: 'Keep the final say.',
      intro: 'DeltaBox Lite turns agent work into a clear decision: run a task, inspect the changes, then keep or undo them. Each step reflects the real file state.',
      demoAria: 'Interactive transaction workflow', run: 'Run a task', diff: 'Review changes', commit: 'Keep the result', abort: 'Undo the attempt',
      steps: [
        { title: 'Run freely', text: 'The agent executes real commands and changes files within a confined filesystem view.' },
        { title: 'See the diff', text: 'Inspect text diffs and markers for binary or large files before deciding what to keep.' },
        { title: 'Keep or undo', text: 'Commit accepts the current state. Abort restores the selected checkpoint.' },
      ],
    },
    flow: {
      run: 'The agent performs real file operations inside a confined workspace.',
      diff: 'Inspect text diffs and markers for binary or large files.',
      commit: 'Accept the current file state and continue.',
      abort: 'Restore the workspace to a checkpoint using saved prior values.',
    },
    performance: {
      label: '02 / MEASURED PERFORMANCE', title1: 'Less copying on writes.', title2: 'Results you can inspect.',
      intro1: 'These write benchmarks compare ', intro2: ' with raw Sandlock using p50 latency. Shorter bars mean less time.',
      raw: 'Raw Sandlock', faster: 'faster',
      case1: 'One 4 KiB write in an existing 256 MiB file', case2: '16 commands, one 4 KiB write per 32 MiB file, then commit',
      note: 'x86 server · Linux 6.18 · ext4 · release build · p50. Raw Sandlock has no durable cross-command session, so the second workload commits each one-shot command separately. For no-op commands, DeltaBox p50 is 13.7–14.3 ms versus 8.1–8.2 ms for raw Sandlock.',
      source: 'Full benchmarks and p95 data ↗',
      workflowTitle: 'Review workflow comparison',
      workflowCbcow: 'CB-CoW + DeltaBox', workflowGit: 'Git + Bubblewrap',
      workflowRows: [
        { label: 'Create 1 KiB file · abort', cbcow: '6.37 ms', git: '44.42 ms', result: '7.0×', deltaWidth: '14.4%' },
        { label: 'Rewrite 1 KiB file · commit', cbcow: '6.94 ms', git: '51.90 ms', result: '7.5×', deltaWidth: '13.4%' },
      ],
      workflowSourceAbort: 'Abort benchmark ↗', workflowSourceCommit: 'Commit benchmark ↗',
    },
    film: {
      label: '03 / SEE IT IN ACTION', title: 'See every change.', intro: 'From a single file write to real review flows in Harness and Pi.',
      aria: 'DeltaBox Lite product film', fallback: 'Your browser does not support video playback.', brandCaption: 'DELTABox LITE / PRODUCT FILM', caption: 'About 1 min 49 sec · Chinese audio',
    },
    inside: {
      label: '04 / UNDER THE HOOD', title1: 'Start with the filesystem.', title2: 'Make changes reversible.',
      intro: 'The same diff, commit, and abort workflow is backed by different native capabilities on each platform.', demoAria: 'Interactive file state walkthrough',
      disclaimer1: 'Logical state diagram, not physical disk layout or actual execution speed. This shows ', disclaimer2: ', where changes are immediately visible to the host.', source: 'Read the technical details ↗',
    },
    integrations: {
      label: '05 / START BUILDING', title: 'Choose your workflow.', intro: 'Use the CLI directly, or bring review and rollback into DSH or Pi.',
      cliTitle: 'Standalone', cliText: 'Control diff, commit, and abort from the CLI or your own agent workflow.',
      dshTitle: 'With DSH', dshText: 'Review changes in the Harness approval panel, then keep or undo them.',
      piTitle: 'With Pi', piBefore: 'Decide in Pi with ', piSeparator: ', ', piLastSeparator: ', and ', piAfter: '.',
      afterRelease: 'Install after release', plannedCommand: 'Planned npm plugin command',
      availability: 'These are target commands for a future release and cannot be installed yet. DSH npm: plugin support still needs verification at release. You can use the source today; see the project README and plugin docs.',
      cta: 'Make every attempt a choice.', github: 'View on GitHub',
    },
    members: { label: '06 / MEMBERS', title: 'Built together.', intro: 'Thanks to everyone who has contributed code to DeltaBox Lite.' },
    footer: 'Agent-native sandboxing with diff · commit · abort.', footerSource: 'SOURCE ↗',
    fs: {
      aria: 'Interactive file state walkthrough', tabsAria: 'Filesystem platform', stageAria: 'Walkthrough stages',
      stages: ['Original state', 'Preserve baseline', 'Write new values', 'Review & decide'], accepted: 'Accepted', aborted: 'Undone',
      previous: 'Previous step', next: 'Next step', play: 'Play', pause: 'Pause', commit: 'Keep new values', abort: 'Restore old values',
      linux: {
        description: 'Save old ranges before overwrite; review the new values in LIVE.',
        lines: ['LIVE contains the original file. There are no pending changes.', 'DeltaFS records C, D, and E before they are overwritten.', 'New values enter LIVE; the old ranges remain available for rollback.', 'Inspect the diff, then choose a result from this same pending state.', 'Commit accepts the new LIVE state. The undo record can be retired.', 'Abort uses the saved ranges to restore LIVE to its original state.'],
        inputLabel: 'INPUT', liveLabel: 'WORKSPACE', oldLabel: 'UNDO',
        input: 'Agent write', inputHint: 'Overwrite C · D · E', live: 'LIVE file', liveHint: 'Current workspace state', old: 'Undo record', oldHint: 'Logical ranges saved before overwrite',
      },
      macos: {
        description: 'macOS through mode: the project and cloned baseline can share data; FSEvents identifies changed paths.',
        lines: ['The project file references the old version. No changes are pending.', 'Cloning creates a separate baseline file that initially shares the old data.', 'The agent writes new content; the baseline still references the old version.', 'Inspect the diff, then choose a result from the same pending state.', 'Commit updates the accepted baseline; the project already has the new version.', 'Abort clones the old version and replaces the project file path.'],
        liveLabel: 'PROJECT', baseLabel: 'BASELINE', eventsLabel: 'EVENTS',
        live: 'Project LIVE', liveHint: 'File changed directly by the agent', base: 'Accepted baseline', baseHint: 'Separate file, initially shared data', eventsHint: 'Changed paths, never file contents',
        pointsTo: 'References →', shared: 'Shared A/B', oldVersion: 'Old C/D/E', newVersion: 'New C′/D′/E′', baseShort: 'BASE', restore: 'Restore clone',
      },
    },
  },
}

export function getLocale() {
  const requested = new URLSearchParams(location.search).get('lang')
  if (requested === 'zh' || requested === 'en') {
    try { localStorage.setItem('deltabox-language', requested) } catch {}
    return requested
  }
  try {
    const stored = localStorage.getItem('deltabox-language')
    if (stored === 'zh' || stored === 'en') return stored
  } catch {}
  return 'zh'
}

export function switchLocale(locale) {
  if (locale !== 'zh' && locale !== 'en') return
  if (getLocale() === locale) return
  try { localStorage.setItem('deltabox-language', locale) } catch {}
  const url = new URL(location.href)
  url.searchParams.set('lang', locale)
  location.assign(url.href)
}

export function applyMetadata(locale) {
  const { title, description } = messages[locale].meta
  document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en'
  document.title = title
  document.querySelector('meta[name="description"]').content = description
}
