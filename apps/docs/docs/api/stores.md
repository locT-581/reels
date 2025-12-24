---
sidebar_position: 2
---

# Stores

Zustand stores cho state management.

## usePlayerStore

Quản lý video player state.

### State

| Property | Type | Description |
|----------|------|-------------|
| `isPlaying` | `boolean` | Video đang phát |
| `isMuted` | `boolean` | Video đang muted |
| `volume` | `number` | Volume level (0-1) |
| `playbackSpeed` | `PlaybackSpeed` | Tốc độ phát |
| `quality` | `Quality` | Quality level |
| `currentTime` | `number` | Thời gian hiện tại (seconds) |
| `duration` | `number` | Tổng thời lượng (seconds) |
| `buffered` | `number` | Buffer position (seconds) |
| `playerState` | `PlayerState` | Trạng thái player |
| `error` | `PlayerError \| null` | Lỗi (nếu có) |

### Actions

| Action | Type | Description |
|--------|------|-------------|
| `play()` | `() => void` | Phát video |
| `pause()` | `() => void` | Pause video |
| `togglePlay()` | `() => void` | Toggle play/pause |
| `toggleMute()` | `() => void` | Toggle mute |
| `setVolume(v)` | `(v: number) => void` | Set volume |
| `setPlaybackSpeed(s)` | `(s: PlaybackSpeed) => void` | Set speed |
| `setQuality(q)` | `(q: Quality) => void` | Set quality |
| `seek(t)` | `(t: number) => void` | Seek to time |
| `reset()` | `() => void` | Reset state |

### Usage

```tsx
import { usePlayerStore } from '@xhub-reel/core'

function PlayerControls() {
  const {
    isPlaying,
    isMuted,
    volume,
    currentTime,
    duration,
    togglePlay,
    toggleMute,
    setVolume,
    seek,
  } = usePlayerStore()

  return (
    <div>
      <button onClick={togglePlay}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      
      <button onClick={toggleMute}>
        {isMuted ? 'Unmute' : 'Mute'}
      </button>
      
      <input
        type="range"
        min={0}
        max={1}
        step={0.1}
        value={volume}
        onChange={(e) => setVolume(Number(e.target.value))}
      />
      
      <input
        type="range"
        min={0}
        max={duration}
        value={currentTime}
        onChange={(e) => seek(Number(e.target.value))}
      />
      
      <span>
        {formatTime(currentTime)} / {formatTime(duration)}
      </span>
    </div>
  )
}
```

### Selectors

```tsx
// Select specific values
const isPlaying = usePlayerStore((state) => state.isPlaying)
const currentTime = usePlayerStore((state) => state.currentTime)

// Select multiple values with shallow compare
const { isPlaying, isMuted } = usePlayerStore(
  (state) => ({ isPlaying: state.isPlaying, isMuted: state.isMuted }),
  shallow
)
```

---

## useFeedStore

Quản lý video feed state.

### State

| Property | Type | Description |
|----------|------|-------------|
| `videos` | `Video[]` | Danh sách video |
| `currentIndex` | `number` | Index video hiện tại |
| `currentVideo` | `Video \| null` | Video hiện tại |
| `feedType` | `'foryou' \| 'following'` | Loại feed |

### Actions

| Action | Type | Description |
|--------|------|-------------|
| `setVideos(v)` | `(v: Video[]) => void` | Set video list |
| `addVideos(v)` | `(v: Video[]) => void` | Add videos to list |
| `setCurrentIndex(i)` | `(i: number) => void` | Set current index |
| `goToNext()` | `() => void` | Go to next video |
| `goToPrevious()` | `() => void` | Go to previous video |
| `setFeedType(t)` | `(t: FeedType) => void` | Set feed type |

### Usage

```tsx
import { useFeedStore } from '@xhub-reel/core'

function FeedControls() {
  const {
    videos,
    currentIndex,
    currentVideo,
    goToNext,
    goToPrevious,
    setFeedType,
  } = useFeedStore()

  return (
    <div>
      <p>
        Video {currentIndex + 1} of {videos.length}
      </p>
      <p>Now playing: {currentVideo?.caption}</p>
      
      <button 
        onClick={goToPrevious}
        disabled={currentIndex === 0}
      >
        Previous
      </button>
      
      <button 
        onClick={goToNext}
        disabled={currentIndex === videos.length - 1}
      >
        Next
      </button>
      
      <select onChange={(e) => setFeedType(e.target.value)}>
        <option value="foryou">For You</option>
        <option value="following">Following</option>
      </select>
    </div>
  )
}
```

### Derived State

