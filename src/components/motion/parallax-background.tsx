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

interface ParallaxBackgroundProps {
  src: string
  alt?: string
  priority?: boolean
  className?: string
  overlayClassName?: string
  speed?: number
  children?: React.ReactNode
}

export function ParallaxBackground({
  src,
  alt = '',
  priority = false,
  className,
  overlayClassName,
  speed = 12,
  children
}: ParallaxBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const imageWrapperRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const finePointer = useFinePointer()
  const enableParallax = !reduced && finePointer

  useEffect(() => {
    if (!enableParallax || !containerRef.current || !imageWrapperRef.current) return

    const anim = gsap.fromTo(
      imageWrapperRef.current,
      { yPercent: -speed, force3D: true },
      {
        yPercent: speed,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      }
    )

    return () => {
      anim.scrollTrigger?.kill()
      anim.kill()
    }
  }, [enableParallax, speed])

  return (
    <div
      ref={containerRef}
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
      aria-hidden="true"
    >
      <div
        ref={imageWrapperRef}
        className={cn(
          'absolute inset-s-0 -top-[18%] h-[136%] w-full',
          enableParallax && 'will-change-transform'
        )}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
      {overlayClassName && <div className={cn('absolute inset-0', overlayClassName)} />}
      {children}
    </div>
  )
}
