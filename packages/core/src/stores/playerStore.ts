/**
 * Player Store - Zustand store for video playback state
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Video, PlayerState, PlaybackSpeed, Quality } from '../types'
import { STORAGE_KEYS } from '../constants'

export interface PlayerStore {
  // State
  currentVideo: Video | null
  playerState: PlayerState
  isPlaying: boolean
  isMuted: boolean
  volume: number
  playbackSpeed: PlaybackSpeed
  quality: Quality
  currentTime: number
  duration: number
  buffered: number

  // Actions
  setCurrentVideo: (video: Video | null) => void
  setPlayerState: (state: PlayerState) => void
  play: () => void
  pause: () => void
  togglePlay: () => void
  toggleMute: () => void
  setVolume: (volume: number) => void
  setPlaybackSpeed: (speed: PlaybackSpeed) => void
  setQuality: (quality: Quality) => void
  seek: (time: number) => void
  updateProgress: (currentTime: number, buffered: number) => void
  setDuration: (duration: number) => void
  reset: () => void
}

const initialState = {
  currentVideo: null,
  playerState: 'idle' as PlayerState,
  isPlaying: false,
  isMuted: true, // Start muted (browser autoplay policy)
  volume: 1,
  playbackSpeed: 1 as PlaybackSpeed,
  quality: 'auto' as Quality,
  currentTime: 0,
  duration: 0,
  buffered: 0,
}

export const usePlayerStore = create<PlayerStore>()(
  persist(
    (set, _get) => ({
      ...initialState,

      setCurrentVideo: (video) =>
        set({
          currentVideo: video,
          currentTime: 0,
          buffered: 0,
          playerState: video ? 'loading' : 'idle',
        }),

      setPlayerState: (playerState) => set({ playerState }),

      play: () => set({ isPlaying: true, playerState: 'playing' }),

      pause: () => set({ isPlaying: false, playerState: 'paused' }),

      togglePlay: () =>
        set((state) => ({
          isPlaying: !state.isPlaying,
          playerState: state.isPlaying ? 'paused' : 'playing',
        })),

      toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),

      setVolume: (volume) =>
        set({
          volume: Math.max(0, Math.min(1, volume)),
          isMuted: volume === 0,
        }),

      setPlaybackSpeed: (playbackSpeed) => set({ playbackSpeed }),

      setQuality: (quality) => set({ quality }),

      seek: (currentTime) => set({ currentTime }),

      updateProgress: (currentTime, buffered) => set({ currentTime, buffered }),

      setDuration: (duration) => set({ duration }),

      reset: () => set(initialState),
    }),
    {
      name: STORAGE_KEYS.PLAYER_PREFERENCES,
      partialize: (state) => ({
        // Only persist user preferences, not playback state
        isMuted: state.isMuted,
        volume: state.volume,
        playbackSpeed: state.playbackSpeed,
        quality: state.quality,
      }),
    }
  )
)

