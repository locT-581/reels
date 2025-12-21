/**
 * createVortexEmbed - Factory function for creating embed instances
 * For use in non-React environments (script tag integration)
 */

import { createElement } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { VortexEmbed, type VortexEmbedProps } from './VortexEmbed'

export interface VortexEmbedOptions extends Omit<VortexEmbedProps, 'className'> {
  container: HTMLElement | string
}

export interface VortexEmbedInstance {
  updateVideos: (videos: VortexEmbedProps['videos']) => void
  destroy: () => void
}

export function createVortexEmbed(options: VortexEmbedOptions): VortexEmbedInstance {
  const { container, ...props } = options

  // Get container element
  const containerElement =
    typeof container === 'string' ? document.querySelector(container) : container

  if (!containerElement || !(containerElement instanceof HTMLElement)) {
    throw new Error('[VortexEmbed] Invalid container element')
  }

  // Create React root
  const root: Root = createRoot(containerElement)
  let currentProps = props

  // Render function
  const render = (newProps: Omit<VortexEmbedProps, 'className'>) => {
    currentProps = newProps
    root.render(createElement(VortexEmbed, newProps))
  }

  // Initial render
  render(props)

  return {
    updateVideos: (videos) => {
      render({ ...currentProps, videos })
    },
    destroy: () => {
      root.unmount()
    },
  }
}

// Global initialization for script tag usage
if (typeof window !== 'undefined') {
  ;(window as unknown as { VortexStream: typeof createVortexEmbed }).VortexStream = createVortexEmbed
}

