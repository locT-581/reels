/**
 * usePreferences - Hook for managing user preferences
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  getPreference,
  setPreference,
  getAllPreferences,
  subscribeToPreferenceChanges,
  PREFERENCE_KEYS,
  type PreferenceKey,
  type UserPreferences,
} from '../storage/preferences'

// ============================================
// Types
// ============================================

export interface UsePreferencesReturn {
  preferences: UserPreferences | null
  isLoading: boolean
  updatePreference: <K extends PreferenceKey>(
    key: K,
    value: UserPreferences[K]
  ) => Promise<void>
}

export interface UsePreferenceReturn<K extends PreferenceKey> {
  value: UserPreferences[K] | undefined
  isLoading: boolean
  setValue: (value: UserPreferences[K]) => Promise<void>
}

// ============================================
// Hooks
// ============================================

/**
 * Hook to access all user preferences
 */
export function usePreferences(): UsePreferencesReturn {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load preferences on mount
  useEffect(() => {
    let mounted = true

    async function loadPreferences() {
      try {
        const prefs = await getAllPreferences()
        if (mounted) {
          setPreferences(prefs)
          setIsLoading(false)
        }
      } catch {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    loadPreferences()

    // Subscribe to changes from other tabs
    const unsubscribe = subscribeToPreferenceChanges((key, value) => {
      setPreferences((prev) =>
        prev ? { ...prev, [key]: value } : null
      )
    })

    return () => {
      mounted = false
      unsubscribe()
    }
  }, [])

  const updatePreference = useCallback(
    async <K extends PreferenceKey>(key: K, value: UserPreferences[K]) => {
      // Optimistic update
      setPreferences((prev) => (prev ? { ...prev, [key]: value } : null))

      // Persist
      await setPreference(key, value)
    },
    []
  )

  return { preferences, isLoading, updatePreference }
}

/**
 * Hook to access a single preference
 */
export function usePreference<K extends PreferenceKey>(
  key: K
): UsePreferenceReturn<K> {
  const [value, setValue] = useState<UserPreferences[K] | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)

  // Load preference on mount
  useEffect(() => {
    let mounted = true

    async function loadPreference() {
      try {
        const pref = await getPreference(key)
        if (mounted) {
          setValue(pref)
          setIsLoading(false)
        }
      } catch {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    loadPreference()

    // Subscribe to changes
    const unsubscribe = subscribeToPreferenceChanges((changedKey, newValue) => {
      if (changedKey === key) {
        setValue(newValue as UserPreferences[K])
      }
    })

    return () => {
      mounted = false
      unsubscribe()
    }
  }, [key])

  const setValueCallback = useCallback(
    async (newValue: UserPreferences[K]) => {
      // Optimistic update
      setValue(newValue)
      // Persist
      await setPreference(key, newValue)
    },
    [key]
  )

  return { value, isLoading, setValue: setValueCallback }
}

/**
 * Hook for muted state (commonly used)
 */
export function useMutedPreference() {
  return usePreference(PREFERENCE_KEYS.MUTED)
}

/**
 * Hook for volume state
 */
export function useVolumePreference() {
  return usePreference(PREFERENCE_KEYS.VOLUME)
}

/**
 * Hook for playback speed
 */
export function usePlaybackSpeedPreference() {
  return usePreference(PREFERENCE_KEYS.PLAYBACK_SPEED)
}

/**
 * Hook for quality setting
 */
export function useQualityPreference() {
  return usePreference(PREFERENCE_KEYS.QUALITY)
}

/**
 * Hook for haptic feedback setting
 */
export function useHapticPreference() {
  return usePreference(PREFERENCE_KEYS.HAPTIC_ENABLED)
}

