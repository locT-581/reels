/**
 * VortexStream Design Tokens
 *
 * CSS Variables-based design system for maximum customizability.
 * Users can override these values by setting CSS variables in their app.
 *
 * @example
 * ```css
 * :root {
 *   --vortex-color-accent: #FF6B6B;
 *   --vortex-radius-lg: 20px;
 * }
 * ```
 */

// =============================================================================
// ANIMATION CONSTANTS (Inlined from core/constants/animation)
// =============================================================================

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

// =============================================================================
// COLOR TOKENS
// =============================================================================

export const colors = {
  // Primary colors
  background: 'var(--vortex-color-bg, #000000)',
  surface: 'var(--vortex-color-surface, #18181B)',
  surfaceHover: 'var(--vortex-color-surface-hover, #27272A)',

  // Accent colors
  accent: 'var(--vortex-color-accent, #8B5CF6)',
  accentHover: 'var(--vortex-color-accent-hover, #7C3AED)',

  // Semantic colors
  like: 'var(--vortex-color-like, #FF2D55)',
  success: 'var(--vortex-color-success, #22C55E)',
  warning: 'var(--vortex-color-warning, #FBBF24)',
  error: 'var(--vortex-color-error, #EF4444)',

  // Text colors
  text: 'var(--vortex-color-text, #FAFAFA)',
  textSecondary: 'var(--vortex-color-text-secondary, #A1A1AA)',
  textMuted: 'var(--vortex-color-text-muted, #71717A)',

  // Overlay colors
  overlay: 'var(--vortex-color-overlay, rgba(0, 0, 0, 0.8))',
  overlayLight: 'var(--vortex-color-overlay-light, rgba(0, 0, 0, 0.4))',

  // Border colors
  border: 'var(--vortex-color-border, rgba(255, 255, 255, 0.1))',
  borderHover: 'var(--vortex-color-border-hover, rgba(255, 255, 255, 0.2))',

  // Transparent
  transparent: 'transparent',
  white: '#FFFFFF',
  black: '#000000',
} as const

// =============================================================================
// SPACING TOKENS (8pt Grid)
// =============================================================================

export const spacing = {
  0: 0,
  1: 4,   // 0.5 unit
  2: 8,   // 1 unit
  3: 12,  // 1.5 units
  4: 16,  // 2 units
  5: 20,  // 2.5 units
  6: 24,  // 3 units
  8: 32,  // 4 units
  10: 40, // 5 units
  12: 48, // 6 units
  16: 64, // 8 units
  20: 80, // 10 units
  24: 96, // 12 units
} as const

// =============================================================================
// BORDER RADIUS TOKENS
// =============================================================================

export const radii = {
  none: 0,
  sm: 'var(--vortex-radius-sm, 8px)',
  md: 'var(--vortex-radius-md, 12px)',
  lg: 'var(--vortex-radius-lg, 16px)',
  xl: 'var(--vortex-radius-xl, 24px)',
  full: '9999px',
} as const

// =============================================================================
// TYPOGRAPHY TOKENS
// =============================================================================

export const fontSizes = {
  xs: 'var(--vortex-font-size-xs, 12px)',
  sm: 'var(--vortex-font-size-sm, 14px)',
  md: 'var(--vortex-font-size-md, 16px)',
  lg: 'var(--vortex-font-size-lg, 18px)',
  xl: 'var(--vortex-font-size-xl, 20px)',
  '2xl': 'var(--vortex-font-size-2xl, 24px)',
  '3xl': 'var(--vortex-font-size-3xl, 32px)',
} as const

export const fontWeights = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const

export const lineHeights = {
  none: 1,
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
} as const

// =============================================================================
// ANIMATION TOKENS
// =============================================================================

export const durations = {
  instant: '0ms',
  fast: `${DURATION.FAST}ms`,
  normal: `var(--vortex-duration-normal, ${DURATION.DEFAULT}ms)`,
  slow: `${DURATION.SLOW}ms`,
} as const

export const easings = {
  // Vortex signature easing (smooth, natural feel)
  vortex: `var(--vortex-easing, ${EASING.VORTEX})`,
  // Standard easings
  ease: 'ease',
  easeIn: EASING.EASE_IN,
  easeOut: EASING.EASE_OUT,
  easeInOut: 'ease-in-out',
  linear: EASING.LINEAR,
} as const

// Spring physics config for Motion library
// Note: These only include stiffness/damping (not type) to avoid duplication when used with transition
export const springs = {
  default: { stiffness: SPRING.DEFAULT.stiffness, damping: SPRING.DEFAULT.damping },
  gentle: { stiffness: SPRING.GENTLE.stiffness, damping: SPRING.GENTLE.damping },
  bouncy: { stiffness: SPRING.BOUNCY.stiffness, damping: SPRING.BOUNCY.damping },
  stiff: { stiffness: SPRING.STIFF.stiffness, damping: SPRING.STIFF.damping },
} as const

