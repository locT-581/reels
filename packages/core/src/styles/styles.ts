/**
 * XHubReel Style Utilities
 *
 * Type-safe inline style helpers for building components.
 * Zero runtime CSS-in-JS - just plain CSSProperties objects.
 */

import type { CSSProperties } from 'react'
import { colors, spacing, radii, fontSizes, fontWeights, shadows, durations, easings, zIndices } from '@xhub-reel/design-tokens'

// =============================================================================
// TYPE HELPERS
// =============================================================================

type SpacingKey = keyof typeof spacing
type ColorKey = keyof typeof colors
type RadiusKey = keyof typeof radii

// =============================================================================
// STYLE FACTORY FUNCTIONS
// =============================================================================

/**
 * Create a style object with type safety
 */
export function style(styles: CSSProperties): CSSProperties {
  return styles
}

/**
 * Merge multiple style objects
 */
export function mergeStyles(...styles: (CSSProperties | undefined | false)[]): CSSProperties {
  return Object.assign({}, ...styles.filter(Boolean))
}

/**
 * Conditional styles helper
 */
export function conditionalStyle(
  condition: boolean,
  trueStyles: CSSProperties,
  falseStyles?: CSSProperties
): CSSProperties {
  return condition ? trueStyles : (falseStyles || {})
}

// =============================================================================
// LAYOUT UTILITIES
// =============================================================================

