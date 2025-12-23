/**
 * Comment-related type definitions
 */

import type { User } from './user'

/**
 * Comment on a video
 */
export interface Comment {
  id: string
  videoId: string
  author: User
  content: string
  createdAt: string
  likesCount: number
  isLiked?: boolean
  repliesCount: number
  replies?: Reply[]
  isPinned?: boolean
  isAuthorLiked?: boolean
  mentionedUsers?: User[]
}

/**
 * Reply to a comment (max 1 level deep)
 */
export interface Reply extends Omit<Comment, 'repliesCount' | 'replies' | 'isPinned'> {
  parentId: string
  replyToUser?: User
}

/**
 * Comment thread with replies
 */
export interface CommentThread {
  comment: Comment
  replies: Reply[]
  hasMoreReplies: boolean
  totalReplies: number
}

/**
 * Comment sort options
 */
export type CommentSortBy = 'newest' | 'popular' | 'oldest'

/**
 * Comment pagination response
 */
export interface CommentResponse {
  comments: Comment[]
  nextCursor?: string
  hasMore: boolean
  totalCount: number
}

/**
 * Reply pagination response
 */
export interface ReplyResponse {
  replies: Reply[]
  nextCursor?: string
  hasMore: boolean
  totalCount: number
}

