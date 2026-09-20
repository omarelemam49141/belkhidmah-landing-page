const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

function localAsset (path: string) {
  return `${BASE_PATH}${path}`
}

export const LOGO_SRC = localAsset('/images/logo.svg')

export const HERO_PHONE_SRC_AR = localAsset('/images/hero-section/hero-section-phone-img-1.png')
export const HERO_PHONE_SRC_EN = localAsset('/images/hero-section/hero-section-phone-img-en.png')

export function heroPhoneSrc (locale: string) {
  return locale === 'ar' ? HERO_PHONE_SRC_AR : HERO_PHONE_SRC_EN
}

/** @deprecated Use `heroPhoneSrc(locale)` */
export const HERO_PHONE_SRC = HERO_PHONE_SRC_AR

export const SERVICES_PHONE_SRC_AR = localAsset('/images/services-section/services-sections-img-ar.png')
export const SERVICES_PHONE_SRC_EN = localAsset('/images/services-section/services-sections-img-en.png')

export function servicesPhoneSrc (locale: string) {
  return locale === 'ar' ? SERVICES_PHONE_SRC_AR : SERVICES_PHONE_SRC_EN
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

export const PLACEHOLDER_CONTACT = {
  phone: '+966 00 000 0000',
  addressAr: 'المملكة العربية السعودية — العنوان سيُضاف لاحقًا',
  addressEn: 'Kingdom of Saudi Arabia — address coming soon'
} as const

const GOOGLE_MAPS_CID = '17205670262855804534'
const GOOGLE_MAPS_LL = '24.784423,46.68234'

export function googleMapsEmbedSrc (locale: string) {
  const hl = locale === 'ar' ? 'ar' : 'en'
  const params = new URLSearchParams({
    ll: GOOGLE_MAPS_LL,
    z: '15',
    t: 'm',
    hl,
    gl: 'EG',
    output: 'embed',
    cid: GOOGLE_MAPS_CID
  })
  return `https://www.google.com/maps?${params.toString()}`
}
