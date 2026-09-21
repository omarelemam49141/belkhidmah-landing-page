import type { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'
import { absoluteLocaleUrl } from '@/lib/site'

export const dynamic = 'force-static'

const ROUTES = ['', 'privacy'] as const

export default function sitemap (): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return routing.locales.flatMap((locale) =>
    ROUTES.map((route) => ({
      url: absoluteLocaleUrl(locale, route),
      lastModified,
      changeFrequency: route === '' ? 'weekly' : 'monthly',
      priority: route === '' ? 1 : 0.5
    }))
  )
}
