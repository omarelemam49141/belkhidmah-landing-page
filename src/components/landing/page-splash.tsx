'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import gsap from 'gsap'
import { HeroSplashScreen } from '@/components/landing/hero-splash-screen'
import { requestScrollTriggerRefresh } from '@/lib/motion/scroll-refresh'

const HOLD_FULL_MS = 2600
const HOLD_LITE_MS = 900
const FLY_DURATION = 1.05
const BG_FADE = 0.72
const LITE_FADE = 0.45

let introConsumed = false

type SplashPhase = 'intro' | 'flying' | 'settled'

type SplashContextValue = {
  phase: SplashPhase
  skipped: boolean
  registerTarget: (el: HTMLElement | null) => void
}

const SplashContext = createContext<SplashContextValue>({
  phase: 'settled',
  skipped: true,
  registerTarget: () => {}
})

export function usePageSplash () {
  return useContext(SplashContext)
}

function motionFromDom () {
  const value = document.documentElement.dataset.motion
  if (value === 'full' || value === 'none' || value === 'lite') return value
  return 'lite'
}

function unlockScroll () {
  document.documentElement.classList.remove('splash-locked')
  document.documentElement.classList.add('scrollbar-hover')
  window.__landingLenis?.start()
  requestScrollTriggerRefresh()
}

function lockScroll () {
  document.documentElement.classList.add('splash-locked')
  window.__landingLenis?.stop()
}

function waitForTarget (getTarget: () => HTMLElement | null, ms = 2000) {
  return new Promise<HTMLElement | null>((resolve) => {
    const start = performance.now()
    const tick = () => {
      const el = getTarget()
      if (el) {
        resolve(el)
        return
      }
      if (performance.now() - start >= ms) {
        resolve(null)
        return
      }
      requestAnimationFrame(tick)
    }
    tick()
  })
}

export function HeroSplashTarget () {
  const { skipped, phase, registerTarget } = usePageSplash()
  const ref = useRef<HTMLDivElement>(null)
  const ready = skipped || phase === 'settled'

  useLayoutEffect(() => {
    registerTarget(ref.current)
    return () => registerTarget(null)
  }, [registerTarget])

  return (
    <div
      ref={ref}
      data-splash-target
      className="absolute inset-0 overflow-hidden bg-[#fffafd]"
    >
      {ready ? <HeroSplashScreen /> : null}
    </div>
  )
}

export function PageSplash ({ children }: { children: React.ReactNode }) {
  const [skipped] = useState(() => introConsumed)
  const [phase, setPhase] = useState<SplashPhase>(() =>
    introConsumed ? 'settled' : 'intro'
  )
  const [overlayOn, setOverlayOn] = useState(() => !introConsumed)
  const targetRef = useRef<HTMLElement | null>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const tweenRef = useRef<gsap.core.Timeline | null>(null)
  const settleRef = useRef<() => void>(() => {})

  const registerTarget = useCallback((el: HTMLElement | null) => {
    targetRef.current = el
  }, [])

  const value = useMemo(
    () => ({ phase, skipped, registerTarget }),
    [phase, skipped, registerTarget]
  )

  useEffect(() => {
    if (skipped) document.documentElement.classList.add('scrollbar-hover')
  }, [skipped])

  useEffect(() => {
    if (skipped) return

    const level = motionFromDom()
    if (level === 'none') {
      introConsumed = true
      setPhase('settled')
      setOverlayOn(false)
      document.documentElement.classList.add('scrollbar-hover')
      return
    }

    let cancelled = false
    lockScroll()

    const settle = () => {
      if (cancelled || introConsumed) return
      introConsumed = true
      tweenRef.current?.kill()
      tweenRef.current = null
      setPhase('settled')
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (cancelled) return
          const overlay = overlayRef.current
          if (overlay) gsap.to(overlay, { autoAlpha: 0, duration: 0.2, ease: 'power2.out' })
          unlockScroll()
          window.setTimeout(() => {
            if (!cancelled) setOverlayOn(false)
          }, 500)
        })
      })
    }
    settleRef.current = settle

    const run = async () => {
      const hold = level === 'full' ? HOLD_FULL_MS : HOLD_LITE_MS
      await new Promise((resolve) => window.setTimeout(resolve, hold))
      if (cancelled || introConsumed) return

      const overlay = overlayRef.current
      const bg = bgRef.current
      const stage = stageRef.current
      if (!overlay || !bg) return

      if (level !== 'full') {
        setPhase('settled')
        const tween = gsap.timeline({
          onComplete: () => {
            if (cancelled) return
            introConsumed = true
            unlockScroll()
            window.setTimeout(() => {
              if (!cancelled) setOverlayOn(false)
            }, 200)
          }
        })
        tweenRef.current = tween
        tween.to(overlay, { autoAlpha: 0, duration: LITE_FADE, ease: 'power2.out' })
        return
      }

      const target = await waitForTarget(() => targetRef.current)
      if (cancelled || introConsumed || !stage) return
      if (!target) {
        settle()
        return
      }

      setPhase('flying')
      const to = target.getBoundingClientRect()
      const fromCx = window.innerWidth / 2
      const fromCy = window.innerHeight / 2
      const endScale = to.height / window.innerHeight
      const dx = to.left + to.width / 2 - fromCx
      const dy = to.top + to.height / 2 - fromCy
      gsap.set(stage, { transformOrigin: '50% 50%' })

      const proxy = { t: 0 }
      const tween = gsap.timeline({ onComplete: settle })
      tweenRef.current = tween
      tween.to(bg, { opacity: 0, duration: BG_FADE, ease: 'power2.inOut' }, 0)
      tween.to(
        proxy,
        {
          t: 1,
          duration: FLY_DURATION,
          ease: 'power3.inOut',
          onUpdate: () => {
            const p = proxy.t
            gsap.set(stage, {
              x: dx * p,
              y: dy * p,
              scale: 1 + (endScale - 1) * p
            })
          }
        },
        0.08
      )
    }

    void run()

    return () => {
      cancelled = true
      tweenRef.current?.kill()
      unlockScroll()
    }
  }, [skipped])

  function skipIntro () {
    if (introConsumed || skipped) return
    settleRef.current()
  }

  return (
    <SplashContext.Provider value={value}>
      {children}
      {overlayOn ? (
        <div
          ref={overlayRef}
          className="page-splash-overlay fixed inset-0 z-100 overflow-hidden"
          role="button"
          tabIndex={0}
          aria-label="Skip intro"
          onPointerDown={skipIntro}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              skipIntro()
            }
          }}
        >
          <div ref={bgRef} className="absolute inset-0 bg-[#fffafd]" />
          <div ref={stageRef} className="pointer-events-none absolute inset-0 overflow-hidden bg-transparent">
            <HeroSplashScreen transparent />
          </div>
        </div>
      ) : null}
    </SplashContext.Provider>
  )
}
