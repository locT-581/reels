---
description: "State management rules - Zustand for client state, TanStack Query for server state"
globs: ["**/stores/**", "**/hooks/use*Query*", "**/hooks/use*Mutation*", "**/*Store*"]
alwaysApply: false
---

# State Management Rules

## Overview

- **Client State**: Zustand (~1.2KB)
- **Server State**: TanStack Query (~13KB)
- **Không dùng**: Redux, MobX, Recoil (quá nặng)

## Zustand Store Pattern

### Player Store

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface PlayerState {
  // State
  currentVideo: Video | null
  isPlaying: boolean
  isMuted: boolean
  volume: number
  playbackSpeed: number
  quality: 'auto' | '1080p' | '720p' | '480p'
  currentTime: number
  duration: number
  buffered: number
}

interface PlayerActions {
  // Actions
  setCurrentVideo: (video: Video) => void
  play: () => void
  pause: () => void
  toggleMute: () => void
  setVolume: (volume: number) => void
  setSpeed: (speed: number) => void
  setQuality: (quality: PlayerState['quality']) => void
  seek: (time: number) => void
  updateProgress: (time: number, buffered: number) => void
}

export const usePlayerStore = create<PlayerState & PlayerActions>()(
  persist(
    (set, get) => ({
      // Initial state
      currentVideo: null,
      isPlaying: false,
      isMuted: true, // Start muted (browser policy)
      volume: 1,
      playbackSpeed: 1,
      quality: 'auto',
      currentTime: 0,
      duration: 0,
      buffered: 0,

      // Actions
      setCurrentVideo: (video) => set({ currentVideo: video, currentTime: 0 }),
      play: () => set({ isPlaying: true }),
      pause: () => set({ isPlaying: false }),
      toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
      setVolume: (volume) => set({ volume, isMuted: volume === 0 }),
      setSpeed: (playbackSpeed) => set({ playbackSpeed }),
      setQuality: (quality) => set({ quality }),
      seek: (currentTime) => set({ currentTime }),
      updateProgress: (currentTime, buffered) => set({ currentTime, buffered }),
    }),
    {
      name: 'vortex-player',
      partialize: (state) => ({
        // Chỉ persist những gì cần
        isMuted: state.isMuted,
        volume: state.volume,
        playbackSpeed: state.playbackSpeed,
        quality: state.quality,
      }),
    }
  )
)
```

### Feed Store

```typescript
interface FeedState {
  videos: Video[]
  currentIndex: number
  feedType: 'foryou' | 'following'
  hasMore: boolean
}

interface FeedActions {
  setVideos: (videos: Video[]) => void
  appendVideos: (videos: Video[]) => void
  setCurrentIndex: (index: number) => void
  setFeedType: (type: FeedState['feedType']) => void
  removeVideo: (id: string) => void
}

export const useFeedStore = create<FeedState & FeedActions>((set) => ({
  videos: [],
  currentIndex: 0,
  feedType: 'foryou',
  hasMore: true,

  setVideos: (videos) => set({ videos }),
  appendVideos: (videos) => set((state) => ({ 
    videos: [...state.videos, ...videos] 
  })),
  setCurrentIndex: (currentIndex) => set({ currentIndex }),
  setFeedType: (feedType) => set({ feedType, videos: [], currentIndex: 0 }),
  removeVideo: (id) => set((state) => ({
    videos: state.videos.filter((v) => v.id !== id)
  })),
}))
```

### User Store

```typescript
interface UserState {
  user: User | null
  isAuthenticated: boolean
  watchHistory: string[]
  likedVideos: Set<string>
  savedVideos: Set<string>
}

interface UserActions {
  setUser: (user: User | null) => void
  addToHistory: (videoId: string) => void
  toggleLike: (videoId: string) => void
  toggleSave: (videoId: string) => void
  clearHistory: () => void
}

