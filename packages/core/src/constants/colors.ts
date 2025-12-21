/**
 * Vortex Design System - Color Palette
 */

/**
 * Primary colors
 */
export const COLORS = {
  // Core palette
  /** Primary background - OLED black */
  BLACK: '#000000',
  /** Primary accent - Electric Violet */
  VIOLET: '#8B5CF6',
  /** Like/heart color - Vortex Red */
  RED: '#FF2D55',
  /** Secondary text - Neutral Gray */
  GRAY: '#8E8E93',
  /** Primary text */
  WHITE: '#FFFFFF',

  // Extended palette
  /** Success state */
  GREEN: '#34C759',
  /** Warning state */
  ORANGE: '#FF9500',
  /** Info state */
  BLUE: '#007AFF',

  // Semantic aliases
  PRIMARY: '#8B5CF6',
  SECONDARY: '#8E8E93',
  BACKGROUND: '#000000',
  SURFACE: '#1C1C1E',
  ERROR: '#FF3B30',
  SUCCESS: '#34C759',
  WARNING: '#FF9500',
  INFO: '#007AFF',
} as const

/**
 * Opacity variants for overlays
 */
export const OPACITY = {
  /** Subtle overlay */
  SUBTLE: 0.1,
  /** Light overlay */
  LIGHT: 0.2,
  /** Medium overlay */
  MEDIUM: 0.4,
  /** Heavy overlay */
  HEAVY: 0.6,
  /** Modal backdrop */
  BACKDROP: 0.8,
} as const

/**
 * Gradient presets
 */
export const GRADIENTS = {
  /** Video overlay gradient (bottom) */
  VIDEO_OVERLAY: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
  /** Action bar background */
  ACTION_BAR: 'linear-gradient(to left, rgba(0,0,0,0.4) 0%, transparent 100%)',
  /** Header fade */
  HEADER_FADE: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 100%)',
  /** Violet gradient */
  VIOLET: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
  /** Red gradient */
  RED: 'linear-gradient(135deg, #FF2D55 0%, #FF375F 100%)',
} as const

/**
 * Shadow presets
 */
export const SHADOWS = {
  /** Text shadow for video overlays */
  TEXT: '0 2px 2px rgba(0,0,0,0.8)',
  /** Small elevation */
  SM: '0 1px 2px rgba(0,0,0,0.5)',
  /** Medium elevation */
  MD: '0 4px 8px rgba(0,0,0,0.5)',
  /** Large elevation */
  LG: '0 8px 16px rgba(0,0,0,0.5)',
  /** Extra large elevation */
  XL: '0 16px 32px rgba(0,0,0,0.5)',
} as const

/**
 * Glassmorphism blur values
 */
export const BLUR = {
  /** Subtle blur */
  SM: '8px',
  /** Default blur for sheets */
  DEFAULT: '20px',
  /** Heavy blur */
  LG: '40px',
} as const

