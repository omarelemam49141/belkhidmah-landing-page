import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText)
}

export function initLineReveal (el: HTMLElement): () => void {
  const split = SplitText.create(el, {
    type: 'lines, words',
    mask: 'lines',
    autoSplit: true,
    aria: 'none',
    onSplit: (self) =>
      gsap.from(self.words, {
        duration: 1,
        y: 100,
        autoAlpha: 0,
        stagger: 0.05,
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        }
      })
  })

  return () => {
    split.kill()
    split.revert()
  }
}
