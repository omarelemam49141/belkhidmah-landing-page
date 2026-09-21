import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export function initHorizontalPinScroll(options: {
  sectionEl: HTMLElement
  wrapperEl: HTMLElement
  innerEl: HTMLElement
  isRtl?: boolean
}): { kill: () => void } | null {
  const { sectionEl, wrapperEl, innerEl, isRtl } = options
  if (window.innerWidth < 768) return null

  let tl: gsap.core.Timeline | null = null
  let killed = false
  const cleanups: Array<() => void> = []

  const measureTravel = () =>
    Math.max(0, innerEl.scrollWidth - (wrapperEl.clientWidth || window.innerWidth))

  const create = () => {
    if (killed || tl) return
    const travel = measureTravel()
    if (travel <= 0) return

    const scrollDistance = travel * 1.75 + window.innerHeight * 0.35
    gsap.set(innerEl, { force3D: true, willChange: 'transform', x: 0 })

    tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionEl,
        start: 'top top',
        end: `+=${scrollDistance}`,
        pin: sectionEl,
        pinSpacing: true,
        scrub: 1,
        invalidateOnRefresh: true,
        anticipatePin: 0,
        fastScrollEnd: false
      }
    })

    tl.to(innerEl, {
      x: isRtl ? travel : -travel,
      ease: 'none',
      force3D: true
    })

    ScrollTrigger.refresh()
    window.setTimeout(() => ScrollTrigger.refresh(), 150)
    window.setTimeout(() => ScrollTrigger.refresh(), 700)
  }

  const retryIds = [window.setTimeout(create, 50), window.setTimeout(create, 350)]
  requestAnimationFrame(() => requestAnimationFrame(create))

  innerEl.querySelectorAll('img').forEach((img) => {
    const onLoad = () => {
      if (tl) ScrollTrigger.refresh()
      else create()
    }
    if (!img.complete) {
      img.addEventListener('load', onLoad)
      cleanups.push(() => img.removeEventListener('load', onLoad))
    }
  })

  return {
    kill: () => {
      killed = true
      retryIds.forEach((id) => window.clearTimeout(id))
      cleanups.forEach((fn) => fn())
      tl?.scrollTrigger?.kill()
      tl?.kill()
      gsap.set(innerEl, { clearProps: 'transform,willChange' })
    }
  }
}

export function initFacilityCardsAnimation(options: {
  sectionEl: HTMLElement
}): { kill: () => void } | null {
  const { sectionEl } = options
  const list = sectionEl.querySelector('[data-facility-list]') as HTMLElement | null
  const cards = gsap.utils.toArray<HTMLElement>('[data-facility-card]', sectionEl)

  const ctx = gsap.context(() => {
    if (list) {
      gsap.set(list, {
        perspective: 1400,
        transformStyle: 'preserve-3d'
      })
    }

    cards.forEach((card, idx) => {
      const fromRight = idx % 2 === 0

      gsap.set(card, {
        transformPerspective: 1400,
        transformOrigin: fromRight ? '100% 50%' : '0% 50%',
        force3D: true,
        autoAlpha: 0
      })

      gsap.fromTo(
        card,
        {
          autoAlpha: 0,
          x: fromRight ? 90 : -90,
          z: -220,
          rotateY: fromRight ? -62 : 62,
          scale: 0.82
        },
        {
          autoAlpha: 1,
          x: 0,
          z: 0,
          rotateY: 0,
          scale: 1,
          ease: 'none',
          force3D: true,
          immediateRender: true,
          scrollTrigger: {
            trigger: card,
            start: 'top 92%',
            end: 'top 58%',
            scrub: 0.55,
            invalidateOnRefresh: true
          }
        }
      )
    })
  }, sectionEl)

  const refreshId = window.setTimeout(() => ScrollTrigger.refresh(), 120)

  return {
    kill: () => {
      window.clearTimeout(refreshId)
      ctx.revert()
      gsap.set(cards, { clearProps: 'opacity,visibility,transform,filter' })
      if (list) gsap.set(list, { clearProps: 'perspective,transform,transformStyle' })
    }
  }
}
