'use client'

import { motion } from 'framer-motion'
import { Button, buttonVariants } from '@/components/ui/button'
import { useFullMotion } from '@/hooks/use-motion-level'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { cn } from '@/lib/utils'
import type { VariantProps } from 'class-variance-authority'

type MotionButtonProps = React.ComponentProps<typeof Button> &
  VariantProps<typeof buttonVariants>

export function MotionButton ({
  className,
  children,
  disabled,
  ...props
}: MotionButtonProps) {
  const reduced = useReducedMotion()
  const fullMotion = useFullMotion()

  if (reduced || disabled || !fullMotion) {
    return (
      <Button className={className} disabled={disabled} {...props}>
        {children}
      </Button>
    )
  }

  return (
    <motion.div
      className="inline-flex"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 500, damping: 28 }}
    >
      <Button
        className={cn('shadow-sm hover:shadow-md enabled:active:shadow-sm', className)}
        disabled={disabled}
        {...props}
      >
        {children}
      </Button>
    </motion.div>
  )
}
