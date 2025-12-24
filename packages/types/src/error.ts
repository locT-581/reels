/**
 * Error-related type definitions
 */

/**
 * Application error types
 */
export type ErrorType =
  | 'network'
  | 'notFound'
  | 'restricted'
  | 'server'
  | 'auth'
  | 'validation'
  | 'rateLimit'
  | 'unknown'

/**
 * Application error
 */
export interface XHubReelError {
  code: string
  type: ErrorType
  message: string
  details?: Record<string, unknown>
  timestamp?: number
  recoverable?: boolean
}

/**
 * API error response shape (from server)
 */
export interface ApiErrorResponse {
  status: number
  code: string
  message: string
  errors?: Array<{
    field: string
    message: string
  }>
}

/**
 * Error boundary fallback props
 */
export interface ErrorFallbackProps {
  error: Error
  resetErrorBoundary: () => void
}

