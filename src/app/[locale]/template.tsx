import { PageTransition } from '@/components/motion/page-transition'

export default function LocaleTemplate ({
  children
}: {
  children: React.ReactNode
}) {
  return <PageTransition>{children}</PageTransition>
}
