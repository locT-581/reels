/**
 * Feed Store - Zustand store for video feed state
 */

import { create } from 'zustand'
import type { Video, FeedType } from '../types'

export interface FeedStore {
  // State
  videos: Video[]
  currentIndex: number
  feedType: FeedType
  isLoading: boolean
  hasMore: boolean
  error: string | null

  // Actions
  setVideos: (videos: Video[]) => void
  appendVideos: (videos: Video[]) => void
  setCurrentIndex: (index: number) => void
  goToNext: () => void
  goToPrevious: () => void
  setFeedType: (type: FeedType) => void
  removeVideo: (id: string) => void
  setLoading: (loading: boolean) => void
  setHasMore: (hasMore: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

const initialState = {
  videos: [] as Video[],
  currentIndex: 0,
  feedType: 'foryou' as FeedType,
  isLoading: false,
  hasMore: true,
  error: null,
}

export const useFeedStore = create<FeedStore>((set, get) => ({
  ...initialState,

  setVideos: (videos) => set({ videos, currentIndex: 0 }),

  appendVideos: (videos) =>
    set((state) => ({
      videos: [...state.videos, ...videos],
    })),

  setCurrentIndex: (currentIndex) => set({ currentIndex }),

  goToNext: () =>
    set((state) => {
      const nextIndex = Math.min(state.currentIndex + 1, state.videos.length - 1)
      return { currentIndex: nextIndex }
    }),

  goToPrevious: () =>
    set((state) => {
      const prevIndex = Math.max(state.currentIndex - 1, 0)
      return { currentIndex: prevIndex }
    }),

  setFeedType: (feedType) => {
    const currentFeedType = get().feedType
    if (currentFeedType !== feedType) {
      set({
        feedType,
        videos: [],
        currentIndex: 0,
        hasMore: true,
        error: null,
      })
    }
  },

  removeVideo: (id) =>
    set((state) => {
      const newVideos = state.videos.filter((v) => v.id !== id)
      const newIndex = Math.min(state.currentIndex, newVideos.length - 1)
      return {
        videos: newVideos,
        currentIndex: Math.max(0, newIndex),
      }
    }),

  setLoading: (isLoading) => set({ isLoading }),

  setHasMore: (hasMore) => set({ hasMore }),

  setError: (error) => set({ error }),

  reset: () => set(initialState),
}))

