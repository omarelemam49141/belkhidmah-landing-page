'use client'

import { useLayoutEffect, useRef } from 'react'
import { useFullMotion } from '@/hooks/use-motion-level'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { initLineReveal } from '@/lib/motion/text-line-reveal'
import { ScrollReveal } from '@/components/motion/scroll-reveal'

type TextTag = 'p' | 'h1' | 'h2' | 'h3' | 'div' | 'span'

export function ScrollLineReveal ({
  as: Tag = 'p',
  className,
  children
}: {
  as?: TextTag
  className?: string
  children: React.ReactNode
}) {
  const text = typeof children === 'string' ? children : String(children)
  const reduced = useReducedMotion()
  const fullMotion = useFullMotion()
  const ref = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    if (!fullMotion || !ref.current) return
    return initLineReveal(ref.current)
  }, [fullMotion, text])

  if (reduced) {
    return <Tag className={className}>{text}</Tag>
  }

  if (!fullMotion) {
    return (
      <ScrollReveal>
        <Tag className={className}>{text}</Tag>
      </ScrollReveal>
    )
  }

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {text}
    </Tag>
  )
}
