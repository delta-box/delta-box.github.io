import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import './metal-logo.css'

export function initMetalLogo() {
  const hero = document.querySelector('.hero')
  const canvas = document.createElement('canvas')
  canvas.className = 'metal-logo'
  canvas.setAttribute('aria-hidden', 'true')
  let renderer
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
  } catch {
    return // Keep the text logo and ordinary hero usable without WebGL.
  }
  document.body.append(canvas)
  hero.classList.add('has-metal-logo')
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0x000000, 0)
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = .95
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(36, 1, .1, 100)
  camera.position.z = 10
  const pmrem = new THREE.PMREMGenerator(renderer)
  const room = new RoomEnvironment()
  const environment = pmrem.fromScene(room, .04)
  scene.environment = environment.texture
  room.dispose()
  pmrem.dispose()

  const shape = new THREE.Shape()
  shape.moveTo(0, 1.8)
  shape.lineTo(-1.65, -1.05)
  shape.lineTo(1.65, -1.05)
  shape.closePath()
  const hole = new THREE.Path()
  hole.moveTo(0, .87)
  hole.lineTo(.84, -.57)
  hole.lineTo(-.84, -.57)
  hole.closePath()
  shape.holes.push(hole)
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: .34, bevelEnabled: true, bevelThickness: .08, bevelSize: .065, bevelSegments: 4, steps: 1,
  })
  geometry.translate(0, 0, -.17)
  const metal = new THREE.MeshStandardMaterial({ color: 0xbfc7bb, metalness: 1, roughness: .18 })
  const logo = new THREE.Group()
  logo.add(new THREE.Mesh(geometry, metal))
  scene.add(logo)
  const key = new THREE.DirectionalLight(0xf6ffe3, 2.5)
  key.position.set(-3, 5, 5)
  scene.add(key)
  const rim = new THREE.DirectionalLight(0xb9d6ee, 3)
  rim.position.set(4, -1, 2)
  scene.add(rim)

  const labels = []
  function label(text, x, y, angle) {
    const surface = document.createElement('canvas')
    surface.width = 512
    surface.height = 96
    const ctx = surface.getContext('2d')
    ctx.fillStyle = '#20271e'
    ctx.font = '600 54px monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text.split('').join(' '), 256, 48)
    const texture = new THREE.CanvasTexture(surface)
    texture.colorSpace = THREE.SRGBColorSpace
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -1 })
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(.95, .18), material)
    mesh.position.set(x, y, .255)
    mesh.rotation.z = angle
    logo.add(mesh)
    labels.push(material)
  }
  label('WRITE', -.67, .27, Math.PI / 3)
  label('DIFF', .67, .27, -Math.PI / 3)
  label('DECIDE', 0, -.83, 0)

  const preference = matchMedia('(prefers-reduced-motion: reduce)')
  let frame = 0
  const clamp = (n) => Math.max(0, Math.min(1, n))
  function render() {
    frame = 0
    const width = innerWidth
    const height = innerHeight
    const mobile = width <= 900
    const progress = clamp(scrollY / (hero.offsetHeight * .85))
    const motion = preference.matches ? 0 : progress
    const visibleHeight = 2 * Math.tan(THREE.MathUtils.degToRad(18)) * camera.position.z
    const unit = visibleHeight / height
    const startX = mobile ? width / 2 : width * .77
    const startY = mobile ? 228 : Math.min(height * .48, 410)
    const size = mobile ? Math.min(width * .57, 240) : Math.min(width * .31, 440)
    logo.position.set((startX - width / 2) * unit * (1 - motion), (height / 2 - startY + motion * 100) * unit, motion * 3)
    logo.scale.setScalar(size * unit / 3.3 * (1 + motion * .5))
    logo.rotation.set(-.16 + motion * Math.PI * 1.7, -.3 + motion * Math.PI * 1.4, -.12 - motion * Math.PI * .65)
    labels.forEach((material) => { material.opacity = 1 - clamp(motion / .52) })
    const opacity = preference.matches ? 1 - progress : 1 - clamp((progress - .52) / .38)
    canvas.style.opacity = String(opacity)
    canvas.style.visibility = opacity <= 0 ? 'hidden' : 'visible'
    if (opacity > 0) renderer.render(scene, camera)
  }
  function schedule() {
    if (!frame) frame = requestAnimationFrame(render)
  }
  function resize() {
    renderer.setSize(innerWidth, innerHeight)
    camera.aspect = innerWidth / innerHeight
    camera.updateProjectionMatrix()
    schedule()
  }
  window.addEventListener('scroll', schedule, { passive: true })
  window.addEventListener('resize', resize)
  preference.addEventListener('change', schedule)
  resize()
}
