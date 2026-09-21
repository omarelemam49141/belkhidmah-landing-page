const DEFAULT_GITHUB_PAGES_ORIGIN = 'https://omarelemam49141.github.io'

export function getBasePath (): string {
  const path = process.env.NEXT_PUBLIC_BASE_PATH ?? ''
  if (!path) return ''
  return path.startsWith('/') ? path : `/${path}`
}

/** Site origin (no trailing slash). Includes basePath when deployed under a subpath. */
export function getSiteUrl (): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')
  if (configured) {
    const basePath = getBasePath()
    if (basePath && !configured.endsWith(basePath)) {
      return `${configured}${basePath}`
    }
    return configured
  }

  if (process.env.NODE_ENV === 'production') {
    const basePath = getBasePath()
    return `${DEFAULT_GITHUB_PAGES_ORIGIN}${basePath}`
  }

  return 'http://localhost:3000'
}

export function localePath (locale: string, pathname = ''): string {
  const normalized = pathname.replace(/^\//, '').replace(/\/$/, '')
  const segment = normalized ? `/${normalized}` : ''
  const trailing = process.env.GITHUB_PAGES === 'true' ? '/' : ''
  return `/${locale}${segment}${trailing}`
}

export function absoluteLocaleUrl (locale: string, pathname = ''): string {
  return `${getSiteUrl()}${localePath(locale, pathname)}`
}

export function alternateLanguages (
  pathname = ''
): Record<string, string> {
  const languages: Record<string, string> = {}
  for (const locale of ['ar', 'en'] as const) {
    languages[locale] = absoluteLocaleUrl(locale, pathname)
  }
  languages['x-default'] = absoluteLocaleUrl('ar', pathname)
  return languages
}
