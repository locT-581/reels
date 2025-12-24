/**
 * VideoFeedItemActions - Action buttons component
 *
 * Renders like, comment, share buttons.
 * Must be used within VideoFeedItem.
 */

'use client'

import { forwardRef, type HTMLAttributes } from 'react'
import { ActionBar } from '@vortex/player'
import { useVideoFeedItemContext } from './context'

export interface VideoFeedItemActionsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onShare'> {
  /** Override like callback from context */
  onLike?: () => void
  /** Override comment callback from context */
  onComment?: () => void
  /** Override share callback from context */
  onShare?: () => void
}

const VideoFeedItemActions = forwardRef<HTMLDivElement, VideoFeedItemActionsProps>(
  ({ onLike: onLikeProp, onComment: onCommentProp, onShare: onShareProp, ...props }, ref) => {
    const {
      video,
      onLike: contextOnLike,
      onComment: contextOnComment,
      onShare: contextOnShare,
    } = useVideoFeedItemContext()

    return (
      <div ref={ref} {...props}>
        <ActionBar
          avatarUrl={video.author.avatar}
          likeCount={video.stats.likes}
          commentCount={video.stats.comments}
          shareCount={video.stats.shares}
          isLiked={video.isLiked}
          onLike={onLikeProp ?? contextOnLike}
          onComment={onCommentProp ?? contextOnComment}
          onShare={onShareProp ?? contextOnShare}
        />
      </div>
    )
  }
)

VideoFeedItemActions.displayName = 'VideoFeedItemActions'

export { VideoFeedItemActions }
