'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { Sparkles } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { ScrollReveal } from '@/components/motion/scroll-reveal'
import { initHorizontalPinScroll } from '@/lib/motion/jahez-scroll-triggers'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { LANDING_SECTION_TITLE_CLASS } from '@/components/landing/landing-styles'
import { appScreenSrcs } from '@/lib/landing/assets'
import { cn } from '@/lib/utils'

export function ScreensSection () {
  const t = useTranslations('screens')
  const locale = useLocale()
  const reduced = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reduced || !sectionRef.current || !wrapperRef.current || !innerRef.current) return
    const anim = initHorizontalPinScroll({
      sectionEl: sectionRef.current,
      wrapperEl: wrapperRef.current,
      innerEl: innerRef.current,
      isRtl: locale === 'ar'
    })
    return () => anim?.kill()
  }, [locale, reduced])

  return (
    <section
      ref={sectionRef}
      id="screens"
      className="relative flex min-h-svh flex-col bg-white pt-22 pb-10 md:h-svh md:overflow-hidden md:pb-6"
    >
      <div className="relative z-10 mx-auto w-full max-w-7xl shrink-0 px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="mb-8 text-center sm:mb-10 md:mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-pink/30 bg-brand-blush/60 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-brand-magenta shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{t('badge')}</span>
          </div>
          <h2 className={cn(LANDING_SECTION_TITLE_CLASS, 'text-brand-magenta')}>{t('title')}</h2>
          <span className="mx-auto mt-4 block h-1 w-16 rounded-full bg-linear-to-r from-brand-magenta to-brand-pink" />
          <p className="mx-auto mt-4 max-w-2xl text-base text-neutral-600 sm:text-lg">
            {t('subtitle')}
          </p>
        </ScrollReveal>
      </div>

      <div ref={wrapperRef} className="relative z-10 min-h-0 w-full flex-1 overflow-hidden">
        <div
          ref={innerRef}
          className="flex h-full flex-col items-center gap-8 px-4 sm:px-6 md:w-max md:flex-row md:items-stretch md:gap-10 md:px-8 lg:px-16"
        >
          {appScreenSrcs(locale).map((src, index) => (
            <div
              key={`${src}-${index}`}
              className="flex h-auto max-h-full min-h-0 shrink-0 items-center rounded-[2.2rem] border border-brand-blush/80 bg-white p-2 shadow-xl shadow-brand-lilac/20 sm:p-3 md:h-full md:p-2.5"
            >
              <Image
                src={src}
                alt=""
                width={280}
                height={560}
                className="h-auto w-[220px] sm:w-[240px] md:h-full md:min-h-0 md:w-auto md:max-h-full md:object-contain"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
