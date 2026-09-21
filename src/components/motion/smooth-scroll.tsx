'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useFullMotion } from '@/hooks/use-motion-level'
import { requestScrollTriggerRefresh } from '@/lib/motion/scroll-refresh'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const NAV_OFFSET = -88

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const fullMotion = useFullMotion()

  useEffect(() => {
    if (!fullMotion) return

    const lenis = new Lenis({
      autoRaf: false,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.88,
      syncTouch: false,
      touchMultiplier: 1,
      anchors: { offset: NAV_OFFSET, duration: 1.2 },
      allowNestedScroll: true,
      stopInertiaOnNavigate: true,
      respectReducedMotion: true
    })

    lenis.on('scroll', ScrollTrigger.update)

    const onTick = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)
    window.__landingLenis = lenis

    const onRefreshInit = () => {
      lenis.resize()
    }
    ScrollTrigger.addEventListener('refreshInit', onRefreshInit)

    if (!document.documentElement.classList.contains('splash-locked')) {
      requestScrollTriggerRefresh()
    }

    return () => {
      ScrollTrigger.removeEventListener('refreshInit', onRefreshInit)
      gsap.ticker.remove(onTick)
      gsap.ticker.lagSmoothing(500, 33)
      if (window.__landingLenis === lenis) window.__landingLenis = undefined
      lenis.destroy()
    }
  }, [fullMotion])

  return <>{children}</>
}
