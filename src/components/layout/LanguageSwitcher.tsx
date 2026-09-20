'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/routing'
import { Button } from '@/components/ui/button'
import { setLocaleCookie } from '@/lib/i18n/locale-cookie'
import { cn } from '@/lib/utils'

export function LanguageSwitcher ({ className }: { className?: string }) {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const nextLocale = locale === 'ar' ? 'en' : 'ar'

  function handleClick () {
    setLocaleCookie(nextLocale)
    router.replace(pathname, { locale: nextLocale })
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={cn('bg-background/95 shadow-sm backdrop-blur-sm', className)}
      onClick={handleClick}
      aria-label={nextLocale === 'en' ? 'English' : 'العربية'}
    >
      {nextLocale === 'en' ? 'EN' : 'ع'}
    </Button>
  )
}
