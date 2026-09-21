'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useLocale } from 'next-intl'
import { useFullMotion } from '@/hooks/use-motion-level'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { initTextHighlight } from '@/lib/motion/text-highlight'
import { ScrollReveal } from '@/components/motion/scroll-reveal'
import { cn } from '@/lib/utils'

type HeadingTag = 'h1' | 'h2' | 'h3'

type HighlightPart =
  | { type: 'space'; value: string }
  | { type: 'word'; chars: string[] }

function graphemes (value: string): string[] {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    return [...new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(value)].map(
      (part) => part.segment
    )
  }
  return [...value]
}

function splitHighlightText (text: string, byWord: boolean): HighlightPart[] {
  return text.split(/(\s+)/).flatMap((part): HighlightPart[] => {
    if (!part) return []
    if (/^\s+$/.test(part)) return [{ type: 'space', value: part }]
    return [{ type: 'word', chars: byWord ? [part] : graphemes(part) }]
  })
}

export function ScrollHighlightHeading ({
  as: Tag = 'h2',
  className,
  children
}: {
  as?: HeadingTag
  className?: string
  children: React.ReactNode
}) {
  const text = typeof children === 'string' ? children : String(children)
  const locale = useLocale()
  const reduced = useReducedMotion()
  const fullMotion = useFullMotion()
  const headingRef = useRef<HTMLHeadingElement>(null)
  const byWord = locale === 'ar'
  const parts = useMemo(() => splitHighlightText(text, byWord), [text, byWord])

  useEffect(() => {
    if (!fullMotion || !headingRef.current) return
    return initTextHighlight(headingRef.current)
  }, [fullMotion, text, byWord])

  const headingClassName = cn('w-full', className)

  if (reduced) {
    return <Tag className={headingClassName}>{text}</Tag>
  }

  if (!fullMotion) {
    return (
      <ScrollReveal>
        <Tag className={headingClassName}>{text}</Tag>
      </ScrollReveal>
    )
  }

  return (
    <Tag ref={headingRef} className={headingClassName} aria-label={text}>
      {parts.map((part, index) => {
        if (part.type === 'space') {
          return <span key={`s-${index}`}>{part.value}</span>
        }

        return (
          <span
            key={`w-${index}`}
            data-highlight-word
            aria-hidden
            className="relative inline-block whitespace-nowrap"
          >
            {part.chars.map((char, charIndex) => (
              <span
                key={`c-${index}-${charIndex}`}
                data-highlight-char
                className="relative inline-block"
              >
                {char}
              </span>
            ))}
          </span>
        )
      })}
    </Tag>
  )
}