// =============================================================================
// SHADOW TOKENS
// =============================================================================

export const shadows = {
  none: 'none',
  sm: 'var(--vortex-shadow-sm, 0 1px 2px rgba(0, 0, 0, 0.5))',
  md: 'var(--vortex-shadow-md, 0 4px 6px rgba(0, 0, 0, 0.5))',
  lg: 'var(--vortex-shadow-lg, 0 10px 15px rgba(0, 0, 0, 0.5))',
  // Text shadow for video overlay
  text: 'var(--vortex-shadow-text, 0 2px 4px rgba(0, 0, 0, 0.8), 0 4px 8px rgba(0, 0, 0, 0.6))',
} as const

// =============================================================================
// Z-INDEX TOKENS
// =============================================================================

export const zIndices = {
  base: 0,
  dropdown: 100,
  sticky: 200,
  overlay: 300,
  modal: 400,
  popover: 500,
  tooltip: 600,
  toast: 700,
  max: 999,
} as const

// =============================================================================
// BREAKPOINTS (for reference, not used in inline styles)
// =============================================================================

export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const

// =============================================================================
// COMPONENT-SPECIFIC TOKENS
// =============================================================================

export const components = {
  // Icon sizes
  icon: {
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
  },

  // Button sizes
  button: {
    sm: { height: 32, padding: 12, fontSize: fontSizes.sm },
    md: { height: 40, padding: 16, fontSize: fontSizes.md },
    lg: { height: 48, padding: 20, fontSize: fontSizes.lg },
  },

  // Tap area minimum (accessibility)
  tapArea: 48,

  // Avatar sizes
  avatar: {
    sm: 24,
    md: 32,
    lg: 48,
    xl: 64,
  },

  // Bottom sheet
  bottomSheet: {
    handleWidth: 40,
    handleHeight: 4,
    defaultHeight: '60vh',
    maxHeight: '90vh',
  },

  // Seek bar
  seekBar: {
    height: 2,
    heightActive: 4,
  },

  // Action bar
  actionBar: {
    iconSize: 32,
    gap: 20,
    counterFontSize: fontSizes.xs,
  },
} as const

// =============================================================================
// CSS VARIABLES TEMPLATE
// =============================================================================

/**
 * Generate CSS variables string for injection into document
 * Users can call this and inject into their app to customize the theme
 */
export function generateCSSVariables(overrides: Partial<typeof defaultCSSVariables> = {}): string {
  const vars = { ...defaultCSSVariables, ...overrides }
  return Object.entries(vars)
    .map(([key, value]) => `${key}: ${value};`)
    .join('\n')
}

export const defaultCSSVariables = {
  // Colors
  '--vortex-color-bg': '#000000',
  '--vortex-color-surface': '#18181B',
  '--vortex-color-surface-hover': '#27272A',
  '--vortex-color-accent': '#8B5CF6',
  '--vortex-color-accent-hover': '#7C3AED',
  '--vortex-color-like': '#FF2D55',
  '--vortex-color-success': '#22C55E',
  '--vortex-color-warning': '#FBBF24',
  '--vortex-color-error': '#EF4444',
  '--vortex-color-text': '#FAFAFA',
  '--vortex-color-text-secondary': '#A1A1AA',
  '--vortex-color-text-muted': '#71717A',
  '--vortex-color-overlay': 'rgba(0, 0, 0, 0.8)',
  '--vortex-color-overlay-light': 'rgba(0, 0, 0, 0.4)',
  '--vortex-color-border': 'rgba(255, 255, 255, 0.1)',

  // Spacing & Sizing
  '--vortex-radius-sm': '8px',
  '--vortex-radius-md': '12px',
  '--vortex-radius-lg': '16px',
  '--vortex-radius-xl': '24px',

  // Typography
  '--vortex-font-size-xs': '12px',
  '--vortex-font-size-sm': '14px',
  '--vortex-font-size-md': '16px',
  '--vortex-font-size-lg': '18px',
  '--vortex-font-size-xl': '20px',

  // Animation
  '--vortex-duration-normal': '300ms',
  '--vortex-easing': 'cubic-bezier(0.32, 0.72, 0, 1)',

  // Shadows
  '--vortex-shadow-sm': '0 1px 2px rgba(0, 0, 0, 0.5)',
  '--vortex-shadow-md': '0 4px 6px rgba(0, 0, 0, 0.5)',
  '--vortex-shadow-lg': '0 10px 15px rgba(0, 0, 0, 0.5)',
  '--vortex-shadow-text': '0 2px 4px rgba(0, 0, 0, 0.8), 0 4px 8px rgba(0, 0, 0, 0.6)',
} as const

// Export all tokens as a single object
export const tokens = {
  colors,
  spacing,
  radii,
  fontSizes,
  fontWeights,
  lineHeights,
  durations,
  easings,
  springs,
  shadows,
  zIndices,
  breakpoints,
  components,
} as const

export type Tokens = typeof tokens

