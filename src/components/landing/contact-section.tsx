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
      className="relative overflow-hidden bg-linear-to-b from-slate-50 via-white to-sky-50/20 py-24 sm:py-32"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_40%,rgba(14,165,233,0.06)_0%,transparent_50%),radial-gradient(circle_at_85%_60%,rgba(249,115,22,0.06)_0%,transparent_50%)]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="mb-16 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-sky-700 shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>{t('badge')}</span>
          </div>
          <h2 className={cn(LANDING_SECTION_TITLE_CLASS, 'text-slate-900')}>{t('title')}</h2>
          <span className="mx-auto mt-4 block h-1 w-16 rounded-full bg-linear-to-r from-trust-blue-500 to-warm-orange-500" />
        </ScrollReveal>

        <div className="grid items-stretch gap-8 lg:grid-cols-2">
          <ScrollReveal>
            <div className="h-full rounded-2xl border border-slate-200/90 bg-white p-8 shadow-md shadow-slate-100">
              <h3 className="mb-6 text-lg font-bold text-slate-900">{t('details')}</h3>
              <ul className="space-y-5 text-slate-700">
                <li className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-trust-blue-100 bg-trust-blue-50 text-trust-blue-600">
                    <Phone className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t('phone')}</p>
                    <p className="mt-1 font-medium ltr:font-mono" dir="ltr">{PLACEHOLDER_CONTACT.phone}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-warm-orange-100 bg-warm-orange-50 text-warm-orange-600">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t('address')}</p>
                    <p className="mt-1 font-medium">{address}</p>
                  </div>
                </li>
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.12}>
            <div className="relative h-full min-h-80 overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-md shadow-slate-100">
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
