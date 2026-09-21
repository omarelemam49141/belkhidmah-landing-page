import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
  ;(window as unknown as { gsap?: typeof gsap; ScrollTrigger?: typeof ScrollTrigger }).gsap = gsap
  ;(window as unknown as { gsap?: typeof gsap; ScrollTrigger?: typeof ScrollTrigger }).ScrollTrigger = ScrollTrigger
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

export function initContactFacilitiesAnimation(options: {
  sectionEl: HTMLElement
}): { kill: () => void } | null {
  if (typeof window === 'undefined' || window.innerWidth < 1024) return null

  const { sectionEl } = options
  const cards = gsap.utils.toArray<HTMLElement>('[data-contact-card]', sectionEl)
  const layer1 = sectionEl.querySelector('[data-map-layer="1"]') as HTMLElement | null
  const layer2 = sectionEl.querySelector('[data-map-layer="2"]') as HTMLElement | null

  if (cards.length < 3) return null

  const setActive = (index: number) => {
    cards.forEach((card, i) => {
      card.classList.toggle('is-active', i === index)
    })
  }

  const setMapCrossfade = (progress: number) => {
    if (!layer1 || !layer2) return
    // From 0 to 0.28: layer1 = 1, layer2 = 0
    // From 0.28 to 0.65: crossfade
    // From 0.65 to 1.0: layer1 = 0, layer2 = 1
    if (progress <= 0.28) {
      layer1.style.opacity = '1'
      layer1.style.pointerEvents = 'auto'
      layer2.style.opacity = '0'
      layer2.style.pointerEvents = 'none'
    } else if (progress >= 0.65) {
      layer1.style.opacity = '0'
      layer1.style.pointerEvents = 'none'
      layer2.style.opacity = '1'
      layer2.style.pointerEvents = 'auto'
    } else {
      const blend = (progress - 0.28) / (0.65 - 0.28)
      layer1.style.opacity = (1 - blend).toFixed(3)
      layer1.style.pointerEvents = blend > 0.5 ? 'none' : 'auto'
      layer2.style.opacity = blend.toFixed(3)
      layer2.style.pointerEvents = blend > 0.5 ? 'auto' : 'none'
    }
  }

  setActive(0)
  setMapCrossfade(0)

  const clickCleanups: Array<() => void> = []
  let st: ScrollTrigger | null = null

  const ctx = gsap.context(() => {
    const scrollTravel = Math.max(window.innerHeight * 2, 1400)

    st = ScrollTrigger.create({
      trigger: sectionEl,
      start: 'top top',
      end: `+=${scrollTravel}`,
      pin: sectionEl,
      pinSpacing: true,
      scrub: 0.5,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const p = self.progress
        const activeIdx = p < 0.33 ? 0 : p < 0.67 ? 1 : 2
        setActive(activeIdx)
        setMapCrossfade(p)
      },
      onRefresh: (self) => {
        const p = self.progress
        const activeIdx = p < 0.33 ? 0 : p < 0.67 ? 1 : 2
        setActive(activeIdx)
        setMapCrossfade(p)
      }
    })

    cards.forEach((card, index) => {
      const toggler = card.querySelector('[data-contact-toggler]')
      if (!toggler) return
      const onClick = (e: Event) => {
        e.preventDefault()
        if (!st) {
          setActive(index)
          setMapCrossfade(index === 0 ? 0 : index === 1 ? 0.5 : 1)
          return
        }
        const span = st.end - st.start
        const targetProgress = index === 0 ? 0.08 : index === 1 ? 0.5 : 0.88
        const target = st.start + span * targetProgress
        const lenis = window.__landingLenis
        if (lenis) lenis.scrollTo(target, { duration: 0.9 })
        else window.scrollTo({ top: target, behavior: 'smooth' })
      }
      toggler.addEventListener('click', onClick)
      clickCleanups.push(() => toggler.removeEventListener('click', onClick))
    })
  }, sectionEl)

  const refreshId = window.setTimeout(() => ScrollTrigger.refresh(), 150)

  return {
    kill: () => {
      window.clearTimeout(refreshId)
      clickCleanups.forEach((fn) => fn())
      ctx.revert()
      st?.kill()
      cards.forEach((c) => c.classList.remove('is-active'))
      if (layer1) layer1.style.opacity = ''
      if (layer2) layer2.style.opacity = ''
    }
  }
}
