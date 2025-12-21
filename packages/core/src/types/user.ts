/**
 * User-related type definitions
 */

/**
 * User role in the platform
 */
export type UserRole = 'viewer' | 'creator' | 'moderator' | 'admin'

/**
 * User privacy settings
 */
export interface UserPrivacySettings {
  privateAccount: boolean
  allowComments: boolean
  allowDuet: boolean
  allowStitch: boolean
  allowDownload: boolean
  showLikedVideos: boolean
}

/**
 * User notification settings
 */
export interface UserNotificationSettings {
  likes: boolean
  comments: boolean
  mentions: boolean
  followers: boolean
  messages: boolean
}

/**
 * Base User interface
 */
export interface User {
  id: string
  username: string
  displayName: string
  avatar: string
  bio?: string
  isVerified?: boolean
  followersCount?: number
  followingCount?: number
  likesCount?: number
  videoCount?: number
  role?: UserRole
  createdAt?: string
}

/**
 * Author - User with following status (for video display)
 */
export interface Author extends User {
  isFollowing?: boolean
}

/**
 * Full user profile with settings
 */
export interface UserProfile extends User {
  email?: string
  phone?: string
  privacy?: UserPrivacySettings
  notifications?: UserNotificationSettings
}

/**
 * User relationship status
 */
export interface UserRelationship {
  userId: string
  isFollowing: boolean
  isFollowedBy: boolean
  isBlocked: boolean
  isBlockedBy: boolean
  isMuted: boolean
}

