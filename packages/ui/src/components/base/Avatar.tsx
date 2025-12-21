/**
 * Avatar - User avatar with fallback initials
 */

'use client'

import { useState, useMemo } from 'react'
import { motion } from 'motion/react'
import { User } from 'lucide-react'

export interface AvatarProps {
  /** Image source URL */
  src?: string
  /** Alt text / User name */
  alt?: string
  /** Avatar size */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  /** Show ring for following status */
  isFollowing?: boolean
  /** Show live indicator */
  isLive?: boolean
  /** Click handler */
  onClick?: () => void
  /** Custom className */
  className?: string
}

const sizeClasses = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
}

const ringClasses = {
  xs: 'ring-1 ring-offset-1',
  sm: 'ring-2 ring-offset-1',
  md: 'ring-2 ring-offset-2',
  lg: 'ring-2 ring-offset-2',
  xl: 'ring-[3px] ring-offset-2',
}

export function Avatar({
  src,
  alt = '',
  size = 'md',
  isFollowing = false,
  isLive = false,
  onClick,
  className = '',
}: AvatarProps) {
  const [hasError, setHasError] = useState(false)

  // Generate initials from alt text
  const initials = useMemo(() => {
    if (!alt) return ''
    const words = alt.trim().split(' ').filter(Boolean)
    if (words.length >= 2 && words[0] && words[1]) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase()
    }
    return alt.slice(0, 2).toUpperCase()
  }, [alt])

  // Generate background color based on name
  const bgColor = useMemo(() => {
    if (!alt) return 'bg-zinc-700'
    const colors = [
      'bg-red-600',
      'bg-orange-600',
      'bg-amber-600',
      'bg-yellow-600',
      'bg-lime-600',
      'bg-green-600',
      'bg-emerald-600',
      'bg-teal-600',
      'bg-cyan-600',
      'bg-sky-600',
      'bg-blue-600',
      'bg-indigo-600',
      'bg-violet-600',
      'bg-purple-600',
      'bg-fuchsia-600',
      'bg-pink-600',
    ]
    const hash = alt.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return colors[hash % colors.length]
  }, [alt])

  const showFallback = !src || hasError

  const Component = onClick ? motion.button : motion.div
  const componentProps = onClick
    ? { type: 'button' as const, onClick, whileTap: { scale: 0.95 } }
    : {}

  return (
    <Component
      className={`
        relative inline-flex items-center justify-center
        rounded-full overflow-hidden
        ${sizeClasses[size]}
        ${isFollowing ? `${ringClasses[size]} ring-vortex-violet ring-offset-black` : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      {...componentProps}
    >
      {showFallback ? (
        <div
          className={`
            w-full h-full flex items-center justify-center
            ${bgColor} text-white font-semibold
          `}
        >
          {initials || <User className="w-1/2 h-1/2" />}
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          onError={() => setHasError(true)}
          className="w-full h-full object-cover"
        />
      )}

      {/* Live indicator */}
      {isLive && (
        <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-red-500 rounded text-[8px] font-bold text-white uppercase">
          Live
        </div>
      )}
    </Component>
  )
}

