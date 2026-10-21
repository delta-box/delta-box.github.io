import * as THREE from 'three'

// File handles reference one shared data pool. These are logical ranges, not disk extents.
export function buildMacScene({ content, cube, textTexture, copy, phase, previous, animate, tween }) {
  const liveColor = 0x238964
  const baseColor = 0xb07836
  const live = new THREE.Vector3(-2.1, 2.1, 0)
  const base = new THREE.Vector3(2.1, 2.1, 0)
  const shared = new THREE.Vector3(-3.2, -.9, 0)
  const old = new THREE.Vector3(0, -.9, 0)
  const fresh = new THREE.Vector3(3.2, -.9, 0)
  const hasBase = phase !== 'initial'
  const hasNew = ['write', 'pending', 'commit'].includes(phase)
  const committed = phase === 'commit'
  const aborted = phase === 'abort'
  function label(text, position, width = 2.5) {
    const node = new THREE.Sprite(new THREE.SpriteMaterial({ map: textTexture(text), depthTest: false }))
    node.position.copy(position)
    node.scale.set(width, width / 4, 1)
    content.add(node)
    return node
  }
  function opacity(group, amount) {
    group.traverse((part) => {
      if (!part.material) return
      if (part.userData.originalOpacity === undefined) part.userData.originalOpacity = part.material.opacity
      part.material.transparent = true
      part.material.opacity = part.userData.originalOpacity * amount
      part.material.depthWrite = amount >= 1 && !part.material.map
    })
    group.visible = amount > 0
  }
  function fade(group, from, to, delay = 0) {
    opacity(group, animate ? from : to)
    if (animate) tween((t) => opacity(group, from + (to - from) * t), delay)
  }
  function handle(position, text, color, active) {
    const node = new THREE.Mesh(new THREE.SphereGeometry(.12, 16, 12), new THREE.MeshStandardMaterial({ color }))
    node.position.copy(position)
    content.add(node)
    const caption = label(text, position.clone().add(new THREE.Vector3(0, .45, 0)))
    if (!active) { opacity(node, .18); opacity(caption, .35) }
    if (phase === 'save' && text === copy.base && animate) { fade(node, 0, 1); fade(caption, .35, 1) }
  }
  handle(live, copy.live, liveColor, true)
  handle(base, copy.base, baseColor, hasBase)
  function blocks(letters, center, color, title) {
    const group = new THREE.Group()
    letters.forEach((letter, index) => {
      const block = cube(letter, color)
      block.position.copy(center).add(new THREE.Vector3((index - (letters.length - 1) / 2) * .84, 0, 0))
      group.add(block)
    })
    content.add(group)
    label(title, center.clone().add(new THREE.Vector3(0, -1.05, 0)), 2.8)
    return group
  }
  blocks(['A', 'B'], shared, 0xb6cebb, copy.shared)
  const oldBlocks = blocks(['C', 'D', 'E'], old, 0xe2bd84, copy.oldVersion)
  const newBlocks = blocks(['C′', 'D′', 'E′'], fresh, 0x73b7cf, copy.newVersion)
  opacity(newBlocks, hasNew ? 1 : 0)
  opacity(oldBlocks, committed ? 0 : 1)
  function link(from, to, color, bend = 0) {
    const end = to.clone().add(new THREE.Vector3(0, .4, 0))
    const curve = new THREE.CubicBezierCurve3(from, from.clone().add(new THREE.Vector3(0, -.9, bend)), end.clone().add(new THREE.Vector3(0, 1, bend)), end)
    const object = new THREE.Mesh(new THREE.TubeGeometry(curve, 28, .018, 6, false), new THREE.MeshBasicMaterial({ color, transparent: true }))
    content.add(object)
    return object
  }
  link(live, shared, liveColor, -.4)
  const baseShared = link(base, shared, baseColor, .5)
  opacity(baseShared, hasBase ? 1 : 0)
  if (phase === 'save' && animate) fade(baseShared, 0, 1)
  const liveOld = link(live, old, liveColor, -.35)
  const liveNew = link(live, fresh, liveColor, -.35)
  const baseOld = link(base, old, baseColor, .4)
  const baseNew = link(base, fresh, baseColor, .4)
  opacity(liveOld, hasNew ? 0 : 1)
  opacity(liveNew, hasNew ? 1 : 0)
  opacity(baseOld, hasBase && !committed ? 1 : 0)
  opacity(baseNew, committed ? 1 : 0)
  if (phase === 'save' && animate) fade(baseOld, 0, 1)
  if (phase === 'write' && animate) {
    opacity(newBlocks, .15)
    newBlocks.position.y = .8
    tween((t) => { newBlocks.position.y = .8 * (1 - t); opacity(newBlocks, .15 + .85 * t) })
    fade(liveOld, 1, 0, 700)
    fade(liveNew, 0, 1, 700)
  }
  if (committed && animate) {
    fade(baseOld, 1, 0)
    fade(baseNew, 0, 1)
    fade(oldBlocks, 1, 0, 900)
  }
  if (aborted && animate && ['write', 'pending'].includes(previous)) {
    fade(liveNew, 1, 0)
    fade(liveOld, 0, 1)
    fade(newBlocks, 1, 0, 900)
  }
}
