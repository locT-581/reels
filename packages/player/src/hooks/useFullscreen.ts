/**
 * useFullscreen - Hook for fullscreen control
 */

'use client'

import { useState, useCallback, useEffect, type RefObject } from 'react'

export interface UseFullscreenReturn {
  isFullscreen: boolean
  isSupported: boolean
  toggleFullscreen: () => Promise<void>
  enterFullscreen: () => Promise<void>
  exitFullscreen: () => Promise<void>
}

// Fullscreen API with vendor prefixes
interface FullscreenElement extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void>
  mozRequestFullScreen?: () => Promise<void>
  msRequestFullscreen?: () => Promise<void>
}

interface FullscreenDocument extends Document {
  webkitFullscreenElement?: Element
  mozFullScreenElement?: Element
  msFullscreenElement?: Element
  webkitExitFullscreen?: () => Promise<void>
  mozCancelFullScreen?: () => Promise<void>
  msExitFullscreen?: () => Promise<void>
}

// Extended screen orientation with lock/unlock (not in standard TS types)
interface ExtendedScreenOrientation {
  lock?: (orientation: string) => Promise<void>
  unlock?: () => void
  type: string
  angle: number
}

export function useFullscreen(
  elementRef: RefObject<HTMLElement | null>
): UseFullscreenReturn {
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Check fullscreen support
  const isSupported =
    typeof document !== 'undefined' &&
    !!(
      document.fullscreenEnabled ||
      (document as FullscreenDocument).webkitFullscreenElement !== undefined ||
      (document as FullscreenDocument).mozFullScreenElement !== undefined ||
      (document as FullscreenDocument).msFullscreenElement !== undefined
    )

  // Get current fullscreen element
  const getFullscreenElement = (): Element | null => {
    const doc = document as FullscreenDocument
    return (
      doc.fullscreenElement ||
      doc.webkitFullscreenElement ||
      doc.mozFullScreenElement ||
      doc.msFullscreenElement ||
      null
    )
  }

  // Request fullscreen on element
  const requestFullscreen = async (element: HTMLElement): Promise<void> => {
    const el = element as FullscreenElement

    if (el.requestFullscreen) {
      await el.requestFullscreen()
    } else if (el.webkitRequestFullscreen) {
      await el.webkitRequestFullscreen()
    } else if (el.mozRequestFullScreen) {
      await el.mozRequestFullScreen()
    } else if (el.msRequestFullscreen) {
      await el.msRequestFullscreen()
    }
  }

  // Exit fullscreen
  const exitFullscreenApi = async (): Promise<void> => {
    const doc = document as FullscreenDocument

    if (doc.exitFullscreen) {
      await doc.exitFullscreen()
    } else if (doc.webkitExitFullscreen) {
      await doc.webkitExitFullscreen()
    } else if (doc.mozCancelFullScreen) {
      await doc.mozCancelFullScreen()
    } else if (doc.msExitFullscreen) {
      await doc.msExitFullscreen()
    }
  }

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const fullscreenElement = getFullscreenElement()
      setIsFullscreen(fullscreenElement === elementRef.current)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.addEventListener('mozfullscreenchange', handleFullscreenChange)
    document.addEventListener('MSFullscreenChange', handleFullscreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange)
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange)
    }
  }, [elementRef])

  const enterFullscreen = useCallback(async () => {
    const element = elementRef.current
    if (!element || !isSupported) return

    try {
      await requestFullscreen(element)
      setIsFullscreen(true)

      // Lock screen orientation to landscape on mobile
      const orientation = screen.orientation as ExtendedScreenOrientation
      if (orientation?.lock) {
        try {
          await orientation.lock('landscape')
        } catch {
          // Orientation lock not supported or not allowed
        }
      }
    } catch (error) {
      console.error('[useFullscreen] Failed to enter fullscreen:', error)
    }
  }, [elementRef, isSupported])

  const exitFullscreen = useCallback(async () => {
    if (!isSupported) return

    try {
      await exitFullscreenApi()
      setIsFullscreen(false)

      // Unlock screen orientation
      const orientation = screen.orientation as ExtendedScreenOrientation
      if (orientation?.unlock) {
        orientation.unlock()
      }
    } catch (error) {
      console.error('[useFullscreen] Failed to exit fullscreen:', error)
    }
  }, [isSupported])

  const toggleFullscreen = useCallback(async () => {
    if (isFullscreen) {
      await exitFullscreen()
    } else {
      await enterFullscreen()
    }
  }, [isFullscreen, enterFullscreen, exitFullscreen])

  return {
    isFullscreen,
    isSupported,
    toggleFullscreen,
    enterFullscreen,
    exitFullscreen,
  }
}

