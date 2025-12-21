---
description: "Social interactions - Like, Comment, Reply, Share, Save, and Follow implementations"
globs: ["**/components/*Like*", "**/components/*Comment*", "**/components/*Share*", "**/hooks/use*Like*", "**/hooks/use*Comment*"]
alwaysApply: false
---

# Social Interactions Rules

## Like System

### Like Button Component

```tsx
interface LikeButtonProps {
  videoId: string
  isLiked: boolean
  likesCount: number
  onLike: () => void
}

export function LikeButton({ videoId, isLiked, likesCount, onLike }: LikeButtonProps) {
  return (
    <button
      onClick={onLike}
      className="w-12 h-12 flex flex-col items-center justify-center"
      aria-label={isLiked ? 'Unlike' : 'Like'}
    >
      <motion.div
        animate={{ scale: isLiked ? [1, 1.3, 1] : 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      >
        <Heart
          className={cn(
            'w-8 h-8 transition-colors',
            isLiked 
              ? 'fill-vortex-red stroke-vortex-red' 
              : 'fill-none stroke-white'
          )}
        />
      </motion.div>
      <span className="text-xs text-white mt-1 drop-shadow-md">
        {formatCount(likesCount)}
      </span>
    </button>
  )
}
```

### Like Counter Format

```typescript
export function formatCount(count: number): string {
  if (count < 1000) return count.toString()
  if (count < 10000) return `${(count / 1000).toFixed(1)}K`
  if (count < 1000000) return `${Math.floor(count / 1000)}K`
  return `${(count / 1000000).toFixed(1)}M`
}
```

### Double Tap Like Animation

```tsx
export function DoubleTapLikeAnimation({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1.2, opacity: 1 }}
          exit={{ scale: 1, opacity: 0 }}
          transition={{
            scale: { type: 'spring', stiffness: 500, damping: 15 },
            opacity: { delay: 0.3, duration: 0.2 }
          }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
        >
          <Heart className="w-32 h-32 fill-vortex-red stroke-none drop-shadow-2xl" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

## Comment System

### Comment Bottom Sheet

```tsx
export function CommentSheet({ videoId, isOpen, onClose }: Props) {
  const { data, fetchNextPage, hasNextPage } = useCommentsQuery(videoId)
  const comments = data?.pages.flatMap(p => p.comments) ?? []

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100) onClose()
            }}
            className="fixed inset-x-0 bottom-0 h-[60vh] bg-black/80 backdrop-blur-xl rounded-t-3xl z-50 flex flex-col"
          >
            {/* Drag Handle */}
            <div className="w-10 h-1 bg-white/30 rounded-full mx-auto mt-3" />

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <span className="text-white font-semibold">
                💬 {formatCount(comments.length)} bình luận
              </span>
              <button onClick={onClose} className="p-2">
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Comment List */}
            <div className="flex-1 overflow-y-auto">
              {comments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} />
              ))}
              {hasNextPage && (
                <button onClick={() => fetchNextPage()}>Load more</button>
              )}
            </div>

            {/* Input */}
            <CommentInput videoId={videoId} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
```

### Comment Item

```tsx
interface CommentItemProps {
  comment: Comment
  isReply?: boolean
}

