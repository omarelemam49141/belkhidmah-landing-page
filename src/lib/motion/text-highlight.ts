import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const MUTED_OPACITY = 0.2
const FILL_DURATION = 0.65
const FILL_COMPLETE_AT = 0.8

export function initTextHighlight (headingEl: HTMLElement): () => void {
  const chars = gsap.utils.toArray<HTMLElement>('[data-highlight-char]', headingEl)
  if (!chars.length) return () => {}

  const apply = (progress: number, animate: boolean) => {
    const fill = Math.min(progress / FILL_COMPLETE_AT, 1)
    const filledCount = Math.floor(fill * chars.length)

    chars.forEach((char, index) => {
      const opacity = index < filledCount ? 1 : MUTED_OPACITY
      if (animate) {
        gsap.to(char, { opacity, duration: FILL_DURATION, overwrite: true })
      } else {
        gsap.set(char, { opacity })
      }
    })
  }

  gsap.set(chars, { opacity: MUTED_OPACITY })

  const st = ScrollTrigger.create({
    trigger: headingEl,
    start: 'top 88%',
    end: 'top 38%',
    scrub: 0.35,
    invalidateOnRefresh: true,
    onUpdate: (self) => apply(self.progress, true),
    onRefresh: (self) => apply(self.progress, false)
  })

  apply(st.progress, false)

  return () => {
    st.kill()
    gsap.set(chars, { clearProps: 'opacity' })
  }
}
