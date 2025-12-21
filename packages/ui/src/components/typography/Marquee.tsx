/**
 * Marquee - Auto-scrolling text for overflow
 */

'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'motion/react'

export interface MarqueeProps {
  /** Text content */
  children: string
  /** Scroll speed in pixels per second */
  speed?: number
  /** Delay before starting scroll (ms) */
  delay?: number
  /** Gap between repeated text */
  gap?: number
  /** Pause on hover */
  pauseOnHover?: boolean
  /** Add shadow for video */
  videoSafe?: boolean
  /** Custom className */
  className?: string
}

export function Marquee({
  children,
  speed = 30,
  delay = 2000,
  gap = 40,
  pauseOnHover = true,
  videoSafe = false,
  className = '',
}: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const [shouldScroll, setShouldScroll] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [duration, setDuration] = useState(0)

  // Check if text overflows container
  useEffect(() => {
    const container = containerRef.current
    const text = textRef.current
    if (!container || !text) return

    const checkOverflow = () => {
      const textWidth = text.scrollWidth
      const containerWidth = container.clientWidth
      const overflows = textWidth > containerWidth

      setShouldScroll(overflows)

      if (overflows) {
        // Calculate duration based on text width and speed
        const totalWidth = textWidth + gap
        setDuration(totalWidth / speed)
      }
    }

    checkOverflow()

    // Re-check on resize
    const observer = new ResizeObserver(checkOverflow)
    observer.observe(container)

    return () => observer.disconnect()
  }, [children, speed, gap])

  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover) setIsPaused(true)
  }, [pauseOnHover])

  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover) setIsPaused(false)
  }, [pauseOnHover])

  if (!shouldScroll) {
    return (
      <div
        ref={containerRef}
        className={`
          overflow-hidden whitespace-nowrap
          ${videoSafe ? 'drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]' : ''}
          ${className}
        `}
      >
        <span ref={textRef}>{children}</span>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={`
        overflow-hidden whitespace-nowrap
        ${videoSafe ? 'drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]' : ''}
        ${className}
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="inline-flex"
        initial={{ x: 0 }}
        animate={{
          x: isPaused ? undefined : [0, -(textRef.current?.scrollWidth || 0) - gap],
        }}
        transition={{
          duration,
          delay: delay / 1000,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <span ref={textRef} className="flex-shrink-0">
          {children}
        </span>
        <span
          className="flex-shrink-0"
          style={{ paddingLeft: gap }}
          aria-hidden
        >
          {children}
        </span>
      </motion.div>
    </div>
  )
}

