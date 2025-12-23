/**
 * Player Preferences Store - Zustand store for persisted user preferences
 *
 * This store manages user preferences that should be persisted:
 * - Volume and mute state
 * - Playback speed
 * - Quality preference
 *
 * These preferences are stored in localStorage and persist across sessions.
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PlaybackSpeed, Quality } from '../types'
import { STORAGE_KEYS } from '../constants'

export interface PreferencesStore {
  // User Preferences
  /** Whether the video is muted */
  isMuted: boolean
  /** Current volume level */
  volume: number
  /** Current playback speed */
  playbackSpeed: PlaybackSpeed
  /** Current quality preference */
  quality: Quality

  // Actions
  /** Toggle mute state */
  toggleMute: () => void
  /** Set mute state */
  setMuted: (muted: boolean) => void
  /** Set volume level */
  setVolume: (volume: number) => void
  /** Set playback speed */
  setPlaybackSpeed: (speed: PlaybackSpeed) => void
  /** Set quality preference */
  setQuality: (quality: Quality) => void
  /** Reset preferences */
  resetPreferences: () => void
}

const initialPreferences = {
  isMuted: true, // Start muted (browser autoplay policy)
  volume: 1,
  playbackSpeed: 1 as PlaybackSpeed,
  quality: 'auto' as Quality,
}

export const usePlayerPreferencesStore = create<PreferencesStore>()(
  persist(
    (set) => ({
      ...initialPreferences,

      toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),

      setMuted: (isMuted) => set({ isMuted }),

      setVolume: (volume) =>
        set({
          volume: Math.max(0, Math.min(1, volume)),
          isMuted: volume === 0,
        }),

      setPlaybackSpeed: (playbackSpeed) => set({ playbackSpeed }),

      setQuality: (quality) => set({ quality }),

      resetPreferences: () => set(initialPreferences),
    }),
    {
      name: STORAGE_KEYS.PLAYER_PREFERENCES,
    }
  )
)

