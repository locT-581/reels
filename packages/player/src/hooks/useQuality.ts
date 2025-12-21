/**
 * useQuality - Hook for video quality control
 */

'use client'

import { useState, useCallback, useEffect } from 'react'
import { usePlayerStore } from '@vortex/core'
import type { Quality, QualityLevel } from '@vortex/core'
import type { PlayerCore } from '../core/player-core'

export interface UseQualityReturn {
  quality: Quality
  currentLevel: number
  availableLevels: QualityLevel[]
  isAuto: boolean
  setQuality: (quality: Quality | number) => void
  setAuto: () => void
}

export function useQuality(playerCore: PlayerCore | null): UseQualityReturn {
  const { quality: storedQuality, setQuality: storeQuality } = usePlayerStore()
  
  const [quality, setQualityState] = useState<Quality>(storedQuality)
  const [currentLevel, setCurrentLevel] = useState(-1)
  const [availableLevels, setAvailableLevels] = useState<QualityLevel[]>([])

  // Get available levels from player
  useEffect(() => {
    if (!playerCore) return

    const levels = playerCore.getQualityLevels()
    setAvailableLevels(levels)
    setCurrentLevel(playerCore.getCurrentQuality())
  }, [playerCore])

  const isAuto = currentLevel === -1

  const setQuality = useCallback(
    (newQuality: Quality | number) => {
      if (!playerCore) return

      if (typeof newQuality === 'number') {
        // Set by level index
        playerCore.setQuality(newQuality)
        setCurrentLevel(newQuality)

        // Update stored quality based on level
        if (newQuality === -1) {
          setQualityState('auto')
          storeQuality('auto')
        } else {
          const level = availableLevels[newQuality]
          if (level) {
            const qualityLabel = `${level.height}p` as Quality
            setQualityState(qualityLabel)
            storeQuality(qualityLabel)
          }
        }
      } else {
        // Set by quality string
        setQualityState(newQuality)
        storeQuality(newQuality)

        if (newQuality === 'auto') {
          playerCore.setQuality(-1)
          setCurrentLevel(-1)
        } else {
          // Find matching level
          const height = parseInt(newQuality.replace('p', ''))
          const levelIndex = availableLevels.findIndex((l) => l.height === height)
          
          if (levelIndex !== -1) {
            playerCore.setQuality(levelIndex)
            setCurrentLevel(levelIndex)
          }
        }
      }
    },
    [playerCore, availableLevels, storeQuality]
  )

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

