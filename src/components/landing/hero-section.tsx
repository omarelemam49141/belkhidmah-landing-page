'use client'

import { ArrowRight, ExternalLink } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { BrandMark } from '@/components/brand/BrandMark'
import { VENDOR_PORTAL_URL } from '@/lib/site'
import { HeroSplashTarget, usePageSplash } from '@/components/landing/page-splash'
import { PhoneMockup } from '@/components/landing/phone-mockup'
import { FadeIn } from '@/components/motion/fade-in'
import { ScrollHighlightHeading } from '@/components/motion/scroll-highlight-heading'
import { ScrollLineReveal } from '@/components/motion/scroll-line-reveal'
import { MotionButton } from '@/components/motion/motion-button'
import { ParallaxBackground } from '@/components/motion/parallax-background'
import { SpotlightTiltCard } from '@/components/motion/spotlight-tilt-card'
import { LANDING_HERO_COPY_WIDTH } from '@/components/landing/landing-styles'
import { heroPhoneScreens, HERO_SCENE_SRC } from '@/lib/landing/assets'
import { cn } from '@/lib/utils'

export function HeroSection () {
  const locale = useLocale()
  const t = useTranslations('hero')
  const { skipped } = usePageSplash()
  const phoneScreens = heroPhoneScreens(locale)

  const phone = (
    <>
      <div className="absolute inset-8 rounded-[3rem] bg-glow-cool/35 blur-3xl hero-phone-glow" aria-hidden />
      <div className="relative z-10 animate-float">
        <SpotlightTiltCard glass={false}>
          <PhoneMockup lead={<HeroSplashTarget />} screens={phoneScreens} priority />
        </SpotlightTiltCard>
      </div>
    </>
  )

  return (
    <section id="home" className="relative flex min-h-[94vh] items-center overflow-hidden">
      <ParallaxBackground
        src={HERO_SCENE_SRC}
        priority
        overlayClassName="bg-linear-to-b from-overlay-ink/90 via-overlay-mid/78 to-overlay-ink/94"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(75,109,148,0.28)_0%,transparent_70%)]" />
      </ParallaxBackground>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-10 px-4 py-28 sm:px-6 sm:py-32 lg:grid-cols-2 lg:gap-12 lg:px-8">
        <div className="order-2 flex justify-center lg:order-1">
          {skipped ? (
            <FadeIn delay={0.2} className="relative">
              {phone}
            </FadeIn>
          ) : (
            <div className="relative">{phone}</div>
          )}
        </div>

        <div className="order-1 text-center lg:order-2 lg:text-start">
          <FadeIn>
            <BrandMark
              size={72}
              className="mx-auto mb-6 drop-shadow-[0_6px_18px_rgba(0,0,0,0.75)] lg:mx-0"
            />
          </FadeIn>

          <ScrollHighlightHeading
            as="h1"
            className={cn(
              LANDING_HERO_COPY_WIDTH,
              'mb-4 text-balance text-3xl font-extrabold leading-[1.15] tracking-tight text-white sm:text-5xl lg:text-6xl'
            )}
          >
            {t('title')}
          </ScrollHighlightHeading>

          <ScrollLineReveal
            className={cn(LANDING_HERO_COPY_WIDTH, 'mb-2 text-xl font-semibold text-white sm:text-2xl')}
          >
            {t('subtitle')}
          </ScrollLineReveal>
          <ScrollLineReveal
            className={cn(
              LANDING_HERO_COPY_WIDTH,
              'text-base font-normal leading-relaxed text-white/90 sm:text-xl'
            )}
          >
            {t('description')}
          </ScrollLineReveal>

          <FadeIn delay={0.45} className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
            <MotionButton
              asChild
              size="lg"
              className="group relative overflow-hidden bg-linear-to-r from-brand-pink via-brand-magenta to-brand-pink px-8 py-6 text-base font-bold text-white shadow-[0_10px_25px_-5px_rgba(11,19,36,0.55)] transition-all duration-300 hover:shadow-[0_15px_30px_-5px_rgba(11,19,36,0.7)]"
            >
              <a href="#download" className="flex items-center gap-2">
                <span>{t('ctaPrimary')}</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
              </a>
            </MotionButton>

            <MotionButton
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 bg-white/10 px-8 py-6 text-base font-semibold text-white shadow-lg backdrop-blur-md hover:border-white/50 hover:bg-white/20"
            >
              <a href="#about">{t('ctaSecondary')}</a>
            </MotionButton>

            <MotionButton
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 bg-white/10 px-8 py-6 text-base font-semibold text-white shadow-lg backdrop-blur-md hover:border-white/50 hover:bg-white/20"
            >
              <a href={VENDOR_PORTAL_URL} className="flex items-center gap-2">
                <span>{t('ctaPortal')}</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </MotionButton>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
