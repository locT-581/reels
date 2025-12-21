/**
 * Tests for formatCount utility
 */

import { describe, it, expect } from 'vitest'
import { formatCount } from '../utils/format'

describe('formatCount', () => {
  describe('numbers less than 1000', () => {
    it('should return the number as is', () => {
      expect(formatCount(0)).toBe('0')
      expect(formatCount(1)).toBe('1')
      expect(formatCount(100)).toBe('100')
      expect(formatCount(999)).toBe('999')
    })
  })

  describe('thousands (K)', () => {
    it('should format exactly 1000 as 1.0K', () => {
      expect(formatCount(1000)).toBe('1.0K')
    })

    it('should format numbers between 1000-10000 with one decimal', () => {
      expect(formatCount(1500)).toBe('1.5K')
      expect(formatCount(2300)).toBe('2.3K')
      expect(formatCount(9900)).toBe('9.9K')
    })

    it('should format numbers 10000+ without decimal', () => {
      expect(formatCount(10000)).toBe('10K')
      expect(formatCount(50000)).toBe('50K')
      expect(formatCount(100000)).toBe('100K')
      expect(formatCount(500000)).toBe('500K')
      expect(formatCount(999000)).toBe('999K')
    })
  })

  describe('millions (M)', () => {
    it('should format millions with one decimal', () => {
      expect(formatCount(1000000)).toBe('1.0M')
      expect(formatCount(1500000)).toBe('1.5M')
      expect(formatCount(2300000)).toBe('2.3M')
      expect(formatCount(10000000)).toBe('10.0M')
    })
  })

  describe('edge cases', () => {
    it('should handle decimal input by flooring', () => {
      expect(formatCount(1234.56)).toBe('1.2K')
    })
  })
})
