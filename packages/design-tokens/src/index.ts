/**
 * @xhub-reel/design-tokens
 *
 * CSS Variables-based design system for XHubReel.
 * Zero dependencies, maximum customizability.
 */

// Design tokens
export {
  // Animation constants
  EASING,
  DURATION,
  SPRING,
  VARIANTS,
  STAGGER,
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
  // Shadow tokens
  shadows,
  // Z-index tokens
  zIndices,
  // Breakpoints
  breakpoints,
  // Component tokens
  components,
  // CSS Variables
  generateCSSVariables,
  defaultCSSVariables,
  // All tokens
  tokens,
  type Tokens,
} from './tokens'

// Style utilities
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

