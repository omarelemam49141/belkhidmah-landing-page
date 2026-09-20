'use client'

import { MapPin, Phone, Sparkles } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { ScrollHighlightHeading } from '@/components/motion/scroll-highlight-heading'
import { ScrollReveal } from '@/components/motion/scroll-reveal'
import { LANDING_SECTION_TITLE_CLASS } from '@/components/landing/landing-styles'
import { PLACEHOLDER_CONTACT, googleMapsEmbedSrc } from '@/lib/landing/assets'
import { cn } from '@/lib/utils'

const CONTACT_CARD =
  'rounded-2xl border border-glow-cool/40 bg-white'

export function ContactSection () {
  const t = useTranslations('contact')
  const locale = useLocale()
  const address = locale === 'ar' ? PLACEHOLDER_CONTACT.addressAr : PLACEHOLDER_CONTACT.addressEn

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-white py-24 sm:py-32"
    >
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <ScrollReveal>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-blush bg-brand-blush/50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-brand-magenta shadow-xs">
              <Sparkles className="h-3.5 w-3.5 text-brand-pink" />
              <span>{t('badge')}</span>
            </div>
          </ScrollReveal>
          <ScrollHighlightHeading className={cn(LANDING_SECTION_TITLE_CLASS, 'text-brand-magenta')}>
            {t('title')}
          </ScrollHighlightHeading>
          <ScrollReveal>
            <span className="mx-auto mt-4 block h-1 w-16 rounded-full bg-linear-to-r from-brand-magenta to-brand-pink" />
          </ScrollReveal>
        </div>

        <div className="grid items-stretch gap-8 lg:grid-cols-2">
          <ScrollReveal>
            <div className={cn('h-full p-8', CONTACT_CARD)}>
              <h3 className="mb-6 text-lg font-bold text-brand-magenta">{t('details')}</h3>
              <ul className="space-y-5 text-neutral-700">
                <li className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-glow-cool/30 bg-glow-cool/10 text-brand-magenta">
                    <Phone className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">{t('phone')}</p>
                    <p className="mt-1 font-medium ltr:font-mono" dir="ltr">{PLACEHOLDER_CONTACT.phone}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-glow-cool/30 bg-glow-cool/10 text-brand-magenta">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">{t('address')}</p>
                    <p className="mt-1 font-medium">{address}</p>
                  </div>
                </li>
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.12}>
            <div className={cn('relative h-full min-h-80 overflow-hidden', CONTACT_CARD)}>
              <iframe
                title={t('mapTitle')}
                src={googleMapsEmbedSrc(locale)}
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
