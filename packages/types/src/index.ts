/**
 * @vortex/core - Type definitions
 * Core types for VortexStream video platform
 */

// Video types
export type {
  Video,
  VideoMetadata,
  VideoStats,
  QualityLevel,
  Sound,
  VideoAspectRatio,
  VideoSourceType,
} from './video'

// User types
export type {
  User,
  Author,
  UserProfile,
  UserRole,
  UserPrivacySettings,
  UserNotificationSettings,
  UserRelationship,
} from './user'

// Comment types
export type {
  Comment,
  Reply,
  CommentThread,
  CommentSortBy,
  CommentResponse,
  ReplyResponse,
} from './comment'

// Player types
export type {
  PlayerState,
  PlaybackSpeed,
  Quality,
  PlayerProgress,
  BufferedRange,
  PlayerError,
  PlayerErrorType,
  PlayerConfig,
  PlayerEvent,
  PlayerEventMap,
} from './player'

// Feed types
export type {
  FeedType,
  FeedResponse,
  FeedRequest,
  VideoActivation,
  FeedScrollState,
  FeedPreloadConfig,
} from './feed'

// UI types
export type {
  ToastOptions,
  BottomSheetState,
  ContextMenuOption,
  ModalState,
  LoadingState,
  ThemeMode,
} from './ui'

// Error types
export type {
  ErrorType,
  VortexError,
  ApiErrorResponse,
  ErrorFallbackProps,
} from './error'

// Config types (API integration)
export type {
  VortexConfig,
  VortexProviderProps,
  VortexContextValue,
  VortexApiEndpoints,
  VortexAuthConfig,
  VortexResponseTransformers,
  VortexInterceptors,
  VideoListResponse,
  VideoDetailResponse,
  CommentsListResponse,
  RepliesListResponse,
  VideoFetchParams,
  TokenRefreshResult,
  RequestInterceptor,
  ResponseInterceptor,
  ErrorInterceptor,
} from './config'
export { DEFAULT_API_ENDPOINTS } from './config'

// API Response types (for transformers)
export type {
  ApiMediaItem,
  ApiThumbnail,
  ApiOwner,
  ApiReel,
  ApiPaginatedResponse,
  ApiSingleResponse,
  ExternalApiErrorResponse,
  ApiComment,
  ApiReply,
  ApiCommentsResponse,
} from './api-response'

// Re-export HttpErrorResponse for backward compatibility
export type { ApiErrorResponse as HttpErrorResponse } from './error'
