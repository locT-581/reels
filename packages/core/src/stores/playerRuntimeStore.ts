/**
 * Player Runtime Store - Zustand store for non-persisted playback state
 *
 * This store manages runtime playback state that should NOT be persisted:
 * - Current video information
 * - Playback state (playing, paused, buffering, etc.)
 * - Playback progress (currentTime, duration, buffered)
 *
 * This state is transient and resets on page refresh.
 */

import { create } from 'zustand'
import type { Video, PlayerState } from '../types'

export interface PlayerRuntimeStore {
  // Runtime State
  /** Current video */
  currentVideo: Video | null
  /** Current player state */
  playerState: PlayerState
  /** Whether the video is playing */
  isPlaying: boolean
  /** Current time */
  currentTime: number
  /** Current duration */
  duration: number
  /** Current buffered */
  buffered: number

  // Actions
  /** Set current video */
  setCurrentVideo: (video: Video | null) => void
  /** Set player state */
  setPlayerState: (state: PlayerState) => void
  /** Play the video */
  play: () => void
  /** Pause the video */
  pause: () => void
  /** Toggle play/pause */
  togglePlay: () => void
  /** Seek to a specific time */
  seek: (time: number) => void
  /** Update progress */
  updateProgress: (currentTime: number, buffered: number) => void
  /** Set duration */
  setDuration: (duration: number) => void
  /** Reset the store */
  reset: () => void
}

const initialRuntimeState = {
  currentVideo: null,
  playerState: 'idle' as PlayerState,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  buffered: 0,
}

export const usePlayerRuntimeStore = create<PlayerRuntimeStore>((set) => ({
  ...initialRuntimeState,

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

  seek: (currentTime) => set({ currentTime }),

  updateProgress: (currentTime, buffered) => set({ currentTime, buffered }),

  setDuration: (duration) => set({ duration }),

  reset: () => set(initialRuntimeState),
}))

