'use client'

import { Mail, MapPin, Phone, Sparkles } from 'lucide-react'
import { motion, type Variants } from 'framer-motion'
import { useLocale, useTranslations } from 'next-intl'
import { ScrollHighlightHeading } from '@/components/motion/scroll-highlight-heading'
import { ScrollReveal } from '@/components/motion/scroll-reveal'
import { LANDING_SECTION_TITLE_CLASS } from '@/components/landing/landing-styles'
import { CONTACT, googleMapsEmbedSrc } from '@/lib/landing/assets'
import { useFullMotion } from '@/hooks/use-motion-level'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { cn } from '@/lib/utils'

const CONTACT_CARD =
  'flex h-full items-start gap-3 rounded-2xl border border-glow-cool/40 bg-white p-5 shadow-sm outline-none transition-shadow hover:border-brand-magenta/30 hover:shadow-md focus-visible:ring-2 focus-visible:ring-brand-magenta/40'

const LINK_CLASS =
  'font-medium underline-offset-4 transition-colors hover:text-brand-magenta hover:underline'

const contactStagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.06 } }
}

const contactItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] }
  }
}

const contactIcon: Variants = {
  hidden: { scale: 0.7, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: 'spring', stiffness: 420, damping: 18 }
  }
}

function ContactIcon ({
  children,
  animate
}: {
  children: React.ReactNode
  animate: boolean
}) {
  return (
    <motion.span
      variants={animate ? contactIcon : undefined}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-glow-cool/30 bg-glow-cool/10 text-brand-magenta"
    >
      {children}
    </motion.span>
  )
}

export function ContactSection () {
  const t = useTranslations('contact')
  const locale = useLocale()
  const reduced = useReducedMotion()
  const fullMotion = useFullMotion()
  const play = !reduced
  const rich = fullMotion && !reduced
  const isRtl = locale === 'ar'

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
          <motion.div
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1"
            variants={play ? contactStagger : undefined}
            initial={play ? 'hidden' : undefined}
            whileInView={play ? 'visible' : undefined}
            viewport={{ once: true, margin: '-50px' }}
          >
            <motion.div variants={play ? contactItem : undefined}>
              <motion.a
                href={`mailto:${CONTACT.email}`}
                whileHover={rich ? { y: -4 } : undefined}
                transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                className={CONTACT_CARD}
              >
                <ContactIcon animate={rich}>
                  <Mail className="h-5 w-5" />
                </ContactIcon>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    {t('email')}
                  </p>
                  <p className={cn('mt-1', LINK_CLASS)} dir="ltr">
                    {CONTACT.email}
                  </p>
                </div>
              </motion.a>
            </motion.div>

            <motion.div variants={play ? contactItem : undefined} className="sm:col-span-2 lg:col-span-1">
              <motion.div
                whileHover={rich ? { y: -4 } : undefined}
                transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                className={CONTACT_CARD}
              >
                <ContactIcon animate={rich}>
                  <Phone className="h-5 w-5" />
                </ContactIcon>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    {t('phone')}
                  </p>
                  <p className="mt-1 text-sm font-medium text-neutral-700">{t('phonesLabel')}</p>
                  <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1" dir="ltr">
                    {CONTACT.phones.map((phone, index) => (
                      <span key={phone.tel} className="inline-flex items-center gap-2">
                        {index > 0 ? (
                          <span className="text-neutral-400" aria-hidden>
                            —
                          </span>
                        ) : null}
                        <a href={`tel:${phone.tel}`} className={LINK_CLASS}>
                          {phone.display}
                        </a>
                      </span>
                    ))}
                  </p>
                </div>
              </motion.div>
            </motion.div>

            <motion.div variants={play ? contactItem : undefined}>
              <motion.a
                href={CONTACT.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={rich ? { y: -4 } : undefined}
                transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                className={CONTACT_CARD}
              >
                <ContactIcon animate={rich}>
                  <MapPin className="h-5 w-5" />
                </ContactIcon>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    {t('maps')}
                  </p>
                  <p className={cn('mt-1', LINK_CLASS)}>{t('mapsCta')}</p>
                </div>
              </motion.a>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative min-h-80 overflow-hidden rounded-2xl border border-glow-cool/40 bg-white lg:min-h-full"
            initial={
              rich
                ? {
                    opacity: 0,
                    clipPath: isRtl ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)'
                  }
                : play
                  ? { opacity: 0, y: 24 }
                  : undefined
            }
            whileInView={
              rich
                ? { opacity: 1, clipPath: 'inset(0 0 0 0)' }
                : play
                  ? { opacity: 1, y: 0 }
                  : undefined
            }
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: rich ? 0.85 : 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <iframe
              title={t('mapTitle')}
              src={googleMapsEmbedSrc(locale)}
              className="absolute inset-0 h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <motion.span
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-[42%] z-10 text-brand-magenta drop-shadow-md"
              initial={rich ? { y: -28, opacity: 0, scale: 0.7 } : undefined}
              whileInView={rich ? { y: 0, opacity: 1, scale: 1 } : undefined}
              viewport={{ once: true }}
              transition={{ delay: 0.45, type: 'spring', stiffness: 380, damping: 16 }}
            >
              <MapPin className="h-9 w-9 -translate-x-1/2 fill-brand-magenta/20" />
            </motion.span>
            <a
              href={CONTACT.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-x-4 bottom-4 z-10 inline-flex items-center justify-center gap-2 rounded-xl border border-glow-cool/40 bg-white/95 px-4 py-2.5 text-sm font-semibold text-brand-magenta shadow-sm backdrop-blur-sm transition-colors hover:border-brand-magenta/40 hover:bg-white"
            >
              <MapPin className="h-4 w-4" />
              {t('mapsCta')}
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
