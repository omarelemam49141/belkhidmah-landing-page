import type { Metadata } from 'next'
import { alternateLanguages, getSiteUrl, localePath } from '@/lib/site'

type PageMetaInput = {
  locale: string
  title: string
  description: string
  pathname?: string
}

export function buildPageMetadata ({
  locale,
  title,
  description,
  pathname = ''
}: PageMetaInput): Metadata {
  const canonicalPath = localePath(locale, pathname)
  const ogLocale = locale === 'ar' ? 'ar_SA' : 'en_US'
  const ogAlternateLocale = locale === 'ar' ? ['en_US'] : ['ar_SA']

  return {
    metadataBase: new URL(getSiteUrl()),
    title,
    description,
    alternates: {
      canonical: canonicalPath,
      languages: alternateLanguages(pathname)
    },
    openGraph: {
      type: 'website',
      locale: ogLocale,
      alternateLocale: ogAlternateLocale,
      title,
      description,
      url: canonicalPath,
      images: [
        {
          url: '/splash.png',
          width: 512,
          height: 512,
          alt: title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/splash.png']
    },
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: '32x32' },
        { url: '/icon.svg', type: 'image/svg+xml' }
      ],
      apple: [{ url: '/apple-icon.png', sizes: '180x180' }]
    }
  }
}