export function CommentItem({ comment, isReply = false }: CommentItemProps) {
  const [showReplies, setShowReplies] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className={cn('px-4 py-3', isReply && 'pl-14')}>
      <div className="flex gap-3">
        {/* Avatar */}
        <img
          src={comment.author.avatar}
          alt={comment.author.username}
          className={cn('rounded-full', isReply ? 'w-6 h-6' : 'w-8 h-8')}
        />

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2">
            <span className="text-white text-sm font-medium">
              @{comment.author.username}
            </span>
            <span className="text-vortex-gray text-xs">
              {formatTimeAgo(comment.createdAt)}
            </span>
          </div>

          {/* Content */}
          <p
            className={cn(
              'text-white text-sm mt-1',
              !isExpanded && 'line-clamp-3'
            )}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {comment.content}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-4 mt-2">
            <button className="flex items-center gap-1 text-vortex-gray text-xs">
              <Heart className="w-4 h-4" />
              {comment.likesCount > 0 && formatCount(comment.likesCount)}
            </button>
            <button className="text-vortex-gray text-xs">
              Trả lời
            </button>
          </div>

          {/* Replies */}
          {comment.repliesCount > 0 && !isReply && (
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="text-vortex-gray text-xs mt-2"
            >
              {showReplies ? 'Ẩn phản hồi' : `Xem ${comment.repliesCount} phản hồi`}
            </button>
          )}

          {showReplies && comment.replies?.map((reply) => (
            <CommentItem key={reply.id} comment={reply} isReply />
          ))}
        </div>
      </div>
    </div>
  )
}
```

### Comment Input

```tsx
export function CommentInput({ videoId, replyTo }: Props) {
  const [content, setContent] = useState('')
  const { mutate: postComment, isPending } = useCommentMutation(videoId)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = () => {
    if (!content.trim()) return
    postComment(content, {
      onSuccess: () => setContent('')
    })
  }

  return (
    <div className="flex items-center gap-3 p-4 border-t border-white/10 bg-black/50">
      <img
        src={currentUser.avatar}
        alt="You"
        className="w-7 h-7 rounded-full"
      />
      <input
        ref={inputRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={replyTo ? `Trả lời @${replyTo}...` : 'Thêm bình luận...'}
        maxLength={500}
        className="flex-1 bg-transparent text-white text-sm placeholder:text-vortex-gray outline-none"
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
      />
      <button
        onClick={handleSubmit}
        disabled={!content.trim() || isPending}
        className={cn(
          'p-2 rounded-full transition-colors',
          content.trim() ? 'text-vortex-violet' : 'text-vortex-gray'
        )}
      >
        <Send className="w-5 h-5" />
      </button>
    </div>
  )
}
```

## Share System

### Share Bottom Sheet

```tsx
const SHARE_OPTIONS = [
  { id: 'messenger', icon: MessengerIcon, label: 'Messenger' },
  { id: 'zalo', icon: ZaloIcon, label: 'Zalo' },
  { id: 'whatsapp', icon: WhatsAppIcon, label: 'WhatsApp' },
  { id: 'telegram', icon: TelegramIcon, label: 'Telegram' },
  { id: 'facebook', icon: FacebookIcon, label: 'Facebook' },
  { id: 'twitter', icon: TwitterIcon, label: 'Twitter' },
] as const

const SHARE_ACTIONS = [
  { id: 'copy', icon: Link, label: 'Sao chép link' },
  { id: 'sms', icon: MessageSquare, label: 'SMS' },
  { id: 'email', icon: Mail, label: 'Email' },
  { id: 'more', icon: MoreHorizontal, label: 'Thêm' },
] as const

export function ShareSheet({ video, isOpen, onClose }: Props) {
  const shareUrl = `https://vortex.app/v/${video.id}`

  const handleShare = async (platform: string) => {
    switch (platform) {
      case 'copy':
        await navigator.clipboard.writeText(shareUrl)
        toast.success('Đã sao chép link')
        break
      case 'more':
        await navigator.share({
          title: video.caption,
          url: shareUrl,
        })
        break
      default:
        window.open(getShareUrl(platform, shareUrl), '_blank')
    }
    trackShare(video.id, platform)
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="bg-black/80 backdrop-blur-xl rounded-t-3xl">
        <SheetHeader>
          <SheetTitle className="text-white">Chia sẻ</SheetTitle>
        </SheetHeader>

        {/* Social Apps */}
        <div className="flex gap-4 overflow-x-auto py-4">
          {SHARE_OPTIONS.map((option) => (
            <button
              key={option.id}
              onClick={() => handleShare(option.id)}
              className="flex flex-col items-center gap-2 min-w-[60px]"
            >
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <option.icon className="w-6 h-6" />
              </div>
              <span className="text-xs text-white">{option.label}</span>
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-4 gap-4 py-4 border-t border-white/10">
          {SHARE_ACTIONS.map((action) => (
            <button
              key={action.id}
              onClick={() => handleShare(action.id)}
              className="flex flex-col items-center gap-2"
            >
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <action.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs text-white">{action.label}</span>
            </button>
          ))}
        </div>

        {/* Link Preview */}
        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl mt-4">
          <img src={video.thumbnail} className="w-12 h-12 rounded-lg object-cover" />
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm truncate">{video.caption}</p>
            <p className="text-vortex-gray text-xs truncate">{shareUrl}</p>
          </div>
          <button
            onClick={() => handleShare('copy')}
            className="text-vortex-violet text-sm font-medium"
          >
            Sao chép
          </button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
```

## Action Bar

```tsx
export function ActionBar({ video }: { video: Video }) {
  const [showComments, setShowComments] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const { mutate: like } = useLikeMutation()
  const { mutate: save } = useSaveMutation()

  return (
    <>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.05 } }
        }}
        className="absolute right-3 bottom-[20%] flex flex-col items-center gap-5"
      >
        {/* Follow Button */}
        <motion.div variants={fadeInUp}>
          <FollowButton author={video.author} />
        </motion.div>

        {/* Like */}
        <motion.div variants={fadeInUp}>
          <LikeButton
            videoId={video.id}
            isLiked={video.isLiked}
            likesCount={video.likesCount}
            onLike={() => like(video.id)}
          />
        </motion.div>

        {/* Comment */}
        <motion.div variants={fadeInUp}>
          <ActionButton
            icon={MessageCircle}
            count={video.commentsCount}
            onClick={() => setShowComments(true)}
          />
        </motion.div>

        {/* Share */}
        <motion.div variants={fadeInUp}>
          <ActionButton
            icon={Share}
            count={video.sharesCount}
            onClick={() => setShowShare(true)}
          />
        </motion.div>

        {/* Save */}
        <motion.div variants={fadeInUp}>
          <SaveButton
            videoId={video.id}
            isSaved={video.isSaved}
            onSave={() => save(video.id)}
          />
        </motion.div>
      </motion.div>

      {/* Sheets */}
      <CommentSheet
        videoId={video.id}
        isOpen={showComments}
        onClose={() => setShowComments(false)}
      />
      <ShareSheet
        video={video}
        isOpen={showShare}
        onClose={() => setShowShare(false)}
      />
    </>
  )
}
```

## Optimistic Update Pattern

```typescript
// Always update UI immediately, rollback on error
const handleLike = async (videoId: string) => {
  // 1. Haptic feedback
  navigator.vibrate?.(10)

  // 2. Optimistic update (via mutation)
  likeMutation.mutate(videoId)

  // 3. Show animation
  setShowHeartAnimation(true)
  setTimeout(() => setShowHeartAnimation(false), 500)
}
```

