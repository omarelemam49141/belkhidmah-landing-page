import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { cairo, tajawal } from '@/lib/fonts'
import { routing } from '@/i18n/routing'
import { MotionLevelProvider } from '@/hooks/use-motion-level'
import { MOTION_BOOTSTRAP_SCRIPT } from '@/lib/motion/level'
import '../globals.css'

export function generateStaticParams () {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata ({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!routing.locales.includes(locale as 'ar' | 'en')) {
    return {}
  }

  const t = await getTranslations({ locale, namespace: 'meta' })

  return {
    title: t('title'),
    description: t('description'),
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: '32x32' },
        { url: '/icon.svg', type: 'image/svg+xml' }
      ],
      apple: [{ url: '/apple-icon.png', sizes: '180x180' }]
    }
  }
}

export default async function LocaleLayout ({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as 'ar' | 'en')) {
    notFound()
  }

  setRequestLocale(locale)

  const messages = await getMessages({ locale })
  const isRTL = locale === 'ar'

  return (
    <html
      lang={locale}
      dir={isRTL ? 'rtl' : 'ltr'}
      className={`${cairo.variable} ${tajawal.variable}${isRTL ? ' locale-ar' : ''}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: MOTION_BOOTSTRAP_SCRIPT }} />
      </head>
      <body className={`${cairo.className} font-sans antialiased min-h-screen`}>
        <MotionLevelProvider>
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </MotionLevelProvider>
      </body>
    </html>
  )
}
