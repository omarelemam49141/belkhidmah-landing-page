export function homeSectionHref (
  id: string,
  pathname: string,
  locale: string
): string {
  if (pathname === '/') return `#${id}`
  return locale === 'ar' ? `/#${id}` : `/en/#${id}`
}
