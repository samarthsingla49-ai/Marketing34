import { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import * as THREE from 'three'

/*
  ServicesCanvas
  ─────────────
  A fixed-size WebGL canvas that lives inside the Services section.
  Four floating geometric shapes enter from below, staggered, as the
  section scrolls into view.  Each shape maps 1-to-1 to a service card.

  scroll state: svcProgress.value  (0 = section not yet visible, 1 = fully in view)
*/

export const svcProgress = { value: 0 }

/* ── colour / geometry config ──────────────────────────────────────────── */
const SHAPES = [
  { geo: 'icosahedron', color: '#1E56FF', pos: [-1.35,  1.25, 0], delay: 0    },
  { geo: 'octahedron',  color: '#4ade80', pos: [ 1.35,  1.25, 0], delay: 0.18 },
  { geo: 'dodecahedron',color: '#ff6b6b', pos: [-1.35, -1.25, 0], delay: 0.36 },
  { geo: 'sphere',      color: '#fbbf24', pos: [ 1.35, -1.25, 0], delay: 0.54 },
]

/* ── single shape ───────────────────────────────────────────────────────── */
function Shape ({ geo, color, pos, delay }) {
  const mesh    = useRef(null)
  const entered = useRef(0)   // smooth progress [0,1]

  useFrame(({ clock }, delta) => {
    if (!mesh.current) return

    // Advance smooth progress toward target
    const raw    = Math.max(0, Math.min(1, (svcProgress.value - delay) / 0.55))
    entered.current += (raw - entered.current) * 0.06
    const pr = entered.current

    // Gentle hover
    const hover = Math.sin(clock.elapsedTime * 0.75 + delay * 3.5) * 0.18

    mesh.current.position.set(pos[0], pos[1] + hover, pos[2])
    mesh.current.scale.setScalar(Math.max(0.001, pr))
    if (mesh.current.material) mesh.current.material.opacity = Math.min(1, pr * 1.8)

    // Slow spin
    mesh.current.rotation.y += delta * 0.45
    mesh.current.rotation.x += delta * 0.18
  })

  return (
    <mesh ref={mesh} position={pos}>
      {geo === 'icosahedron'  && <icosahedronGeometry  args={[0.6,  0]} />}
      {geo === 'octahedron'   && <octahedronGeometry   args={[0.6,  0]} />}
      {geo === 'dodecahedron' && <dodecahedronGeometry args={[0.52, 0]} />}
      {geo === 'sphere'       && <sphereGeometry       args={[0.52, 32, 32]} />}
      <meshPhysicalMaterial
        color={color}
        roughness={0.08}
        metalness={0.25}
        clearcoat={0.9}
        clearcoatRoughness={0.05}
        envMapIntensity={1.8}
        transparent
        opacity={0}
        side={THREE.FrontSide}
      />
    </mesh>
  )
}

/* ── thin connecting lines between shapes (as a single line-segments mesh) */
function Connectors () {
  const lineRef = useRef(null)
  const alpha   = useRef(0)

  useFrame(() => {
    if (!lineRef.current) return
    const target = svcProgress.value > 0.7 ? 1 : 0
    alpha.current += (target - alpha.current) * 0.04
    lineRef.current.material.opacity = alpha.current * 0.18
  })

  const pts = [
    new THREE.Vector3(-1.35,  1.25, 0),
    new THREE.Vector3( 1.35,  1.25, 0),
    new THREE.Vector3( 1.35, -1.25, 0),
    new THREE.Vector3(-1.35, -1.25, 0),
    new THREE.Vector3(-1.35,  1.25, 0),
    new THREE.Vector3( 1.35, -1.25, 0),
    new THREE.Vector3( 1.35,  1.25, 0),
    new THREE.Vector3(-1.35, -1.25, 0),
  ]
  const geom = new THREE.BufferGeometry().setFromPoints(pts)

  return (
    <lineSegments ref={lineRef} geometry={geom}>
      <lineBasicMaterial color="#ffffff" transparent opacity={0} />
    </lineSegments>
  )
}

/* ── exported canvas ────────────────────────────────────────────────────── */
export default function ServicesCanvas () {
  useEffect(() => {
    const onScroll = () => {
      const sec = document.getElementById('services-section')
      if (!sec) return
      const rect   = sec.getBoundingClientRect()
      const height = sec.offsetHeight
      // 0 when top of section is at bottom of viewport → 1 when top is at top
      const raw    = 1 - rect.top / window.innerHeight
      svcProgress.value = Math.max(0, Math.min(1, raw))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()   // run once on mount in case already visible
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 48 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
      style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[6, 6, 6]}   intensity={2.2} color="#ffffff" />
      <directionalLight position={[-4, -3, 3]} intensity={1.0} color="#4D7AFF" />
      <pointLight       position={[0,  0, 8]}  intensity={6}   color="#ffffff" distance={20} />
      <Environment preset="studio" />

      {SHAPES.map(s => (
        <Shape key={s.geo} {...s} />
      ))}
      <Connectors />
    </Canvas>
  )
}
