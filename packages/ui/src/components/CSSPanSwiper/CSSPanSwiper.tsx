'use client';

import type { CSSPanSlideProps, CSSPanSwiperProps, SwiperContextValue, VirtualConfig } from './types';
import React, {
  Children,
  createContext,
  isValidElement,
  use,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { getVirtualSlideRange, useCSSPanSwiper } from './useCSSPanSwiper';
import './styles.css';

// Context để chia sẻ state giữa Swiper và Slide
const SwiperContext = createContext<SwiperContextValue | null>(null);

export function useSwiperContext() {
  const context = use(SwiperContext);
  if (!context) {
    throw new Error('CSSPanSlide must be used within CSSPanSwiper');
  }
  return context;
}

/**
 * CSSPanSwiper - High-performance swiper using native CSS scroll snap
 *
 * Ưu điểm so với LiteSwiper:
 * - Native scrolling: Browser xử lý scroll ở native level (60fps+)
 * - Không cần touch event handlers -> không block main thread
 * - GPU-accelerated scroll -> smoother animations
 * - CSS scroll-snap -> automatic snapping without JS
 * - Momentum scrolling tự nhiên như native app
 *
 * Nhược điểm:
 * - Ít control hơn về custom animations
 * - Khó implement resistance effect ở edges
 * - Behavior có thể khác nhau giữa các browsers
 */
export function CSSPanSwiper({
  direction = 'horizontal',
  initialSlide = 0,
  allowTouchMove = true,
  virtual,
  speed,
  className = '',
  style,
  onSwiper,
  onSlideChange,
  onScrollEnd,
  scrollEndDebounce = 150,
  children,
}: CSSPanSwiperProps) {
  // Memoize childArray để tránh re-render không cần thiết
  const childArray = useMemo(() => Children.toArray(children), [children]);
  const totalSlides = childArray.length;

  // Debug refs
  const prevTotalRef = useRef(totalSlides);
  const prevRangeRef = useRef({ start: -1, end: -1 });

  // Parse virtual config
  const virtualConfig: VirtualConfig | null = useMemo(() => {
    if (!virtual) return null;
    if (virtual === true) {
      return { enabled: true, addSlidesBefore: 2, addSlidesAfter: 2 };
    }
    return { enabled: true, ...virtual };
  }, [virtual]);

  const {
    containerRef,
    activeIndex,
    swiperRef,
  } = useCSSPanSwiper({
    direction,
    initialSlide,
    allowTouchMove,
    totalSlides,
    scrollEndDebounce,
    speed,
    onSlideChange,
    onScrollEnd,
  });

  // Expose swiper API
  useEffect(() => {
    onSwiper?.(swiperRef);
  }, [onSwiper, swiperRef]);

  // Update swiper ref khi activeIndex thay đổi
  useEffect(() => {
    onSwiper?.(swiperRef);
  }, [activeIndex, swiperRef, onSwiper]);

  // Context value
  const contextValue: SwiperContextValue = useMemo(() => ({
    activeIndex,
    direction,
    virtualConfig,
  }), [activeIndex, direction, virtualConfig]);

  // Render slides với virtual support
  const renderedSlides = useMemo(() => {
    if (!virtualConfig?.enabled) {
      // Không có virtual - render tất cả
      return childArray.map((child, index) => {
        if (!isValidElement<CSSPanSlideProps>(child)) return null;

        return (
          <div
            key={child.props.virtualIndex ?? index}
            className={`css-pan-slide ${child.props.className || ''}`}
            id={child.props.id}
            style={{
              ...child.props.style,
              // Critical: Mỗi slide chiếm 100% viewport
              flexShrink: 0,
              width: direction === 'horizontal' ? '100%' : undefined,
              height: direction === 'vertical' ? '100%' : undefined,
              // Scroll snap alignment
              scrollSnapAlign: 'start',
              scrollSnapStop: 'always',
            }}
          >
            {child.props.children}
          </div>
        );
      });
    }

    // Virtual rendering - chỉ render slides trong range
    const { start, end } = getVirtualSlideRange(activeIndex, totalSlides, virtualConfig);

    // Debug: chỉ log khi range hoặc totalSlides thực sự thay đổi
    if (prevRangeRef.current.start !== start || prevRangeRef.current.end !== end || prevTotalRef.current !== totalSlides) {
      prevRangeRef.current = { start, end };
      prevTotalRef.current = totalSlides;
    }

    return childArray.map((child, index) => {
      if (!isValidElement<CSSPanSlideProps>(child)) return null;

      const virtualIndex = child.props.virtualIndex ?? index;
      const isInRange = virtualIndex >= start && virtualIndex <= end;

      // Render placeholder cho slides ngoài range
      // QUAN TRỌNG: Placeholder vẫn cần giữ kích thước để scroll position đúng
      if (!isInRange) {
        return (
          <div
            key={virtualIndex}
            className="css-pan-slide css-pan-slide--virtual-placeholder"
            style={{
              flexShrink: 0,
              width: direction === 'horizontal' ? '100%' : undefined,
              height: direction === 'vertical' ? '100%' : undefined,
              scrollSnapAlign: 'start',
              scrollSnapStop: 'always',
            }}
          />
        );
      }

      return (
        <div
          key={virtualIndex}
          className={`css-pan-slide ${child.props.className || ''}`}
          id={child.props.id}
          style={{
            ...child.props.style,
            flexShrink: 0,
            width: direction === 'horizontal' ? '100%' : undefined,
            height: direction === 'vertical' ? '100%' : undefined,
            scrollSnapAlign: 'start',
            scrollSnapStop: 'always',
          }}
        >
          {child.props.children}
        </div>
      );
    });
  }, [childArray, virtualConfig, activeIndex, totalSlides, direction]);

  const isVertical = direction === 'vertical';

  return (
    <SwiperContext value={contextValue}>
      <div
        ref={containerRef}
        className={`css-pan-swiper ${className}`}
        style={{
          // Container styles
          position: 'relative',
          width: '100%',
          height: '100%',

          // Scrolling setup - key for performance
          overflowX: !allowTouchMove ? 'hidden' : (isVertical ? 'hidden' : 'scroll'),
          overflowY: !allowTouchMove ? 'hidden' : (isVertical ? 'scroll' : 'hidden'),

          // Hide scrollbar but keep functionality
          scrollbarWidth: 'none', // Firefox
          msOverflowStyle: 'none', // IE/Edge

          // CSS Scroll Snap - the magic sauce!
          scrollSnapType: isVertical ? 'y mandatory' : 'x mandatory',

          // iOS smooth scrolling
          WebkitOverflowScrolling: 'touch',

          // Prevent overscroll bounce (optional - improves UX)
          overscrollBehavior: 'contain',

          // Display as flex for slide layout
          display: 'flex',
          flexDirection: isVertical ? 'column' : 'row',

          // User provided styles
          ...style,
        }}
      >
        {renderedSlides}
      </div>
    </SwiperContext>
  );
}
