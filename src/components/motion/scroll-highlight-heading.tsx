'use client'

import { useLayoutEffect, useMemo, useRef } from 'react'
import { useLocale } from 'next-intl'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { initTextHighlight } from '@/lib/motion/text-highlight'

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
  return text.split(/(\s+)/).flatMap((part) => {
    if (!part) return []
    if (/^\s+$/.test(part)) return [{ type: 'space' as const, value: part }]
    return [{ type: 'word' as const, chars: byWord ? [part] : graphemes(part) }]
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
  const headingRef = useRef<HTMLHeadingElement>(null)
  const byWord = locale === 'ar'
  const parts = useMemo(() => splitHighlightText(text, byWord), [text, byWord])

  useLayoutEffect(() => {
    if (reduced || !headingRef.current) return
    return initTextHighlight(headingRef.current)
  }, [reduced, text, byWord])

  if (reduced) {
    return <Tag className={className}>{text}</Tag>
  }

  return (
    <Tag ref={headingRef} className={className} aria-label={text}>
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
