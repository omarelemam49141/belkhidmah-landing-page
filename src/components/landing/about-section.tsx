'use client'

import { Sparkles } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { ScrollReveal } from '@/components/motion/scroll-reveal'
import { LANDING_SECTION_TITLE_CLASS } from '@/components/landing/landing-styles'
import { cn } from '@/lib/utils'

export function AboutSection () {
  const t = useTranslations('about')

  return (
    <section
      id="about"
      className="relative overflow-hidden bg-white py-24 sm:py-32"
    >
      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-blush bg-brand-blush/50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-brand-magenta shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-brand-pink" />
            <span>{t('badge')}</span>
          </div>
          <h2 className={cn(LANDING_SECTION_TITLE_CLASS, 'text-brand-magenta')}>{t('title')}</h2>
          <span className="mx-auto mt-4 block h-1 w-16 rounded-full bg-linear-to-r from-brand-magenta to-brand-pink" />
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-neutral-600 sm:text-lg">
            {t('body')}
          </p>
        </ScrollReveal>
      </div>
    </section>
  )
}
