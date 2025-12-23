/**
 * Animation configuration constants
 * Based on Vortex Design System
 *
 * Note: These constants are the canonical source.
 * The `springs` export in `styles/tokens.ts` references these values.
 */

/**
 * Easing curves
 */
export const EASING = {
  /** Vortex signature easing - smooth deceleration */
  VORTEX: 'cubic-bezier(0.32, 0.72, 0, 1)',
  /** iOS-like spring feel */
  IOS: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
  /** Quick ease out */
  EASE_OUT: 'cubic-bezier(0, 0, 0.2, 1)',
  /** Ease in for exits */
  EASE_IN: 'cubic-bezier(0.4, 0, 1, 1)',
  /** Linear (for spinners) */
  LINEAR: 'linear',
} as const

/**
 * Duration presets in milliseconds
 */
export const DURATION = {
  /** Instant feedback (tap) */
  INSTANT: 100,
  /** Fast transitions */
  FAST: 150,
  /** Default UI transitions */
  DEFAULT: 300,
  /** Slow/emphasized transitions */
  SLOW: 500,
  /** Page transitions */
  PAGE: 400,
} as const

/**
 * Spring physics configuration for Motion library
 */
export const SPRING = {
  /** Default spring for UI elements */
  DEFAULT: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 30,
  },
  /** Bouncy spring for like animations */
  BOUNCY: {
    type: 'spring' as const,
    stiffness: 600,
    damping: 15,
  },
  /** Gentle spring for sheets */
  GENTLE: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 25,
  },
  /** Stiff spring for snappy feedback */
  STIFF: {
    type: 'spring' as const,
    stiffness: 500,
    damping: 35,
  },
  /** Slow spring for page transitions */
  SLOW: {
    type: 'spring' as const,
    stiffness: 200,
    damping: 25,
  },
} as const

/**
 * Common animation variants for Motion
 */
export const VARIANTS = {
  /** Fade in/out */
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  /** Scale up from center */
  scaleUp: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 },
  },
  /** Slide up from bottom */
  slideUp: {
    initial: { y: '100%' },
    animate: { y: 0 },
    exit: { y: '100%' },
  },
  /** Slide down from top */
  slideDown: {
    initial: { y: '-100%' },
    animate: { y: 0 },
    exit: { y: '-100%' },
  },
  /** Slide in from right */
  slideRight: {
    initial: { x: '100%' },
    animate: { x: 0 },
    exit: { x: '100%' },
  },
  /** Slide in from left */
  slideLeft: {
    initial: { x: '-100%' },
    animate: { x: 0 },
    exit: { x: '-100%' },
  },
} as const

/**
 * Animation delays for staggered effects
 */
export const STAGGER = {
  /** Fast stagger for lists */
  FAST: 0.03,
  /** Default stagger */
  DEFAULT: 0.05,
  /** Slow stagger for emphasis */
  SLOW: 0.1,
} as const

