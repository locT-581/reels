/**
 * XHubReel Styles
 *
 * Re-exports from @xhub-reel/design-tokens for convenience.
 * Users can import directly from @xhub-reel/design-tokens or from @xhub-reel/core.
 */

// Re-export all design tokens
export {
  // Color tokens
  colors,

  // Spacing tokens
  spacing,

  // Border radius tokens
  radii,

  // Typography tokens
  fontSizes,
  fontWeights,
  lineHeights,

  // Animation tokens
  durations,
  easings,
  springs,
  EASING,
  DURATION,
  SPRING,
  VARIANTS,
  STAGGER,

  // Shadow tokens
  shadows,

  // Z-index tokens
  zIndices,

  // Breakpoint tokens
  breakpoints,

  // Component tokens
  components,

  // All tokens object
  tokens,

  // CSS variables
  generateCSSVariables,
  defaultCSSVariables,

  // Types
  type Tokens,
} from '@xhub-reel/design-tokens'

// Re-export style utilities
export {
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
  styles,
} from './styles'

// Default export
export { styles as default } from './styles'
