# State Architecture

## Overview

VortexStream uses a layered state management approach:

```
┌─────────────────────────────────────────────────────────────┐
│                     React Component                          │
├─────────────────────────────────────────────────────────────┤
│                  Component Local State                       │
│         (useState, useRef - UI-specific state)               │
├─────────────────────────────────────────────────────────────┤
│                    Zustand Stores                            │
│  ┌─────────────────────┐  ┌─────────────────────────────┐  │
│  │ PlayerRuntimeStore  │  │ PlayerPreferencesStore      │  │
│  │  (not persisted)    │  │  (persisted to localStorage)│  │
│  └─────────────────────┘  └─────────────────────────────┘  │
│  ┌─────────────────────┐  ┌─────────────────────────────┐  │
│  │     FeedStore       │  │       UIStore               │  │
│  │  (not persisted)    │  │    (not persisted)          │  │
│  └─────────────────────┘  └─────────────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│              PlayerStateMachine (validation)                 │
│           (state transition guards in player-core)           │
└─────────────────────────────────────────────────────────────┘
```

## State Ownership

| State | Store | Persisted | Location |
|-------|-------|-----------|----------|
| User Preferences | `usePlayerPreferencesStore` | Yes (localStorage) | `@vortex/core` |
| Playback Runtime | `usePlayerRuntimeStore` | No | `@vortex/core` |
| Feed State | `useFeedStore` | No | `@vortex/core` |
| UI State | `useUIStore` | No | `@vortex/core` |
| User Session | `useUserStore` | No | `@vortex/core` |

## Stores Detail

### usePlayerPreferencesStore (Persisted)

Manages user preferences that persist across sessions:

```typescript
interface PreferencesStore {
  isMuted: boolean
  volume: number
  playbackSpeed: PlaybackSpeed
  quality: Quality
  
  // Actions
  toggleMute: () => void
  setMuted: (muted: boolean) => void
  setVolume: (volume: number) => void
  setPlaybackSpeed: (speed: PlaybackSpeed) => void
  setQuality: (quality: Quality) => void
  resetPreferences: () => void
}
```

**When to use:**
- Storing user's volume preference
- Storing preferred playback speed
- Storing quality preference

### usePlayerRuntimeStore (Not Persisted)

Manages runtime playback state that resets on page refresh:

```typescript
interface PlayerRuntimeStore {
  currentVideo: Video | null
  playerState: PlayerState
  isPlaying: boolean
  currentTime: number
  duration: number
  buffered: number
  
  // Actions
  setCurrentVideo: (video: Video | null) => void
  setPlayerState: (state: PlayerState) => void
  play: () => void
  pause: () => void
  togglePlay: () => void
  seek: (time: number) => void
  updateProgress: (currentTime: number, buffered: number) => void
  setDuration: (duration: number) => void
  reset: () => void
}
```

**When to use:**
- Tracking current video
- Tracking playback progress
- Managing play/pause state

### usePlayerStore (Composite - Backward Compatibility)

Combines runtime and preferences for backward compatibility:

```typescript
// ⚠️ DEPRECATED: Use individual stores for new code
function usePlayerStore(): PlayerRuntimeStore & PreferencesStore
```

### useFeedStore

Manages video feed navigation state:

```typescript
interface FeedStore {
  videos: Video[]
  currentIndex: number
  isLoading: boolean
  hasMore: boolean
  error: Error | null
  
  // Actions
  setVideos: (videos: Video[]) => void
  appendVideos: (videos: Video[]) => void
  prependVideos: (videos: Video[]) => void
  setCurrentIndex: (index: number) => void
  // ...
}
```

### useUIStore

Manages UI state like modals and bottom sheets:

```typescript
interface UIStore {
  isCommentsOpen: boolean
  isShareOpen: boolean
  isMenuOpen: boolean
  activeModal: string | null
  
  // Actions
  openComments: () => void
  closeComments: () => void
  // ...
}
```

## PlayerStateMachine

Located in `@vortex/player-core`, validates state transitions:

```typescript
const machine = createPlayerStateMachine()

// Check if transition is valid before changing state
if (machine.canTransition('playing')) {
  machine.transition('playing')
  playerRuntimeStore.play()
}
```

Valid transitions:
- `idle` → `loading`
- `loading` → `ready` | `error`
- `ready` → `playing` | `loading` | `error`
- `playing` → `paused` | `buffering` | `ended` | `error`
- `buffering` → `playing` | `paused` | `stalled` | `error`
- `stalled` → `playing` | `buffering` | `error` | `loading`
- `ended` → `playing` | `loading` | `idle`
- `error` → `loading` | `idle`
- `*` → `idle` (reset from any state)

## When to Use What

### Component Local State (`useState`)

Use for:
- UI-specific state (hover, focus, animation state)
- Form input values
- Temporary UI state that doesn't affect other components

```typescript
const [isHovered, setIsHovered] = useState(false)
const [inputValue, setInputValue] = useState('')
```

### Zustand Stores

Use for:
- State shared across multiple components
- State that needs to persist across navigation
- State that other parts of the app need to react to

```typescript
import { usePlayerRuntimeStore, usePlayerPreferencesStore } from '@vortex/core'

// For runtime state
const { isPlaying, play, pause } = usePlayerRuntimeStore()

// For preferences
const { volume, setVolume } = usePlayerPreferencesStore()
```

### TanStack Query

Use for:
- Server state (API data)
- Caching and deduplication
- Background refetching

```typescript
import { useVideoFeed } from '@vortex/feed'

const { data, isLoading, fetchNextPage } = useVideoFeed({
  initialPageSize: 10,
})
```

## Best Practices

1. **Prefer individual stores** over the composite `usePlayerStore`
2. **Use selectors** to minimize re-renders
3. **Keep component state local** unless it needs to be shared
4. **Don't store derived state** - compute it instead
5. **Use the state machine** for complex state transitions

```typescript
// ✅ Good: Individual stores with selectors
const isPlaying = usePlayerRuntimeStore((state) => state.isPlaying)
const volume = usePlayerPreferencesStore((state) => state.volume)

// ❌ Avoid: Using composite store (deprecated)
const { isPlaying, volume } = usePlayerStore()

// ✅ Good: Compute derived state
const progress = duration > 0 ? (currentTime / duration) * 100 : 0

// ❌ Avoid: Storing derived state
const [progress, setProgress] = useState(0)
```

