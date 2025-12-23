/**
 * Power Manager Service
 * Monitors battery status and provides power-saving recommendations
 */

export interface PowerInfo {
  batteryLevel: number | null
  isCharging: boolean
  isLowPowerMode: boolean
}

export interface PowerManagerCallbacks {
  onPowerChange?: (info: PowerInfo) => void
  onLowBattery?: () => void
}

interface BatteryManager extends EventTarget {
  level: number
  charging: boolean
}

export class PowerManager {
  private callbacks: PowerManagerCallbacks = {}
  private currentInfo: PowerInfo = {
    batteryLevel: null,
    isCharging: false,
    isLowPowerMode: false,
  }
  private battery: BatteryManager | null = null

  constructor() {
    this.initBattery()
  }

  private async initBattery(): Promise<void> {
    try {
      const nav = navigator as Navigator & { getBattery?: () => Promise<BatteryManager> }
      if (nav.getBattery) {
        this.battery = await nav.getBattery()
        this.updateInfo()
        this.setupListeners()
      }
    } catch {
      // Battery API not supported
    }
  }

  private updateInfo(): void {
    if (this.battery) {
      this.currentInfo = {
        batteryLevel: this.battery.level,
        isCharging: this.battery.charging,
        isLowPowerMode: this.battery.level < 0.2,
      }
      this.callbacks.onPowerChange?.(this.currentInfo)

      if (this.currentInfo.batteryLevel !== null && this.currentInfo.batteryLevel < 0.15) {
        this.callbacks.onLowBattery?.()
      }
    }
  }

  private setupListeners(): void {
    if (this.battery) {
      this.battery.addEventListener('levelchange', () => this.updateInfo())
      this.battery.addEventListener('chargingchange', () => this.updateInfo())
    }
  }

  subscribe(callbacks: PowerManagerCallbacks): () => void {
    this.callbacks = { ...this.callbacks, ...callbacks }
    return () => {
      this.callbacks = {}
    }
  }

  getInfo(): PowerInfo {
    return this.currentInfo
  }

  isPowerSaving(): boolean {
    return this.currentInfo.isLowPowerMode && !this.currentInfo.isCharging
  }

  getRecommendedConfig(): Record<string, unknown> {
    if (this.isPowerSaving()) {
      return {
        maxBufferLength: 15,
        capLevelToPlayerSize: true,
      }
    }
    return {}
  }

  destroy(): void {
    this.callbacks = {}
  }
}

export function createPowerManager(): PowerManager {
  return new PowerManager()
}

