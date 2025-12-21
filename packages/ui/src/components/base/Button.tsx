/**
 * Button - Multi-variant button component
 */

'use client'

import { forwardRef, type ReactNode } from 'react'
import { motion, type HTMLMotionProps } from 'motion/react'
import { Loader2 } from 'lucide-react'
import { SPRING } from '@vortex/core'

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  /** Button size */
  size?: 'sm' | 'md' | 'lg'
  /** Loading state */
  isLoading?: boolean
  /** Full width */
  fullWidth?: boolean
  /** Icon before text */
  leftIcon?: ReactNode
  /** Icon after text */
  rightIcon?: ReactNode
  /** Custom className */
  className?: string
  /** Button contents */
  children: ReactNode
}

const variantClasses = {
  primary:
    'bg-vortex-violet text-white hover:bg-vortex-violet/90 active:bg-vortex-violet/80',
  secondary:
    'bg-zinc-800 text-white hover:bg-zinc-700 active:bg-zinc-600 border border-zinc-700',
  ghost:
    'bg-transparent text-white hover:bg-white/10 active:bg-white/20',
  danger:
    'bg-red-600 text-white hover:bg-red-500 active:bg-red-700',
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm gap-1.5 rounded-lg min-h-[32px]',
  md: 'px-4 py-2 text-base gap-2 rounded-xl min-h-[40px]',
  lg: 'px-6 py-3 text-lg gap-2.5 rounded-2xl min-h-[48px]',
}

const iconSizeClasses = {
  sm: '[&_svg]:w-4 [&_svg]:h-4',
  md: '[&_svg]:w-5 [&_svg]:h-5',
  lg: '[&_svg]:w-6 [&_svg]:h-6',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      disabled,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading

    return (
      <motion.button
        ref={ref}
        type="button"
        disabled={isDisabled}
        className={`
          inline-flex items-center justify-center
          font-medium
          transition-colors duration-200
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${iconSizeClasses[size]}
          ${fullWidth ? 'w-full' : ''}
          ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${className}
        `}
        whileTap={isDisabled ? undefined : { scale: 0.97 }}
        transition={{
          type: 'spring',
          stiffness: SPRING.DEFAULT.stiffness,
          damping: SPRING.DEFAULT.damping,
        }}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="animate-spin" />
        ) : leftIcon ? (
          leftIcon
        ) : null}
        
        <span className={isLoading ? 'opacity-0' : ''}>{children}</span>
        
        {!isLoading && rightIcon}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'

