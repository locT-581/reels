/**
 * useFeedScroll - Scroll management hook with snap behavior
 */

'use client'

import { useState, useEffect, useCallback, useRef, type RefObject } from 'react'

export interface UseFeedScrollOptions {
  /** Scroll container ref */
  scrollRef: RefObject<HTMLElement | null>
  /** Total number of items */
  itemCount: number
  /** Height of each item (default: viewport height) */
  itemHeight?: number
  /** Callback when scroll position changes */
  onScrollChange?: (scrollTop: number, velocity: number) => void
  /** Callback when current index changes */
  onIndexChange?: (index: number) => void
}

export interface UseFeedScrollReturn {
  currentIndex: number
  scrollVelocity: number
  isScrolling: boolean
  scrollToIndex: (index: number, smooth?: boolean) => void
  scrollToNext: () => void
  scrollToPrev: () => void
}

export function useFeedScroll({
  scrollRef,
  itemCount,
  itemHeight,
  onScrollChange,
  onIndexChange,
}: UseFeedScrollOptions): UseFeedScrollReturn {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [scrollVelocity, setScrollVelocity] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)

  const lastScrollTopRef = useRef(0)
  const lastScrollTimeRef = useRef(Date.now())
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Get item height (default to viewport)
  const getItemHeight = useCallback(() => {
    if (itemHeight) return itemHeight
    if (typeof window !== 'undefined') return window.innerHeight
    return 800
  }, [itemHeight])

  // Scroll to specific index
  const scrollToIndex = useCallback(
    (index: number, smooth: boolean = true) => {
      const element = scrollRef.current
      if (!element) return

      const clampedIndex = Math.max(0, Math.min(index, itemCount - 1))
      const top = clampedIndex * getItemHeight()

      element.scrollTo({
        top,
        behavior: smooth ? 'smooth' : 'auto',
      })
    },
    [scrollRef, itemCount, getItemHeight]
  )

  const scrollToNext = useCallback(() => {
    scrollToIndex(currentIndex + 1)
  }, [currentIndex, scrollToIndex])

  const scrollToPrev = useCallback(() => {
    scrollToIndex(currentIndex - 1)
  }, [currentIndex, scrollToIndex])

  // Track scroll position and velocity
  useEffect(() => {
    const element = scrollRef.current
    if (!element) return

    const handleScroll = () => {
      const now = Date.now()
      const scrollTop = element.scrollTop
      const timeDelta = now - lastScrollTimeRef.current
      const scrollDelta = Math.abs(scrollTop - lastScrollTopRef.current)

      // Calculate velocity (px/s)
      if (timeDelta > 0) {
        const velocity = (scrollDelta / timeDelta) * 1000
        setScrollVelocity(velocity)
        onScrollChange?.(scrollTop, velocity)
      }

      // Update current index
      const height = getItemHeight()
      const newIndex = Math.round(scrollTop / height)
      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < itemCount) {
        setCurrentIndex(newIndex)
        onIndexChange?.(newIndex)
      }

      // Track scrolling state
      setIsScrolling(true)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false)
        setScrollVelocity(0)
      }, 150)

      // Update refs
      lastScrollTopRef.current = scrollTop
      lastScrollTimeRef.current = now
    }

    element.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      element.removeEventListener('scroll', handleScroll)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [scrollRef, itemCount, currentIndex, getItemHeight, onScrollChange, onIndexChange])

  return {
    currentIndex,
    scrollVelocity,
    isScrolling,
    scrollToIndex,
    scrollToNext,
    scrollToPrev,
  }
}
