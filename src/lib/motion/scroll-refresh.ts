import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  ScrollTrigger.config({ ignoreMobileResize: true })
}

let timer: number | undefined
let running = false

export function requestScrollTriggerRefresh () {
  if (typeof window === 'undefined') return
  if (document.documentElement.classList.contains('splash-locked')) return
  if (timer !== undefined) window.clearTimeout(timer)
  timer = window.setTimeout(() => {
    timer = undefined
    if (running) return
    running = true
    try {
      ScrollTrigger.refresh()
    } catch {
      // Pin spacer can already be detached during React remount / nested refresh.
    } finally {
      running = false
    }
  }, 120)
}
