/**
 * VideoContainer - Container with aspect ratio handling
 */

'use client'

import { forwardRef, type ReactNode, type CSSProperties } from 'react'
import { cn } from '../utils/cn'

export interface VideoContainerProps {
  /** Children (usually VideoPlayer) */
  children: ReactNode
  /** Aspect ratio (width/height). Default is 9/16 for vertical video */
  aspectRatio?: number
  /** Fill mode */
  fillMode?: 'cover' | 'contain' | 'fill'
  /** Max width constraint */
  maxWidth?: number | string
  /** Max height constraint */
  maxHeight?: number | string
  /** Custom className */
  className?: string
  /** Custom style */
  style?: CSSProperties
  /** Show placeholder while loading */
  showPlaceholder?: boolean
  /** Placeholder background color/image */
  placeholderBg?: string
}

export const VideoContainer = forwardRef<HTMLDivElement, VideoContainerProps>(
  (
    {
      children,
      aspectRatio = 9 / 16, // Vertical video default
      fillMode = 'cover',
      maxWidth,
      maxHeight,
      className,
      style,
      showPlaceholder = false,
      placeholderBg,
    },
    ref
  ) => {
    const containerStyle: CSSProperties = {
      aspectRatio: `${aspectRatio}`,
      maxWidth: maxWidth,
      maxHeight: maxHeight,
      ...style,
    }

    const objectFitMap = {
      cover: 'object-cover',
      contain: 'object-contain',
      fill: 'object-fill',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'relative w-full h-full overflow-hidden bg-black',
          className
        )}
        style={containerStyle}
      >
        {/* Placeholder */}
        {showPlaceholder && (
          <div
            className="absolute inset-0 z-0"
            style={{
              background: placeholderBg ?? 'linear-gradient(180deg, #1a1a1a 0%, #000 100%)',
            }}
          />
        )}

        {/* Video container with fill mode */}
        <div
          className={cn(
            'absolute inset-0 z-10',
            '[&_video]:w-full [&_video]:h-full',
            `[&_video]:${objectFitMap[fillMode]}`
          )}
        >
          {children}
        </div>
      </div>
    )
  }
)

VideoContainer.displayName = 'VideoContainer'

/**
 * FullScreenContainer - Container that fills the entire viewport
 */
export interface FullScreenContainerProps extends Omit<VideoContainerProps, 'aspectRatio' | 'maxWidth' | 'maxHeight'> {
  /** Safe area insets */
  safeArea?: boolean
}

export const FullScreenContainer = forwardRef<HTMLDivElement, FullScreenContainerProps>(
  ({ children, safeArea = true, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'fixed inset-0 w-screen h-screen bg-black',
          safeArea && 'pt-safe pb-safe',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

FullScreenContainer.displayName = 'FullScreenContainer'

