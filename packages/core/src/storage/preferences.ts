/**
 * User Preferences - Persistent user settings
 */

import { getDB } from './db'

// ============================================
// Preference Keys
// ============================================

export const PREFERENCE_KEYS = {
  MUTED: 'player.muted',
  VOLUME: 'player.volume',
  PLAYBACK_SPEED: 'player.playbackSpeed',
  QUALITY: 'player.quality',
  AUTOPLAY: 'player.autoplay',
  CAPTIONS_ENABLED: 'player.captionsEnabled',
  CAPTIONS_LANGUAGE: 'player.captionsLanguage',
  THEME: 'ui.theme',
  REDUCED_MOTION: 'ui.reducedMotion',
  HAPTIC_ENABLED: 'ui.hapticEnabled',
} as const

export type PreferenceKey = (typeof PREFERENCE_KEYS)[keyof typeof PREFERENCE_KEYS]

// ============================================
// Default Values
// ============================================

export interface UserPreferences {
  // Player
  'player.muted': boolean
  'player.volume': number
  'player.playbackSpeed': number
  'player.quality': 'auto' | '1080p' | '720p' | '480p' | '360p'
  'player.autoplay': boolean
  'player.captionsEnabled': boolean
  'player.captionsLanguage': string

  // UI
  'ui.theme': 'dark' | 'light' | 'system'
  'ui.reducedMotion': boolean
  'ui.hapticEnabled': boolean
}

const DEFAULT_PREFERENCES: UserPreferences = {
  'player.muted': true, // Start muted for autoplay
  'player.volume': 1,
  'player.playbackSpeed': 1,
  'player.quality': 'auto',
  'player.autoplay': true,
  'player.captionsEnabled': false,
  'player.captionsLanguage': 'vi',
  'ui.theme': 'dark',
  'ui.reducedMotion': false,
  'ui.hapticEnabled': true,
}

// ============================================
// Preference Functions
// ============================================

/**
 * Get a single preference value
 */
export async function getPreference<K extends PreferenceKey>(
  key: K
): Promise<UserPreferences[K]> {
  const db = await getDB()
  const value = await db.get('preferences', key)
  return (value as UserPreferences[K]) ?? DEFAULT_PREFERENCES[key]
}

/**
 * Set a single preference value
 */
export async function setPreference<K extends PreferenceKey>(
  key: K,
  value: UserPreferences[K]
): Promise<void> {
  const db = await getDB()
  await db.put('preferences', value, key)

  // Broadcast change to other tabs
  broadcastPreferenceChange(key, value)
}

/**
 * Get all preferences
 */
export async function getAllPreferences(): Promise<UserPreferences> {
  const db = await getDB()
  const tx = db.transaction('preferences', 'readonly')

  const result = { ...DEFAULT_PREFERENCES }

  let cursor = await tx.store.openCursor()
  while (cursor) {
    const key = cursor.key as PreferenceKey
    if (key in result) {
      (result as Record<string, unknown>)[key] = cursor.value
    }
    cursor = await cursor.continue()
  }

  return result
}

/**
 * Set multiple preferences
 */
export async function setPreferences(
  prefs: Partial<UserPreferences>
): Promise<void> {
  const db = await getDB()
  const tx = db.transaction('preferences', 'readwrite')

  await Promise.all([
    ...Object.entries(prefs).map(([key, value]) =>
      tx.store.put(value, key)
    ),
    tx.done,
  ])

  // Broadcast changes
  Object.entries(prefs).forEach(([key, value]) => {
    broadcastPreferenceChange(key as PreferenceKey, value)
  })
}

/**
 * Reset a preference to default
 */
export async function resetPreference<K extends PreferenceKey>(
  key: K
): Promise<void> {
  const db = await getDB()
  await db.delete('preferences', key)
  broadcastPreferenceChange(key, DEFAULT_PREFERENCES[key])
}

/**
 * Reset all preferences to defaults
 */
export async function resetAllPreferences(): Promise<void> {
  const db = await getDB()
  const tx = db.transaction('preferences', 'readwrite')
  await tx.store.clear()
  await tx.done
}

// ============================================
// Cross-Tab Sync
// ============================================

const BROADCAST_CHANNEL_NAME = 'vortex-preferences'
let broadcastChannel: BroadcastChannel | null = null

function getBroadcastChannel(): BroadcastChannel | null {
  if (typeof window === 'undefined') return null

  if (!broadcastChannel) {
    try {
      broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME)
    } catch {
      // BroadcastChannel not supported
      return null
    }
  }

  return broadcastChannel
}

function broadcastPreferenceChange(key: PreferenceKey, value: unknown): void {
  const channel = getBroadcastChannel()
  if (channel) {
    channel.postMessage({ type: 'PREFERENCE_CHANGE', key, value })
  }
}

/**
 * Subscribe to preference changes from other tabs
 */
export function subscribeToPreferenceChanges(
  callback: (key: PreferenceKey, value: unknown) => void
): () => void {
  const channel = getBroadcastChannel()
  if (!channel) return () => {}

  const handler = (event: MessageEvent) => {
    if (event.data?.type === 'PREFERENCE_CHANGE') {
      callback(event.data.key, event.data.value)
    }
  }

  channel.addEventListener('message', handler)

  return () => {
    channel.removeEventListener('message', handler)
  }
}

