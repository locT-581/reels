/**
 * createXHubReelEmbed - Factory function for creating embed instances
 * For use in non-React environments (script tag integration)
 */

import { createElement } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { XHubReelEmbed, type XHubReelEmbedProps } from './XHubReelEmbed'

export interface XHubReelEmbedOptions extends Omit<XHubReelEmbedProps, 'className'> {
  container: HTMLElement | string
}

export interface XHubReelEmbedInstance {
  updateVideos: (videos: XHubReelEmbedProps['videos']) => void
  destroy: () => void
}

export function createXHubReelEmbed(options: XHubReelEmbedOptions): XHubReelEmbedInstance {
  const { container, ...props } = options

  // Get container element
  const containerElement =
    typeof container === 'string' ? document.querySelector(container) : container

  if (!containerElement || !(containerElement instanceof HTMLElement)) {
    throw new Error('[XHubReelEmbed] Invalid container element')
  }

  // Create React root
  const root: Root = createRoot(containerElement)
  let currentProps = props

  // Render function
  const render = (newProps: Omit<XHubReelEmbedProps, 'className'>) => {
    currentProps = newProps
    root.render(createElement(XHubReelEmbed, newProps))
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
  ;(window as unknown as { XHubReel: typeof createXHubReelEmbed }).XHubReel = createXHubReelEmbed
}

