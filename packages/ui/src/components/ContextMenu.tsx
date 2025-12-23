/**
 * ContextMenu - Long press context menu
 */

'use client'

import { motion, AnimatePresence } from 'motion/react'
import {
  Bookmark,
  EyeOff,
  UserX,
  Flag,
  Link,
  X,
} from 'lucide-react'
import { SPRING } from '@vortex/design-tokens'
import { lightHaptic } from '../utils'
import type { ReactNode } from 'react'

export interface ContextMenuOption {
  /** Unique identifier */
  id: string
  /** Icon component */
  icon: ReactNode
  /** Label text */
  label: string
  /** Whether this option is destructive (red) */
  destructive?: boolean
  /** Called when option is clicked */
  onClick?: () => void
}

export interface ContextMenuProps {
  /** Whether the menu is open */
  isOpen: boolean
  /** Called when menu should close */
  onClose: () => void
  /** Position to show menu */
  position?: { x: number; y: number }
  /** Custom options (overrides defaults) */
  options?: ContextMenuOption[]
  /** Called when "Not interested" is clicked */
  onNotInterested?: () => void
  /** Called when "Hide author" is clicked */
  onHideAuthor?: () => void
  /** Called when "Report" is clicked */
  onReport?: () => void
  /** Called when "Copy link" is clicked */
  onCopyLink?: () => void
  /** Called when "Save video" is clicked */
  onSaveVideo?: () => void
  /** Whether video is already saved */
  isSaved?: boolean
}

// Default options
const getDefaultOptions = (props: ContextMenuProps): ContextMenuOption[] => [
  {
    id: 'save',
    icon: <Bookmark size={20} className={props.isSaved ? 'fill-current' : ''} />,
    label: props.isSaved ? 'Bỏ lưu video' : 'Lưu video',
    onClick: props.onSaveVideo,
  },
  {
    id: 'copy-link',
    icon: <Link size={20} />,
    label: 'Sao chép link',
    onClick: props.onCopyLink,
  },
  {
    id: 'not-interested',
    icon: <EyeOff size={20} />,
    label: 'Không quan tâm',
    onClick: props.onNotInterested,
  },
  {
    id: 'hide-author',
    icon: <UserX size={20} />,
    label: 'Ẩn tác giả này',
    onClick: props.onHideAuthor,
  },
  {
    id: 'report',
    icon: <Flag size={20} />,
    label: 'Báo cáo',
    destructive: true,
    onClick: props.onReport,
  },
]

export function ContextMenu({
  isOpen,
  onClose,
  position,
  options,
  ...props
}: ContextMenuProps) {
  const menuOptions = options || getDefaultOptions({ isOpen, onClose, position, options, ...props })

  const handleOptionClick = (option: ContextMenuOption) => {
    lightHaptic()
    option.onClick?.()
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Menu */}
          <motion.div
            className="fixed z-50 min-w-[200px] max-w-[280px] bg-zinc-800/95 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl"
            style={{
              left: position?.x ?? '50%',
              top: position?.y ?? '50%',
              transform: position ? 'translate(-50%, -50%)' : undefined,
              marginLeft: position ? 0 : '-140px',
              marginTop: position ? 0 : '-150px',
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{
              type: 'spring',
              stiffness: SPRING.DEFAULT.stiffness,
              damping: SPRING.DEFAULT.damping,
            }}
          >
            {/* Options */}
            <div className="py-2">
              {menuOptions.map((option, index) => (
                <motion.button
                  key={option.id}
                  onClick={() => handleOptionClick(option)}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors ${
                    option.destructive ? 'text-red-500' : 'text-white'
                  }`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  {option.icon}
                  <span className="text-sm font-medium">{option.label}</span>
                </motion.button>
              ))}
            </div>

            {/* Cancel button */}
            <div className="border-t border-white/10">
              <button
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-white/70 hover:bg-white/10 transition-colors"
              >
                <X size={20} />
                <span className="text-sm font-medium">Hủy</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

