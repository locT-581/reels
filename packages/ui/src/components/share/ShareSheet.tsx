/**
 * ShareSheet - Bottom sheet for sharing options
 */

'use client'

import { useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  X,
  Link,
  Download,
  Flag,
  MessageCircle,
  Send,
} from 'lucide-react'
import { SPRING, lightHaptic } from '@vortex/core'
import { ShareOption } from './ShareOption'

export interface ShareSheetProps {
  /** Whether the sheet is open */
  isOpen: boolean
  /** Called when sheet should close */
  onClose: () => void
  /** Video URL to share */
  videoUrl?: string
  /** Video title/caption */
  videoTitle?: string
  /** Called when link is copied */
  onCopyLink?: () => void
  /** Called when save video is clicked */
  onSaveVideo?: () => void
  /** Called when report is clicked */
  onReport?: () => void
  /** Called when a social share option is clicked */
  onSocialShare?: (platform: string) => void
}

// Social share platforms
const socialPlatforms = [
  { id: 'messenger', label: 'Messenger', color: '#0084FF', icon: MessageCircle },
  { id: 'whatsapp', label: 'WhatsApp', color: '#25D366', icon: MessageCircle },
  { id: 'telegram', label: 'Telegram', color: '#0088CC', icon: Send },
  { id: 'facebook', label: 'Facebook', color: '#1877F2', icon: MessageCircle },
  { id: 'twitter', label: 'X', color: '#000000', icon: MessageCircle },
]

export function ShareSheet({
  isOpen,
  onClose,
  videoUrl,
  videoTitle,
  onCopyLink,
  onSaveVideo,
  onReport,
  onSocialShare,
}: ShareSheetProps) {
  const handleCopyLink = useCallback(() => {
    if (videoUrl) {
      navigator.clipboard.writeText(videoUrl)
      lightHaptic()
      onCopyLink?.()
    }
  }, [videoUrl, onCopyLink])

  const handleNativeShare = useCallback(async () => {
    if (navigator.share && videoUrl) {
      try {
        await navigator.share({
          title: videoTitle || 'Check out this video!',
          url: videoUrl,
        })
      } catch (err) {
        // User cancelled or error
        console.log('Share cancelled')
      }
    }
  }, [videoUrl, videoTitle])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-900 rounded-t-3xl max-h-[80vh] overflow-hidden"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{
              type: 'spring',
              stiffness: SPRING.DEFAULT.stiffness,
              damping: SPRING.DEFAULT.damping,
            }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-white/20 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-4 pb-4">
              <h3 className="text-lg font-semibold text-white">Chia sẻ tới</h3>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10"
                aria-label="Close"
              >
                <X size={24} className="text-white" />
              </button>
            </div>

            {/* Social platforms */}
            <div className="px-4 pb-4">
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {socialPlatforms.map((platform) => (
                  <ShareOption
                    key={platform.id}
                    icon={<platform.icon size={24} className="text-white" />}
                    label={platform.label}
                    bgColor={platform.color}
                    onClick={() => onSocialShare?.(platform.id)}
                  />
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-white/10 mx-4" />

            {/* Actions */}
            <div className="px-4 py-4">
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                <ShareOption
                  icon={<Link size={24} className="text-white" />}
                  label="Sao chép link"
                  bgColor="#444"
                  onClick={handleCopyLink}
                />
                {typeof navigator !== 'undefined' && 'share' in navigator && (
                  <ShareOption
                    icon={<Send size={24} className="text-white" />}
                    label="Chia sẻ khác"
                    bgColor="#444"
                    onClick={handleNativeShare}
                  />
                )}
                <ShareOption
                  icon={<Download size={24} className="text-white" />}
                  label="Lưu video"
                  bgColor="#444"
                  onClick={onSaveVideo}
                />
                <ShareOption
                  icon={<Flag size={24} className="text-white" />}
                  label="Báo cáo"
                  bgColor="#444"
                  onClick={onReport}
                />
              </div>
            </div>

            {/* Safe area padding */}
            <div className="h-safe-bottom" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

