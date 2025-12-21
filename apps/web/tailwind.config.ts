import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    '../../packages/*/src/**/*.{ts,tsx}',
  ],
  theme: {
    screens: {
      // Mobile-first, only define breakpoints when NEEDED for desktop
      tablet: '768px',
      desktop: '1024px', // Rarely used
    },
    extend: {
      colors: {
        // Vortex Design System
        'vortex-black': '#000000',
        'vortex-violet': '#8B5CF6',
        'vortex-red': '#FF2D55',
        'vortex-gray': '#8E8E93',
      },
      spacing: {
        // 8pt grid system (8, 16, 24, 32, 40, 48...)
        // Safe area insets for mobile
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      borderRadius: {
        // Large border radius for friendly, modern feel
        '2xl': '16px',
        '3xl': '24px',
      },
      transitionTimingFunction: {
        // Vortex easing curve
        vortex: 'cubic-bezier(0.32, 0.72, 0, 1)',
      },
      transitionDuration: {
        // Default transition duration
        DEFAULT: '300ms',
      },
      animation: {
        'fade-in': 'fadeIn 300ms ease-vortex',
        'fade-out': 'fadeOut 300ms ease-vortex',
        'slide-up': 'slideUp 300ms ease-vortex',
        'slide-down': 'slideDown 300ms ease-vortex',
        'scale-in': 'scaleIn 200ms ease-vortex',
        shimmer: 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(100%)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        shimmer:
          'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
      },
    },
  },
  plugins: [],
}

export default config

