/**
 * useVirtualFeed - Virtualization hook using @tanstack/react-virtual
 */

'use client'

import { useCallback, type RefObject } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import type { Video } from '@vortex/core'

export interface UseVirtualFeedOptions {
  /** Videos to display */
  videos: Video[]
  /** Scroll container ref */
  scrollRef: RefObject<HTMLElement | null>
  /** Number of items to render outside viewport */
  overscan?: number
  /** Gap between items */
  gap?: number
}

export interface UseVirtualFeedReturn {
  virtualizer: ReturnType<typeof useVirtualizer<HTMLElement, Element>>
  virtualItems: ReturnType<ReturnType<typeof useVirtualizer<HTMLElement, Element>>['getVirtualItems']>
  totalSize: number
  scrollToIndex: (index: number) => void
  measureElement: (element: Element | null) => void
}

export function useVirtualFeed({
  videos,
  scrollRef,
  overscan = 2,
  gap = 0,
}: UseVirtualFeedOptions): UseVirtualFeedReturn {
  // Estimate item size as viewport height
  const estimateSize = useCallback(() => {
    if (typeof window !== 'undefined') {
      return window.innerHeight
    }
    return 800 // Fallback
  }, [])

  const virtualizer = useVirtualizer({
    count: videos.length,
    getScrollElement: () => scrollRef.current,
    estimateSize,
    overscan,
    gap,
  })

  const scrollToIndex = useCallback(
    (index: number) => {
      virtualizer.scrollToIndex(index, {
        align: 'start',
        behavior: 'smooth',
      })
    },
    [virtualizer]
  )

  return {
    virtualizer,
    virtualItems: virtualizer.getVirtualItems(),
    totalSize: virtualizer.getTotalSize(),
    scrollToIndex,
    measureElement: virtualizer.measureElement,
  }
}
