import { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import * as THREE from 'three'

/*
  3D Torus — scroll-driven sculpted ring that overlaps the hero text.

  Z-index layering:
    canvas   → z-index: 5
    line-back  → z-index: 1  (torus COVERS these)
    line-front → z-index: 15 (torus goes BEHIND this)

  Scroll behaviour:
    As the hero scrolls out of view (progress 0→1), the torus:
      • Rotates faster
      • Drifts toward the top-right and recedes on Z
      • Scales down gradually
*/

const heroScroll = { value: 0 }

function Torus ({ mouse }) {
  const mesh = useRef(null)

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const segments = isMobile ? { radial: 16, tubular: 60 } : { radial: 32, tubular: 120 }

  useFrame(() => {
    if (!mesh.current) return
    const p = heroScroll.value

    // Rotation — speeds up as we scroll
    mesh.current.rotation.y += 0.0035 + p * 0.009
    mesh.current.rotation.z += 0.0008 + p * 0.004

    // Mouse parallax fades out as we scroll
    const fade   = 1 - p * 0.85
    const tx     = mouse.current.x * 0.7 * fade + p * 3.8
    const ty     = mouse.current.y * 0.35 * fade + p * 1.8
    const tz     = p * -2.5

    mesh.current.position.x += (tx - mesh.current.position.x) * 0.045
    mesh.current.position.y += (ty - mesh.current.position.y) * 0.045
    mesh.current.position.z += (tz - mesh.current.position.z) * 0.045

    // Scale & opacity
    const scale = Math.max(0.01, 1 - p * 0.55)
    mesh.current.scale.setScalar(scale)
    if (mesh.current.material) {
      mesh.current.material.opacity = Math.max(0, 1 - p * 1.6)
    }
  })

  return (
    <mesh ref={mesh} rotation={[Math.PI * 0.28, 0, 0]}>
      <torusGeometry args={[1.45, 0.52, segments.radial, segments.tubular]} />
      <meshPhysicalMaterial
        color="#1E56FF"
        roughness={0.05}
        metalness={0.18}
        clearcoat={1.0}
        clearcoatRoughness={0.04}
        envMapIntensity={2.0}
        transparent
        opacity={1}
        side={THREE.FrontSide}
      />
    </mesh>
  )
}

export default function RibbonScene () {
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = e => {
      mouse.current.x =  (e.clientX / window.innerWidth  - 0.5) * 2
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2
    }
    const onScroll = () => {
      const hero = document.getElementById('hero-section')
      if (!hero) return
      const rect = hero.getBoundingClientRect()
      heroScroll.value = Math.max(0, Math.min(1, -rect.top / hero.offsetHeight))
    }
    window.addEventListener('mousemove', onMove,   { passive: true })
    window.addEventListener('scroll',    onScroll, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('scroll',    onScroll)
    }
  }, [])

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
      style={{
        position     : 'absolute',
        inset        : 0,
        zIndex       : 5,
        pointerEvents: 'none',
      }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]}   intensity={2.5} color="#ffffff" />
      <directionalLight position={[-5, -2, 3]} intensity={1.2} color="#4D7AFF" />
      <pointLight      position={[0,  4, 6]}   intensity={8}   color="#ffffff" distance={18} />
      <Environment preset="studio" />
      <Torus mouse={mouse} />
    </Canvas>
  )
}
