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

export function initContactFacilitiesAnimation(options: {
  sectionEl: HTMLElement
}): { kill: () => void } | null {
  const { sectionEl } = options
  if (window.innerWidth < 768) return null

  const cards = gsap.utils.toArray<HTMLElement>('[data-contact-card]', sectionEl)
  const layer1 = sectionEl.querySelector('[data-map-layer="1"]') as HTMLElement | null
  const layer2 = sectionEl.querySelector('[data-map-layer="2"]') as HTMLElement | null
  if (cards.length < 3) return null

  let tl: gsap.core.Timeline | null = null
  let killed = false
  const clickCleanups: Array<() => void> = []

  const setActive = (index: number) => {
    cards.forEach((card, i) => {
      card.classList.toggle('is-active', i === index)
    })
  }

  const SNAP_MAP_AT = 0.67
  let mapIsSecond = false

  const setMapPhoto = (progress: number) => {
    if (!layer1 || !layer2) return
    const showSecond = progress >= SNAP_MAP_AT
    if (showSecond === mapIsSecond) return
    mapIsSecond = showSecond
    layer1.classList.toggle('is-hidden', showSecond)
    layer2.classList.toggle('is-visible', showSecond)
    layer1.style.pointerEvents = showSecond ? 'none' : 'auto'
  }

  const applyProgress = (progress: number) => {
    const activeIdx = progress < 0.33 ? 0 : progress < 0.67 ? 1 : 2
    setActive(activeIdx)
    setMapPhoto(progress)
  }

  const create = () => {
    if (killed || tl) return

    const proxy = { p: 0 }
    const scrollDistance = window.innerHeight * 2.15

    gsap.set(sectionEl, { zIndex: 30 })
    setActive(0)
    setMapPhoto(0)

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

    tl.to(proxy, {
      p: 1,
      ease: 'none',
      onUpdate: () => applyProgress(proxy.p)
    })

    cards.forEach((card, index) => {
      const toggler = card.querySelector('[data-contact-toggler]')
      if (!toggler) return
      const onClick = (e: Event) => {
        e.preventDefault()
        const st = tl?.scrollTrigger
        if (!st) {
          applyProgress(index === 0 ? 0 : index === 1 ? 0.5 : 1)
          return
        }
        const targetProgress = index === 0 ? 0.08 : index === 1 ? 0.5 : 0.88
        const target = st.start + (st.end - st.start) * targetProgress
        const lenis = window.__landingLenis
        if (lenis) lenis.scrollTo(target, { duration: 0.9 })
        else window.scrollTo({ top: target, behavior: 'smooth' })
      }
      toggler.addEventListener('click', onClick)
      clickCleanups.push(() => toggler.removeEventListener('click', onClick))
    })

    ScrollTrigger.refresh()
    window.setTimeout(() => ScrollTrigger.refresh(), 150)
    window.setTimeout(() => ScrollTrigger.refresh(), 700)
  }

  const retryIds = [window.setTimeout(create, 50), window.setTimeout(create, 350)]
  requestAnimationFrame(() => requestAnimationFrame(create))

  return {
    kill: () => {
      killed = true
      retryIds.forEach((id) => window.clearTimeout(id))
      clickCleanups.forEach((fn) => fn())
      tl?.scrollTrigger?.kill()
      tl?.kill()
      tl = null
      gsap.set(sectionEl, { clearProps: 'zIndex' })
      layer1?.classList.remove('is-hidden')
      layer2?.classList.remove('is-visible')
      setActive(0)
    }
  }
}
