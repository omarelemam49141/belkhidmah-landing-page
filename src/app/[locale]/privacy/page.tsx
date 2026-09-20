import { getTranslations, setRequestLocale } from 'next-intl/server'
import { LegalDocumentPage } from '@/components/landing/legal-document-page'

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
