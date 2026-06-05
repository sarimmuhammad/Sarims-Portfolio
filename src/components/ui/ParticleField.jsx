import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function ParticleField({ style = {} }) {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 1000)
    camera.position.z = 80

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    // Particles
    const COUNT = 1800
    const positions = new Float32Array(COUNT * 3)
    const colors    = new Float32Array(COUNT * 3)
    const sizes     = new Float32Array(COUNT)

    const colA = new THREE.Color('#34d399') // emerald
    const colB = new THREE.Color('#10b981') // emerald dark
    const colC = new THREE.Color('#1a3a2a') // very dark

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 200
      positions[i * 3 + 1] = (Math.random() - 0.5) * 120
      positions[i * 3 + 2] = (Math.random() - 0.5) * 80

      const t = Math.random()
      const col = t < 0.15 ? colA : t < 0.35 ? colB : colC
      colors[i * 3]     = col.r
      colors[i * 3 + 1] = col.g
      colors[i * 3 + 2] = col.b

      sizes[i] = Math.random() * 2.5 + 0.5
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    const mat = new THREE.PointsMaterial({
      size: 1.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
    })

    const points = new THREE.Points(geo, mat)
    scene.add(points)

    // Connection lines (limited, for performance)
    const lineGeo = new THREE.BufferGeometry()
    const linePositions = []
    const lineColors = []
    const threshold = 18
    const maxLines = 300

    let lineCount = 0
    for (let i = 0; i < COUNT && lineCount < maxLines; i++) {
      for (let j = i + 1; j < COUNT && lineCount < maxLines; j++) {
        const dx = positions[i*3] - positions[j*3]
        const dy = positions[i*3+1] - positions[j*3+1]
        const dz = positions[i*3+2] - positions[j*3+2]
        const dist = Math.sqrt(dx*dx + dy*dy + dz*dz)
        if (dist < threshold) {
          linePositions.push(
            positions[i*3], positions[i*3+1], positions[i*3+2],
            positions[j*3], positions[j*3+1], positions[j*3+2]
          )
          const alpha = 1 - dist / threshold
          lineColors.push(0.204*alpha, 0.831*alpha, 0.6*alpha, 0.204*alpha, 0.831*alpha, 0.6*alpha)
          lineCount++
        }
      }
    }

    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3))
    lineGeo.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3))
    const lineMat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.18 })
    const lines = new THREE.LineSegments(lineGeo, lineMat)
    scene.add(lines)

    // Mouse parallax
    const mouse = { x: 0, y: 0 }
    const onMouseMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth  - 0.5) * 2
      mouse.y = (e.clientY / window.clientHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouseMove)

    // Resize
    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    }
    window.addEventListener('resize', onResize)

    // Animate
    let frameId
    const animate = () => {
      frameId = requestAnimationFrame(animate)
      points.rotation.y += 0.0003
      points.rotation.x += 0.0001
      lines.rotation.y += 0.0003
      lines.rotation.x += 0.0001
      camera.position.x += (mouse.x * 8 - camera.position.x) * 0.04
      camera.position.y += (-mouse.y * 5 - camera.position.y) * 0.04
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={mountRef} style={{ position: 'absolute', inset: 0, ...style }} />
}
