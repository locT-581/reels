# Styling Guide

## Approach: CSS Variables + Inline Styles

All VortexStream packages use inline styles with design tokens from `@vortex/core` for theming.

### Why Inline Styles?

1. **Zero runtime CSS-in-JS overhead** - No style injection at runtime
2. **No class name conflicts** - No global CSS conflicts
3. **Easy to override via style prop** - Consumer can customize easily
4. **Better for code splitting** - Styles bundled with components
5. **Type-safe** - TypeScript checks style objects

## Design Tokens

Import design tokens from `@vortex/core`:

```typescript
import {
  colors,
  spacing,
  radii,
  fontSizes,
  fontWeights,
  durations,
  easings,
  springs,
  shadows,
  zIndices,
  mergeStyles,
} from '@vortex/core'
```

### Colors

```typescript
const colors = {
  background: '#000000',      // OLED optimized black
  surface: '#1A1A1A',         // Elevated surfaces
  accent: '#8B5CF6',          // Electric Violet
  like: '#FF2D55',            // Like color (pink-red)
  text: '#FFFFFF',            // Primary text
  textSecondary: 'rgba(255, 255, 255, 0.7)',
  textMuted: 'rgba(255, 255, 255, 0.5)',
  border: 'rgba(255, 255, 255, 0.1)',
  overlay: 'rgba(0, 0, 0, 0.8)',
  white: '#FFFFFF',
  black: '#000000',
  error: '#EF4444',
  success: '#22C55E',
  warning: '#F59E0B',
}
```

### Spacing (8pt Grid)

```typescript
const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
}
```

### Border Radius

```typescript
const radii = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
  full: 9999,
}
```

### Typography

```typescript
const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
}

const fontWeights = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
}
```

### Animation

```typescript
const durations = {
  fast: '150ms',
  normal: '300ms',
  slow: '500ms',
}

const easings = {
  vortex: 'cubic-bezier(0.32, 0.72, 0, 1)',
  spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
}

const springs = {
  default: { stiffness: 400, damping: 30 },
  gentle: { stiffness: 200, damping: 20 },
  stiff: { stiffness: 600, damping: 40 },
}
```

## Component Styling Pattern

### Basic Pattern

```typescript
import { type CSSProperties } from 'react'
import { colors, spacing, radii, mergeStyles } from '@vortex/core'

// 1. Define static styles as constants
const containerStyles: CSSProperties = {
  backgroundColor: colors.background,
  padding: spacing[4],
  borderRadius: radii.lg,
}

const titleStyles: CSSProperties = {
  color: colors.text,
  fontSize: fontSizes.lg,
  fontWeight: fontWeights.semibold,
}

// 2. Use in component with mergeStyles for overrides
export function MyComponent({ style }: { style?: CSSProperties }) {
  return (
    <div style={mergeStyles(containerStyles, style)}>
      <h1 style={titleStyles}>Title</h1>
    </div>
  )
}
```

### Variant Styles

```typescript
const variantStyles: Record<Variant, CSSProperties> = {
  primary: {
    backgroundColor: colors.accent,
    color: colors.white,
  },
  secondary: {
    backgroundColor: colors.surface,
    color: colors.text,
  },
  ghost: {
    backgroundColor: 'transparent',
    color: colors.text,
  },
}

// Usage
<button style={mergeStyles(baseStyles, variantStyles[variant], style)}>
```

### Size Styles

```typescript
const sizeStyles: Record<Size, CSSProperties> = {
  sm: {
    height: 32,
    padding: `${spacing[1]}px ${spacing[3]}px`,
    fontSize: fontSizes.sm,
  },
  md: {
    height: 40,
    padding: `${spacing[2]}px ${spacing[4]}px`,
    fontSize: fontSizes.md,
  },
  lg: {
    height: 48,
    padding: `${spacing[3]}px ${spacing[6]}px`,
    fontSize: fontSizes.md,
  },
}
```

### Conditional Styles

