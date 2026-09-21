'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { cn } from '@/lib/utils'

type ScreensCarouselProps = {
  srcs: string[]
  prevLabel: string
  nextLabel: string
  goToLabel: (index: number) => string
}

const navBtnClass =
  'absolute top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-brand-pink/30 bg-white/95 text-brand-magenta shadow-md backdrop-blur-sm transition-colors hover:bg-brand-blush focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink/50'

export function ScreensCarousel ({
  srcs,
  prevLabel,
  nextLabel,
  goToLabel
}: ScreensCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const reduced = useReducedMotion()
  const count = srcs.length

  const syncIndex = useCallback(() => {
    const root = scrollerRef.current
    if (!root) return
    const slides = Array.from(root.children) as HTMLElement[]
    if (!slides.length) return
    const mid = root.scrollLeft + root.clientWidth / 2
    let best = 0
    let bestDist = Infinity
    slides.forEach((slide, i) => {
      const center = slide.offsetLeft + slide.offsetWidth / 2
      const dist = Math.abs(center - mid)
      if (dist < bestDist) {
        bestDist = dist
        best = i
      }
    })
    setIndex(best)
  }, [])

  const goTo = useCallback(
    (target: number) => {
      const root = scrollerRef.current
      if (!root || count === 0) return
      const next = ((target % count) + count) % count
      const slide = root.children[next] as HTMLElement | undefined
      if (!slide) return
      const left = slide.offsetLeft - (root.clientWidth - slide.offsetWidth) / 2
      root.scrollTo({ left, behavior: reduced ? 'auto' : 'smooth' })
    },
    [count, reduced]
  )

  useEffect(() => {
    const root = scrollerRef.current
    if (!root) return
    syncIndex()
    root.addEventListener('scroll', syncIndex, { passive: true })
    window.addEventListener('resize', syncIndex)
    return () => {
      root.removeEventListener('scroll', syncIndex)
      window.removeEventListener('resize', syncIndex)
    }
  }, [syncIndex, srcs])

  return (
    <div
      className="relative w-full outline-none"
      aria-roledescription="carousel"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft') {
          event.preventDefault()
          goTo(index - 1)
        }
        if (event.key === 'ArrowRight') {
          event.preventDefault()
          goTo(index + 1)
        }
      }}
    >
      <div className="relative">
        <div
          ref={scrollerRef}
          dir="ltr"
          data-lenis-prevent
          className="scrollbar-none flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-[max(1rem,calc(50%-6.25rem))] py-1 touch-pan-x sm:gap-5 sm:px-[max(1.5rem,calc(50%-6.875rem))]"
        >
          {srcs.map((src, i) => (
            <div
              key={`${src}-${i}`}
              className={cn(
                'w-50 shrink-0 snap-center rounded-[2.2rem] border border-glow-cool/40 bg-white p-2 transition-[transform,opacity] duration-300 sm:w-55 sm:p-2.5',
                i === index ? 'scale-100 opacity-100' : 'scale-[0.9] opacity-55'
              )}
            >
              <Image
                src={src}
                alt=""
                width={280}
                height={560}
                className="h-auto max-h-[min(26rem,calc(100svh-22rem))] w-full object-contain"
                priority={i === 0}
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          aria-label={prevLabel}
          onClick={() => goTo(index - 1)}
          className={cn(navBtnClass, 'left-2')}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          aria-label={nextLabel}
          onClick={() => goTo(index + 1)}
          className={cn(navBtnClass, 'right-2')}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div dir="ltr" className="mt-4 flex items-center justify-center gap-2">
        {srcs.map((_, i) => (
          <button
            key={`dot-${i}`}
            type="button"
            aria-label={goToLabel(i + 1)}
            aria-current={i === index ? true : undefined}
            onClick={() => goTo(i)}
            className={cn(
              'h-2 rounded-full transition-all duration-300',
              i === index ? 'w-6 bg-brand-magenta' : 'w-2 bg-brand-pink/35 hover:bg-brand-pink/60'
            )}
          />
        ))}
      </div>
    </div>
  )
}
