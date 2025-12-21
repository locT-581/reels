---
description: "UI component rules - Tailwind CSS, shadcn/ui, animations, and the Vortex Design System"
globs: ["**/components/**", "**/ui/**", "**/*.tsx"]
alwaysApply: false
---

# UI Components Rules (Vortex Design System)

## Design System Overview

- **Philosophy**: Video-centric, "Invisible App"
- **Motion**: Physics-First (spring animations)
- **Layout**: Reachability First (bottom 1/3 for interactions)

## Color Palette

```typescript
// tailwind.config.ts
const colors = {
  'vortex-black': '#000000',      // Nền chủ đạo (OLED optimized)
  'vortex-violet': '#8B5CF6',     // Màu nhấn (Actions)
  'vortex-red': '#FF2D55',        // Like color
  'vortex-gray': '#8E8E93',       // Secondary text
}
```

## Typography

```typescript
// Font: Inter hoặc Geist (San-serif)
const typography = {
  header: 'font-bold text-xl',      // 20px+, Bold
  body: 'font-medium text-sm',      // 14-16px, Medium
  caption: 'text-xs text-vortex-gray', // 12px
}

// Text trên video cần shadow
const textOverVideo = 'drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]'
```

## Spacing (8pt Grid)

```typescript
// Chỉ dùng các giá trị: 8, 16, 24, 32, 40, 48...
// Tailwind: p-2 (8px), p-4 (16px), p-6 (24px), p-8 (32px)

// Safe areas cho mobile
const safeArea = {
  top: 'pt-safe-top',    // env(safe-area-inset-top)
  bottom: 'pb-safe-bottom', // env(safe-area-inset-bottom)
}
```

## Border Radius

```typescript
// Bo góc lớn: 16px - 24px
const borderRadius = {
  default: 'rounded-2xl',  // 16px
  large: 'rounded-3xl',    // 24px
}
```

## Glassmorphism (cho Overlays)

```typescript
// Bottom sheets, modals dùng glassmorphism
const glassmorph = 'bg-black/80 backdrop-blur-xl'

// Example: Comment sheet
<div className="bg-black/80 backdrop-blur-xl rounded-t-3xl">
  {/* Content */}
</div>
```

## Animation Rules

### Timing & Easing

```typescript
// Default transition: 300ms
// Easing: cubic-bezier(0.32, 0.72, 0, 1)

// Tailwind config
const transitionTimingFunction = {
  'vortex': 'cubic-bezier(0.32, 0.72, 0, 1)',
}

// Usage
<div className="transition-all duration-300 ease-vortex" />
```

### Spring Physics (Motion)

```typescript
import { motion, spring } from 'motion/react'

// Spring config cho natural feel
const springConfig = {
  stiffness: 400,
  damping: 30,
}

// Example: Like animation
<motion.div
  animate={{ scale: liked ? [1, 1.3, 1] : 1 }}
  transition={{ type: 'spring', ...springConfig }}
/>
```

### Stagger Animations

```typescript
// Action bar buttons xuất hiện với stagger
const staggerChildren = 0.05 // 50ms

<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    visible: { transition: { staggerChildren: 0.05 } }
  }}
>
  {buttons.map((btn) => (
    <motion.button
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
    />
  ))}
</motion.div>
```

## Icons

- Dùng Lucide React (tree-shakable)
- Style: Outline mặc định, Solid khi active
- Size: 32px cho action buttons

```tsx
import { Heart } from 'lucide-react'

// Unliked: outline
<Heart className="w-8 h-8 stroke-white fill-none" />

// Liked: solid
<Heart className="w-8 h-8 stroke-vortex-red fill-vortex-red" />
```

## Bottom Sheets

```tsx
// Height: 60% mặc định, có thể kéo lên 90%
// Animation: Slide up với spring physics

<motion.div
  initial={{ y: '100%' }}
  animate={{ y: 0 }}
  exit={{ y: '100%' }}
  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
  drag="y"
  dragConstraints={{ top: 0, bottom: 0 }}
  dragElastic={{ top: 0, bottom: 0.5 }}
  className="fixed inset-x-0 bottom-0 h-[60vh] bg-black/80 backdrop-blur-xl rounded-t-3xl"
>
  {/* Drag handle */}
  <div className="w-10 h-1 bg-white/30 rounded-full mx-auto mt-3" />
  {/* Content */}
</motion.div>
```

## Video Overlay Layout

```
┌─────────────────────────────────┐
│ [Following] [For You]           │ ← Top tabs
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
<button className="w-12 h-12 flex items-center justify-center">
  <Icon className="w-8 h-8" />
</button>

// Focus indicators cho keyboard users
<button className="focus:ring-2 focus:ring-vortex-violet focus:ring-offset-2 focus:ring-offset-black" />
```

## Reduced Motion Support

```typescript
// Respect user preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Motion component với reduced motion
<motion.div
  animate={{ opacity: 1 }}
  transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }}
/>
```

## No White Backgrounds

❌ KHÔNG BAO GIỜ dùng `bg-white` cho pages chứa video
✅ Luôn dùng `bg-black` hoặc `bg-vortex-black`

