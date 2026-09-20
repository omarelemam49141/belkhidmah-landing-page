'use client'

import { useCallback, useRef } from 'react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { cn } from '@/lib/utils'

type SpotlightTiltCardProps = {
  children: React.ReactNode
  className?: string
  spotColor?: string
}

export function SpotlightTiltCard ({
  children,
  className,
  spotColor = 'rgba(255,255,255,0.22)'
}: SpotlightTiltCardProps) {
  const reduced = useReducedMotion()
  const cardRef = useRef<HTMLDivElement>(null)

  const reset = useCallback(() => {
    const el = cardRef.current
    if (!el) return
    el.style.setProperty('--spot-x', '50%')
    el.style.setProperty('--spot-y', '18%')
    el.style.transform = 'perspective(1400px) rotateX(0deg) rotateY(0deg) translateZ(0)'
  }, [])

  function handlePointer (event: React.PointerEvent<HTMLDivElement>) {
    if (reduced || event.pointerType !== 'mouse') return
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width
    const py = (event.clientY - rect.top) / rect.height
    el.style.setProperty('--spot-x', `${px * 100}%`)
    el.style.setProperty('--spot-y', `${py * 100}%`)
    el.style.transform = `perspective(1400px) rotateX(${(0.5 - py) * 8}deg) rotateY(${(px - 0.5) * 10}deg) translateZ(8px)`
  }

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointer}
      onPointerLeave={reset}
      className={cn(
        'group relative h-full overflow-hidden rounded-2xl border border-white/12',
        'bg-white/7 shadow-[0_18px_50px_-20px_rgba(0,0,0,0.65)] backdrop-blur-xl',
        '[transform-style:preserve-3d] transition-[transform,box-shadow,border-color] duration-300 ease-out will-change-transform',
        className
      )}
      style={{
        ['--spot-x' as string]: '50%',
        ['--spot-y' as string]: '18%'
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 opacity-80 mix-blend-screen transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(280px circle at var(--spot-x) var(--spot-y), ${spotColor}, transparent 62%)`
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-px z-20 rounded-[15px] bg-linear-to-b from-white/12 via-transparent to-black/20"
      />
      <div className="relative z-10 flex h-full min-h-0 flex-col">{children}</div>
    </div>
  )
}
