import type { Comment } from '@vortex/core'

/**
 * Mock comments for demonstration
 */
export const mockComments: Comment[] = [
  {
    id: 'comment-1',
    videoId: 'video-1',
    author: {
      id: 'user-1',
      username: 'happy_viewer',
      displayName: 'Happy Viewer',
      avatar: 'https://i.pravatar.cc/150?u=user1',
      isVerified: false,
      followersCount: 1200,
      followingCount: 456,
    },
    content: 'Video hay quá! 🔥 Keep up the good work!',
    likesCount: 245,
    repliesCount: 12,
    isLiked: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    isPinned: true,
    isAuthorLiked: true,
  },
  {
    id: 'comment-2',
    videoId: 'video-1',
    author: {
      id: 'user-2',
      username: 'tech_fan',
      displayName: 'Tech Fan ⚡',
      avatar: 'https://i.pravatar.cc/150?u=user2',
      isVerified: true,
      followersCount: 89000,
      followingCount: 234,
    },
    content: 'Đây là nền tảng video tương lai! Gestures mượt mà quá 👏',
    likesCount: 156,
    repliesCount: 5,
    isLiked: true,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    isPinned: false,
    isAuthorLiked: false,
  },
  {
    id: 'comment-3',
    videoId: 'video-1',
    author: {
      id: 'user-3',
      username: 'design_lover',
      displayName: 'Design Lover',
      avatar: 'https://i.pravatar.cc/150?u=user3',
      isVerified: false,
      followersCount: 5600,
      followingCount: 789,
    },
    content: 'UI đẹp quá! Dark mode chuẩn OLED 🖤',
    likesCount: 89,
    repliesCount: 3,
    isLiked: false,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    isPinned: false,
    isAuthorLiked: true,
  },
  {
    id: 'comment-4',
    videoId: 'video-1',
    author: {
      id: 'user-4',
      username: 'mobile_dev',
      displayName: 'Mobile Developer 📱',
      avatar: 'https://i.pravatar.cc/150?u=user4',
      isVerified: true,
      followersCount: 45000,
      followingCount: 156,
    },
    content:
      'Performance tuyệt vời! 60fps scroll không drop frame. Virtualization làm rất tốt 💪',
    likesCount: 312,
    repliesCount: 18,
    isLiked: false,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    isPinned: false,
    isAuthorLiked: false,
  },
  {
    id: 'comment-5',
    videoId: 'video-1',
    author: {
      id: 'user-5',
      username: 'react_master',
      displayName: 'React Master',
      avatar: 'https://i.pravatar.cc/150?u=user5',
      isVerified: false,
      followersCount: 23000,
      followingCount: 345,
    },
    content:
      'Double tap để like, long press để mở menu - UX quá tốt! Học được nhiều từ project này 📚',
    likesCount: 178,
    repliesCount: 7,
    isLiked: true,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    isPinned: false,
    isAuthorLiked: false,
  },
  {
    id: 'comment-6',
    videoId: 'video-1',
    author: {
      id: 'user-6',
      username: 'ux_designer',
      displayName: 'UX Designer ✨',
      avatar: 'https://i.pravatar.cc/150?u=user6',
      isVerified: true,
      followersCount: 67000,
      followingCount: 432,
    },
    content:
      'Animation spring physics làm mọi thứ feel natural. Electric Violet accent color 💜 rất đẹp!',
    likesCount: 234,
    repliesCount: 9,
    isLiked: false,
    createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    isPinned: false,
    isAuthorLiked: true,
  },
  {
    id: 'comment-7',
    videoId: 'video-1',
    author: {
      id: 'user-7',
      username: 'video_editor',
      displayName: 'Video Editor',
      avatar: 'https://i.pravatar.cc/150?u=user7',
      isVerified: false,
      followersCount: 12000,
      followingCount: 567,
    },
    content: 'HLS streaming chất lượng cao! Buffer management rất thông minh 🎥',
    likesCount: 98,
    repliesCount: 4,
    isLiked: false,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    isPinned: false,
    isAuthorLiked: false,
  },
  {
    id: 'comment-8',
    videoId: 'video-1',
    author: {
      id: 'user-8',
      username: 'pwa_expert',
      displayName: 'PWA Expert 🌐',
      avatar: 'https://i.pravatar.cc/150?u=user8',
      isVerified: true,
      followersCount: 34000,
      followingCount: 123,
    },
    content:
      'Offline support với Service Worker rất impressive! Có thể xem video cached khi mất mạng 📶',
    likesCount: 156,
    repliesCount: 6,
    isLiked: true,
    createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
    isPinned: false,
    isAuthorLiked: false,
  },
]

/**
 * Generate more comments for pagination
 */
export function generateMoreComments(
  videoId: string,
  startIndex: number,
  count: number
): Comment[] {
  return Array.from({ length: count }, (_, i) => {
    const index = startIndex + i
    return {
      id: `comment-gen-${videoId}-${index}`,
      videoId,
      author: {
        id: `user-gen-${index}`,
        username: `user_${index}`,
        displayName: `User ${index}`,
        avatar: `https://i.pravatar.cc/150?u=usergen${index}`,
        isVerified: Math.random() > 0.9,
        followersCount: Math.floor(Math.random() * 10000),
        followingCount: Math.floor(Math.random() * 500),
      },
      content: `This is a generated comment #${index}. VortexStream is awesome! 🚀`,
      likesCount: Math.floor(Math.random() * 100),
      repliesCount: Math.floor(Math.random() * 10),
      isLiked: Math.random() > 0.8,
      createdAt: new Date(
        Date.now() - (index + 1) * 3600 * 1000
      ).toISOString(),
      isPinned: false,
      isAuthorLiked: Math.random() > 0.9,
    }
  })
}
