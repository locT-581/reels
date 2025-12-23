/**
 * ErrorOverlay - Human-friendly error messages
 */

'use client'

import { motion } from 'motion/react'
import { WifiOff, AlertTriangle, RefreshCw, SkipForward } from 'lucide-react'
import { SPRING, ERROR_MESSAGES } from '@vortex/core'
import type { PlayerErrorType } from '@vortex/core'

export interface ErrorOverlayProps {
  errorType: PlayerErrorType
  errorMessage?: string
  onRetry?: () => void
  onSkip?: () => void
  showSkip?: boolean
}

const errorConfig: Record<
  PlayerErrorType,
  { icon: typeof WifiOff; title: string; description: string }
> = {
  network: {
    icon: WifiOff,
    title: 'Không có kết nối',
    description: ERROR_MESSAGES.network,
  },
  decode: {
    icon: AlertTriangle,
    title: 'Lỗi phát video',
    description: 'Đã xảy ra lỗi khi phát video. Vui lòng thử lại.',
  },
  notSupported: {
    icon: AlertTriangle,
    title: 'Không hỗ trợ',
    description: 'Trình duyệt của bạn không hỗ trợ phát video này.',
  },
  aborted: {
    icon: AlertTriangle,
    title: 'Đã hủy',
    description: 'Video đã bị hủy tải.',
  },
  unknown: {
    icon: AlertTriangle,
    title: 'Có lỗi xảy ra',
    description: ERROR_MESSAGES.unknown,
  },
}

export function ErrorOverlay({
  errorType,
  errorMessage,
  onRetry,
  onSkip,
  showSkip = true,
}: ErrorOverlayProps) {
  const config = errorConfig[errorType] ?? errorConfig.unknown
  const Icon = config.icon

  return (
    <motion.div
      className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/90 px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="flex flex-col items-center gap-4 max-w-xs text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: 'spring',
          stiffness: SPRING.DEFAULT.stiffness,
          damping: SPRING.DEFAULT.damping,
          delay: 0.1,
        }}
      >
        {/* Icon */}
        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
          <Icon className="w-8 h-8 text-white/70" />
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-white">{config.title}</h3>

        {/* Description */}
        <p className="text-sm text-white/60">
          {errorMessage ?? config.description}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-4">
          {onRetry && (
            <motion.button
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-vortex-violet text-white font-medium text-sm"
              onClick={onRetry}
              whileTap={{ scale: 0.95 }}
              transition={{
                type: 'spring',
                stiffness: SPRING.DEFAULT.stiffness,
                damping: SPRING.DEFAULT.damping,
              }}
            >
              <RefreshCw className="w-4 h-4" />
              Thử lại
            </motion.button>
          )}

          {showSkip && onSkip && (
            <motion.button
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 text-white font-medium text-sm"
              onClick={onSkip}
              whileTap={{ scale: 0.95 }}
              transition={{
                type: 'spring',
                stiffness: SPRING.DEFAULT.stiffness,
                damping: SPRING.DEFAULT.damping,
              }}
            >
              <SkipForward className="w-4 h-4" />
              Bỏ qua
            </motion.button>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

