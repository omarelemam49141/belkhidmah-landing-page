'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { BrandMark } from '@/components/brand/BrandMark'
import { FadeIn } from '@/components/motion/fade-in'
import { ParallaxBackground } from '@/components/motion/parallax-background'
import { LANDING_SECTION_TITLE_CLASS } from '@/components/landing/landing-styles'
import {
  APPLE_STORE_BTN_SRC,
  DOWNLOAD_SCENE_SRC,
  GOOGLE_PLAY_BTN_SRC,
  STORE_LINKS
} from '@/lib/landing/assets'
import { cn } from '@/lib/utils'

const STORE_LINK_BASE =
  'inline-flex h-14 shrink-0 items-center justify-center rounded-xl shadow-lg transition-transform duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50'

const STORE_LINK_CLASS = cn(STORE_LINK_BASE, 'w-[11.75rem] sm:w-[12.5rem]')

const STORE_IMAGE_CLASS = 'h-14 w-auto max-w-full rounded-xl object-contain object-center'

export function DownloadSection () {
  const t = useTranslations('download')

  return (
    <section id="download" className="relative overflow-hidden py-28 text-white sm:py-36">
      <ParallaxBackground
        src={DOWNLOAD_SCENE_SRC}
        overlayClassName="bg-neutral-950/85"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.18)_0%,rgba(14,165,233,0.15)_40%,transparent_75%)]" />
      </ParallaxBackground>

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <FadeIn>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white shadow-xl backdrop-blur-md sm:text-sm">
            <span className="flex h-2 w-2 rounded-full bg-impact-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
            <Sparkles className="h-3.5 w-3.5 text-warm-orange-400" />
            <span>{t('badge')}</span>
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <h2 className={cn(LANDING_SECTION_TITLE_CLASS, 'mb-10 text-balance text-white')}>
            {t('title')}
          </h2>
        </FadeIn>

        <FadeIn delay={0.3} className="flex flex-wrap items-stretch justify-center gap-4 sm:gap-6">
          <a href={STORE_LINKS.apple} className={STORE_LINK_CLASS}>
            <Image
              src={APPLE_STORE_BTN_SRC}
              alt={t('appleAlt')}
              width={808}
              height={309}
              className={STORE_IMAGE_CLASS}
            />
          </a>
          <a href={STORE_LINKS.google} className={STORE_LINK_CLASS}>
            <Image
              src={GOOGLE_PLAY_BTN_SRC}
              alt={t('googleAlt')}
              width={667}
              height={199}
              className={STORE_IMAGE_CLASS}
            />
          </a>
        </FadeIn>
      </div>
    </section>
  )
}
