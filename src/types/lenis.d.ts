import type Lenis from 'lenis'

declare global {
  interface Window {
    __landingLenis?: Lenis
  }
}

export {}