```typescript
// Using mergeStyles with conditionals
<div
  style={mergeStyles(
    baseStyles,
    isActive && activeStyles,
    isDisabled && disabledStyles,
    style
  )}
>

// Or using conditionalStyle helper
import { conditionalStyle } from '@vortex/core'

<div
  style={conditionalStyle(
    baseStyles,
    [isActive, activeStyles],
    [isDisabled, disabledStyles]
  )}
>
```

## Helper Functions

### mergeStyles

Merges multiple style objects, filtering out falsy values:

```typescript
import { mergeStyles } from '@vortex/core'

const style = mergeStyles(
  baseStyles,
  isActive && activeStyles,  // Only applied if isActive
  customStyle                 // External override
)
```

### Style Presets

Common style patterns available in `@vortex/core`:

```typescript
import { presets } from '@vortex/core'

// Centering
presets.center       // display: flex, alignItems: center, justifyContent: center
presets.absoluteFill // position: absolute, inset: 0

// Layout
presets.row          // display: flex, flexDirection: row
presets.column       // display: flex, flexDirection: column
presets.spaceBetween // justifyContent: space-between

// Text
presets.textShadow   // textShadow for text on video
presets.truncate     // overflow: hidden, textOverflow: ellipsis, whiteSpace: nowrap
```

## Best Practices

### Do's ✅

```typescript
// ✅ Use design tokens
style={{ padding: spacing[4] }}

// ✅ Use mergeStyles for combining styles
style={mergeStyles(baseStyles, variant && variantStyles, style)}

// ✅ Define styles outside component
const buttonStyles: CSSProperties = { ... }

// ✅ Type your style objects
const styles = {
  container: { ... } satisfies CSSProperties,
}

// ✅ Allow style override via props
interface Props {
  style?: CSSProperties
}
```

### Don'ts ❌

```typescript
// ❌ Don't hardcode values
style={{ padding: 16 }}  // Use spacing[4] instead

// ❌ Don't use Tailwind classes on video pages
className="bg-white"  // Never use white bg on video

// ❌ Don't create styles inside render
function Component() {
  const styles = { ... }  // Creates new object each render
}

// ❌ Don't use inline objects for static styles
<div style={{ backgroundColor: colors.background, ... }}>  // Move outside

// ❌ Don't mix Tailwind and inline styles
<div className="p-4" style={{ color: 'white' }}>
```

## Component Examples

### Button with Variants

```typescript
const baseStyles: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: fontWeights.medium,
  borderRadius: radii.lg,
  border: 'none',
  cursor: 'pointer',
  transition: `all ${durations.normal} ${easings.vortex}`,
}

const variantStyles = {
  primary: { backgroundColor: colors.accent, color: colors.white },
  secondary: { backgroundColor: colors.surface, color: colors.text },
  ghost: { backgroundColor: 'transparent', color: colors.text },
}

export function Button({ variant = 'primary', style, ...props }) {
  return (
    <button
      style={mergeStyles(baseStyles, variantStyles[variant], style)}
      {...props}
    />
  )
}
```

### Glass Card

```typescript
const glassCardStyles: CSSProperties = {
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  borderRadius: radii.xl,
  border: `1px solid ${colors.border}`,
  padding: spacing[4],
}
```

### Video Overlay Text

```typescript
const videoTextStyles: CSSProperties = {
  color: colors.text,
  textShadow: shadows.text,  // '0 2px 4px rgba(0, 0, 0, 0.8)'
  fontWeight: fontWeights.semibold,
}
```

## Animation with Motion

Use Motion (from motion.dev) for animations:

```typescript
import { motion } from 'motion/react'
import { springs } from '@vortex/core'

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ type: 'spring', ...springs.default }}
>
```

## Z-Index Scale

```typescript
const zIndices = {
  behind: -1,
  base: 0,
  dropdown: 10,
  sticky: 20,
  overlay: 30,
  modal: 40,
  popover: 50,
  toast: 60,
}
```

Always use these predefined z-indices to maintain proper layering.

