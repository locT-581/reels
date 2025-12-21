/**
 * User Store - Zustand store for user state (auth, likes, saves)
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../types'
import { STORAGE_KEYS } from '../constants'

export interface UserStore {
  // State
  currentUser: User | null
  isLoggedIn: boolean
  likedVideos: Set<string>
  savedVideos: Set<string>
  followingUsers: Set<string>

  // Auth actions
  setUser: (user: User | null) => void
  login: (user: User) => void
  logout: () => void

  // Like actions
  toggleLike: (videoId: string) => void
  isLiked: (videoId: string) => boolean
  setLikedVideos: (videoIds: string[]) => void

  // Save/Bookmark actions
  toggleSave: (videoId: string) => void
  isSaved: (videoId: string) => boolean
  setSavedVideos: (videoIds: string[]) => void

  // Follow actions
  toggleFollow: (userId: string) => void
  isFollowing: (userId: string) => boolean
  setFollowingUsers: (userIds: string[]) => void

  // Reset
  reset: () => void
}

const initialState = {
  currentUser: null,
  isLoggedIn: false,
  likedVideos: new Set<string>(),
  savedVideos: new Set<string>(),
  followingUsers: new Set<string>(),
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Auth actions
      setUser: (user) =>
        set({
          currentUser: user,
          isLoggedIn: user !== null,
        }),

      login: (user) =>
        set({
          currentUser: user,
          isLoggedIn: true,
        }),

      logout: () =>
        set({
          currentUser: null,
          isLoggedIn: false,
          // Keep liked/saved for potential re-login
        }),

      // Like actions
      toggleLike: (videoId) =>
        set((state) => {
          const newLiked = new Set(state.likedVideos)
          if (newLiked.has(videoId)) {
            newLiked.delete(videoId)
          } else {
            newLiked.add(videoId)
          }
          return { likedVideos: newLiked }
        }),

      isLiked: (videoId) => get().likedVideos.has(videoId),

      setLikedVideos: (videoIds) =>
        set({ likedVideos: new Set(videoIds) }),

      // Save actions
      toggleSave: (videoId) =>
        set((state) => {
          const newSaved = new Set(state.savedVideos)
          if (newSaved.has(videoId)) {
            newSaved.delete(videoId)
          } else {
            newSaved.add(videoId)
          }
          return { savedVideos: newSaved }
        }),

      isSaved: (videoId) => get().savedVideos.has(videoId),

      setSavedVideos: (videoIds) =>
        set({ savedVideos: new Set(videoIds) }),

      // Follow actions
      toggleFollow: (userId) =>
        set((state) => {
          const newFollowing = new Set(state.followingUsers)
          if (newFollowing.has(userId)) {
            newFollowing.delete(userId)
          } else {
            newFollowing.add(userId)
          }
          return { followingUsers: newFollowing }
        }),

      isFollowing: (userId) => get().followingUsers.has(userId),

      setFollowingUsers: (userIds) =>
        set({ followingUsers: new Set(userIds) }),

      // Reset
      reset: () => set(initialState),
    }),
    {
      name: STORAGE_KEYS.USER_DATA,
      partialize: (state) => ({
        // Persist user data
        currentUser: state.currentUser,
        isLoggedIn: state.isLoggedIn,
        // Convert Sets to arrays for JSON serialization
        likedVideos: Array.from(state.likedVideos),
        savedVideos: Array.from(state.savedVideos),
        followingUsers: Array.from(state.followingUsers),
      }),
      // Custom storage to handle Set serialization
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name)
          if (!str) return null

          const parsed = JSON.parse(str)
          return {
            ...parsed,
            state: {
              ...parsed.state,
              // Convert arrays back to Sets
              likedVideos: new Set(parsed.state?.likedVideos || []),
              savedVideos: new Set(parsed.state?.savedVideos || []),
              followingUsers: new Set(parsed.state?.followingUsers || []),
            },
          }
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value))
        },
        removeItem: (name) => {
          localStorage.removeItem(name)
        },
      },
    }
  )
)