export const layout = {
  // Flexbox
  flex: (options: {
    direction?: CSSProperties['flexDirection']
    align?: CSSProperties['alignItems']
    justify?: CSSProperties['justifyContent']
    gap?: SpacingKey | number
    wrap?: CSSProperties['flexWrap']
  } = {}): CSSProperties => ({
    display: 'flex',
    flexDirection: options.direction,
    alignItems: options.align,
    justifyContent: options.justify,
    gap: typeof options.gap === 'number' ? options.gap : spacing[options.gap || 0],
    flexWrap: options.wrap,
  }),

  flexCenter: style({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),

  flexBetween: style({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  }),

  flexColumn: style({
    display: 'flex',
    flexDirection: 'column',
  }),

  // Grid
  grid: (options: {
    columns?: number | string
    rows?: number | string
    gap?: SpacingKey | number
  } = {}): CSSProperties => ({
    display: 'grid',
    gridTemplateColumns: typeof options.columns === 'number' ? `repeat(${options.columns}, 1fr)` : options.columns,
    gridTemplateRows: typeof options.rows === 'number' ? `repeat(${options.rows}, 1fr)` : options.rows,
    gap: typeof options.gap === 'number' ? options.gap : spacing[options.gap || 0],
  }),

  // Position
  absolute: (options: {
    top?: number | string
    right?: number | string
    bottom?: number | string
    left?: number | string
    inset?: number | string
  } = {}): CSSProperties => ({
    position: 'absolute',
    ...(options.inset !== undefined && { inset: options.inset }),
    ...(options.top !== undefined && { top: options.top }),
    ...(options.right !== undefined && { right: options.right }),
    ...(options.bottom !== undefined && { bottom: options.bottom }),
    ...(options.left !== undefined && { left: options.left }),
  }),

  fixed: (options: {
    top?: number | string
    right?: number | string
    bottom?: number | string
    left?: number | string
    inset?: number | string
  } = {}): CSSProperties => ({
    position: 'fixed',
    ...(options.inset !== undefined && { inset: options.inset }),
    ...(options.top !== undefined && { top: options.top }),
    ...(options.right !== undefined && { right: options.right }),
    ...(options.bottom !== undefined && { bottom: options.bottom }),
    ...(options.left !== undefined && { left: options.left }),
  }),

  // Full size
  fullScreen: style({
    position: 'fixed',
    inset: 0,
    width: '100%',
    height: '100%',
  }),

  fullSize: style({
    width: '100%',
    height: '100%',
  }),

  // Centering
  centerAbsolute: style({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  }),
}

// =============================================================================
// SPACING UTILITIES
// =============================================================================

export const space = {
  padding: (value: SpacingKey | number): CSSProperties => ({
    padding: typeof value === 'number' ? value : spacing[value],
  }),

  paddingX: (value: SpacingKey | number): CSSProperties => {
    const px = typeof value === 'number' ? value : spacing[value]
    return { paddingLeft: px, paddingRight: px }
  },

  paddingY: (value: SpacingKey | number): CSSProperties => {
    const py = typeof value === 'number' ? value : spacing[value]
    return { paddingTop: py, paddingBottom: py }
  },

  margin: (value: SpacingKey | number): CSSProperties => ({
    margin: typeof value === 'number' ? value : spacing[value],
  }),

  marginX: (value: SpacingKey | number): CSSProperties => {
    const mx = typeof value === 'number' ? value : spacing[value]
    return { marginLeft: mx, marginRight: mx }
  },

  marginY: (value: SpacingKey | number): CSSProperties => {
    const my = typeof value === 'number' ? value : spacing[value]
    return { marginTop: my, marginBottom: my }
  },

  gap: (value: SpacingKey | number): CSSProperties => ({
    gap: typeof value === 'number' ? value : spacing[value],
  }),
}

// =============================================================================
// TYPOGRAPHY UTILITIES
// =============================================================================

export const typography = {
  text: (options: {
    size?: keyof typeof fontSizes
    weight?: keyof typeof fontWeights
    color?: ColorKey
    align?: CSSProperties['textAlign']
    lineHeight?: number
  } = {}): CSSProperties => ({
    fontSize: options.size ? fontSizes[options.size] : undefined,
    fontWeight: options.weight ? fontWeights[options.weight] : undefined,
    color: options.color ? colors[options.color] : undefined,
    textAlign: options.align,
    lineHeight: options.lineHeight,
  }),

  // Preset text styles
  heading: style({
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.text,
    lineHeight: 1.25,
  }),

  body: style({
    fontSize: fontSizes.md,
    fontWeight: fontWeights.normal,
    color: colors.text,
    lineHeight: 1.5,
  }),

  caption: style({
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.normal,
    color: colors.textSecondary,
    lineHeight: 1.4,
  }),

  // Video overlay text (with shadow)
  videoText: style({
    color: colors.text,
    textShadow: shadows.text,
  }),

  // Truncation
  truncate: style({
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  }),

  lineClamp: (lines: number): CSSProperties => ({
    display: '-webkit-box',
    WebkitLineClamp: lines,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  }),
}

// =============================================================================
// VISUAL UTILITIES
// =============================================================================

export const visual = {
  // Background
  bg: (color: ColorKey | string): CSSProperties => ({
    backgroundColor: color in colors ? colors[color as ColorKey] : color,
  }),

  // Border radius
  rounded: (size: RadiusKey = 'md'): CSSProperties => ({
    borderRadius: radii[size],
  }),

  // Border
  border: (options: {
    width?: number
    color?: ColorKey | string
    style?: CSSProperties['borderStyle']
  } = {}): CSSProperties => ({
    borderWidth: options.width || 1,
    borderStyle: options.style || 'solid',
    borderColor: options.color
      ? (options.color in colors ? colors[options.color as ColorKey] : options.color)
      : colors.border,
  }),

  // Shadow
  shadow: (size: keyof typeof shadows = 'md'): CSSProperties => ({
    boxShadow: shadows[size],
  }),

  // Opacity
  opacity: (value: number): CSSProperties => ({
    opacity: value,
  }),

  // Glassmorphism effect
  glass: (blur: number = 20): CSSProperties => ({
    backgroundColor: colors.overlay,
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
  }),

  glassLight: (blur: number = 10): CSSProperties => ({
    backgroundColor: colors.overlayLight,
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
  }),
}

// =============================================================================
// INTERACTIVE UTILITIES
// =============================================================================

export const interactive = {
  // Cursor
  clickable: style({
    cursor: 'pointer',
    userSelect: 'none',
  }),

  disabled: style({
    cursor: 'not-allowed',
    opacity: 0.5,
    pointerEvents: 'none',
  }),

  // Touch
  noSelect: style({
    userSelect: 'none',
    WebkitUserSelect: 'none',
    WebkitTouchCallout: 'none',
  }),

  touchAction: (action: CSSProperties['touchAction']): CSSProperties => ({
    touchAction: action,
  }),

  // Pointer events
  pointerNone: style({
    pointerEvents: 'none',
  }),

  pointerAuto: style({
    pointerEvents: 'auto',
  }),
}

// =============================================================================
// ANIMATION UTILITIES
// =============================================================================

export const animation = {
  transition: (
    properties: string | string[] = 'all',
    duration: keyof typeof durations = 'normal',
    easing: keyof typeof easings = 'xhubReel'
  ): CSSProperties => ({
    transitionProperty: Array.isArray(properties) ? properties.join(', ') : properties,
    transitionDuration: durations[duration],
    transitionTimingFunction: easings[easing],
  }),

  noTransition: style({
    transition: 'none',
  }),
}

// =============================================================================
// SCROLL UTILITIES
// =============================================================================

export const scroll = {
  // Scrollable container
  scrollY: style({
    overflowY: 'auto',
    overflowX: 'hidden',
    WebkitOverflowScrolling: 'touch',
  }),

  scrollX: style({
    overflowX: 'auto',
    overflowY: 'hidden',
    WebkitOverflowScrolling: 'touch',
  }),

  // Hide scrollbar
  hideScrollbar: style({
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
  }),

  // Snap scroll for video feed
  snapY: style({
    scrollSnapType: 'y mandatory',
    overscrollBehaviorY: 'contain',
  }),

  snapStart: style({
    scrollSnapAlign: 'start',
    scrollSnapStop: 'always',
  }),
}

// =============================================================================
// Z-INDEX UTILITIES
// =============================================================================

export const layer = {
  z: (level: keyof typeof zIndices | number): CSSProperties => ({
    zIndex: typeof level === 'number' ? level : zIndices[level],
  }),
}

// =============================================================================
// SIZE UTILITIES
// =============================================================================

export const size = {
  square: (value: number | string): CSSProperties => ({
    width: value,
    height: value,
  }),

  width: (value: number | string): CSSProperties => ({
    width: value,
  }),

  height: (value: number | string): CSSProperties => ({
    height: value,
  }),

  minHeight: (value: number | string): CSSProperties => ({
    minHeight: value,
  }),

  maxWidth: (value: number | string): CSSProperties => ({
    maxWidth: value,
  }),
}

// =============================================================================
// PRESET STYLES
// =============================================================================

/**
 * Common preset styles for quick use
 */
export const presets = {
  // Video feed container
  feedContainer: mergeStyles(
    layout.fixed({ inset: 0 }),
    scroll.scrollY,
    scroll.snapY,
    scroll.hideScrollbar,
    visual.bg('background'),
    {
      touchAction: 'pan-y',
    }
  ),

  // Video feed item
  feedItem: mergeStyles(
    layout.fullSize,
    scroll.snapStart,
    visual.bg('background'),
    {
      position: 'relative',
    }
  ),

  // Action button (like, comment, share)
  actionButton: mergeStyles(
    layout.flexCenter,
    size.square(48),
    visual.rounded('full'),
    interactive.clickable,
    animation.transition(['transform', 'background-color'])
  ),

  // Bottom sheet
  bottomSheet: mergeStyles(
    layout.fixed({ left: 0, right: 0, bottom: 0 }),
    visual.glass(),
    visual.rounded('xl'),
    {
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    }
  ),

  // Video overlay gradient (bottom)
  overlayGradient: style({
    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
  }),

  // Safe area padding
  safeAreaTop: style({
    paddingTop: 'env(safe-area-inset-top)',
  }),

  safeAreaBottom: style({
    paddingBottom: 'env(safe-area-inset-bottom)',
  }),
}

// =============================================================================
// EXPORT ALL
// =============================================================================

export const styles = {
  style,
  mergeStyles,
  conditionalStyle,
  layout,
  space,
  typography,
  visual,
  interactive,
  animation,
  scroll,
  layer,
  size,
  presets,
}

export default styles

