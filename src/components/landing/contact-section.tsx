'use client'

import { MapPin, Phone, Sparkles } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { ScrollReveal } from '@/components/motion/scroll-reveal'
import { SpotlightTiltCard } from '@/components/motion/spotlight-tilt-card'
import { LANDING_SECTION_TITLE_CLASS } from '@/components/landing/landing-styles'
import { PLACEHOLDER_CONTACT, googleMapsEmbedSrc } from '@/lib/landing/assets'
import { cn } from '@/lib/utils'

const CONTACT_CARD_3D =
  'rounded-2xl border border-glow-cool/40 bg-white shadow-[0_2px_3px_rgba(11,19,36,0.06),0_10px_24px_-6px_rgba(75,109,148,0.32),0_28px_56px_-18px_rgba(11,19,36,0.22),inset_0_1px_0_rgba(255,255,255,1)]'

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
