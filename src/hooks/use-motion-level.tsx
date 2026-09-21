'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import {
  applyMotionLevel,
  detectMotionLevel,
  FULL_MOTION_POINTER_MQ,
  REDUCE_MOTION_MQ,
  type MotionLevel
} from '@/lib/motion/level'

const MotionLevelContext = createContext<MotionLevel>('lite')

export function MotionLevelProvider ({ children }: { children: React.ReactNode }) {
  const [level, setLevel] = useState<MotionLevel>('lite')

  useEffect(() => {
    const apply = () => {
      const next = detectMotionLevel()
      applyMotionLevel(next)
      setLevel(next)
    }

    apply()

    const reduced = window.matchMedia(REDUCE_MOTION_MQ)
    const fullPointer = window.matchMedia(FULL_MOTION_POINTER_MQ)
    reduced.addEventListener('change', apply)
    fullPointer.addEventListener('change', apply)
    return () => {
      reduced.removeEventListener('change', apply)
      fullPointer.removeEventListener('change', apply)
    }
  }, [])

  return (
    <MotionLevelContext.Provider value={level}>{children}</MotionLevelContext.Provider>
  )
}

export function useMotionLevel (): MotionLevel {
  return useContext(MotionLevelContext)
}

export function useFullMotion (): boolean {
  return useMotionLevel() === 'full'
}
