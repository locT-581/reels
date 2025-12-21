/**
 * Vortex Design System - Tailwind Preset
 *
 * Mobile-first, video-centric design system
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      // Vortex Color Palette
      colors: {
        vortex: {
          black: '#000000',
          violet: '#8B5CF6',
          red: '#FF2D55',
          white: '#FFFFFF',
        },
        // Extended palette for UI elements
        surface: {
          primary: '#000000',
          secondary: '#0A0A0A',
          tertiary: '#141414',
          elevated: '#1A1A1A',
        },
      },

      // 8pt Spacing System
      spacing: {
        '0.5': '4px',
        '1': '8px',
        '1.5': '12px',
        '2': '16px',
        '2.5': '20px',
        '3': '24px',
        '4': '32px',
        '5': '40px',
        '6': '48px',
        '8': '64px',
        '10': '80px',
        '12': '96px',
        '16': '128px',
        // Safe area
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },

      // Border Radius
      borderRadius: {
        'vortex': '16px',
        'vortex-lg': '24px',
        'vortex-xl': '32px',
      },

      // Custom Easing
      transitionTimingFunction: {
        'vortex': 'cubic-bezier(0.32, 0.72, 0, 1)',
        'bounce-out': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },

      // Animation Duration
      transitionDuration: {
        'vortex': '300ms',
        'fast': '150ms',
        'slow': '500ms',
      },

      // Z-Index Scale
      zIndex: {
        'video': '0',
        'controls': '10',
        'overlay': '20',
        'header': '30',
        'sheet': '40',
        'modal': '50',
        'toast': '60',
        'tooltip': '70',
      },

      // Font Family (use system fonts for performance)
      fontFamily: {
        sans: [
          'Inter',
          'SF Pro Display',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },

      // Font Size Scale
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },

      // Box Shadow
      boxShadow: {
        'vortex': '0 8px 32px rgba(0, 0, 0, 0.5)',
        'glow-violet': '0 0 20px rgba(139, 92, 246, 0.3)',
        'glow-red': '0 0 20px rgba(255, 45, 85, 0.3)',
      },

      // Backdrop Blur
      backdropBlur: {
        'vortex': '24px',
      },

      // Custom Animations
      animation: {
        'shimmer': 'shimmer 2s infinite linear',
        'pulse-slow': 'pulse 3s infinite',
        'bounce-in': 'bounce-in 0.5s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
      },

      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'bounce-in': {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },

      // Aspect Ratio
      aspectRatio: {
        'video': '9 / 16',
        'thumbnail': '16 / 9',
      },

      // Min Height for tap targets
      minHeight: {
        'tap': '48px',
      },
      minWidth: {
        'tap': '48px',
      },

      // Safe area heights
      height: {
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'screen-safe': 'calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))',
      },
    },
  },

  plugins: [
    // Custom utilities
    function({ addUtilities }) {
      addUtilities({
        // Text shadow for video overlays
        '.text-video-overlay': {
          'text-shadow': '0 2px 4px rgba(0, 0, 0, 0.8)',
        },
        // Hide scrollbar
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        // Touch action utilities
        '.touch-pan-y': {
          'touch-action': 'pan-y',
        },
        '.touch-pan-x': {
          'touch-action': 'pan-x',
        },
        // GPU acceleration
        '.gpu': {
          'transform': 'translateZ(0)',
          'backface-visibility': 'hidden',
        },
        // Safe area padding
        '.pt-safe': {
          'padding-top': 'env(safe-area-inset-top)',
        },
        '.pb-safe': {
          'padding-bottom': 'env(safe-area-inset-bottom)',
        },
        '.pl-safe': {
          'padding-left': 'env(safe-area-inset-left)',
        },
        '.pr-safe': {
          'padding-right': 'env(safe-area-inset-right)',
        },
      })
    },
  ],
}

