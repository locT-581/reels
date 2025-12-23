---
description: "UI component rules - CSS Variables, Inline Styles, animations, and the Vortex Design System"
globs: ["**/components/**", "**/ui/**", "**/*.tsx"]
alwaysApply: false
---

# UI Components Rules (Vortex Design System)

## Design System Overview

- **Philosophy**: Video-centric, "Invisible App"
- **Motion**: Physics-First (spring animations)
- **Layout**: Reachability First (bottom 1/3 for interactions)
- **Styling**: CSS Variables + Inline Styles (NO Tailwind CSS)

## Styling Approach

### Import Design Tokens

```typescript
import {
  colors,
  spacing,
  radii,
  fontSizes,
  fontWeights,
  shadows,
  durations,
  easings,
  springs,
  zIndices,
  mergeStyles,
  layout,
  typography,
  visual,
  interactive,
  animation,
} from '@vortex/core'
```

### Building Styles

```typescript
// Define styles as CSSProperties objects
const buttonStyles: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: colors.accent,
  borderRadius: radii.lg,
  padding: `${spacing[2]}px ${spacing[4]}px`,
}

// Merge multiple styles
const combinedStyles = mergeStyles(
  buttonStyles,
  isActive && { backgroundColor: colors.accentHover },
  style // Allow prop override
)

// Use in JSX
<button style={combinedStyles}>Click me</button>
```

### Using Utility Functions

```typescript
// Layout utilities
layout.flex({ direction: 'column', align: 'center', gap: 4 })
layout.flexCenter
layout.fixed({ top: 0, left: 0, right: 0 })
layout.centerAbsolute

// Typography utilities
typography.text({ size: 'md', weight: 'semibold', color: 'text' })
typography.heading
typography.caption
typography.lineClamp(2)

// Visual utilities
visual.bg('surface')
visual.rounded('lg')
visual.glass(20) // Glassmorphism
visual.shadow('md')

// Interactive utilities
interactive.clickable
interactive.disabled
interactive.touchAction('pan-y')
```

## Color Palette

```typescript
const colors = {
  background: 'var(--vortex-color-bg, #000000)',
  surface: 'var(--vortex-color-surface, #18181B)',
  accent: 'var(--vortex-color-accent, #8B5CF6)',
  like: 'var(--vortex-color-like, #FF2D55)',
  text: 'var(--vortex-color-text, #FAFAFA)',
  textSecondary: 'var(--vortex-color-text-secondary, #A1A1AA)',
  textMuted: 'var(--vortex-color-text-muted, #71717A)',
  overlay: 'var(--vortex-color-overlay, rgba(0, 0, 0, 0.8))',
  border: 'var(--vortex-color-border, rgba(255, 255, 255, 0.1))',
}
```

## Spacing (8pt Grid)

```typescript
const spacing = {
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
}
```

## Border Radius

```typescript
const radii = {
  sm: 'var(--vortex-radius-sm, 8px)',
  md: 'var(--vortex-radius-md, 12px)',
  lg: 'var(--vortex-radius-lg, 16px)',
  xl: 'var(--vortex-radius-xl, 24px)',
  full: '9999px',
}
```

## Glassmorphism (for Overlays)

```typescript
// Using utility
const sheetStyles = visual.glass(20)

// Or manually
const glassStyles: CSSProperties = {
  backgroundColor: colors.overlay,
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
}
```

## Animation Rules

### Timing & Easing

```typescript
const durations = {
  fast: '150ms',
  normal: 'var(--vortex-duration-normal, 300ms)',
  slow: '500ms',
}

const easings = {
  vortex: 'var(--vortex-easing, cubic-bezier(0.32, 0.72, 0, 1))',
}

// Usage
animation.transition(['transform', 'opacity'], 'normal', 'vortex')
```

### Spring Physics (Motion)

```typescript
import { motion } from 'motion/react'
import { springs } from '@vortex/core'

// Spring configs
const springs = {
  default: { stiffness: 400, damping: 30 },
  gentle: { stiffness: 200, damping: 20 },
  bouncy: { stiffness: 500, damping: 25 },
}

// Example: Like animation
<motion.div
  animate={{ scale: liked ? [1, 1.3, 1] : 1 }}
  transition={{ type: 'spring', ...springs.default }}
/>
```

## Icons

Use inline SVG instead of icon libraries:

```tsx
const HeartIcon = ({ filled, color = 'white' }: { filled?: boolean; color?: string }) => (
  <svg
    width={32}
    height={32}
    viewBox="0 0 24 24"
    fill={filled ? color : 'none'}
    stroke={color}
    strokeWidth={2}
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)

// Unliked: outline
<HeartIcon filled={false} color="white" />

// Liked: solid
<HeartIcon filled={true} color={colors.like} />
```

## Bottom Sheets

```tsx
const sheetStyles: CSSProperties = {
  position: 'fixed',
  inset: 0,
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: colors.overlay,
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  borderTopLeftRadius: radii.xl,
  borderTopRightRadius: radii.xl,
}

// With Motion for animation
<motion.div
  initial={{ y: '100%' }}
  animate={{ y: 0 }}
  exit={{ y: '100%' }}
  transition={{ type: 'spring', ...springs.default }}
  style={sheetStyles}
>
  {/* Drag handle */}
  <div style={{
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    margin: '12px auto 0',
  }} />
  {/* Content */}
</motion.div>
```

## Video Overlay Layout

```
┌─────────────────────────────────┐
│ [Mute] [Tab Tabs] [Menu]        │ ← Header (fixed)
│                                 │
│                                 │
│                        [👤+]    │ ← Action bar (right)
│                        [❤️]     │
│                        1.2K     │
│                        [💬]     │
│                        234      │
│                        [🔗]     │
│                        [🔖]     │
│                                 │
│ [Avatar]                        │
│ @username                       │ ← Info overlay (left bottom)
│ Caption text...                 │
│ #hashtag #trending              │
│ ♪ Sound name...                 │
├─────────────────────────────────┤
│ ═══════════════════════════════ │ ← Seek bar (2px)
└─────────────────────────────────┘
```

## Accessibility

```tsx
// Tap areas tối thiểu 48x48px
const tapAreaStyles: CSSProperties = {
  width: 48,
  height: 48,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

// Always include aria-label for icon buttons
<button style={tapAreaStyles} aria-label="Like">
  <HeartIcon />
</button>
```

## Component Props Pattern

```tsx
interface MyComponentProps {
  // ... other props
  /** Custom styles override */
  style?: CSSProperties
  /** Custom className (for external CSS if needed) */
  className?: string
}

export function MyComponent({ style, className = '', ...props }: MyComponentProps) {
  return (
    <div
      style={mergeStyles(baseStyles, style)}
      className={className}
    >
      {/* content */}
    </div>
  )
}
```

## No White Backgrounds

❌ KHÔNG BAO GIỜ dùng `backgroundColor: '#FFFFFF'` cho pages chứa video
✅ Luôn dùng `backgroundColor: colors.background` hoặc `#000000`

## Customization for Users

Users can override design tokens via CSS variables:

```css
:root {
  /* Change accent color to blue */
  --vortex-color-accent: #3B82F6;
  --vortex-color-accent-hover: #2563EB;

  /* Larger border radius */
  --vortex-radius-lg: 20px;

  /* Slower animations */
  --vortex-duration-normal: 400ms;
}
```
