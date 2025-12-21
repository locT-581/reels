/**
 * BlurPlaceholder - Blurred thumbnail while loading
 */

'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'

export interface BlurPlaceholderProps {
  /** Blur data URL (base64 tiny image) */
  blurDataUrl?: string
  /** Background color fallback */
  fallbackColor?: string
  /** Whether content is loaded */
  isLoaded?: boolean
  /** Custom className */
  className?: string
}

export function BlurPlaceholder({
  blurDataUrl,
  fallbackColor = '#18181b', // zinc-900
  isLoaded = false,
  className = '',
}: BlurPlaceholderProps) {
  const [showPlaceholder, setShowPlaceholder] = useState(true)

  // Delay hiding placeholder for smooth transition
  useEffect(() => {
    if (isLoaded) {
      const timer = setTimeout(() => {
        setShowPlaceholder(false)
      }, 300)
      return () => clearTimeout(timer)
    } else {
      setShowPlaceholder(true)
    }
  }, [isLoaded])

  return (
    <AnimatePresence>
      {showPlaceholder && (
        <motion.div
          className={`absolute inset-0 overflow-hidden ${className}`}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {blurDataUrl ? (
            <img
              src={blurDataUrl}
              alt=""
              aria-hidden
              className="w-full h-full object-cover scale-110 blur-xl"
            />
          ) : (
            <div
              className="w-full h-full"
              style={{ backgroundColor: fallbackColor }}
            />
          )}
          
          {/* Shimmer overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/**
 * Generate a tiny blur data URL from an image URL
 * Note: This should be done server-side in production
 */
export async function generateBlurDataUrl(
  imageUrl: string,
  width = 10,
  height = 10
): Promise<string> {
  if (typeof window === 'undefined') {
    return ''
  }

  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        resolve('')
        return
      }
      
      ctx.drawImage(img, 0, 0, width, height)
      resolve(canvas.toDataURL('image/jpeg', 0.1))
    }
    
    img.onerror = () => {
      resolve('')
    }
    
    img.src = imageUrl
  })
}

