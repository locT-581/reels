/**
 * Skeleton - Loading placeholder with shimmer animation
 */

'use client'

export interface SkeletonProps {
  /** Skeleton variant */
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded'
  /** Width (CSS value or number for pixels) */
  width?: string | number
  /** Height (CSS value or number for pixels) */
  height?: string | number
  /** For text variant - number of lines */
  lines?: number
  /** Animation enabled */
  animate?: boolean
  /** Custom className */
  className?: string
}

const variantClasses = {
  text: 'rounded',
  circular: 'rounded-full',
  rectangular: 'rounded-none',
  rounded: 'rounded-xl',
}

export function Skeleton({
  variant = 'text',
  width,
  height,
  lines = 1,
  animate = true,
  className = '',
}: SkeletonProps) {
  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  }

  // For text variant with multiple lines
  if (variant === 'text' && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`
              bg-zinc-800 ${variantClasses[variant]}
              ${animate ? 'animate-pulse' : ''}
            `}
            style={{
              ...style,
              height: height || '1em',
              width: i === lines - 1 ? '75%' : width || '100%',
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      className={`
        bg-zinc-800 ${variantClasses[variant]}
        ${animate ? 'animate-pulse' : ''}
        ${className}
      `}
      style={style}
    />
  )
}

/**
 * Skeleton for avatar placeholder
 */
export function AvatarSkeleton({
  size = 'md',
  className = '',
}: {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}) {
  const sizeMap = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 48,
    xl: 64,
  }

  return (
    <Skeleton
      variant="circular"
      width={sizeMap[size]}
      height={sizeMap[size]}
      className={className}
    />
  )
}

/**
 * Skeleton for video thumbnail
 */
export function ThumbnailSkeleton({
  aspectRatio = '9/16',
  className = '',
}: {
  aspectRatio?: string
  className?: string
}) {
  return (
    <div
      className={`relative w-full ${className}`}
      style={{ aspectRatio }}
    >
      <Skeleton
        variant="rounded"
        width="100%"
        height="100%"
        className="absolute inset-0"
      />
    </div>
  )
}