export const useUserStore = create<UserState & UserActions>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      watchHistory: [],
      likedVideos: new Set(),
      savedVideos: new Set(),

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      addToHistory: (videoId) => set((state) => {
        const history = state.watchHistory.filter((id) => id !== videoId)
        return { watchHistory: [videoId, ...history].slice(0, 1000) }
      }),

      toggleLike: (videoId) => set((state) => {
        const liked = new Set(state.likedVideos)
        if (liked.has(videoId)) {
          liked.delete(videoId)
        } else {
          liked.add(videoId)
        }
        return { likedVideos: liked }
      }),

      toggleSave: (videoId) => set((state) => {
        const saved = new Set(state.savedVideos)
        if (saved.has(videoId)) {
          saved.delete(videoId)
        } else {
          saved.add(videoId)
        }
        return { savedVideos: saved }
      }),

      clearHistory: () => set({ watchHistory: [] }),
    }),
    {
      name: 'vortex-user',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name)
          if (!str) return null
          const parsed = JSON.parse(str)
          // Convert arrays back to Sets
          parsed.state.likedVideos = new Set(parsed.state.likedVideos)
          parsed.state.savedVideos = new Set(parsed.state.savedVideos)
          return parsed
        },
        setItem: (name, value) => {
          // Convert Sets to arrays for storage
          const toStore = {
            ...value,
            state: {
              ...value.state,
              likedVideos: [...value.state.likedVideos],
              savedVideos: [...value.state.savedVideos],
            }
          }
          localStorage.setItem(name, JSON.stringify(toStore))
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
)
```

## TanStack Query Patterns

### Query Keys Convention

```typescript
export const queryKeys = {
  feed: {
    all: ['feed'] as const,
    forYou: () => [...queryKeys.feed.all, 'foryou'] as const,
    following: () => [...queryKeys.feed.all, 'following'] as const,
  },
  video: {
    all: ['video'] as const,
    detail: (id: string) => [...queryKeys.video.all, id] as const,
    comments: (id: string) => [...queryKeys.video.all, id, 'comments'] as const,
  },
  user: {
    all: ['user'] as const,
    profile: (id: string) => [...queryKeys.user.all, id] as const,
    videos: (id: string) => [...queryKeys.user.all, id, 'videos'] as const,
  },
} as const
```

### Feed Query

```typescript
export const useFeedQuery = (type: 'foryou' | 'following') => {
  return useInfiniteQuery({
    queryKey: type === 'foryou' ? queryKeys.feed.forYou() : queryKeys.feed.following(),
    queryFn: async ({ pageParam = 0 }) => {
      const response = await fetch(`/api/feed/${type}?page=${pageParam}`)
      return response.json() as Promise<{ videos: Video[]; nextPage: number | null }>
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
```

### Comments Query

```typescript
export const useCommentsQuery = (videoId: string) => {
  return useInfiniteQuery({
    queryKey: queryKeys.video.comments(videoId),
    queryFn: async ({ pageParam = 0 }) => {
      const response = await fetch(`/api/videos/${videoId}/comments?page=${pageParam}`)
      return response.json() as Promise<{ comments: Comment[]; nextPage: number | null }>
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: !!videoId,
    staleTime: 1000 * 60, // 1 minute
  })
}
```

### Mutations with Optimistic Updates

```typescript
export const useLikeMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (videoId: string) => {
      const response = await fetch(`/api/videos/${videoId}/like`, { method: 'POST' })
      return response.json()
    },
    onMutate: async (videoId) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: queryKeys.video.detail(videoId) })

      // Snapshot previous value
      const previousVideo = queryClient.getQueryData(queryKeys.video.detail(videoId))

      // Optimistic update
      queryClient.setQueryData(queryKeys.video.detail(videoId), (old: Video) => ({
        ...old,
        isLiked: !old.isLiked,
        likesCount: old.isLiked ? old.likesCount - 1 : old.likesCount + 1,
      }))

      return { previousVideo }
    },
    onError: (err, videoId, context) => {
      // Rollback on error
      queryClient.setQueryData(
        queryKeys.video.detail(videoId),
        context?.previousVideo
      )
    },
    onSettled: (data, error, videoId) => {
      // Refetch to ensure sync
      queryClient.invalidateQueries({ queryKey: queryKeys.video.detail(videoId) })
    },
  })
}
```

### Comment Mutation

```typescript
export const useCommentMutation = (videoId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (content: string) => {
      const response = await fetch(`/api/videos/${videoId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ content }),
      })
      return response.json() as Promise<Comment>
    },
    onSuccess: (newComment) => {
      queryClient.setQueryData(
        queryKeys.video.comments(videoId),
        (old: { pages: { comments: Comment[] }[] }) => ({
          ...old,
          pages: [
            { comments: [newComment, ...old.pages[0].comments] },
            ...old.pages.slice(1),
          ],
        })
      )
    },
  })
}
```

## Selectors Pattern

```typescript
// Computed/derived state với selectors
const useCurrentVideo = () => usePlayerStore((state) => state.currentVideo)
const useIsPlaying = () => usePlayerStore((state) => state.isPlaying)
const usePlaybackControls = () => usePlayerStore((state) => ({
  play: state.play,
  pause: state.pause,
  seek: state.seek,
}))

// Avoid re-renders với shallow compare
import { shallow } from 'zustand/shallow'

const usePlayerSettings = () => usePlayerStore(
  (state) => ({
    volume: state.volume,
    playbackSpeed: state.playbackSpeed,
    quality: state.quality,
  }),
  shallow
)
```

## Best Practices

1. **Separate stores by domain** - Player, Feed, User stores
2. **Use selectors** - Avoid selecting entire store
3. **Optimistic updates** - Update UI before API response
4. **Proper cache invalidation** - Use query keys correctly
5. **Persist only necessary data** - Don't persist temporary state

