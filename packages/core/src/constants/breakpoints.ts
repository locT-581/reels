/**
 * Responsive breakpoints
 * Mobile-first approach - only define when needed for larger screens
 */

/**
 * Breakpoint values in pixels
 */
export const BREAKPOINTS = {
  /** Small phones */
  XS: 320,
  /** Standard phones */
  SM: 375,
  /** Large phones / small tablets */
  MD: 428,
  /** Tablets */
  TABLET: 768,
  /** Desktop (rarely used) */
  DESKTOP: 1024,
  /** Large desktop */
  LG: 1280,
} as const

/**
 * Media query strings
 */
export const MEDIA = {
  /** Extra small devices */
  XS: `(min-width: ${BREAKPOINTS.XS}px)`,
  /** Small devices */
  SM: `(min-width: ${BREAKPOINTS.SM}px)`,
  /** Medium devices */
  MD: `(min-width: ${BREAKPOINTS.MD}px)`,
  /** Tablet and up */
  TABLET: `(min-width: ${BREAKPOINTS.TABLET}px)`,
  /** Desktop and up */
  DESKTOP: `(min-width: ${BREAKPOINTS.DESKTOP}px)`,
  /** Large screens */
  LG: `(min-width: ${BREAKPOINTS.LG}px)`,
  /** Prefers reduced motion */
  REDUCED_MOTION: '(prefers-reduced-motion: reduce)',
  /** Touch device detection */
  TOUCH: '(hover: none) and (pointer: coarse)',
  /** Fine pointer (mouse) */
  MOUSE: '(hover: hover) and (pointer: fine)',
  /** Portrait orientation */
  PORTRAIT: '(orientation: portrait)',
  /** Landscape orientation */
  LANDSCAPE: '(orientation: landscape)',
} as const

/**
 * Safe area insets CSS variables
 */
export const SAFE_AREA = {
  TOP: 'env(safe-area-inset-top)',
  BOTTOM: 'env(safe-area-inset-bottom)',
  LEFT: 'env(safe-area-inset-left)',
  RIGHT: 'env(safe-area-inset-right)',
} as const

