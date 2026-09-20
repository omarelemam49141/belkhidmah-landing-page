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
  const cards = gsap.utils.toArray<HTMLElement>('[data-facility-card]', sectionEl)
  const mediaImages = gsap.utils.toArray<HTMLElement>('[data-facility-image]', sectionEl)
  const tiltCleanups: Array<() => void> = []

  const ctx = gsap.context(() => {
    const mm = gsap.matchMedia()

    mm.add('(min-width: 992px)', () => {
      cards.forEach((card, idx) => {
        const img = mediaImages[idx]
        const staggerEls = card.querySelectorAll('[data-facility-stagger]')

        const cardTl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionEl,
            start: 'top 80%',
            toggleActions: 'play none none none',
            once: true
          }
        })

        cardTl.fromTo(
          card,
          { y: 70, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.8, ease: 'power3.out', overwrite: 'auto' },
          idx * 0.12
        )

        if (staggerEls.length) {
          cardTl.fromTo(
            staggerEls,
            { y: 25, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              stagger: 0.08,
              duration: 0.5,
              ease: 'power2.out',
              overwrite: 'auto'
            },
            idx * 0.12 + 0.15
          )
        }

        if (img) {
          gsap.fromTo(
            img,
            { yPercent: -12, scale: 1.12 },
            {
              yPercent: 12,
              scale: 1.02,
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
              }
            }
          )
        }

        tiltCleanups.push(attachCardTilt(card))
      })
    })

    mm.add('(max-width: 991px)', () => {
      cards.forEach((card, idx) => {
        gsap.fromTo(
          card,
          { y: 40, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.7,
            ease: 'power2.out',
            delay: idx * 0.08,
            overwrite: 'auto',
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              toggleActions: 'play none none none',
              once: true
            }
          }
        )
      })
    })
  }, sectionEl)

  const refreshId = window.setTimeout(() => ScrollTrigger.refresh(), 120)
  const safetyId = window.setTimeout(() => {
    gsap.set(cards, { autoAlpha: 1, y: 0, overwrite: 'auto' })
    gsap.set(sectionEl.querySelectorAll('[data-facility-stagger]'), {
      autoAlpha: 1,
      y: 0,
      overwrite: 'auto'
    })
  }, 1400)

  return {
    kill: () => {
      window.clearTimeout(refreshId)
      window.clearTimeout(safetyId)
      tiltCleanups.forEach((fn) => fn())
      ctx.revert()
      gsap.set(cards, { clearProps: 'opacity,visibility,transform,filter' })
    }
  }
}

function attachCardTilt(card: HTMLElement): () => void {
  const media = card.querySelector('[data-facility-media]') as HTMLElement | null

  const onMouseMove = (e: MouseEvent) => {
    const rect = card.getBoundingClientRect()
    const xPct = ((e.clientX - rect.left) / rect.width - 0.5) * 2
    const yPct = ((e.clientY - rect.top) / rect.height - 0.5) * 2

    gsap.to(card, {
      rotationY: xPct * 4,
      rotationX: -yPct * 4,
      transformPerspective: 1200,
      ease: 'power1.out',
      duration: 0.4
    })

    if (media) {
      gsap.to(media, { x: xPct * 6, y: yPct * 6, ease: 'power1.out', duration: 0.4 })
    }
  }

  const onMouseLeave = () => {
    gsap.to(card, { rotationY: 0, rotationX: 0, ease: 'power2.out', duration: 0.7 })
    if (media) {
      gsap.to(media, { x: 0, y: 0, ease: 'power2.out', duration: 0.7 })
    }
  }

  card.addEventListener('mousemove', onMouseMove)
  card.addEventListener('mouseleave', onMouseLeave)

  return () => {
    card.removeEventListener('mousemove', onMouseMove)
    card.removeEventListener('mouseleave', onMouseLeave)
  }
}
