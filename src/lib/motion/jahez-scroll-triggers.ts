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
  if (window.innerWidth < 768) return null

  const { sectionEl } = options
  const itemsWrap = sectionEl.querySelector('[data-contact-items]') as HTMLElement | null
  const stack = sectionEl.querySelector('[data-contact-stack]') as HTMLElement | null
  const items = gsap.utils.toArray<HTMLElement>('[data-contact-item]', sectionEl)
  if (!itemsWrap || items.length < 2) return null

  const setActive = (index: number) => {
    items.forEach((el, i) => {
      el.classList.toggle('is-active', i === index)
    })
    stack?.classList.toggle('is-second', index === 1)
  }

  setActive(0)

  const clickCleanups: Array<() => void> = []
  let st: ScrollTrigger | null = null

  const ctx = gsap.context(() => {
    st = ScrollTrigger.create({
      trigger: itemsWrap,
      start: 'top 5.75rem',
      end: () =>
        `+=${Math.max(sectionEl.offsetHeight - itemsWrap.offsetHeight, window.innerHeight * 1.2)}`,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        setActive(self.progress >= 0.5 ? 1 : 0)
      }
    })

    items.forEach((item, index) => {
      const toggler = item.querySelector('[data-contact-toggler]')
      if (!toggler) return
      const onClick = () => {
        if (!st) return
        const span = st.end - st.start
        const target = st.start + span * (index === 0 ? 0.08 : 0.78)
        const lenis = window.__landingLenis
        if (lenis) lenis.scrollTo(target, { duration: 0.9 })
        else window.scrollTo({ top: target, behavior: 'smooth' })
      }
      toggler.addEventListener('click', onClick)
      clickCleanups.push(() => toggler.removeEventListener('click', onClick))
    })
  }, sectionEl)

  const refreshId = window.setTimeout(() => ScrollTrigger.refresh(), 120)

  return {
    kill: () => {
      window.clearTimeout(refreshId)
      clickCleanups.forEach((fn) => fn())
      ctx.revert()
      setActive(0)
    }
  }
}
