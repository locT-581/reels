/**
 * UI-related type definitions
 */

/**
 * Toast notification options
 */
export interface ToastOptions {
  message: string
  type?: 'success' | 'error' | 'info' | 'warning'
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
  icon?: React.ReactNode
}

/**
 * Bottom sheet state
 */
export interface BottomSheetState {
  isOpen: boolean
  height: number // Percentage of viewport (0-1)
  isDragging: boolean
}

/**
 * Context menu option
 */
export interface ContextMenuOption {
  id: string
  label: string
  icon?: React.ReactNode
  destructive?: boolean
  disabled?: boolean
  onClick: () => void
}

/**
 * Modal state
 */
export interface ModalState {
  isOpen: boolean
  title?: string
  content?: React.ReactNode
}

/**
 * Loading state
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

/**
 * Theme mode
 */
export type ThemeMode = 'dark' | 'light' | 'system'

