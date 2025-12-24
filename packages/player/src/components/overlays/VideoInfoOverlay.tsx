/**
 * VideoInfoOverlay - Author, caption, hashtags, sound info
 */

'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { Music2, ChevronDown, ChevronUp } from 'lucide-react'
import type { Video, Author } from '@xhub-reel/core'

export interface VideoInfoOverlayProps {
  video: Video
  onAuthorClick?: (author: Author) => void
  onHashtagClick?: (hashtag: string) => void
  onSoundClick?: () => void
  /** Max lines for caption before truncate */
  maxCaptionLines?: number
}

export function VideoInfoOverlay({
  video,
  onAuthorClick,
  onHashtagClick,
  onSoundClick,
  maxCaptionLines = 2,
}: VideoInfoOverlayProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { author, caption, hashtags, sound } = video

  return (
    <div className="absolute bottom-0 left-0 right-16 p-4 pb-safe z-20">
      <div className="flex flex-col gap-3">
        {/* Author info */}
        <motion.button
          className="flex items-center gap-2"
          onClick={() => onAuthorClick?.(author)}
          whileTap={{ scale: 0.98 }}
        >
          {/* Avatar */}
          <img
            src={author.avatar}
            alt={author.displayName}
            className="w-10 h-10 rounded-full border-2 border-white object-cover"
          />

          <div className="flex flex-col items-start">
            {/* Username */}
            <span className="text-white font-semibold text-sm drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
              @{author.username}
              {author.isVerified && (
                <span className="ml-1 text-xhub-reel-violet">✓</span>
              )}
            </span>

            {/* Display name */}
            <span className="text-white/70 text-xs drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
              {author.displayName}
            </span>
          </div>
        </motion.button>

        {/* Caption */}
        {caption && (
          <div className="relative">
            <motion.p
              className={`text-white text-sm drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] ${
                !isExpanded ? `line-clamp-${maxCaptionLines}` : ''
              }`}
              animate={{ height: 'auto' }}
            >
              {caption}
            </motion.p>

            {/* Expand/collapse button */}
            {caption.length > 100 && (
              <button
                className="text-white/70 text-xs font-medium mt-1 flex items-center gap-1"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? (
                  <>
                    Thu gọn <ChevronUp className="w-3 h-3" />
                  </>
                ) : (
                  <>
                    Xem thêm <ChevronDown className="w-3 h-3" />
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* Hashtags */}
        {hashtags && hashtags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {hashtags.map((tag, i) => (
              <motion.button
                key={i}
                className="text-xhub-reel-violet text-sm font-medium drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]"
                onClick={() => onHashtagClick?.(tag)}
                whileTap={{ scale: 0.95 }}
              >
                #{tag}
              </motion.button>
            ))}
          </div>
        )}

        {/* Sound/Music */}
        {sound && (
          <motion.button
            className="flex items-center gap-2 max-w-[200px]"
            onClick={onSoundClick}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
              <Music2 className="w-4 h-4 text-white" />
            </div>

            {/* Marquee for long sound titles */}
            <div className="overflow-hidden">
              <motion.span
                className="text-white text-xs whitespace-nowrap drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]"
                animate={{
                  x: sound.title.length > 25 ? [0, -100, 0] : 0,
                }}
                transition={{
                  duration: sound.title.length > 25 ? 8 : 0,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                {sound.title}
              </motion.span>
            </div>
          </motion.button>
        )}
      </div>
    </div>
  )
}

