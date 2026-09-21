'use client'

import dynamic from 'next/dynamic'
import { BrandMark } from '@/components/brand/BrandMark'
import { useMotionLevel } from '@/hooks/use-motion-level'
import { cn } from '@/lib/utils'

function HeroSplashFallback ({ animate = true }: { animate?: boolean }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#fffafd]">
      <div className="relative flex h-16 w-16 items-center justify-center">
        <span
          className={cn(
            'pointer-events-none absolute inset-0 rounded-full border-2 border-brand-blush border-t-brand-pink',
            animate && 'hero-splash-spin'
          )}
          aria-hidden
        />
        <div className={cn(animate && 'hero-splash-float')}>
          <BrandMark size={40} />
        </div>
      </div>
    </div>
  )
}

const HeroSplashCanvas = dynamic(
  () => import('./hero-splash-canvas').then((module) => module.HeroSplashCanvas),
  { ssr: false, loading: () => <HeroSplashFallback /> }
)

export function HeroSplashScreen () {
  const level = useMotionLevel()

  return (
    <div data-no-tilt className="absolute inset-0 cursor-pointer overflow-hidden bg-[#fffafd]">
      {level === 'full' ? (
        <HeroSplashCanvas />
      ) : (
        <HeroSplashFallback animate={level !== 'none'} />
      )}
    </div>
  )
}
