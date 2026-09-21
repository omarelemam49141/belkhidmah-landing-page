const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

function localAsset (path: string) {
  return `${BASE_PATH}${path}`
}

export const LOGO_SRC = localAsset('/images/logo.svg')

export const HERO_PHONE_SRC_AR = localAsset('/images/hero-section/companies-ar.jpeg')
export const HERO_PHONE_SRC_EN = localAsset('/images/hero-section/companies-en.jpeg')
export const HERO_FAQ_SRC_AR = localAsset('/images/hero-section/faqs-ar.jpeg')
export const HERO_FAQ_SRC_EN = localAsset('/images/hero-section/faqs-en.jpeg')

export function heroPhoneSrc (locale: string) {
  return locale === 'ar' ? HERO_PHONE_SRC_AR : HERO_PHONE_SRC_EN
}

export function heroPhoneScreens (locale: string) {
  return locale === 'ar'
    ? [HERO_PHONE_SRC_AR, HERO_FAQ_SRC_AR]
    : [HERO_PHONE_SRC_EN, HERO_FAQ_SRC_EN]
}

/** @deprecated Use `heroPhoneSrc(locale)` */
export const HERO_PHONE_SRC = HERO_PHONE_SRC_AR

export const SERVICES_PHONE_SRC_AR = localAsset('/images/services-section/favourite-ar.jpeg')
export const SERVICES_PHONE_SRC_EN = localAsset('/images/services-section/favourite-en.jpeg')
export const SERVICES_ORDERS_SRC_AR = localAsset('/images/services-section/orders-ar.jpeg')
export const SERVICES_ORDERS_SRC_EN = localAsset('/images/services-section/orders-en.jpeg')

export function servicesPhoneSrc (locale: string) {
  return locale === 'ar' ? SERVICES_PHONE_SRC_AR : SERVICES_PHONE_SRC_EN
}

export function servicesPhoneScreens (locale: string) {
  return locale === 'ar'
    ? [SERVICES_PHONE_SRC_AR, SERVICES_ORDERS_SRC_AR]
    : [SERVICES_PHONE_SRC_EN, SERVICES_ORDERS_SRC_EN]
}

/** @deprecated Use `servicesPhoneSrc(locale)` */
export const SERVICES_PHONE_SRC = SERVICES_PHONE_SRC_EN
export const APPLE_STORE_BTN_SRC = localAsset('/images/stores-section/apple-store.png')
export const GOOGLE_PLAY_BTN_SRC = localAsset('/images/stores-section/google-play.png')

const APP_SCREEN_BASENAMES = [
  'notifications',
  'offers',
  'orders',
  'profile',
  'support',
  'tickets-history'
] as const

export const APP_SCREEN_SRCS_AR = APP_SCREEN_BASENAMES.map((name) =>
  localAsset(`/images/app-screen-section/${name}-ar.jpeg`)
)

export const APP_SCREEN_SRCS_EN = APP_SCREEN_BASENAMES.map((name) =>
  localAsset(`/images/app-screen-section/${name}-en.jpeg`)
)

/** @deprecated Use `appScreenSrcs(locale)` */
export const APP_SCREEN_SRC_AR = APP_SCREEN_SRCS_AR[0]
/** @deprecated Use `appScreenSrcs(locale)` */
export const APP_SCREEN_SRC_EN = APP_SCREEN_SRCS_EN[0]

export function appScreenSrc (locale: string) {
  return locale === 'ar' ? APP_SCREEN_SRC_AR : APP_SCREEN_SRC_EN
}

export function appScreenSrcs (locale: string) {
  return locale === 'ar' ? APP_SCREEN_SRCS_AR : APP_SCREEN_SRCS_EN
}

export const HERO_SCENE_SRC =
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=2400&q=80'

export const SERVICES_SCENE_SRC =
  'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=2400&q=80'

export const DOWNLOAD_SCENE_SRC =
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2400&q=80'

export const STORE_LINKS = {
  apple: '#',
  google: '#'
} as const

export const CONTACT = {
  email: 'service@belkhedma.sa',
  phones: [
    { display: '0112960009', tel: '+966112960009' },
    { display: '0548123213', tel: '+966548123213' }
  ],
  mapsUrl: 'https://maps.app.goo.gl/Lnjeia8NqeePGzfN6'
} as const

export const CONTACT_LOCATION_SRC = localAsset('/images/location.jpeg')

const GOOGLE_MAPS_CID = '6562383958474323201'
const GOOGLE_MAPS_LL = '24.7680941,46.7105027'

export function googleMapsEmbedSrc (locale: string) {
  const hl = locale === 'ar' ? 'ar' : 'en'
  const params = new URLSearchParams({
    q: GOOGLE_MAPS_LL,
    ll: GOOGLE_MAPS_LL,
    z: '16',
    t: 'm',
    hl,
    gl: 'SA',
    output: 'embed',
    cid: GOOGLE_MAPS_CID
  })
  return `https://www.google.com/maps?${params.toString()}`
}
