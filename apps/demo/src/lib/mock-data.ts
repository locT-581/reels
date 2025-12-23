/**
 * Mock Data for VortexStream Demo
 *
 * These sample videos are from publicly available sources for demo purposes.
 */

import type { Video, Author, Comment, Reply } from '@vortex/core'

// Sample Authors
export const authors: Author[] = [
  {
    id: 'author-1',
    username: 'vortex_official',
    displayName: 'VortexStream',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop',
    isVerified: true,
    followersCount: 1500000,
    followingCount: 120,
  },
  {
    id: 'author-2',
    username: 'nature_vibes',
    displayName: 'Nature Vibes',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    isVerified: true,
    followersCount: 890000,
    followingCount: 450,
  },
  {
    id: 'author-3',
    username: 'tech_explorer',
    displayName: 'Tech Explorer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    isVerified: false,
    followersCount: 234000,
    followingCount: 890,
  },
  {
    id: 'author-4',
    username: 'travel_dreams',
    displayName: 'Travel Dreams',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    isVerified: true,
    followersCount: 1200000,
    followingCount: 320,
  },
  {
    id: 'author-5',
    username: 'urban_stories',
    displayName: 'Urban Stories',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
    isVerified: false,
    followersCount: 567000,
    followingCount: 1200,
  },
]

// Get author safely
const getAuthor = (index: number): Author => authors[index] ?? authors[0]!

// Sample Videos with publicly available MP4 sources
// Using sample videos from various free video hosting services
export const mockVideos: Video[] = [
  {
    id: 'video-1',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=700&fit=crop',
    blurHash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4',
    author: getAuthor(0),
    caption: 'Cảm nhận sức mạnh của thiên nhiên 🔥 #nature #fire #amazing',
    hashtags: ['nature', 'fire', 'amazing'],
    stats: { views: 2500000, likes: 450000, comments: 12500, shares: 8900 },
    duration: 15,
    createdAt: new Date().toISOString(),
    isLiked: false,
    isSaved: false,
    sound: {
      id: 'sound-1',
      title: 'Epic Nature',
      artist: 'Ambient Sounds',
      duration: 15,
    },
  },
  {
    id: 'video-2',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=700&fit=crop',
    blurHash: 'L8I5XHof~WRjM{t7j[WB%Kofs;j[',
    author: getAuthor(1),
    caption: 'Escape to paradise 🏝️ Nơi đây thật tuyệt vời! #travel #paradise #vacation',
    hashtags: ['travel', 'paradise', 'vacation'],
    stats: { views: 1800000, likes: 320000, comments: 8700, shares: 5400 },
    duration: 15,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    isLiked: true,
    isSaved: false,
    sound: {
      id: 'sound-2',
      title: 'Tropical Vibes',
      artist: 'Beach Sounds',
      duration: 15,
    },
  },
  {
    id: 'video-3',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=700&fit=crop',
    blurHash: 'L02rs}of00of~qj[00ay%MayM{ay',
    author: getAuthor(2),
    caption: 'Công nghệ tương lai đang đến gần hơn bao giờ hết 🚀 #tech #future #innovation',
    hashtags: ['tech', 'future', 'innovation'],
    stats: { views: 980000, likes: 156000, comments: 4500, shares: 2300 },
    duration: 60,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    isLiked: false,
    isSaved: true,
    sound: {
      id: 'sound-3',
      title: 'Digital Dreams',
      artist: 'Synth Wave',
      duration: 60,
    },
  },
  {
    id: 'video-4',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=700&fit=crop',
    blurHash: 'LBDu,v~WM{M{_N%NRkRkD$xuIUt7',
    author: getAuthor(3),
    caption: 'Road trip to remember 🚗 Hành trình khám phá không giới hạn #roadtrip #adventure #explore',
    hashtags: ['roadtrip', 'adventure', 'explore'],
    stats: { views: 3200000, likes: 567000, comments: 15600, shares: 12000 },
    duration: 15,
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    isLiked: true,
    isSaved: true,
    sound: {
      id: 'sound-4',
      title: 'Open Road',
      artist: 'Journey Music',
      duration: 15,
    },
  },
  {
    id: 'video-5',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=700&fit=crop',
    blurHash: 'L35X$*xu00t7_3M{D%Rj00ay~qRj',
    author: getAuthor(4),
    caption: 'Khoảnh khắc tuyệt đẹp giữa thành phố ✨ #urban #night #citylife',
    hashtags: ['urban', 'night', 'citylife'],
    stats: { views: 1450000, likes: 234000, comments: 6700, shares: 4500 },
    duration: 15,
    createdAt: new Date(Date.now() - 345600000).toISOString(),
    isLiked: false,
    isSaved: false,
    sound: {
      id: 'sound-5',
      title: 'City Lights',
      artist: 'Urban Beats',
      duration: 15,
    },
  },
  {
    id: 'video-6',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=700&fit=crop',
    blurHash: 'L6BDVF00_4xu~qj[M{xu00M{Rjay',
    author: getAuthor(0),
    caption: 'Animation showcase 🎬 Sáng tạo không giới hạn #animation #creative #art',
    hashtags: ['animation', 'creative', 'art'],
    stats: { views: 5600000, likes: 890000, comments: 23400, shares: 18700 },
    duration: 596,
    createdAt: new Date(Date.now() - 432000000).toISOString(),
    isLiked: false,
    isSaved: false,
    sound: {
      id: 'sound-6',
      title: 'Creative Flow',
      artist: 'Art Studio',
      duration: 596,
    },
  },
  {
    id: 'video-7',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=700&fit=crop',
    blurHash: 'LBE:HVt7_3M{~qj[D%ay00WB%May',
    author: getAuthor(1),
    caption: 'Giấc mơ về một thế giới kỳ ảo 🌙 #dream #fantasy #imagination',
    hashtags: ['dream', 'fantasy', 'imagination'],
    stats: { views: 2100000, likes: 345000, comments: 9800, shares: 6700 },
    duration: 653,
    createdAt: new Date(Date.now() - 518400000).toISOString(),
    isLiked: true,
    isSaved: false,
    sound: {
      id: 'sound-7',
      title: 'Dream Sequence',
      artist: 'Fantasy Orchestra',
      duration: 653,
    },
  },
  {
    id: 'video-8',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=700&fit=crop',
    blurHash: 'L8BM-U~W00of~qWBRjof00j[M{ay',
    author: getAuthor(2),
    caption: 'Epic adventure awaits 🐉 Câu chuyện về sự dũng cảm #epic #adventure #dragon',
    hashtags: ['epic', 'adventure', 'dragon'],
    stats: { views: 4500000, likes: 780000, comments: 21000, shares: 15600 },
    duration: 888,
    createdAt: new Date(Date.now() - 604800000).toISOString(),
    isLiked: false,
    isSaved: true,
    sound: {
      id: 'sound-8',
      title: 'Epic Score',
      artist: 'Cinema Orchestra',
      duration: 888,
    },
  },
]

