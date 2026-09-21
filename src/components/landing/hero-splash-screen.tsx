'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { BrandMark } from '@/components/brand/BrandMark'
import { useMotionLevel } from '@/hooks/use-motion-level'
import { cn } from '@/lib/utils'

function HeroSplashFallback ({
  animate = true,
  transparent = false
}: {
  animate?: boolean
  transparent?: boolean
}) {
  return (
    <div
      className={cn(
        'absolute inset-0 flex items-center justify-center',
        !transparent && 'bg-[#fffafd]'
      )}
    >
      <div data-splash-logo className="relative aspect-square w-[min(42%,13.5rem)]">
        <span
          className={cn(
            'pointer-events-none absolute inset-0 rounded-full border-2 border-brand-blush border-t-brand-pink',
            animate && 'hero-splash-spin'
          )}
          aria-hidden
        />
        <div className={cn('flex h-full w-full items-center justify-center p-[18%]', animate && 'hero-splash-float')}>
          <BrandMark size={160} className="h-full! w-full!" />
        </div>
      </div>
    </div>
  )
}

const HeroSplashCanvas = dynamic(
  () => import('./hero-splash-canvas').then((module) => module.HeroSplashCanvas),
  { ssr: false, loading: () => null }
)

export function HeroSplashScreen ({ transparent = false }: { transparent?: boolean } = {}) {
  const level = useMotionLevel()
  const [allowFallback, setAllowFallback] = useState(!transparent)

  useEffect(() => {
    if (!transparent) return
    if (document.documentElement.dataset.motion !== 'full') setAllowFallback(true)
  }, [transparent])

  const showCanvas = level === 'full'
  const showFallback = allowFallback && !showCanvas

  return (
    <div
      data-no-tilt
      className={cn(
        'absolute inset-0 cursor-pointer overflow-hidden',
        !transparent && 'bg-[#fffafd]'
      )}
    >
      {showCanvas ? (
        <HeroSplashCanvas />
      ) : showFallback ? (
        <HeroSplashFallback animate={level !== 'none'} transparent={transparent} />
      ) : null}
    </div>
  )
}
