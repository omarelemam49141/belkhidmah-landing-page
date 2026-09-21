export type MotionLevel = 'none' | 'lite' | 'full'

export const REDUCE_MOTION_MQ = '(prefers-reduced-motion: reduce)'
export const FULL_MOTION_POINTER_MQ =
  '(min-width: 768px) and (hover: hover) and (pointer: fine)'

type NavigatorWithHints = Navigator & {
  deviceMemory?: number
  connection?: { saveData?: boolean }
}

export function detectMotionLevel (): MotionLevel {
  if (typeof window === 'undefined') return 'lite'
  if (window.matchMedia(REDUCE_MOTION_MQ).matches) return 'none'

  const nav = navigator as NavigatorWithHints
  const saveData = Boolean(nav.connection?.saveData)
  const lowMemory = typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 4
  if (saveData || lowMemory) return 'lite'

  if (!window.matchMedia(FULL_MOTION_POINTER_MQ).matches) return 'lite'
  return 'full'
}

export function applyMotionLevel (level: MotionLevel): void {
  if (typeof document === 'undefined') return
  document.documentElement.dataset.motion = level
}

/** Runs before paint so lite CSS (no blur / no infinite loops) applies immediately. */
export const MOTION_BOOTSTRAP_SCRIPT = `(function(){try{var d=document.documentElement;if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){d.setAttribute('data-motion','none');return;}var n=navigator;var save=n.connection&&n.connection.saveData;var mem=n.deviceMemory;var weak=!!save||(typeof mem==='number'&&mem<=4);var fine=window.matchMedia('(min-width: 768px) and (hover: hover) and (pointer: fine)').matches;d.setAttribute('data-motion',(!fine||weak)?'lite':'full');}catch(e){document.documentElement.setAttribute('data-motion','lite');}})();`
