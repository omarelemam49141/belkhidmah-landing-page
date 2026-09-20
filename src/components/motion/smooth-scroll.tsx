'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const NAV_OFFSET = -88

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
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

    const onRefresh = () => lenis.resize()
    ScrollTrigger.addEventListener('refresh', onRefresh)
    ScrollTrigger.refresh()

    return () => {
      ScrollTrigger.removeEventListener('refresh', onRefresh)
      gsap.ticker.remove(onTick)
      gsap.ticker.lagSmoothing(500, 33)
      if (window.__landingLenis === lenis) window.__landingLenis = undefined
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
