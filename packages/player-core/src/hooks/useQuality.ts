/**
 * useQuality - Hook for video quality control
 *
 * This hook bridges the preferences store with the player core.
 * - `quality` preference comes from store (single source of truth)
 * - `currentLevel` and `availableLevels` are derived from PlayerCore (runtime info)
 */

'use client'

import { useState, useCallback, useEffect } from 'react'
import { usePlayerPreferencesStore } from '@xhub-reel/core'
import type { Quality, QualityLevel } from '@xhub-reel/core'
import type { PlayerCore } from '../core/player-core'

/**
 * useQuality - Hook for video quality control
 *
 * This hook bridges the preferences store with the player core.
 * - `quality` preference comes from store (single source of truth)
 * - `currentLevel` and `availableLevels` are derived from PlayerCore (runtime info)
 *
 * @param playerCore - PlayerCore instance
 * @returns Object containing quality state and controls
 */
export interface UseQualityReturn {
  /** User's quality preference (from store) */
  quality: Quality
  /** Current active quality level index (-1 = auto) */
  currentLevel: number
  /** Available quality levels from player */
  availableLevels: QualityLevel[]
  /** Whether auto quality is enabled */
  isAuto: boolean
  /** Set quality by preference string or level index */
  setQuality: (quality: Quality | number) => void
  /** Set to auto quality */
  setAuto: () => void
}

/**
 * useQuality - Hook for video quality control
 *
 * This hook bridges the preferences store with the player core.
 * - `quality` preference comes from store (single source of truth)
 * - `currentLevel` and `availableLevels` are derived from PlayerCore (runtime info)
 *
 * @param playerCore - PlayerCore instance
 * @returns Object containing quality state and controls
 */
export function useQuality(playerCore: PlayerCore | null): UseQualityReturn {
  // Single source of truth for quality preference
  const { quality, setQuality: storeSetQuality } = usePlayerPreferencesStore()

  // Runtime state derived from playerCore (not duplicating store)
  const [currentLevel, setCurrentLevel] = useState(-1)
  const [availableLevels, setAvailableLevels] = useState<QualityLevel[]>([])

  // Side effect: Get available levels from player
  useEffect(() => {
    if (!playerCore) return

    const levels = playerCore.getQualityLevels()
    setAvailableLevels(levels)
    setCurrentLevel(playerCore.getCurrentQuality())
  }, [playerCore])

  // Side effect: Apply stored quality preference to player
  useEffect(() => {
    if (!playerCore || availableLevels.length === 0) return

    if (quality === 'auto') {
      playerCore.setQuality(-1)
      setCurrentLevel(-1)
    } else {
      // Find matching level by height
      const height = parseInt(quality.replace('p', ''))
      const levelIndex = availableLevels.findIndex((l) => l.height === height)

      if (levelIndex !== -1) {
        playerCore.setQuality(levelIndex)
        setCurrentLevel(levelIndex)
      }
    }
  }, [playerCore, quality, availableLevels])

  const isAuto = currentLevel === -1

  // Action: Set quality
  const setQuality = useCallback(
    (newQuality: Quality | number) => {
      if (!playerCore) return

      if (typeof newQuality === 'number') {
        // Set by level index
        playerCore.setQuality(newQuality)
        setCurrentLevel(newQuality)

        // Update store with quality label
        if (newQuality === -1) {
          storeSetQuality('auto')
        } else {
          const level = availableLevels[newQuality]
          if (level) {
            storeSetQuality(`${level.height}p` as Quality)
          }
        }
      } else {
        // Set by quality string - store will trigger effect above
        storeSetQuality(newQuality)
      }
    },
    [playerCore, availableLevels, storeSetQuality]
  )

  // Action: Set to auto
  const setAuto = useCallback(() => {
    setQuality('auto')
  }, [setQuality])

  return {
    quality,
    currentLevel,
    availableLevels,
    isAuto,
    setQuality,
    setAuto,
  }
}
