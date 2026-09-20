'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Download, Menu } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/routing'
import { BrandMark } from '@/components/brand/BrandMark'
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'
import { MotionButton } from '@/components/motion/motion-button'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { fadeUp, motionTransition, staggerContainer } from '@/lib/motion/presets'
import { homeSectionHref } from '@/lib/landing/home-section-href'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { id: 'home', labelKey: 'home' },
  { id: 'about', labelKey: 'about' },
  { id: 'services', labelKey: 'services' },
  { id: 'screens', labelKey: 'screens' },
  { id: 'contact', labelKey: 'contact' }
] as const

const SCROLL_COMPACT_AT = 16

export function LandingNavbar () {
  const tNav = useTranslations('nav')
  const tFooter = useTranslations('footer')
  const tHero = useTranslations('hero')
  const reduced = useReducedMotion()
  const pathname = usePathname()
  const locale = useLocale()
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeId, setActiveId] = useState<string | null>('home')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    let ticking = false

    const update = () => {
      const y = window.scrollY
      const compact = y > SCROLL_COMPACT_AT
      setIsScrolled((prev) => (prev === compact ? prev : compact))
      if (y < 96) setActiveId((prev) => (prev === 'home' ? prev : 'home'))
      ticking = false
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const sections = NAV_ITEMS.map((item) => document.getElementById(item.id)).filter(
      (el): el is HTMLElement => Boolean(el)
    )
    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible?.target.id) {
          setActiveId(visible.target.id)
        }
      },
      { rootMargin: '-28% 0px -58% 0px', threshold: [0, 0.2, 0.45, 0.7] }
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  const closeMenu = () => setMenuOpen(false)

  function navHref (id: (typeof NAV_ITEMS)[number]['id']) {
    return homeSectionHref(id, pathname, locale)
  }

  return (
    <motion.header
      className="pointer-events-none fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-5 sm:pt-4"
      initial={reduced ? false : { y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={motionTransition}
    >
      <div
        className={cn(
          'pointer-events-auto mx-auto flex max-w-7xl items-center gap-2 rounded-2xl border px-2.5 py-2 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 sm:gap-3 sm:px-3 lg:rounded-full lg:px-4',
          isScrolled
            ? 'border-white/15 bg-neutral-950/80 shadow-2xl shadow-black/40 backdrop-blur-xl'
            : 'border-white/10 bg-neutral-950/45 shadow-lg shadow-black/20 backdrop-blur-md'
        )}
      >
        <Link
          href="/"
          className="group flex min-w-0 shrink-0 items-center gap-2.5 rounded-xl pe-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        >
          <BrandMark
            size={36}
            framed
            className="transition-transform duration-300 group-hover:scale-105"
          />
          <div className="flex min-w-0 flex-col text-start">
            <span className="truncate text-sm font-bold tracking-tight text-white sm:text-base">
              {tFooter('brand')}
            </span>
            <span className="hidden truncate text-[11px] text-white/65 2xl:inline-block">
              {tHero('badge')}
            </span>
          </div>
        </Link>

        <nav
          aria-label={tNav('primary')}
          className="hidden min-w-0 flex-1 items-center justify-center lg:flex"
        >
          <div className="flex items-center gap-0.5 rounded-full border border-white/10 bg-white/5 p-1">
            {NAV_ITEMS.map((item) => {
              const isActive = activeId === item.id
              return (
                <a
                  key={item.id}
                  href={navHref(item.id)}
                  aria-current={isActive ? 'true' : undefined}
                  className={cn(
                    'relative rounded-full px-2.5 py-1.5 text-[13px] font-medium whitespace-nowrap transition-colors duration-200 xl:px-3.5 xl:text-sm',
                    isActive
                      ? 'text-white'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  )}
                >
                  {isActive && !reduced ? (
                    <motion.span
                      layoutId="landing-nav-pill"
                      className="absolute inset-0 rounded-full bg-white/12 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  ) : isActive ? (
                    <span className="absolute inset-0 rounded-full bg-white/12" />
                  ) : null}
                  <span className="relative z-10">{tNav(item.labelKey)}</span>
                </a>
              )
            })}
            <Link
              href="/privacy"
              className={cn(
                'relative rounded-full px-2.5 py-1.5 text-[13px] font-medium whitespace-nowrap text-white/70 transition-colors duration-200 hover:bg-white/5 hover:text-white xl:px-3.5 xl:text-sm',
                pathname === '/privacy' && 'text-white'
              )}
            >
              {pathname === '/privacy' && !reduced ? (
                <motion.span
                  layoutId="landing-nav-pill"
                  className="absolute inset-0 rounded-full bg-white/12 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]"
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                />
              ) : null}
              <span className="relative z-10">{tNav('privacy')}</span>
            </Link>
          </div>
        </nav>

        <div className="ms-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
          <div className="relative">
            {!reduced && (
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-glow-cool/45 blur-lg animate-nav-cta-glow"
              />
            )}
            <MotionButton
              asChild
              size="sm"
              className="rounded-full bg-linear-to-r from-brand-pink to-brand-magenta px-3 text-white shadow-lg shadow-overlay-ink/40 hover:from-brand-magenta hover:to-brand-pink sm:px-4"
            >
              <a href={homeSectionHref('download', pathname, locale)} className="flex items-center gap-1.5 font-semibold">
                <Download className="h-4 w-4" />
                <span className="hidden min-[380px]:inline">{tNav('download')}</span>
                <ArrowRight className="hidden h-3.5 w-3.5 sm:inline rtl:rotate-180" />
              </a>
            </MotionButton>
          </div>

          <LanguageSwitcher className="h-8 rounded-full border-white/15 bg-white/5 px-2.5 text-white shadow-none backdrop-blur-sm hover:bg-white/15 hover:text-white" />

          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-8 rounded-full border-white/15 bg-white/5 text-white shadow-none backdrop-blur-sm hover:bg-white/15 hover:text-white lg:hidden"
                aria-label={tNav('openMenu')}
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="flex w-[min(100vw-2rem,20rem)] flex-col border-white/10 bg-neutral-950/95 p-0 text-white backdrop-blur-xl"
            >
              <SheetHeader className="border-b border-white/10 px-5 py-4">
                <div className="flex items-center gap-3">
                  <BrandMark size={36} framed />
                  <div className="min-w-0 text-start">
                    <SheetTitle className="text-white">{tFooter('brand')}</SheetTitle>
                    <SheetDescription className="text-white/60">{tNav('menuTitle')}</SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              <motion.nav
                aria-label={tNav('primary')}
                className="flex flex-1 flex-col gap-1 p-3"
                initial={reduced ? false : 'hidden'}
                animate="visible"
                variants={reduced ? undefined : staggerContainer}
              >
                {NAV_ITEMS.map((item) => {
                  const isActive = activeId === item.id
                  return (
                    <motion.a
                      key={item.id}
                      href={navHref(item.id)}
                      onClick={closeMenu}
                      variants={reduced ? undefined : fadeUp}
                      aria-current={isActive ? 'true' : undefined}
                      className={cn(
                        'rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-200',
                        isActive
                          ? 'bg-white/12 text-white'
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                      )}
                    >
                      {tNav(item.labelKey)}
                    </motion.a>
                  )
                })}
                <motion.div variants={reduced ? undefined : fadeUp}>
                  <Link
                    href="/privacy"
                    onClick={closeMenu}
                    className="mt-1 flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2.5 text-sm font-medium text-white/90 transition-colors duration-200 hover:bg-white/10"
                  >
                    {tNav('privacy')}
                  </Link>
                </motion.div>
              </motion.nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  )
}