```tsx
import { useFeedStore } from '@xhub-reel/core'

function FeedStatus() {
  const videos = useFeedStore((state) => state.videos)
  const currentIndex = useFeedStore((state) => state.currentIndex)
  
  const isFirstVideo = currentIndex === 0
  const isLastVideo = currentIndex === videos.length - 1
  const hasVideos = videos.length > 0
  
  return (
    <div>
      {!hasVideos && <p>No videos</p>}
      {isLastVideo && <p>You've reached the end!</p>}
    </div>
  )
}
```

---

## useUIStore

Quản lý UI state (modals, sheets, toasts).

### State

| Property | Type | Description |
|----------|------|-------------|
| `isCommentSheetOpen` | `boolean` | Comment sheet đang mở |
| `isShareSheetOpen` | `boolean` | Share sheet đang mở |
| `activeVideoId` | `string \| null` | Video ID đang tương tác |
| `toast` | `Toast \| null` | Toast hiện tại |

### Actions

| Action | Type | Description |
|--------|------|-------------|
| `openCommentSheet(id)` | `(id: string) => void` | Mở comment sheet |
| `closeCommentSheet()` | `() => void` | Đóng comment sheet |
| `openShareSheet(id)` | `(id: string) => void` | Mở share sheet |
| `closeShareSheet()` | `() => void` | Đóng share sheet |
| `showToast(msg, type)` | `(msg, type) => void` | Show toast |
| `hideToast()` | `() => void` | Hide toast |

### Usage

```tsx
import { useUIStore } from '@xhub-reel/core'

function VideoActions({ video }) {
  const {
    openCommentSheet,
    openShareSheet,
    showToast,
  } = useUIStore()

  const handleLike = async () => {
    await likeVideo(video.id)
    showToast('Đã thích video!', 'success')
  }

  return (
    <div>
      <button onClick={handleLike}>Like</button>
      <button onClick={() => openCommentSheet(video.id)}>
        Comments
      </button>
      <button onClick={() => openShareSheet(video.id)}>
        Share
      </button>
    </div>
  )
}

// In app root
function App() {
  const { 
    isCommentSheetOpen, 
    closeCommentSheet,
    activeVideoId,
    toast,
    hideToast,
  } = useUIStore()

  return (
    <>
      <VideoFeed />
      
      <CommentSheet
        isOpen={isCommentSheetOpen}
        onClose={closeCommentSheet}
        videoId={activeVideoId}
      />
      
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </>
  )
}
```

---

## useUserStore

Quản lý user authentication state.

### State

| Property | Type | Description |
|----------|------|-------------|
| `user` | `User \| null` | Current user |
| `isAuthenticated` | `boolean` | User đã login |
| `isLoading` | `boolean` | Đang loading auth state |

### Actions

| Action | Type | Description |
|--------|------|-------------|
| `setUser(u)` | `(u: User) => void` | Set current user |
| `logout()` | `() => void` | Logout |
| `updateProfile(p)` | `(p: Partial<User>) => void` | Update profile |

### Usage

```tsx
import { useUserStore } from '@xhub-reel/core'

function UserProfile() {
  const { user, isAuthenticated, logout } = useUserStore()

  if (!isAuthenticated) {
    return <LoginButton />
  }

  return (
    <div>
      <img src={user.avatar} alt={user.displayName} />
      <h2>@{user.username}</h2>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

---

## Store Persistence

```tsx
import { persist } from 'zustand/middleware'

// Player preferences persisted
const usePlayerStore = create(
  persist(
    (set) => ({
      isMuted: false,
      volume: 1,
      playbackSpeed: 1,
      // ...
    }),
    {
      name: 'xhub-reel-player',
      partialize: (state) => ({
        isMuted: state.isMuted,
        volume: state.volume,
        playbackSpeed: state.playbackSpeed,
      }),
    }
  )
)
```

---

## Combining Stores

```tsx
import { usePlayerStore, useFeedStore, useUIStore } from '@xhub-reel/core'

function useVideoControls() {
  const { isPlaying, togglePlay } = usePlayerStore()
  const { currentVideo, goToNext, goToPrevious } = useFeedStore()
  const { openCommentSheet, showToast } = useUIStore()

  const handleLike = async () => {
    if (!currentVideo) return
    await likeVideo(currentVideo.id)
    showToast('Liked!', 'success')
  }

  return {
    isPlaying,
    currentVideo,
    togglePlay,
    goToNext,
    goToPrevious,
    handleLike,
    openComments: () => currentVideo && openCommentSheet(currentVideo.id),
  }
}
```

