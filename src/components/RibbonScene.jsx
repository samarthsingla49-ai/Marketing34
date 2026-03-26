import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import * as THREE from 'three'

// ─── How the weave works ──────────────────────────────────────────────────────
//
//  The Canvas sits at z-index:5 (absolutely fills the hero section).
//  "We unlock" and "talent." live at z-index:1  → ribbon COVERS them.
//  "[top] marketing"           lives at z-index:15 → ribbon goes BEHIND it.
//
//  Inside the 3-D scene the ribbon's Z position oscillates so it visually
//  plunges toward and away from the camera, giving authentic depth.
//
// ─────────────────────────────────────────────────────────────────────────────

const SEGS   = 220   // curve subdivisions — higher = smoother
const HALF_W = 1.25  // half-width of the ribbon in world units
const N_CTRL = 12    // number of Catmull-Rom control points

function Ribbon () {
  // Pre-allocate control-point Vector3s so we never GC inside the hot loop
  const ctrlPts = useMemo(
    () => Array.from({ length: N_CTRL + 1 }, () => new THREE.Vector3()),
    []
  )
  const curve = useMemo(
    () => new THREE.CatmullRomCurve3(ctrlPts, false, 'catmullrom', 0.5),
    [ctrlPts]
  )

  // Build the flat-ribbon BufferGeometry once; update positions every frame
  const { geo, posAttr, nrmAttr } = useMemo(() => {
    const pos = new Float32Array((SEGS + 1) * 6)
    const nrm = new Float32Array((SEGS + 1) * 6)
    const uv  = new Float32Array((SEGS + 1) * 4)
    const idx = []

    for (let i = 0; i <= SEGS; i++) {
      const t = i / SEGS
      uv[i * 4] = 0;  uv[i * 4 + 1] = t
      uv[i * 4 + 2] = 1; uv[i * 4 + 3] = t
    }
    for (let i = 0; i < SEGS; i++) {
      const a = i * 2, b = i * 2 + 1, c = i * 2 + 2, d = i * 2 + 3
      idx.push(a, b, c,  b, d, c)
    }

    const geo     = new THREE.BufferGeometry()
    const posAttr = new THREE.BufferAttribute(pos, 3)
    const nrmAttr = new THREE.BufferAttribute(nrm, 3)
    posAttr.setUsage(THREE.DynamicDrawUsage)
    nrmAttr.setUsage(THREE.DynamicDrawUsage)
    geo.setAttribute('position', posAttr)
    geo.setAttribute('normal',   nrmAttr)
    geo.setAttribute('uv',       new THREE.BufferAttribute(uv, 2))
    geo.setIndex(idx)

    return { geo, posAttr, nrmAttr }
  }, [])

  useFrame(({ clock }) => {
    const t   = clock.getElapsedTime()
    const pos = posAttr.array
    const nrm = nrmAttr.array

    // ── 1. Animate Catmull-Rom control points ────────────────────────────────
    for (let i = 0; i <= N_CTRL; i++) {
      const s = i / N_CTRL
      ctrlPts[i].set(
        // S-curve in X with a gentle secondary harmonic
        Math.sin(s * Math.PI * 2.0   + t * 0.36) * 2.3
        + Math.sin(s * Math.PI * 4.5 + t * 0.18) * 0.5,
        // Ribbon spans the full height of the viewport (-5 → +5 world units)
        (s - 0.5) * 11,
        // Z oscillation → ribbon plunges toward / away from camera
        Math.cos(s * Math.PI * 2.5   + t * 0.28) * 1.6
        + Math.cos(s * Math.PI * 5.5 + t * 0.14) * 0.35
      )
    }

    // ── 2. Evaluate Frenet frames along the updated curve ────────────────────
    const frames = curve.computeFrenetFrames(SEGS, false)

    for (let i = 0; i <= SEGS; i++) {
      const s  = i / SEGS
      const p  = curve.getPoint(s)
      const bn = frames.binormals[i]
      const n  = frames.normals[i]

      // Gentle continuous twist — keeps the broad face visible, not edge-on
      const tw  = s * Math.PI * 1.1 + t * 0.10
      const c   = Math.cos(tw), sn = Math.sin(tw)

      // Twisted binormal (ribbon's width direction)
      const bx = bn.x * c + n.x * sn
      const by = bn.y * c + n.y * sn
      const bz = bn.z * c + n.z * sn

      // Twisted normal (for lighting)
      const nx = -bn.x * sn + n.x * c
      const ny = -bn.y * sn + n.y * c
      const nz = -bn.z * sn + n.z * c

      const vi = i * 6
      // Left edge
      pos[vi]     = p.x - bx * HALF_W
      pos[vi + 1] = p.y - by * HALF_W
      pos[vi + 2] = p.z - bz * HALF_W
      // Right edge
      pos[vi + 3] = p.x + bx * HALF_W
      pos[vi + 4] = p.y + by * HALF_W
      pos[vi + 5] = p.z + bz * HALF_W
      // Normals (same for both edges → smooth flat-shaded look)
      nrm[vi]     = nx; nrm[vi + 1] = ny; nrm[vi + 2] = nz
      nrm[vi + 3] = nx; nrm[vi + 4] = ny; nrm[vi + 5] = nz
    }

    posAttr.needsUpdate = true
    nrmAttr.needsUpdate = true
  })

  return (
    // frustumCulled={false} prevents Three.js culling the mesh while its
    // bounding box is being rebuilt dynamically every frame
    <mesh geometry={geo} frustumCulled={false}>
      <meshPhysicalMaterial
        color="#0044ee"
        roughness={0.04}
        metalness={0.12}
        clearcoat={1.0}
        clearcoatRoughness={0.04}
        envMapIntensity={2.5}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

export default function RibbonScene () {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 60 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
      style={{
        position : 'absolute',
        inset    : 0,
        zIndex   : 5,
        pointerEvents: 'none',
      }}
    >
      {/* Three-point lighting gives the ribbon its glossy, dimensional look */}
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 5, 5]}   intensity={2.2} />
      <pointLight position={[-6, 1, 4]}  color="#5588ff" intensity={10} distance={22} />
      <pointLight position={[ 5, -3, 4]} color="#ffffff"  intensity={10} distance={22} />

      {/*
        Environment adds realistic image-based reflections to the
        MeshPhysicalMaterial so the ribbon catches light like real lacquer.
        Loads a small HDR from the pmndrs CDN — works on Vercel with no config.
      */}
      <Environment preset="studio" />

      <Ribbon />
    </Canvas>
  )
}
