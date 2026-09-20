import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

export function BrandMark ({
  size = 40,
  framed = false,
  className
}: {
  size?: number
  framed?: boolean
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-xl bg-linear-to-br from-trust-blue-500 to-trust-blue-700 text-white',
        framed && 'border border-white/20 bg-white/10 p-0.5 shadow-md from-trust-blue-400/80 to-warm-orange-500/70',
        className
      )}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <Sparkles className="size-[55%]" />
    </span>
  )
}
