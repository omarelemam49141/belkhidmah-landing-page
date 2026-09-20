import { getLocale } from 'next-intl/server'
import { cairo, tajawal } from '@/lib/fonts'
import './globals.css'

export default async function RootLayout ({
  children
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()
  const isRTL = locale === 'ar'

  return (
    <html
      lang={locale}
      dir={isRTL ? 'rtl' : 'ltr'}
      className={`${cairo.variable} ${tajawal.variable}${isRTL ? ' locale-ar' : ''}`}
      suppressHydrationWarning
    >
      <body className={`${cairo.className} font-sans antialiased min-h-screen`}>
        {children}
      </body>
    </html>
  )
}
