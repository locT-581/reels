/**
 * UI Store - Zustand store for UI state (modals, sheets, etc.)
 */

import { create } from 'zustand'
import type { ToastOptions } from '../types'

export interface UIStore {
  // State
  isCommentSheetOpen: boolean
  isShareSheetOpen: boolean
  isContextMenuOpen: boolean
  contextMenuPosition: { x: number; y: number } | null
  activeVideoId: string | null
  toast: ToastOptions | null

  // Actions
  openCommentSheet: (videoId: string) => void
  closeCommentSheet: () => void
  openShareSheet: (videoId: string) => void
  closeShareSheet: () => void
  openContextMenu: (videoId: string, position: { x: number; y: number }) => void
  closeContextMenu: () => void
  showToast: (options: ToastOptions) => void
  hideToast: () => void
  closeAll: () => void
}

const initialState = {
  isCommentSheetOpen: false,
  isShareSheetOpen: false,
  isContextMenuOpen: false,
  contextMenuPosition: null,
  activeVideoId: null,
  toast: null,
}

export const useUIStore = create<UIStore>((set) => ({
  ...initialState,

  openCommentSheet: (videoId) =>
    set({
      isCommentSheetOpen: true,
      activeVideoId: videoId,
      // Close other modals
      isShareSheetOpen: false,
      isContextMenuOpen: false,
    }),

  closeCommentSheet: () =>
    set({
      isCommentSheetOpen: false,
      activeVideoId: null,
    }),

  openShareSheet: (videoId) =>
    set({
      isShareSheetOpen: true,
      activeVideoId: videoId,
      // Close other modals
      isCommentSheetOpen: false,
      isContextMenuOpen: false,
    }),

  closeShareSheet: () =>
    set({
      isShareSheetOpen: false,
      activeVideoId: null,
    }),

  openContextMenu: (videoId, position) =>
    set({
      isContextMenuOpen: true,
      contextMenuPosition: position,
      activeVideoId: videoId,
    }),

  closeContextMenu: () =>
    set({
      isContextMenuOpen: false,
      contextMenuPosition: null,
    }),

  showToast: (options) => set({ toast: options }),

  hideToast: () => set({ toast: null }),

  closeAll: () => set(initialState),
}))

