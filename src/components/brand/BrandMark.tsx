import { cn } from '@/lib/utils'
import { LOGO_SRC } from '@/lib/landing/assets'

export function BrandMark ({
  size = 40,
  framed = false,
  className,
  alt = ''
}: {
  size?: number
  framed?: boolean
  className?: string
  alt?: string
}) {
  const decorative = alt === ''

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center overflow-hidden',
        framed && 'rounded-xl border border-white/20 bg-white p-1 shadow-md',
        className
      )}
      style={{ width: size, height: size }}
      aria-hidden={decorative || undefined}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- SVG brand mark, skip next/image optimizer */}
      <img
        src={LOGO_SRC}
        alt={alt}
        width={size}
        height={size}
        className="h-full w-full object-contain"
      />
    </span>
  )
}
