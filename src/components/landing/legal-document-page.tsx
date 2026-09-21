'use client'

import { FileText } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { LandingNavbar } from '@/components/landing/landing-navbar'
import { LandingFooter } from '@/components/landing/landing-footer'
import { LANDING_SECTION_TITLE_CLASS } from '@/components/landing/landing-styles'
import { FadeIn } from '@/components/motion/fade-in'
import { MotionButton } from '@/components/motion/motion-button'
import { SmoothScroll } from '@/components/motion/smooth-scroll'
import { cn } from '@/lib/utils'

export type PrivacyPolicyLink = {
  label: string
  href: string
}

export type PrivacyPolicyItem = {
  label: string
  text: string
}

export type PrivacyPolicySection = {
  heading: string
  paragraphs?: string[]
  listIntro?: string
  links?: PrivacyPolicyLink[]
  bullets?: string[]
  items?: PrivacyPolicyItem[]
  after?: string[]
  email?: string
}

export function LegalDocumentPage ({
  title,
  intro,
  sections,
  copyright
}: {
  title: string
  intro: string[]
  sections: PrivacyPolicySection[]
  copyright: string
}) {
  const t = useTranslations('legal')

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-white text-neutral-900">
        <LandingNavbar />
        <main className="relative overflow-hidden pb-20 pt-28">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(75,109,148,0.10)_0%,transparent_55%),radial-gradient(circle_at_90%_20%,rgba(11,19,36,0.06)_0%,transparent_45%)]"
            aria-hidden
          />
          <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-blush bg-brand-blush/50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-brand-magenta shadow-sm">
                <FileText className="h-3.5 w-3.5 text-brand-magenta" />
                <span>{t('badge')}</span>
              </div>
              <h1 className={cn(LANDING_SECTION_TITLE_CLASS, 'mb-8 text-brand-magenta')}>{title}</h1>
            </FadeIn>

            <FadeIn delay={0.1}>
              <article className="rounded-2xl border border-brand-blush/80 bg-white p-8 shadow-lg shadow-brand-lilac/15 sm:p-10">
                <div className="space-y-4 text-base leading-relaxed text-neutral-700">
                  {intro.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}

                  {sections.map((section) => (
                    <section key={section.heading} className="space-y-3 pt-4">
                      <h2 className="text-xl font-bold text-brand-magenta sm:text-2xl">
                        {section.heading}
                      </h2>
                      {section.paragraphs?.map((paragraph, index) => {
                        const isLast = index === (section.paragraphs?.length ?? 0) - 1
                        return (
                          <p key={paragraph}>
                            {paragraph}
                            {isLast && section.email ? (
                              <>
                                {' '}
                                <a
                                  href={`mailto:${section.email}`}
                                  dir="ltr"
                                  className="inline-block text-brand-pink underline underline-offset-2 transition-colors hover:text-brand-magenta"
                                >
                                  {section.email}
                                </a>
                              </>
                            ) : null}
                          </p>
                        )
                      })}
                      {section.listIntro ? <p>{section.listIntro}</p> : null}
                      {section.links?.length ? (
                        <ul className="list-disc space-y-1 ps-6">
                          {section.links.map((link) => (
                            <li key={link.href}>
                              <a
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                dir="ltr"
                                className="inline-block text-brand-pink underline underline-offset-2 transition-colors hover:text-brand-magenta"
                              >
                                {link.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                      {section.bullets?.length ? (
                        <ul className="list-disc space-y-1 ps-6">
                          {section.bullets.map((bullet) => (
                            <li key={bullet}>{bullet}</li>
                          ))}
                        </ul>
                      ) : null}
                      {section.items?.length ? (
                        <ul className="list-disc space-y-2 ps-6">
                          {section.items.map((item) => (
                            <li key={item.label}>
                              <strong>{item.label} : </strong>
                              {item.text}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                      {section.after?.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </section>
                  ))}
                </div>
                <hr className="my-8 border-neutral-200" />
                <p className="text-sm text-neutral-500">{copyright}</p>
                <MotionButton asChild className="mt-8" variant="outline">
                  <Link href="/">{t('backHome')}</Link>
                </MotionButton>
              </article>
            </FadeIn>
          </div>
        </main>
        <LandingFooter />
      </div>
    </SmoothScroll>
  )
}
