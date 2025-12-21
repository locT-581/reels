/**
 * Error messages and codes
 */

/**
 * Human-friendly error messages (Vietnamese)
 */
export const ERROR_MESSAGES = {
  network: 'Mạng đang nghỉ ngơi, thử lại nhé!',
  notFound: 'Video này đã bay màu rồi',
  restricted: 'Video không khả dụng ở khu vực bạn',
  server: 'Có lỗi từ phía chúng tôi, xin lỗi!',
  auth: 'Bạn cần đăng nhập để tiếp tục',
  rateLimit: 'Bạn thao tác quá nhanh, đợi chút nhé!',
  validation: 'Thông tin không hợp lệ',
  unknown: 'Có lỗi xảy ra, thử lại nhé!',
} as const

/**
 * Error codes
 */
export const ERROR_CODES = {
  // Network errors (1xxx)
  NETWORK_ERROR: 1000,
  TIMEOUT: 1001,
  OFFLINE: 1002,

  // Auth errors (2xxx)
  UNAUTHORIZED: 2000,
  TOKEN_EXPIRED: 2001,
  INVALID_CREDENTIALS: 2002,

  // Resource errors (3xxx)
  NOT_FOUND: 3000,
  RESTRICTED: 3001,
  DELETED: 3002,

  // Player errors (4xxx)
  PLAYER_ERROR: 4000,
  HLS_ERROR: 4001,
  DECODE_ERROR: 4002,
  AUTOPLAY_BLOCKED: 4003,

  // Server errors (5xxx)
  SERVER_ERROR: 5000,
  MAINTENANCE: 5001,

  // Client errors (6xxx)
  VALIDATION_ERROR: 6000,
  RATE_LIMIT: 6001,
} as const

