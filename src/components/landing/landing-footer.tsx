'use client'

import { ChevronUp } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { Link as LocaleLink, usePathname } from '@/i18n/routing'
import { BrandMark } from '@/components/brand/BrandMark'
import { homeSectionHref } from '@/lib/landing/home-section-href'

export function LandingFooter () {
  const t = useTranslations('footer')
  const tNav = useTranslations('nav')
  const currentYear = new Date().getFullYear()
  const pathname = usePathname()
  const locale = useLocale()
  const sectionHref = (id: string) => homeSectionHref(id, pathname, locale)

  return (
    <footer className="relative border-t border-neutral-800 bg-neutral-950 text-neutral-300">
      <button
        type="button"
        onClick={() => {
          const lenis = window.__landingLenis
          if (lenis) lenis.scrollTo(0, { duration: 1.2 })
          else window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
        className="absolute left-1/2 top-0 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-brand-magenta text-white shadow-lg transition-transform hover:scale-105"
        aria-label={t('backToTop')}
      >
        <ChevronUp className="h-5 w-5" />
      </button>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <BrandMark size={44} framed />
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-white">{t('brand')}</span>
                <span className="text-xs text-neutral-400">{t('tagline')}</span>
              </div>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-neutral-400">{t('mission')}</p>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-white">
              {tNav('primary')}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href={sectionHref('about')} className="transition-colors hover:text-warm-orange-400">
                  {tNav('about')}
                </a>
              </li>
              <li>
                <a href={sectionHref('services')} className="transition-colors hover:text-warm-orange-400">
                  {tNav('services')}
                </a>
              </li>
              <li>
                <a href={sectionHref('screens')} className="transition-colors hover:text-warm-orange-400">
                  {tNav('screens')}
                </a>
              </li>
              <li>
                <a href={sectionHref('contact')} className="transition-colors hover:text-warm-orange-400">
                  {tNav('contact')}
                </a>
              </li>
              <li>
                <LocaleLink href="/privacy" className="transition-colors hover:text-warm-orange-400">
                  {tNav('privacy')}
                </LocaleLink>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-neutral-800/80 pt-8 text-center text-xs text-neutral-400">
          <p>{t('copyright', { year: currentYear })}</p>
        </div>
      </div>
    </footer>
  )
}
