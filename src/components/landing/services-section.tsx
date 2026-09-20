'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import {
  Brush,
  ChefHat,
  Sparkles,
  UserRound,
  Users,
  Wind
} from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { ScrollReveal } from '@/components/motion/scroll-reveal'
import { ParallaxBackground } from '@/components/motion/parallax-background'
import { initFacilityCardsAnimation } from '@/lib/motion/jahez-scroll-triggers'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { LANDING_SECTION_TITLE_CLASS } from '@/components/landing/landing-styles'
import { SpotlightTiltCard } from '@/components/motion/spotlight-tilt-card'
import {
  SERVICES_PHONE_SRC_AR,
  SERVICES_PHONE_SRC_EN,
  SERVICES_SCENE_SRC
} from '@/lib/landing/assets'
import { cn } from '@/lib/utils'

const SERVICE_ITEMS = [
  { key: 'cleaning' as const, icon: Brush, color: 'text-brand-blush', wrap: 'bg-brand-magenta/30 border-brand-lilac/40' },
  { key: 'laundry' as const, icon: Wind, color: 'text-brand-blush', wrap: 'bg-brand-pink/25 border-brand-pink/40' },
  { key: 'agedCare' as const, icon: Users, color: 'text-white', wrap: 'bg-brand-lilac/35 border-brand-blush/35' },
  { key: 'cooking' as const, icon: ChefHat, color: 'text-brand-blush', wrap: 'bg-brand-pink/20 border-brand-lilac/40' },
  { key: 'other' as const, icon: UserRound, color: 'text-white', wrap: 'bg-white/12 border-brand-blush/40' }
]

export function ServicesSection () {
  const locale = useLocale()
  const t = useTranslations('services')
  const phoneSrc =
    locale === 'ar' ? SERVICES_PHONE_SRC_AR : SERVICES_PHONE_SRC_EN
  const reduced = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (reduced || !sectionRef.current) return
    const anim = initFacilityCardsAnimation({ sectionEl: sectionRef.current })
    return () => anim?.kill()
  }, [reduced])

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative overflow-hidden py-24 text-white sm:py-32"
    >
      <ParallaxBackground
        src={SERVICES_SCENE_SRC}
        overlayClassName="bg-linear-to-b from-brand-magenta/45 via-neutral-950/78 to-neutral-950/88"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,rgba(145,40,141,0.28)_0%,transparent_55%),radial-gradient(ellipse_at_right,rgba(219,44,145,0.18)_0%,transparent_50%)]" />
      </ParallaxBackground>

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <ScrollReveal className="flex justify-center lg:justify-start">
          <SpotlightTiltCard glass={false}>
            <Image
              src={phoneSrc}
              alt=""
              width={520}
              height={640}
              priority
              className="h-auto w-[240px] drop-shadow-2xl sm:w-[320px] lg:w-[380px]"
            />
          </SpotlightTiltCard>
        </ScrollReveal>

        <div>
          <ScrollReveal className="mb-10">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-white shadow-xs">
              <Sparkles className="h-3.5 w-3.5 text-brand-blush" />
              <span>{t('badge')}</span>
            </div>
            <h2 className={cn(LANDING_SECTION_TITLE_CLASS, 'text-white')}>{t('title')}</h2>
            <span className="mt-4 block h-1 w-16 rounded-full bg-linear-to-r from-brand-pink to-brand-lilac" />
          </ScrollReveal>

          <ul className="space-y-3">
            {SERVICE_ITEMS.map((item) => {
              const Icon = item.icon
              return (
                <li
                  key={item.key}
                  data-facility-card
                  className="group flex items-center gap-4 rounded-2xl border border-white/12 bg-white/8 px-4 py-3.5 shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-white/25 hover:bg-white/12 [transform-style:preserve-3d]"
                >
                  <span
                    data-facility-stagger
                    data-facility-media
                    className={cn(
                      'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border',
                      item.wrap
                    )}
                  >
                    <Icon className={cn('h-6 w-6', item.color)} />
                  </span>
                  <span data-facility-stagger className="text-lg font-semibold tracking-tight">
                    {t(item.key)}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
