/**
 * useInfiniteScroll - Hook for infinite scroll loading
 */

'use client'

import { useEffect, useRef, useCallback, useState } from 'react'

export interface UseInfiniteScrollOptions {
  /** Called when more content should be loaded */
  onLoadMore?: () => void | Promise<void>
  /** Whether currently loading */
  isLoading?: boolean
  /** Whether there's more content to load */
  hasMore?: boolean
  /** Number of items from end to trigger load */
  threshold?: number
  /** Root margin for intersection observer */
  rootMargin?: string
}

export interface UseInfiniteScrollReturn {
  /** Ref to attach to sentinel element */
  sentinelRef: (element: HTMLElement | null) => void
  /** Whether currently in loading state */
  isLoadingMore: boolean
}

export function useInfiniteScroll({
  onLoadMore,
  isLoading = false,
  hasMore = true,
  threshold: _threshold = 3,
  rootMargin = '0px 0px 200px 0px',
}: UseInfiniteScrollOptions): UseInfiniteScrollReturn {
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const sentinelRef = useRef<HTMLElement | null>(null)
  const loadingRef = useRef(false)

  // Load more callback
  const handleLoadMore = useCallback(async () => {
    if (loadingRef.current || isLoading || !hasMore || !onLoadMore) return

    loadingRef.current = true
    setIsLoadingMore(true)

    try {
      await onLoadMore()
    } finally {
      loadingRef.current = false
      setIsLoadingMore(false)
    }
  }, [onLoadMore, isLoading, hasMore])

  // Setup intersection observer
  const setSentinelRef = useCallback(
    (element: HTMLElement | null) => {
      // Cleanup previous observer
      if (observerRef.current) {
        observerRef.current.disconnect()
      }

      sentinelRef.current = element

      if (!element || !hasMore) return

      observerRef.current = new IntersectionObserver(
        (entries) => {
          const [entry] = entries
          if (entry?.isIntersecting) {
            handleLoadMore()
          }
        },
        {
          rootMargin,
          threshold: 0,
        }
      )

      observerRef.current.observe(element)
    },
    [hasMore, rootMargin, handleLoadMore]
  )

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  // Update loading state
  useEffect(() => {
    loadingRef.current = isLoading
  }, [isLoading])

  return {
    sentinelRef: setSentinelRef,
    isLoadingMore,
  }
}
