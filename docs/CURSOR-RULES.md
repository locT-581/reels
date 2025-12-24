# XHubReel Cursor Rules Documentation

Tài liệu này mô tả tất cả Cursor Rules đã được tạo cho dự án XHubReel.

## Cấu trúc Rules

```
.cursor/rules/
├── project-conventions/     # Always Apply
│   └── RULE.md
├── video-player/           # Apply to **/player/**, **/video/**
│   └── RULE.md
├── ui-components/          # Apply to **/components/**, **/ui/**
│   └── RULE.md
├── gestures/               # Apply to **/gestures/**
│   └── RULE.md
├── feed-virtualization/    # Apply to **/feed/**
│   └── RULE.md
├── state-management/       # Apply to **/stores/**
│   └── RULE.md
├── interactions/           # Apply to **/Like**, **/Comment**, **/Share**
│   └── RULE.md
└── performance/            # Always Apply
    └── RULE.md
```

---

## Rule Summaries

### 1. Project Conventions (Always Apply)
**File**: `.cursor/rules/project-conventions/RULE.md`

Nội dung chính:
- Tech stack bắt buộc (Next.js 15, TypeScript, Tailwind, Zustand...)
- Monorepo structure
- Naming conventions
- Import rules
- Error handling patterns

### 2. Video Player (Apply to video files)
**File**: `.cursor/rules/video-player/RULE.md`

Nội dung chính:
- HLS.js configuration (mobile optimized)
- Native HLS fallback cho iOS
- Video state machine
- Loading states visual
- Player controls specs
- Graceful degradation
- Memory management

### 3. UI Components (Apply to component files)
**File**: `.cursor/rules/ui-components/RULE.md`

Nội dung chính:
- XHubReel Design System
- Color palette (#000000, #8B5CF6, #FF2D55)
- Typography (Inter/Geist)
- 8pt spacing grid
- Animation với Motion (spring physics)
- Glassmorphism cho overlays
- Bottom sheet patterns
- Icon usage (Lucide React)

### 4. Gestures (Apply to gesture files)
**File**: `.cursor/rules/gestures/RULE.md`

Nội dung chính:
- @use-gesture/react implementation
- Tap gestures (single, double, long press)
- Swipe gestures (vertical, horizontal)
- Haptic feedback
- Context menu
- Animation cho like/seek

### 5. Feed Virtualization (Apply to feed files)
**File**: `.cursor/rules/feed-virtualization/RULE.md`

Nội dung chính:
- @tanstack/react-virtual setup
- Scroll snap CSS
- Video activation rules (50% viewport)
- Scroll velocity detection
- Pre-loading strategy
- Memory management
- Pull-to-refresh
- Infinite scroll

### 6. State Management (Apply to store files)
**File**: `.cursor/rules/state-management/RULE.md`

Nội dung chính:
- Zustand store patterns (Player, Feed, User)
- Persist middleware
- TanStack Query patterns
- Query keys convention
- Optimistic updates
- Mutation patterns
- Selectors

### 7. Interactions (Apply to interaction files)
**File**: `.cursor/rules/interactions/RULE.md`

Nội dung chính:
- Like system (button, animation, counter format)
- Comment system (bottom sheet, item, input, threading)
- Share system (options, platforms)
- Action bar layout
- Optimistic update patterns

### 8. Performance (Always Apply)
**File**: `.cursor/rules/performance/RULE.md`

Nội dung chính:
- Bundle size budgets
- Core Web Vitals targets
- Code splitting rules
- Memoization patterns
- CSS performance
- Network optimization
- Service worker caching
- Monitoring setup

---

## How Rules Work

Theo [Cursor documentation](https://cursor.com/docs/context/rules):

1. **Always Apply**: Rules trong `project-conventions` và `performance` luôn được áp dụng
2. **Apply to Specific Files**: Rules khác được áp dụng dựa trên `globs` pattern
3. **Apply Intelligently**: Cursor tự quyết định dựa trên `description`

---

## Usage Examples

### Khi tạo Video Player component:
Cursor sẽ tự động áp dụng:
- `project-conventions` (always)
- `performance` (always)
- `video-player` (matched by globs)
- `ui-components` (matched by globs)

### Khi tạo Comment feature:
Cursor sẽ áp dụng:
- `project-conventions` (always)
- `performance` (always)
- `interactions` (matched by globs)
- `ui-components` (matched by globs)
- `state-management` (if creating store)

---

## Alternative: AGENTS.md

Ngoài Project Rules, còn có file `AGENTS.md` ở root với hướng dẫn ngắn gọn hơn.

File này phù hợp cho:
- Quick reference
- Simple projects
- Người mới join project

---

## Updating Rules

1. Edit file `RULE.md` tương ứng trong `.cursor/rules/`
2. Rules tự động sync khi save
3. Có thể tạo rule mới bằng command `New Cursor Rule`

---

## Best Practices

1. **Keep rules under 500 lines** - Đã tuân thủ
2. **Split by domain** - Mỗi rule focus vào một domain
3. **Provide examples** - Đã có code examples
4. **Be specific** - Không vague, có targets cụ thể
5. **Version control** - Rules nằm trong `.cursor/rules/`

