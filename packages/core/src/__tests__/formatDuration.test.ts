/**
 * Tests for formatDuration utility
 */

import { describe, it, expect } from 'vitest'
import { formatDuration } from '../utils/format'

describe('formatDuration', () => {
  describe('seconds only (< 60s)', () => {
    it('should format 0 seconds', () => {
      expect(formatDuration(0)).toBe('0:00')
    })

    it('should format single digit seconds with padding', () => {
      expect(formatDuration(1)).toBe('0:01')
      expect(formatDuration(5)).toBe('0:05')
      expect(formatDuration(9)).toBe('0:09')
    })

    it('should format double digit seconds', () => {
      expect(formatDuration(10)).toBe('0:10')
      expect(formatDuration(30)).toBe('0:30')
      expect(formatDuration(59)).toBe('0:59')
    })
  })

  describe('minutes and seconds', () => {
    it('should format exactly 1 minute', () => {
      expect(formatDuration(60)).toBe('1:00')
    })

    it('should format minutes with seconds', () => {
      expect(formatDuration(65)).toBe('1:05')
      expect(formatDuration(90)).toBe('1:30')
      expect(formatDuration(125)).toBe('2:05')
    })

    it('should format large minutes', () => {
      expect(formatDuration(600)).toBe('10:00')
      expect(formatDuration(3599)).toBe('59:59')
    })
  })

  describe('hours, minutes and seconds', () => {
    it('should format exactly 1 hour', () => {
      expect(formatDuration(3600)).toBe('1:00:00')
    })

    it('should format hours with minutes and seconds', () => {
      expect(formatDuration(3661)).toBe('1:01:01')
      expect(formatDuration(3723)).toBe('1:02:03')
      expect(formatDuration(7200)).toBe('2:00:00')
    })

    it('should format large hours', () => {
      expect(formatDuration(36000)).toBe('10:00:00')
      expect(formatDuration(86399)).toBe('23:59:59')
    })
  })

  describe('edge cases', () => {
    it('should handle decimal seconds by flooring', () => {
      expect(formatDuration(1.5)).toBe('0:01')
      expect(formatDuration(59.9)).toBe('0:59')
      expect(formatDuration(60.1)).toBe('1:00')
    })
  })
})
