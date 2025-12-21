/**
 * Text - Typography component with video-safe variants
 */

'use client'

import { forwardRef, type HTMLAttributes, type ElementType } from 'react'

export type TextVariant = 
  | 'display'
  | 'title'
  | 'subtitle'
  | 'body'
  | 'caption'
  | 'label'
  | 'overline'

export type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold'

export interface TextProps extends HTMLAttributes<HTMLElement> {
  /** Typography variant */
  variant?: TextVariant
  /** Font weight */
  weight?: TextWeight
  /** Add shadow for text over video */
  videoSafe?: boolean
  /** Truncate with ellipsis */
  truncate?: boolean
  /** Max lines before truncate */
  maxLines?: number
  /** Text color */
  color?: 'default' | 'muted' | 'accent' | 'error'
  /** HTML element to render */
  as?: ElementType
  /** Custom className */
  className?: string
}

const variantClasses: Record<TextVariant, string> = {
  display: 'text-4xl leading-tight',
  title: 'text-xl leading-snug',
  subtitle: 'text-lg leading-snug',
  body: 'text-base leading-normal',
  caption: 'text-sm leading-normal',
  label: 'text-xs leading-normal',
  overline: 'text-xs uppercase tracking-wider leading-normal',
}

const weightClasses: Record<TextWeight, string> = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
}

const colorClasses: Record<string, string> = {
  default: 'text-white',
  muted: 'text-white/60',
  accent: 'text-vortex-violet',
  error: 'text-red-500',
}

const defaultElements: Record<TextVariant, ElementType> = {
  display: 'h1',
  title: 'h2',
  subtitle: 'h3',
  body: 'p',
  caption: 'span',
  label: 'span',
  overline: 'span',
}

export const Text = forwardRef<HTMLElement, TextProps>(
  (
    {
      variant = 'body',
      weight = 'normal',
      videoSafe = false,
      truncate = false,
      maxLines,
      color = 'default',
      as,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const Component = as || defaultElements[variant]

    const lineClampClass = maxLines
      ? `line-clamp-${maxLines}`
      : truncate
      ? 'truncate'
      : ''

    return (
      <Component
        ref={ref}
        className={`
          ${variantClasses[variant]}
          ${weightClasses[weight]}
          ${colorClasses[color]}
          ${videoSafe ? 'drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]' : ''}
          ${lineClampClass}
          ${className}
        `}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

Text.displayName = 'Text'

