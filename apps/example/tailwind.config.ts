import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
    '../../packages/player/src/**/*.{js,ts,jsx,tsx}',
    '../../packages/feed/src/**/*.{js,ts,jsx,tsx}',
    '../../packages/gestures/src/**/*.{js,ts,jsx,tsx}',
  ],
  presets: [require('@vortex/ui/tailwind.preset')],
  theme: {
    extend: {
      // Additional custom theme extensions
    },
  },
}

export default config

