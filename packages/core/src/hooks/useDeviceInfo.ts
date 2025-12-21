/**
 * useDeviceInfo hook - Get device information
 */

import { useState, useEffect } from 'react'
import {
  isMobile,
  isIOS,
  supportsNativeHLS,
  isTouchDevice,
  getDevicePixelRatio,
  getViewport,
  prefersReducedMotion,
} from '../utils/device'

interface DeviceInfo {
  isMobile: boolean
  isIOS: boolean
  supportsNativeHLS: boolean
  isTouchDevice: boolean
  devicePixelRatio: number
  viewport: { width: number; height: number }
  prefersReducedMotion: boolean
}

export function useDeviceInfo(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() => ({
    isMobile: false,
    isIOS: false,
    supportsNativeHLS: false,
    isTouchDevice: false,
    devicePixelRatio: 1,
    viewport: { width: 0, height: 0 },
    prefersReducedMotion: false,
  }))

  useEffect(() => {
    // Update device info on client side
    const updateDeviceInfo = () => {
      setDeviceInfo({
        isMobile: isMobile(),
        isIOS: isIOS(),
        supportsNativeHLS: supportsNativeHLS(),
        isTouchDevice: isTouchDevice(),
        devicePixelRatio: getDevicePixelRatio(),
        viewport: getViewport(),
        prefersReducedMotion: prefersReducedMotion(),
      })
    }

    updateDeviceInfo()

    // Update on resize
    const handleResize = () => {
      setDeviceInfo((prev) => ({
        ...prev,
        viewport: getViewport(),
      }))
    }

    // Update on reduced motion preference change
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleMotionChange = () => {
      setDeviceInfo((prev) => ({
        ...prev,
        prefersReducedMotion: prefersReducedMotion(),
      }))
    }

    window.addEventListener('resize', handleResize)
    mediaQuery.addEventListener('change', handleMotionChange)

    return () => {
      window.removeEventListener('resize', handleResize)
      mediaQuery.removeEventListener('change', handleMotionChange)
    }
  }, [])

  return deviceInfo
}

