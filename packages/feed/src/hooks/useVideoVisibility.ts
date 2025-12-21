/**
 * useVideoVisibility - Track video visibility using IntersectionObserver
 */

'use client'

import { useState, useEffect, useRef, type RefObject } from 'react'
import { VIDEO_ACTIVATION } from '@vortex/core'

export interface UseVideoVisibilityOptions {
  /** Element to observe */
  elementRef: RefObject<HTMLElement | null>
  /** Threshold to activate (default: 50%) */
  activateThreshold?: number
  /** Threshold to deactivate (default: 30%) */
  deactivateThreshold?: number
  /** Root margin */
  rootMargin?: string
  /** Callback when visibility changes */
  onVisibilityChange?: (isVisible: boolean, ratio: number) => void
}

export interface UseVideoVisibilityReturn {
  isVisible: boolean
  isActive: boolean
  visibilityRatio: number
}

export function useVideoVisibility({
  elementRef,
  activateThreshold = VIDEO_ACTIVATION.ACTIVATION_THRESHOLD,
  deactivateThreshold = VIDEO_ACTIVATION.DEACTIVATION_THRESHOLD,
  rootMargin = '0px',
  onVisibilityChange,
}: UseVideoVisibilityOptions): UseVideoVisibilityReturn {
  const [isVisible, setIsVisible] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [visibilityRatio, setVisibilityRatio] = useState(0)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    // Cleanup previous observer
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    // Create observer with multiple thresholds for granular tracking
    const thresholds = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const ratio = entry.intersectionRatio
          setVisibilityRatio(ratio)
          setIsVisible(ratio > 0)

          // Activation logic with hysteresis
          if (ratio >= activateThreshold) {
            setIsActive(true)
          } else if (ratio < deactivateThreshold) {
            setIsActive(false)
          }
          // Between thresholds: maintain current state (hysteresis)

          onVisibilityChange?.(ratio > 0, ratio)
        })
      },
      {
        threshold: thresholds,
        rootMargin,
      }
    )

    observerRef.current.observe(element)

    return () => {
      observerRef.current?.disconnect()
    }
  }, [elementRef, activateThreshold, deactivateThreshold, rootMargin, onVisibilityChange])

  return {
    isVisible,
    isActive,
    visibilityRatio,
  }
}

