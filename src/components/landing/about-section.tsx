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
      className="relative overflow-hidden bg-linear-to-b from-slate-50 via-white to-sky-50/30 py-24 sm:py-32"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(2,132,199,0.07)_0%,transparent_55%)]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-sky-700 shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>{t('badge')}</span>
          </div>
          <h2 className={cn(LANDING_SECTION_TITLE_CLASS, 'text-slate-900')}>{t('title')}</h2>
          <span className="mx-auto mt-4 block h-1 w-16 rounded-full bg-linear-to-r from-trust-blue-500 to-warm-orange-500" />
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            {t('body')}
          </p>
        </ScrollReveal>
      </div>
    </section>
  )
}