// Sample Replies
const sampleReplies: Reply[] = [
  {
    id: 'reply-1',
    videoId: 'video-1',
    parentId: 'comment-1',
    author: getAuthor(0),
    content: 'Cảm ơn bạn nhiều! 🙏',
    likesCount: 567,
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    isLiked: true,
  },
  {
    id: 'reply-2',
    videoId: 'video-1',
    parentId: 'comment-2',
    author: getAuthor(0),
    content: 'Đây là ở Iceland bạn ơi!',
    likesCount: 234,
    createdAt: new Date(Date.now() - 9000000).toISOString(),
    isLiked: false,
  },
]

// Sample Comments
export const mockComments: Comment[] = [
  {
    id: 'comment-1',
    videoId: 'video-1',
    author: getAuthor(1),
    content: 'Video này quá đẹp! 😍',
    likesCount: 1234,
    repliesCount: 1,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    isLiked: false,
    replies: [sampleReplies[0]!],
  },
  {
    id: 'comment-2',
    videoId: 'video-1',
    author: getAuthor(2),
    content: 'Mình cũng muốn được đến đây một lần!',
    likesCount: 890,
    repliesCount: 0,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    isLiked: true,
    replies: [],
  },
  {
    id: 'comment-3',
    videoId: 'video-1',
    author: getAuthor(3),
    content: 'Địa điểm này ở đâu vậy bạn?',
    likesCount: 456,
    repliesCount: 1,
    createdAt: new Date(Date.now() - 10800000).toISOString(),
    isLiked: false,
    replies: [sampleReplies[1]!],
  },
  {
    id: 'comment-4',
    videoId: 'video-1',
    author: getAuthor(4),
    content: 'Chất lượng video tuyệt vời! Bạn quay bằng gì vậy?',
    likesCount: 678,
    repliesCount: 0,
    createdAt: new Date(Date.now() - 14400000).toISOString(),
    isLiked: false,
    replies: [],
  },
]

// Utility functions
export function getVideoById(id: string): Video | undefined {
  return mockVideos.find((v) => v.id === id)
}

export function getVideosByAuthor(authorId: string): Video[] {
  return mockVideos.filter((v) => v.author.id === authorId)
}

export function getVideosByHashtag(hashtag: string): Video[] {
  return mockVideos.filter((v) =>
    v.hashtags.some((h) => h.toLowerCase() === hashtag.toLowerCase())
  )
}

export function getCommentsForVideo(videoId: string): Comment[] {
  return mockComments.filter((c) => c.videoId === videoId)
}

export function searchVideos(query: string): Video[] {
  const lowerQuery = query.toLowerCase()
  return mockVideos.filter(
    (v) =>
      v.caption.toLowerCase().includes(lowerQuery) ||
      v.hashtags.some((h) => h.toLowerCase().includes(lowerQuery)) ||
      v.author.username.toLowerCase().includes(lowerQuery) ||
      v.author.displayName.toLowerCase().includes(lowerQuery)
  )
}

// Simulate pagination
export function getVideosPaginated(
  page: number = 1,
  limit: number = 5
): { videos: Video[]; hasMore: boolean; total: number } {
  const start = (page - 1) * limit
  const end = start + limit
  const videos = mockVideos.slice(start, end)

  return {
    videos,
    hasMore: end < mockVideos.length,
    total: mockVideos.length,
  }
}

// Simulate async data fetching
export async function fetchVideos(
  page: number = 1,
  limit: number = 5,
  delay: number = 800
): Promise<{ videos: Video[]; hasMore: boolean; total: number }> {
  await new Promise((resolve) => setTimeout(resolve, delay))
  return getVideosPaginated(page, limit)
}

export async function fetchVideoById(
  id: string,
  delay: number = 500
): Promise<Video | null> {
  await new Promise((resolve) => setTimeout(resolve, delay))
  return getVideoById(id) || null
}

export async function fetchComments(
  videoId: string,
  delay: number = 500
): Promise<Comment[]> {
  await new Promise((resolve) => setTimeout(resolve, delay))
  return getCommentsForVideo(videoId)
}
