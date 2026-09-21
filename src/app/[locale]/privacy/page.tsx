import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { LegalDocumentPage } from '@/components/landing/legal-document-page'
import { buildPageMetadata } from '@/lib/metadata'
import { routing } from '@/i18n/routing'

export async function generateMetadata ({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!routing.locales.includes(locale as 'ar' | 'en')) {
    return {}
  }

  const t = await getTranslations({ locale, namespace: 'legal' })

  return buildPageMetadata({
    locale,
    title: t('privacyTitle'),
    description: t('privacyDescription'),
    pathname: 'privacy'
  })
}

export default async function PrivacyPage ({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('legal')

  return <LegalDocumentPage title={t('privacyTitle')} body={t('body')} />
}
