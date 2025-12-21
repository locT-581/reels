import type { Video } from '@vortex/core'

/**
 * Mock video data for demonstration
 * Using free HLS test streams and placeholder images
 */
export const mockVideos: Video[] = [
  {
    id: 'video-1',
    url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    hlsUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    thumbnail: 'https://picsum.photos/seed/v1/540/960',
    blurHash: 'LKO2:N%2Tw=w]~RBVZRi};RPxuwH',
    author: {
      id: 'author-1',
      username: 'vortex_creator',
      displayName: 'Vortex Creator',
      avatar: 'https://i.pravatar.cc/150?u=author1',
      isVerified: true,
      followersCount: 1250000,
      followingCount: 324,
    },
    caption: 'Welcome to VortexStream! 🚀 #vortex #shortform #video',
    hashtags: ['vortex', 'shortform', 'video'],
    sound: {
      id: 'sound-1',
      title: 'Original Sound',
      artist: 'Vortex Creator',
      duration: 15,
    },
    stats: {
      views: 1500000,
      likes: 250000,
      comments: 15000,
      shares: 5000,
    },
    duration: 15,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    isLiked: false,
    isSaved: false,
    allowComments: true,
  },
  {
    id: 'video-2',
    url: 'https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_ts/master.m3u8',
    hlsUrl: 'https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_ts/master.m3u8',
    thumbnail: 'https://picsum.photos/seed/v2/540/960',
    blurHash: 'LBD]~Vj[00j[_3j[~qoffQ%M9Fof',
    author: {
      id: 'author-2',
      username: 'tech_explorer',
      displayName: 'Tech Explorer',
      avatar: 'https://i.pravatar.cc/150?u=author2',
      isVerified: true,
      followersCount: 890000,
      followingCount: 128,
    },
    caption:
      'Exploring new technologies every day! 💡 Double tap để like #tech #explore',
    hashtags: ['tech', 'explore', 'innovation'],
    sound: {
      id: 'sound-2',
      title: 'Tech Vibes',
      artist: 'Sound Producer',
      duration: 30,
    },
    stats: {
      views: 890000,
      likes: 156000,
      comments: 8500,
      shares: 3200,
    },
    duration: 30,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    isLiked: true,
    isSaved: false,
    allowComments: true,
  },
  {
    id: 'video-3',
    url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    hlsUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    thumbnail: 'https://picsum.photos/seed/v3/540/960',
    blurHash: 'L6Pj0^jE.AyE_3t7t7R**0teleV@',
    author: {
      id: 'author-3',
      username: 'lifestyle_guru',
      displayName: 'Lifestyle Guru ✨',
      avatar: 'https://i.pravatar.cc/150?u=author3',
      isVerified: false,
      followersCount: 450000,
      followingCount: 89,
    },
    caption: 'Morning routine để bắt đầu ngày mới ☀️ #morning #routine #lifestyle',
    hashtags: ['morning', 'routine', 'lifestyle'],
    sound: {
      id: 'sound-3',
      title: 'Morning Coffee',
      artist: 'Chill Beats',
      duration: 20,
    },
    stats: {
      views: 670000,
      likes: 98000,
      comments: 4200,
      shares: 1800,
    },
    duration: 20,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    isLiked: false,
    isSaved: true,
    allowComments: true,
  },
  {
    id: 'video-4',
    url: 'https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_ts/master.m3u8',
    hlsUrl: 'https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_ts/master.m3u8',
    thumbnail: 'https://picsum.photos/seed/v4/540/960',
    blurHash: 'LNB4$d~qRj?G%#xvIVt8%gM|Rjof',
    author: {
      id: 'author-4',
      username: 'foodie_vn',
      displayName: 'Foodie Vietnam 🍜',
      avatar: 'https://i.pravatar.cc/150?u=author4',
      isVerified: true,
      followersCount: 2100000,
      followingCount: 256,
    },
    caption: 'Phở Hà Nội - món ăn sáng tuyệt vời! 🍲 #pho #hanoi #vietnam #food',
    hashtags: ['pho', 'hanoi', 'vietnam', 'food'],
    sound: {
      id: 'sound-4',
      title: 'Vietnamese Kitchen',
      artist: 'Foodie Sounds',
      duration: 25,
    },
    stats: {
      views: 3200000,
      likes: 520000,
      comments: 32000,
      shares: 12000,
    },
    duration: 25,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    isLiked: false,
    isSaved: false,
    allowComments: true,
  },
  {
    id: 'video-5',
    url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    hlsUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    thumbnail: 'https://picsum.photos/seed/v5/540/960',
    blurHash: 'L5H2EC=PM+yV0g-mq.wG9c010J}I',
    author: {
      id: 'author-5',
      username: 'travel_asia',
      displayName: 'Travel Asia 🌏',
      avatar: 'https://i.pravatar.cc/150?u=author5',
      isVerified: true,
      followersCount: 1850000,
      followingCount: 412,
    },
    caption:
      'Hội An đêm nay thật đẹp 🏮 Swipe up để xem thêm! #hoian #vietnam #travel',
    hashtags: ['hoian', 'vietnam', 'travel', 'lanterns'],
    sound: {
      id: 'sound-5',
      title: 'Hội An Nights',
      artist: 'Travel Vibes',
      duration: 18,
    },
    stats: {
      views: 2800000,
      likes: 450000,
      comments: 28000,
      shares: 15000,
    },
    duration: 18,
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    isLiked: true,
    isSaved: true,
    allowComments: true,
  },
]

/**
 * Generate additional mock videos for infinite scroll
 */
export function generateMoreVideos(startIndex: number, count: number): Video[] {
  return Array.from({ length: count }, (_, i) => {
    const index = startIndex + i
    const randomAuthor = mockVideos[index % mockVideos.length].author
    const randomStats = mockVideos[index % mockVideos.length].stats

    return {
      id: `video-generated-${index}`,
      url: index % 2 === 0
        ? 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
        : 'https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_ts/master.m3u8',
      hlsUrl: index % 2 === 0
        ? 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
        : 'https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_ts/master.m3u8',
      thumbnail: `https://picsum.photos/seed/gen${index}/540/960`,
      author: {
        ...randomAuthor,
        id: `author-gen-${index}`,
      },
      caption: `Generated video ${index} - VortexStream Demo 🎬 #demo #vortex`,
      hashtags: ['demo', 'vortex', 'generated'],
      sound: {
        id: `sound-gen-${index}`,
        title: `Sound ${index}`,
        artist: 'Demo Artist',
        duration: 15 + (index % 30),
      },
      stats: {
        views: Math.floor(randomStats.views * (0.5 + Math.random())),
        likes: Math.floor(randomStats.likes * (0.5 + Math.random())),
        comments: Math.floor(randomStats.comments * (0.5 + Math.random())),
        shares: Math.floor(randomStats.shares * (0.5 + Math.random())),
      },
      duration: 15 + (index % 30),
      createdAt: new Date(
        Date.now() - (index + 1) * 3600 * 1000
      ).toISOString(),
      isLiked: Math.random() > 0.7,
      isSaved: Math.random() > 0.9,
      allowComments: true,
    }
  })
}

