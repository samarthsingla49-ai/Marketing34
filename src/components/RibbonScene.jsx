import { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import * as THREE from 'three'

/*
  3D Torus — the "Atuin-style" sculptural ring that overlaps the hero text.

  Z-index layering (same as before, works with the torus just as it did
  with the ribbon):
    canvas   → z-index: 5
    line-back  → z-index: 1  (torus COVERS these lines)
    line-front → z-index: 15 (torus goes BEHIND this line)
*/

function Torus ({ mouse }) {
  const mesh = useRef(null)

  // Mobile: reduce geometry quality for performance
  const [segments] = useState(() => {
    const mobile = typeof window !== 'undefined' && window.innerWidth < 768
    return mobile ? { radial: 16, tubular: 60 } : { radial: 32, tubular: 120 }
  })

  useFrame(() => {
    if (!mesh.current) return
    // Slow organic rotation
    mesh.current.rotation.y += 0.0035
    mesh.current.rotation.z += 0.0008
    // Smooth mouse parallax (lerp toward target)
    mesh.current.position.x += (mouse.current.x * 0.7 - mesh.current.position.x) * 0.045
    mesh.current.position.y += (mouse.current.y * 0.35 - mesh.current.position.y) * 0.045
  })

  return (
    <mesh ref={mesh} rotation={[Math.PI * 0.28, 0, 0]}>
      {/* Ring radius 1.45, tube radius 0.52 — fills ~60% of viewport height */}
      <torusGeometry args={[1.45, 0.52, segments.radial, segments.tubular]} />
      <meshPhysicalMaterial
        color="#1E56FF"
        roughness={0.05}
        metalness={0.18}
        clearcoat={1.0}
        clearcoatRoughness={0.04}
        envMapIntensity={2.0}
        side={THREE.FrontSide}
      />
    </mesh>
  )
}

export default function RibbonScene () {
  // Mouse position shared between DOM listener and R3F loop
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = e => {
      mouse.current.x =  (e.clientX / window.innerWidth  - 0.5) * 2
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
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
      {/* Three-point lighting for the glossy lacquer look */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]}   intensity={2.5} color="#ffffff" />
      <directionalLight position={[-5, -2, 3]} intensity={1.2} color="#4D7AFF" />
      <pointLight      position={[0,  4, 6]}   intensity={8}   color="#ffffff" distance={18} />

      {/* Studio HDR for sharp reflections on the clearcoat layer */}
      <Environment preset="studio" />

      <Torus mouse={mouse} />
    </Canvas>
  )
}
