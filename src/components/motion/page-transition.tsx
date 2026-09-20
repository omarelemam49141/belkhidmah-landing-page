'use client'

import { motion } from 'framer-motion'
import { pageFadeTransition } from '@/lib/motion/presets'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

export function PageTransition ({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion()

  if (reduced) {
    return <>{children}</>
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={pageFadeTransition}
    >
      {children}
    </motion.div>
  )
}
