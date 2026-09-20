'use client'

import { MapPin, Phone, Sparkles } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { ScrollReveal } from '@/components/motion/scroll-reveal'
import { LANDING_SECTION_TITLE_CLASS } from '@/components/landing/landing-styles'
import { PLACEHOLDER_CONTACT, googleMapsEmbedSrc } from '@/lib/landing/assets'
import { cn } from '@/lib/utils'

export function ContactSection () {
  const t = useTranslations('contact')
  const locale = useLocale()
  const address = locale === 'ar' ? PLACEHOLDER_CONTACT.addressAr : PLACEHOLDER_CONTACT.addressEn

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-linear-to-b from-white via-brand-blush/25 to-white py-24 sm:py-32"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_40%,rgba(145,40,141,0.08)_0%,transparent_50%),radial-gradient(circle_at_85%_60%,rgba(219,44,145,0.08)_0%,transparent_50%)]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="mb-16 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-blush bg-brand-blush/50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-brand-magenta shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-brand-pink" />
            <span>{t('badge')}</span>
          </div>
          <h2 className={cn(LANDING_SECTION_TITLE_CLASS, 'text-brand-magenta')}>{t('title')}</h2>
          <span className="mx-auto mt-4 block h-1 w-16 rounded-full bg-linear-to-r from-brand-magenta to-brand-pink" />
        </ScrollReveal>

        <div className="grid items-stretch gap-8 lg:grid-cols-2">
          <ScrollReveal>
            <div className="h-full rounded-2xl border border-brand-blush/80 bg-white p-8 shadow-md shadow-brand-lilac/15">
              <h3 className="mb-6 text-lg font-bold text-brand-magenta">{t('details')}</h3>
              <ul className="space-y-5 text-neutral-700">
                <li className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand-blush bg-brand-blush/60 text-brand-magenta">
                    <Phone className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">{t('phone')}</p>
                    <p className="mt-1 font-medium ltr:font-mono" dir="ltr">{PLACEHOLDER_CONTACT.phone}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand-pink/20 bg-brand-blush/70 text-brand-pink">
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
            <div className="relative h-full min-h-80 overflow-hidden rounded-2xl border border-brand-blush/80 bg-white shadow-md shadow-brand-lilac/15">
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
