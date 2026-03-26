import { useRef, useEffect, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import * as THREE from 'three'

/*
  The ribbon is a TubeGeometry along a CatmullRomCurve3 closed loop.

  Weaving illusion is achieved entirely through DOM z-index:
    canvas          z-index: 5   ← the 3-D ribbon lives here
    text "behind"   z-index: 1   ← ribbon is visually IN FRONT  of these lines
    text "in front" z-index: 15  ← ribbon is visually BEHIND these lines

  The spline path has mild Z-axis variation to give genuine depth cues
  (highlights + foreshortening) that reinforce the weave.
*/

// Base control points for the CatmullRom spline.
// The loop is a tilted, elongated oval centred near the hero text.
const BASE = [
  [ 3.2,  0.3,  0.00],
  [ 2.4,  1.9,  0.35],
  [ 0.6,  2.4,  0.15],
  [-1.2,  1.7, -0.30],
  [-3.1,  0.1,  0.00],
  [-2.3, -1.5, -0.40],
  [-0.1, -2.1, -0.10],
  [ 2.1, -1.3,  0.30],
].map(([x, y, z]) => new THREE.Vector3(x, y, z))

// Mesh quality — fewer segments on mobile for perf
const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
const TUBE_SEGS   = isMobile ? 80  : 200
const RADIAL_SEGS = isMobile ? 12  : 20
const TUBE_RADIUS = 0.38

function RibbonMesh ({ mouse }) {
  const mesh = useRef(null)
  // Reuse a Float32Array-backed geometry reference per frame
  const geoRef = useRef(null)

  useFrame(({ clock }) => {
    if (!mesh.current) return
    const t = clock.getElapsedTime()

    // ── Animate control points with gentle sine/cosine offsets ──────────────
    const pts = BASE.map((p, i) => new THREE.Vector3(
      p.x + Math.sin(t * 0.35 + i * 0.95) * 0.07,
      p.y + Math.cos(t * 0.28 + i * 0.80) * 0.10,
      p.z + Math.sin(t * 0.45 + i * 1.10) * 0.05,
    ))

    const curve = new THREE.CatmullRomCurve3(pts, true, 'catmullrom', 0.5)
    const next  = new THREE.TubeGeometry(curve, TUBE_SEGS, TUBE_RADIUS, RADIAL_SEGS, true)

    if (geoRef.current) geoRef.current.dispose()
    geoRef.current    = next
    mesh.current.geometry = next

    // ── Mouse parallax ───────────────────────────────────────────────────────
    mesh.current.position.x += (mouse.current.x * 0.55 - mesh.current.position.x) * 0.04
    mesh.current.position.y += (mouse.current.y * 0.35 - mesh.current.position.y) * 0.04

    // ── Slow global rotation keeps the spline feeling alive ──────────────────
    mesh.current.rotation.z += 0.0006
  })

  // Initial geometry (will be replaced first frame)
  const initialGeo = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(BASE, true, 'catmullrom', 0.5)
    return new THREE.TubeGeometry(curve, TUBE_SEGS, TUBE_RADIUS, RADIAL_SEGS, true)
  }, [])

  return (
    <mesh ref={mesh} geometry={initialGeo}>
      <meshPhysicalMaterial
        color="#1E56FF"
        roughness={0.05}
        metalness={0.15}
        clearcoat={1.0}
        clearcoatRoughness={0.04}
        envMapIntensity={2.2}
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
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 52 }}
      dpr={[1, isMobile ? 1.5 : 2]}
      gl={{ alpha: true, antialias: true }}
      style={{
        position     : 'absolute',
        inset        : 0,
        zIndex       : 5,
        pointerEvents: 'none',
      }}
    >
      {/* Three-point lighting for the glossy cobalt look */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[ 6,  6,  4]} intensity={3.0} color="#ffffff" />
      <directionalLight position={[-5, -3,  3]} intensity={1.5} color="#5588ff" />
      <pointLight      position={[ 0,  5,  6]} intensity={10}  color="#ffffff" distance={22} />
      <pointLight      position={[ 2, -4,  3]} intensity={4}   color="#1E56FF" distance={15} />

      {/* Studio HDRI gives the clearcoat those sharp, mirror-like reflections */}
      <Environment preset="studio" />

      <RibbonMesh mouse={mouse} />
    </Canvas>
  )
}
