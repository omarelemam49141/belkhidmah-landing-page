export const LOCALE_COOKIE = 'NEXT_LOCALE'

export function setLocaleCookie (locale: string) {
  document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=${60 * 60 * 24 * 365};SameSite=Lax`
}
