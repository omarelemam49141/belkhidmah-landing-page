'use client'

import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { LOGO_SRC } from '@/lib/landing/assets'

const MAGENTA = '#91288d'
const PINK = '#db2c91'
const BG = '#fffafd'

function useLogoTexture () {
  const gl = useThree((state) => state.gl)
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null)

  useEffect(() => {
    let disposed = false
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => {
      if (disposed) return
      const size = 1024
      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.clearRect(0, 0, size, size)
      ctx.drawImage(img, 0, 0, size, size)
      const next = new THREE.CanvasTexture(canvas)
      next.colorSpace = THREE.SRGBColorSpace
      next.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy())
      next.needsUpdate = true
      setTexture(next)
    }
    img.onerror = () => {
      img.onerror = null
      img.src = LOGO_SRC.replace(/logo\.svg$/, 'logo.jpeg')
    }
    img.src = LOGO_SRC
    return () => {
      disposed = true
      setTexture((current) => {
        current?.dispose()
        return null
      })
    }
  }, [gl])

  return texture
}

function SplashRig () {
  const group = useRef<THREE.Group>(null)
  const ring = useRef<THREE.Group>(null)
  const lookX = useRef(0)
  const lookY = useRef(0)
  const spinValue = useRef(0)
  const spinTarget = useRef(0)
  const scaleValue = useRef(1)
  const texture = useLogoTexture()
  const { gl } = useThree()

  useEffect(() => {
    const el = gl.domElement
    el.style.cursor = 'pointer'
    const burst = () => {
      spinTarget.current += Math.PI * 2
      scaleValue.current = 1.14
    }
    el.addEventListener('pointerdown', burst)
    return () => el.removeEventListener('pointerdown', burst)
  }, [gl])

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    const pointer = state.pointer
    const g = group.current
    if (!g) return

    const idleX = Math.sin(t * 0.42) * 0.1
    const idleY = Math.sin(t * 0.55) * 0.22
    lookX.current = THREE.MathUtils.damp(lookX.current, idleX + pointer.y * 0.5, 8, dt)
    lookY.current = THREE.MathUtils.damp(lookY.current, idleY + pointer.x * 0.8, 8, dt)
    spinValue.current = THREE.MathUtils.damp(spinValue.current, spinTarget.current, 3.4, dt)
    scaleValue.current = THREE.MathUtils.damp(scaleValue.current, 1, 8, dt)

    g.rotation.x = lookX.current
    g.rotation.y = lookY.current + spinValue.current
    g.position.y = Math.sin(t * 1.15) * 0.04
    g.scale.setScalar(scaleValue.current * 0.28)

    if (ring.current) {
      ring.current.rotation.z -= dt * 1.2
    }
  })

  return (
    <group ref={group}>
      <mesh position={[0, -0.05, -0.12]}>
        <circleGeometry args={[1.05, 48]} />
        <meshBasicMaterial color={PINK} transparent opacity={0.16} />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.9, 0.9, 0.1, 48]} />
        <meshStandardMaterial color="#f8eef5" roughness={0.42} metalness={0.12} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.9, 0.045, 10, 48]} />
        <meshStandardMaterial
          color={MAGENTA}
          emissive={PINK}
          emissiveIntensity={0.22}
          metalness={0.35}
          roughness={0.32}
        />
      </mesh>

      {texture ? (
        <mesh position={[0, 0, 0.07]}>
          <planeGeometry args={[1.52, 1.52]} />
          <meshStandardMaterial
            map={texture}
            transparent
            depthWrite={false}
            roughness={0.38}
            metalness={0.08}
          />
        </mesh>
      ) : null}

      <group ref={ring} rotation={[0.46, 0.18, 0]}>
        <mesh>
          <torusGeometry args={[1.22, 0.026, 10, 96]} />
          <meshStandardMaterial
            color={PINK}
            emissive={PINK}
            emissiveIntensity={0.32}
            roughness={0.28}
            metalness={0.2}
          />
        </mesh>
        <mesh>
          <torusGeometry args={[1.22, 0.048, 8, 48, Math.PI * 0.58]} />
          <meshStandardMaterial
            color={MAGENTA}
            emissive={MAGENTA}
            emissiveIntensity={0.5}
            roughness={0.22}
          />
        </mesh>
        <mesh position={[1.22, 0, 0]}>
          <sphereGeometry args={[0.055, 16, 16]} />
          <meshStandardMaterial color="#ffffff" emissive={PINK} emissiveIntensity={0.7} />
        </mesh>
      </group>
    </group>
  )
}

export function HeroSplashCanvas () {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(true)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => setActive(Boolean(entry?.isIntersecting && entry.intersectionRatio > 0.12)),
      { threshold: [0, 0.12, 0.4] }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={wrapRef} className="absolute inset-0">
      <Canvas
        flat
        frameloop={active ? 'always' : 'never'}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 4.4], fov: 36 }}
        onCreated={({ scene }) => {
          scene.background = new THREE.Color(BG)
        }}
      >
        <ambientLight intensity={0.85} />
        <directionalLight position={[0.4, 1.2, 4]} intensity={1.05} />
        <pointLight position={[2, 2.1, 3]} intensity={1.6} color={PINK} />
        <pointLight position={[-2.1, -1.4, 2.4]} intensity={1.1} color={MAGENTA} />
        <SplashRig />
      </Canvas>
    </div>
  )
}
