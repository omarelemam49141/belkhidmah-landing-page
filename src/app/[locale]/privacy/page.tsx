import { getTranslations } from 'next-intl/server'
import { LegalDocumentPage } from '@/components/landing/legal-document-page'

export default async function PrivacyPage () {
  const t = await getTranslations('legal')

  return <LegalDocumentPage title={t('privacyTitle')} body={t('body')} />
}
