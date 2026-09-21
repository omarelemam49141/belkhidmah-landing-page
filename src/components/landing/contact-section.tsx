'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import {
  ChevronDown,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
  Sparkles
} from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { ScrollHighlightHeading } from '@/components/motion/scroll-highlight-heading'
import { ScrollReveal } from '@/components/motion/scroll-reveal'
import { LANDING_SECTION_TITLE_CLASS } from '@/components/landing/landing-styles'
import {
  CONTACT,
  CONTACT_LOCATION_SRC,
  googleMapsEmbedSrc
} from '@/lib/landing/assets'
import { initContactFacilitiesAnimation } from '@/lib/motion/jahez-scroll-triggers'
import { useFullMotion } from '@/hooks/use-motion-level'
import { cn } from '@/lib/utils'

export function ContactSection () {
  const t = useTranslations('contact')
  const locale = useLocale()
  const fullMotion = useFullMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0)
  const [mobileMapLayer, setMobileMapLayer] = useState<1 | 2>(1)

  useEffect(() => {
    if (!fullMotion || !sectionRef.current) return
    const anim = initContactFacilitiesAnimation({ sectionEl: sectionRef.current })
    return () => anim?.kill()
  }, [fullMotion])

  const cards = [
    {
      id: 0,
      icon: Mail,
      label: t('email'),
      title: t('emailTitle'),
      body: t('emailBody'),
      ctaText: t('emailCta'),
      ctaHref: `mailto:${CONTACT.email}`,
      extra: (
        <p className="mt-2 text-sm font-semibold text-brand-magenta" dir="ltr">
          {CONTACT.email}
        </p>
      )
    },
    {
      id: 1,
      icon: Phone,
      label: t('phone'),
      title: t('phonesLabel'),
      body: t('phoneBody'),
      ctaText: t('phoneCta'),
      ctaHref: `tel:${CONTACT.phones[0].tel}`,
      extra: (
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-semibold text-brand-magenta" dir="ltr">
          {CONTACT.phones.map((phone, idx) => (
            <span key={phone.tel} className="inline-flex items-center gap-2">
              {idx > 0 && <span className="text-neutral-300">—</span>}
              <a
                href={`tel:${phone.tel}`}
                className="underline-offset-4 hover:text-brand-pink hover:underline"
              >
                {phone.display}
              </a>
            </span>
          ))}
        </div>
      )
    },
    {
      id: 2,
      icon: MapPin,
      label: t('maps'),
      title: t('locationTitle'),
      body: t('locationBody'),
      ctaText: t('mapsCta'),
      ctaHref: CONTACT.mapsUrl,
      external: true,
      extra: (
        <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-neutral-600">
          {t('locationHours')}
        </p>
      )
    }
  ]

  return (
    <section
      ref={sectionRef}
      id="contact"
      className={cn(
        'relative z-20 flex scroll-mt-20 flex-col bg-white pt-22 pb-12',
        fullMotion ? 'md:h-svh md:overflow-hidden md:pb-6' : 'md:pb-16'
      )}
    >
      <div className="relative z-10 mx-auto w-full max-w-7xl shrink-0 px-4 sm:px-6 lg:px-8">
        <div className="mb-6 text-center sm:mb-8 md:mb-6">
          <ScrollReveal>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-brand-blush bg-brand-blush/50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-brand-magenta shadow-xs">
              <Sparkles className="h-3.5 w-3.5 text-brand-pink" />
              <span>{t('badge')}</span>
            </div>
          </ScrollReveal>
          <ScrollHighlightHeading className={cn(LANDING_SECTION_TITLE_CLASS, 'text-brand-magenta')}>
            {t('title')}
          </ScrollHighlightHeading>
          <ScrollReveal>
            <span className="mx-auto mt-2.5 block h-1 w-16 rounded-full bg-linear-to-r from-brand-magenta to-brand-pink" />
          </ScrollReveal>
        </div>
      </div>

      <div className="relative z-10 mx-auto hidden min-h-0 w-full max-w-7xl flex-1 grid-cols-12 items-stretch gap-6 px-4 sm:px-6 md:grid lg:gap-8 lg:px-8">
        <div className="flex min-h-0 flex-col justify-center gap-3 md:col-span-5">
          {cards.map((card) => {
            const Icon = card.icon
            return (
              <div
                key={card.id}
                data-contact-card={card.id}
                className={cn(
                  'group/card flex flex-col overflow-hidden rounded-[1.75rem] border border-glow-cool/25 bg-trust-blue-50/60 shadow-xs',
                  'transition-colors duration-400 ease-[cubic-bezier(0.61,0.22,0.51,0.89)]',
                  '[&.is-active]:border-brand-magenta/40 [&.is-active]:bg-trust-blue-50 [&.is-active]:shadow-md',
                  card.id === 0 && 'is-active'
                )}
              >
                <button
                  type="button"
                  data-contact-toggler
                  className="flex h-16 w-full shrink-0 cursor-pointer items-center justify-between px-5 text-start group-[.is-active]/card:cursor-default lg:h-[4.5rem] lg:px-6"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-brand-blush/60 bg-white text-brand-magenta shadow-xs group-[.is-active]/card:text-brand-pink">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="truncate text-base font-bold text-brand-magenta lg:text-lg">
                      {card.label}
                    </span>
                  </span>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-brand-blush/60 bg-white text-brand-magenta transition-transform duration-300 group-[.is-active]/card:rotate-180">
                    <ChevronDown className="h-5 w-5" />
                  </span>
                </button>

                <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.61,0.22,0.51,0.89)] group-[.is-active]/card:grid-rows-[1fr]">
                  <div className="overflow-hidden">
                    <div className="px-5 pb-5 pt-1 opacity-0 transition-opacity duration-300 group-[.is-active]/card:opacity-100 lg:px-6 lg:pb-6">
                      <h3 className="text-lg font-bold tracking-tight text-neutral-900 lg:text-2xl">
                        {card.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                        {card.body}
                      </p>
                      {card.extra}
                      <div className="pt-4">
                        <a
                          href={card.ctaHref}
                          target={card.external ? '_blank' : undefined}
                          rel={card.external ? 'noopener noreferrer' : undefined}
                          className="inline-flex w-fit items-center gap-2 rounded-full bg-linear-to-r from-brand-magenta to-brand-pink px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:from-brand-pink hover:to-brand-magenta"
                        >
                          <span>{card.ctaText}</span>
                          {card.external ? <ExternalLink className="h-3.5 w-3.5 rtl:rotate-90" /> : null}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="relative min-h-0 overflow-hidden rounded-[1.75rem] border border-glow-cool/25 bg-neutral-100 shadow-xl md:col-span-7">
          <div data-map-layer="1" className="absolute inset-0">
            <iframe
              title={t('mapTitle')}
              src={googleMapsEmbedSrc(locale)}
              className="h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <div data-map-layer="2" className="pointer-events-none absolute inset-0 opacity-0">
            <Image
              src={CONTACT_LOCATION_SRC}
              alt={t('locationAlt')}
              fill
              sizes="(min-width: 768px) 58vw, 100vw"
              className="object-cover"
            />
          </div>
          <a
            href={CONTACT.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-x-4 bottom-4 z-20 flex items-center justify-between rounded-2xl border border-white/60 bg-white/95 px-4 py-3 text-sm font-bold text-brand-magenta shadow-lg backdrop-blur-md hover:border-brand-magenta/40"
          >
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-brand-pink" />
              {t('mapsCta')}
            </span>
            <ExternalLink className="h-4 w-4 rtl:rotate-90" />
          </a>
        </div>
      </div>

      <div className="flex flex-col gap-6 px-4 sm:px-6 md:hidden">
        <div className="relative h-72 w-full overflow-hidden rounded-[1.75rem] border border-glow-cool/25 bg-neutral-100 shadow-md">
          {mobileMapLayer === 1 ? (
            <iframe
              title={t('mapTitle')}
              src={googleMapsEmbedSrc(locale)}
              className="h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          ) : (
            <Image
              src={CONTACT_LOCATION_SRC}
              alt={t('locationAlt')}
              fill
              sizes="100vw"
              className="object-cover"
            />
          )}
          <button
            type="button"
            onClick={() => setMobileMapLayer(mobileMapLayer === 1 ? 2 : 1)}
            className="absolute top-3 end-3 z-20 rounded-full border border-white/60 bg-white/90 px-3 py-1 text-xs font-semibold text-brand-magenta shadow-xs"
          >
            {mobileMapLayer === 1 ? t('locationAlt') : t('mapTitle')}
          </button>
          <a
            href={CONTACT.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-x-4 bottom-4 z-20 flex items-center justify-between rounded-xl border border-white/60 bg-white/95 px-4 py-2.5 text-xs font-bold text-brand-magenta shadow-md"
          >
            <span>{t('mapsCta')}</span>
            <ExternalLink className="h-3.5 w-3.5 rtl:rotate-90" />
          </a>
        </div>

        <div className="flex flex-col gap-3">
          {cards.map((card) => {
            const Icon = card.icon
            const isOpen = mobileActiveIndex === card.id
            return (
              <div
                key={card.id}
                className={cn(
                  'overflow-hidden rounded-[1.5rem] border border-glow-cool/25 bg-trust-blue-50/70',
                  isOpen && 'border-brand-magenta/40 bg-trust-blue-50 shadow-sm'
                )}
              >
                <button
                  type="button"
                  onClick={() => {
                    setMobileActiveIndex(card.id)
                    if (card.id === 2) setMobileMapLayer(2)
                  }}
                  className="flex w-full items-center justify-between px-5 py-4 text-start"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-blush/60 bg-white text-brand-magenta">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="text-base font-bold text-brand-magenta">{card.label}</span>
                  </span>
                  <span className={cn('flex h-8 w-8 items-center justify-center rounded-lg border border-brand-blush/60 bg-white text-brand-magenta transition-transform', isOpen && 'rotate-180')}>
                    <ChevronDown className="h-4 w-4" />
                  </span>
                </button>
                {isOpen ? (
                  <div className="px-5 pb-5 pt-1">
                    <h3 className="text-lg font-bold text-neutral-900">{card.title}</h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-neutral-600">{card.body}</p>
                    {card.extra}
                    <div className="mt-4">
                      <a
                        href={card.ctaHref}
                        target={card.external ? '_blank' : undefined}
                        rel={card.external ? 'noopener noreferrer' : undefined}
                        className="inline-flex items-center gap-1.5 rounded-full bg-linear-to-r from-brand-magenta to-brand-pink px-5 py-2 text-xs font-semibold text-white"
                      >
                        <span>{card.ctaText}</span>
                        {card.external ? <ExternalLink className="h-3 w-3 rtl:rotate-90" /> : null}
                      </a>
                    </div>
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
