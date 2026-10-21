import * as THREE from 'three'
import { buildMacScene } from './filesystem-macos-3d.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

export function initFilesystem3D(host, copy) {
  let renderer
  try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }) } catch { return null }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
  renderer.setClearColor(0x000000, 0)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  host.append(renderer.domElement)
  renderer.domElement.setAttribute('aria-hidden', 'true')
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(36, 1, .1, 100)
  camera.position.set(7, 7, 10)
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableZoom = false
  controls.enablePan = false
  controls.minPolarAngle = .3
  controls.maxPolarAngle = Math.PI / 2.1
  controls.target.set(0, 0, 0)
  controls.update()
  scene.add(new THREE.HemisphereLight(0xffffff, 0x64796e, 3))
  const light = new THREE.DirectionalLight(0xffffff, 3)
  light.position.set(-3, 7, 5)
  scene.add(light)
  const fill = new THREE.DirectionalLight(0xabc7e0, 2)
  fill.position.set(5, 1, -3)
  scene.add(fill)
  const content = new THREE.Group()
  scene.add(content)
  const geometry = new THREE.BoxGeometry(.68, .68, .68)
  const edgeGeometry = new THREE.EdgesGeometry(geometry)
  const motion = matchMedia('(prefers-reduced-motion: reduce)')
  let frame = 0
  let flights = []
  let tweens = []
  let lastPhase = null
  let lastPlatform = null
  let lastRows = null
  const palette = { base: 0xb6cebb, new: 0x73b7cf, old: 0xe2bd84, ghost: 0xa8b2ae }
  const textures = []
  function textTexture(text, dark = true) {
    const canvas = document.createElement('canvas')
    const compact = text.length <= 2
    canvas.width = compact ? 128 : 512; canvas.height = 128
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = dark ? '#244638' : '#ffffff'
    ctx.font = compact ? '600 78px system-ui' : '600 42px system-ui'
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    ctx.fillText(text, canvas.width / 2, 64)
    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    textures.push(texture)
    return texture
  }
  function cube(text, color, opacity = 1) {
    const group = new THREE.Group()
    const material = new THREE.MeshStandardMaterial({ color, roughness: .35, metalness: .12, transparent: opacity < 1, opacity })
    group.add(new THREE.Mesh(geometry, material))
    group.add(new THREE.LineSegments(edgeGeometry, new THREE.LineBasicMaterial({ color: 0x517362, transparent: true, opacity: opacity * .4 })))
    const face = new THREE.Mesh(new THREE.PlaneGeometry(.48, .48), new THREE.MeshBasicMaterial({ map: textTexture(text), transparent: true, depthWrite: false, opacity }))
    face.rotation.x = -Math.PI / 2
    face.position.y = .342
    group.add(face)
    return group
  }
  function disposeGroup() {
    content.traverse((object) => {
      if (object.material) object.material.dispose()
      if (object.geometry && object.geometry !== geometry && object.geometry !== edgeGeometry) object.geometry.dispose()
    })
    textures.splice(0).forEach((texture) => texture.dispose())
    content.clear()
    flights = []
    tweens = []
  }
  function render(time) {
    frame = 0
    flights.forEach((flight) => {
      const t = Math.max(0, Math.min(1, (time - flight.start) / 1050))
      const ease = t * t * (3 - 2 * t)
      flight.object.position.lerpVectors(flight.from, flight.to, ease)
      flight.object.rotation.z = Math.sin(t * Math.PI) * .08
      if (flight.retiring) {
        flight.object.scale.setScalar(1 - ease * .35)
        flight.object.traverse((part) => {
          if (part.material) part.material.opacity = part.userData.initialOpacity * (1 - ease)
        })
      }
      if (t === 1) {
        flight.object.visible = false
        if (flight.target) flight.target.visible = true
        if (flight.underlay) flight.underlay.visible = false
      }
    })
    flights = flights.filter((flight) => time < flight.start + 1050)
    tweens.forEach((item) => {
      const t = Math.max(0, Math.min(1, (time - item.start) / 900))
      item.update(t * t * (3 - 2 * t))
    })
    tweens = tweens.filter((item) => time < item.start + 900)
    renderer.render(scene, camera)
    if (flights.length || tweens.length) frame = requestAnimationFrame(render)
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(render) }
  controls.addEventListener('change', schedule)
  new ResizeObserver(() => {
    const width = host.clientWidth
    if (!width) return
    renderer.setSize(width, host.clientHeight)
    camera.aspect = width / host.clientHeight
    camera.fov = width < 600 ? (lastPlatform === 'macos' ? 70 : 48) : 36
    camera.updateProjectionMatrix()
    schedule()
  }).observe(host)
  return {
    update(rows, phase, platform) {
      const previous = lastPhase
      const previousRows = lastRows
      lastRows = rows
      const samePlatform = platform === lastPlatform
      lastPhase = phase; lastPlatform = platform
      disposeGroup()
      camera.fov = host.clientWidth < 600 ? (platform === 'macos' ? 70 : 48) : 36
      camera.updateProjectionMatrix()
      if (platform === 'macos') {
        buildMacScene({ content, cube, textTexture, copy: copy.macos, phase, previous,
          animate: !motion.matches && samePlatform && previous !== phase,
          tween: (update, delay = 0) => tweens.push({ update, start: performance.now() + delay }),
        })
        schedule()
        return
      }
      const cubes = []
      rows.forEach((row, layer) => {
        const y = 2.1 - layer * 2.1
        const label = new THREE.Sprite(new THREE.SpriteMaterial({ map: textTexture(row.title), depthTest: false }))
        label.position.set(-.25, y + .8, 0)
        label.scale.set(3.1, .78, 1)
        content.add(label)
        cubes[layer] = []
        row.blocks.forEach((block, index) => {
          const x = (index - 2) * 1.05 + (row.blocks.length === 3 ? 2.1 : 0)
          const color = row.muted ? palette.ghost : palette[block.kind]
          const object = cube(block.text, color, row.muted ? .22 : 1)
          object.position.set(x, y, 0)
          content.add(object)
          cubes[layer].push(object)
        })
      })
      // Incoming blocks are consumed by the write, not duplicated above LIVE.
      if (platform === 'linux' && ['write', 'pending', 'commit', 'abort'].includes(phase)) {
        cubes[0].forEach((object) => { object.visible = false })
      }
      // Committed undo records are gone, including when motion is disabled or the view is rebuilt.
      if (phase === 'commit' && platform === 'linux') cubes[2].forEach((object) => { object.visible = false })
      function retire(layer, offset = 0) {
        cubes[layer].slice(offset).forEach((position, index) => {
          const oldBlock = previousRows?.[layer]?.blocks[index + offset] || rows[layer].blocks[index + offset]
          const object = cube(oldBlock.text, palette.old)
          object.position.copy(position.position)
          object.traverse((part) => {
            if (!part.material) return
            part.userData.initialOpacity = part.material.opacity
            part.material.transparent = true
            part.material.depthWrite = false
          })
          content.add(object)
          flights.push({ object, retiring: true, from: position.position.clone(), to: position.position.clone().add(new THREE.Vector3(.7, -.9, -.3)), start: performance.now() + index * 120 })
        })
      }
      function preserveUntilLanding(target, layer, index) {
        const old = previousRows?.[layer]?.blocks[index]
        if (!old) return null
        const underlay = cube(old.text, palette[old.kind])
        underlay.position.copy(target.position)
        content.add(underlay)
        return underlay
      }
      function fall(sourceLayer, targetLayer, sourceOffset = 0, targetOffset = 0, preview = false, delay = 0) {
        cubes[targetLayer].slice(targetOffset).forEach((target, index) => {
          const source = cubes[sourceLayer][index + sourceOffset]
          if (!source) return
          const block = rows[targetLayer].blocks[index + targetOffset]
          const text = preview ? rows[sourceLayer].blocks[index + sourceOffset].text : block.text
          const object = cube(text, preview || phase === 'write' ? palette.ghost : palette[rows[sourceLayer].blocks[index + sourceOffset].kind], preview ? .3 : 1)
          object.position.copy(source.position)
          content.add(object)
          const underlay = !preview && (phase === 'write' || phase === 'abort') ? preserveUntilLanding(target, targetLayer, index + targetOffset) : null
          if (!preview) target.visible = false
          flights.push({ object, target, underlay, from: source.position.clone(), to: target.position.clone(), start: performance.now() + delay + index * 110 })
        })
      }
      if (!motion.matches && (previous !== phase || !samePlatform)) {
        if (platform === 'linux') {
          if (phase === 'initial') fall(0, 1, 0, 2, true)
          if (phase === 'save' && previous === 'initial') {
            fall(1, 2, 2)
          }
          if (phase === 'write' && previous === 'save') fall(0, 1, 0, 2)
          if (phase === 'abort') fall(2, 1, 0, 2)
          if (phase === 'commit' && samePlatform) retire(2)
        }
      }
      schedule()
    },
  }
}
