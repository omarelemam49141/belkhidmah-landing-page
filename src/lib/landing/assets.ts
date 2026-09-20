const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

function localAsset (path: string) {
  return `${BASE_PATH}${path}`
}

export const HERO_PHONE_SRC = localAsset('/images/hero-section/hero-section-phone-img-1.png')
export const SERVICES_PHONE_SRC_AR = localAsset('/images/services-section/services-sections-img-ar.png')
export const SERVICES_PHONE_SRC_EN = localAsset('/images/services-section/services-sections-img-en.png')

export function servicesPhoneSrc (locale: string) {
  return locale === 'ar' ? SERVICES_PHONE_SRC_AR : SERVICES_PHONE_SRC_EN
}

/** @deprecated Use `servicesPhoneSrc(locale)` */
export const SERVICES_PHONE_SRC = SERVICES_PHONE_SRC_EN
export const APPLE_STORE_BTN_SRC = localAsset('/images/stores-section/apple-store.png')
export const GOOGLE_PLAY_BTN_SRC = localAsset('/images/stores-section/google-play.png')

export const APP_SCREEN_SRCS = [
  localAsset('/images/app-screen-section/app-screen-section-img-1.png'),
  localAsset('/images/app-screen-section/app-screen-section-img-2.png'),
  localAsset('/images/app-screen-section/app-screen-section-img-3.png'),
  localAsset('/images/app-screen-section/app-screen-section-img-4.png'),
  localAsset('/images/app-screen-section/app-screen-section-img-5.png')
] as const

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
