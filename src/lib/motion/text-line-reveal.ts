import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText)
}

export function initLineReveal (el: HTMLElement): () => void {
  let cancelled = false
  let split: SplitText | null = null
  let tween: gsap.core.Tween | null = null
  let trigger: ScrollTrigger | null = null

  const revealPlain = () => {
    gsap.set(el, { autoAlpha: 1, y: 0, yPercent: 0 })
  }

  const teardown = () => {
    tween?.kill()
    tween = null
    try {
      trigger?.kill()
    } catch {
      /* pin/trigger already gone */
    }
    trigger = null
    try {
      split?.revert()
    } catch {
      /* split nodes already moved */
    }
    split = null
  }

  const create = () => {
    if (cancelled) return
    teardown()
    if (cancelled) return

    try {
      split = SplitText.create(el, {
        type: 'lines',
        mask: 'lines',
        aria: 'none'
      })

      const lines = (split.lines ?? []).filter(Boolean)
      if (!lines.length) {
        revealPlain()
        return
      }

      gsap.set(lines, { yPercent: 110 })

      tween = gsap.to(lines, {
        yPercent: 0,
        duration: 0.85,
        stagger: 0.07,
        ease: 'power3.out',
        paused: true
      })

      const play = () => {
        tween?.play()
      }

      trigger = ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: play,
        onRefresh (self) {
          if (self.isActive || self.progress > 0) play()
        }
      })

      if (trigger.isActive || trigger.progress > 0) play()
    } catch {
      revealPlain()
    }
  }

  const fontsReady = document.fonts?.ready
  if (fontsReady) {
    void fontsReady.then(() => {
      if (!cancelled) create()
    })
  } else {
    create()
  }

  return () => {
    cancelled = true
    teardown()
    gsap.set(el, { clearProps: 'opacity,visibility,transform' })
  }
}
