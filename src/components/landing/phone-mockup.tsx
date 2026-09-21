'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useFullMotion } from '@/hooks/use-motion-level'
import { cn } from '@/lib/utils'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

type PhoneMockupProps = {
  src?: string
  screens?: string[]
  axis?: 'vertical' | 'horizontal'
  alt?: string
  priority?: boolean
  className?: string
}

export function PhoneMockup ({
  src,
  screens,
  axis = 'vertical',
  alt = '',
  priority = false,
  className
}: PhoneMockupProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const stackRef = useRef<HTMLDivElement>(null)
  const fullMotion = useFullMotion()
  const list = screens?.length ? screens : src ? [src] : []
  const visible = fullMotion ? list : list.slice(0, 1)
  const pageCount = visible.length
  const horizontal = axis === 'horizontal'
  const scrubPages = pageCount > 1 && fullMotion

  useEffect(() => {
    if (!scrubPages || !stackRef.current || !rootRef.current) return

    const trigger = rootRef.current.closest('section') ?? rootRef.current
    const shift = -((pageCount - 1) / pageCount) * 100
    const from = horizontal ? { xPercent: 0, yPercent: 0, force3D: true } : { xPercent: 0, yPercent: 0, force3D: true }
    const to = horizontal
      ? { xPercent: shift, yPercent: 0, ease: 'none' as const }
      : { yPercent: shift, xPercent: 0, ease: 'none' as const }

    const anim = gsap.fromTo(stackRef.current, from, {
      ...to,
      scrollTrigger: {
        trigger,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.65,
        invalidateOnRefresh: true
      }
    })

    const refreshId = window.setTimeout(() => ScrollTrigger.refresh(), 120)

    return () => {
      window.clearTimeout(refreshId)
      anim.scrollTrigger?.kill()
      anim.kill()
      gsap.set(stackRef.current, { clearProps: 'transform' })
    }
  }, [scrubPages, pageCount, horizontal])

  return (
    <div ref={rootRef} className={cn('relative w-[240px] sm:w-[280px] lg:w-[300px]', className)}>
      <div
        aria-hidden
        className="absolute -start-[4px] top-[22%] h-8 w-[4px] rounded-s-sm bg-neutral-700"
      />
      <div
        aria-hidden
        className="absolute -start-[4px] top-[32%] h-14 w-[4px] rounded-s-sm bg-neutral-700"
      />
      <div
        aria-hidden
        className="absolute -end-[4px] top-[28%] h-16 w-[4px] rounded-e-sm bg-neutral-700"
      />

      <div className="relative overflow-hidden rounded-[2.6rem] border-[11px] border-neutral-950 bg-neutral-950 shadow-[0_28px_60px_-18px_rgba(0,0,0,0.75)] ring-1 ring-white/25">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-30 rounded-[1.85rem] ring-1 ring-inset ring-white/10"
        />
        <div
          aria-hidden
          className="absolute left-1/2 top-2.5 z-20 h-[22px] w-[92px] -translate-x-1/2 rounded-full bg-neutral-950 shadow-inner"
        />

        <div className="relative aspect-[9/19.5] overflow-hidden rounded-[1.85rem] bg-neutral-100">
          <div
            ref={stackRef}
            dir="ltr"
            className={cn(
              'flex',
              horizontal ? 'absolute inset-y-0 start-0 h-full' : 'w-full flex-col',
              scrubPages && 'will-change-transform'
            )}
            style={horizontal ? { width: `${pageCount * 100}%` } : undefined}
          >
            {visible.map((screenSrc, index) => (
              <div
                key={screenSrc}
                className={cn(
                  'relative shrink-0',
                  horizontal ? 'h-full' : 'aspect-[9/19.5] w-full'
                )}
                style={horizontal ? { width: `${100 / pageCount}%` } : undefined}
              >
                <Image
                  src={screenSrc}
                  alt={index === 0 ? alt : ''}
                  fill
                  sizes="(max-width: 640px) 240px, (max-width: 1024px) 280px, 300px"
                  priority={priority && index === 0}
                  className="object-cover object-top"
                />
              </div>
            ))}
          </div>
        </div>

        <div
          aria-hidden
          className="absolute inset-x-0 bottom-2 z-20 flex justify-center"
        >
          <span className="h-[5px] w-28 rounded-full bg-white/70" />
        </div>
      </div>
    </div>
  )
}
