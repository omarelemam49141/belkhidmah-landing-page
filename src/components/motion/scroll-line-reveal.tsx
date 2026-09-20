'use client'

import { useLayoutEffect, useRef } from 'react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { initLineReveal } from '@/lib/motion/text-line-reveal'

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
  const ref = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    if (reduced || !ref.current) return
    return initLineReveal(ref.current)
  }, [reduced, text])

  if (reduced) {
    return <Tag className={className}>{text}</Tag>
  }

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {text}
    </Tag>
  )
}
