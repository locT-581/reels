'use client';

import type { CSSPanSwiperRef, Direction, VirtualConfig } from './types';
import { useCallback, useEffect, useRef, useState } from 'react';

type UseCSSPanSwiperOptions = {
  direction: Direction;
  initialSlide: number;
  allowTouchMove: boolean;
  totalSlides: number;
  scrollEndDebounce: number;
  speed?: number; // Custom animation speed in ms (for programmatic scroll)
  onSlideChange?: (index: number) => void;
  onScrollEnd?: (index: number) => void;
};

/**
 * Custom smooth scroll với tốc độ tùy chỉnh
 * Sử dụng easeOutCubic cho animation tự nhiên
 */
function customSmoothScroll(
  element: HTMLElement,
  targetPosition: number,
  duration: number,
  isVertical: boolean,
): Promise<void> {
  return new Promise((resolve) => {
    const startPosition = isVertical ? element.scrollTop : element.scrollLeft;
    const distance = targetPosition - startPosition;
    const startTime = performance.now();

    // easeOutCubic - natural deceleration
    const easeOutCubic = (t: number): number => 1 - (1 - t) ** 3;

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);
      const currentPosition = startPosition + (distance * easedProgress);

      if (isVertical) {
        element.scrollTop = currentPosition;
      } else {
        element.scrollLeft = currentPosition;
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        resolve();
      }
    }

    requestAnimationFrame(animate);
  });
}

export function useCSSPanSwiper(options: UseCSSPanSwiperOptions) {
  const {
    direction,
    initialSlide,
    allowTouchMove,
    totalSlides,
    scrollEndDebounce,
    speed, // Custom speed for programmatic scroll
    onSlideChange,
    onScrollEnd,
  } = options;

  const containerRef = useRef<HTMLDivElement>(null);
  const allowTouchMoveRef = useRef(allowTouchMove);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevActiveIndexRef = useRef(initialSlide);
  const isInitializedRef = useRef(false);
  const isProgrammaticScrollRef = useRef(false);

  const [activeIndex, setActiveIndex] = useState(initialSlide);

  // Sync prop với ref
  useEffect(() => {
    allowTouchMoveRef.current = allowTouchMove;

    if (containerRef.current) {
      // Dynamically enable/disable touch scrolling
      if (allowTouchMove) {
        containerRef.current.style.overflowY = direction === 'vertical' ? 'scroll' : 'hidden';
        containerRef.current.style.overflowX = direction === 'horizontal' ? 'scroll' : 'hidden';
      } else {
        containerRef.current.style.overflow = 'hidden';
      }
    }
  }, [allowTouchMove, direction]);

  // Calculate current slide index from scroll position
  const calculateActiveIndex = useCallback(() => {
    const container = containerRef.current;
    if (!container) return 0;

    const isVertical = direction === 'vertical';
    const scrollPos = isVertical ? container.scrollTop : container.scrollLeft;
    const slideSize = isVertical ? container.clientHeight : container.clientWidth;

    if (slideSize === 0) return 0;

    return Math.round(scrollPos / slideSize);
  }, [direction]);

  // Slide to specific index using native scroll or custom animation
  // customSpeed: number in ms (overrides default speed prop)
  // behavior: 'smooth' | 'instant' | 'auto' (ignored if customSpeed is provided)
  const slideTo = useCallback((index: number, behaviorOrSpeed: ScrollBehavior | number = 'smooth') => {
    const container = containerRef.current;
    if (!container) return;

    const clampedIndex = Math.max(0, Math.min(index, totalSlides - 1));
    const isVertical = direction === 'vertical';
    const slideSize = isVertical ? container.clientHeight : container.clientWidth;
    const targetPosition = clampedIndex * slideSize;

    isProgrammaticScrollRef.current = true;

    // Update state immediately for programmatic navigation
    setActiveIndex(clampedIndex);
    if (prevActiveIndexRef.current !== clampedIndex) {
      prevActiveIndexRef.current = clampedIndex;
      onSlideChange?.(clampedIndex);
    }

    // Determine animation duration
    const customSpeed = typeof behaviorOrSpeed === 'number' ? behaviorOrSpeed : speed;

    if (customSpeed && customSpeed > 0) {
      // Use custom smooth scroll with specific duration
      customSmoothScroll(container, targetPosition, customSpeed, isVertical).then(() => {
        isProgrammaticScrollRef.current = false;
      });
    } else {
      // Use native scroll behavior
      const behavior = typeof behaviorOrSpeed === 'string' ? behaviorOrSpeed : 'smooth';
      container.scrollTo({
        [isVertical ? 'top' : 'left']: targetPosition,
        behavior,
      });

      // Reset programmatic scroll flag after animation
      setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, behavior === 'smooth' ? 350 : 50);
    }
  }, [direction, totalSlides, speed, onSlideChange]);

  const slideNext = useCallback((behaviorOrSpeed: ScrollBehavior | number = 'smooth') => {
    if (activeIndex < totalSlides - 1) {
      slideTo(activeIndex + 1, behaviorOrSpeed);
    }
  }, [activeIndex, totalSlides, slideTo]);

  const slidePrev = useCallback((behaviorOrSpeed: ScrollBehavior | number = 'smooth') => {
    if (activeIndex > 0) {
      slideTo(activeIndex - 1, behaviorOrSpeed);
    }
  }, [activeIndex, slideTo]);

  // Handle scroll events with debounce for scroll end detection
  const handleScroll = useCallback(() => {
    // Skip if programmatic scroll
    if (isProgrammaticScrollRef.current) return;

    const newIndex = calculateActiveIndex();

    // Update active index immediately during scroll
    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);

      // Fire onSlideChange when index changes
      if (prevActiveIndexRef.current !== newIndex) {
        prevActiveIndexRef.current = newIndex;
        onSlideChange?.(newIndex);
      }
    }

    // Debounce scroll end detection
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      const finalIndex = calculateActiveIndex();
      onScrollEnd?.(finalIndex);
    }, scrollEndDebounce);
  }, [calculateActiveIndex, activeIndex, scrollEndDebounce, onSlideChange, onScrollEnd]);

  // Setup scroll listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [handleScroll]);

  // Initial scroll to initialSlide
  useEffect(() => {
    if (isInitializedRef.current) return;

    const container = containerRef.current;
    if (!container) return;

    // Wait for DOM to be ready
    requestAnimationFrame(() => {
      if (initialSlide > 0) {
        slideTo(initialSlide, 'instant');
      }
      isInitializedRef.current = true;
    });
  }, [initialSlide, slideTo]);

  // Swiper API
  const swiperRef: CSSPanSwiperRef = {
    slideTo,
    slideNext,
    slidePrev,
    activeIndex,
    totalSlides,
    isEnd: activeIndex === totalSlides - 1,
    isBeginning: activeIndex === 0,
    get allowTouchMove() {
      return allowTouchMoveRef.current;
    },
    set allowTouchMove(value: boolean) {
      allowTouchMoveRef.current = value;
      if (containerRef.current) {
        if (value) {
          containerRef.current.style.overflowY = direction === 'vertical' ? 'scroll' : 'hidden';
          containerRef.current.style.overflowX = direction === 'horizontal' ? 'scroll' : 'hidden';
        } else {
          containerRef.current.style.overflow = 'hidden';
        }
      }
    },
    containerEl: containerRef.current,
  };

  return {
    containerRef,
    activeIndex,
    swiperRef,
  };
}

export function getVirtualSlideRange(
  activeIndex: number,
  totalSlides: number,
  config: VirtualConfig,
): { start: number; end: number } {
  const before = config.addSlidesBefore ?? 2;
  const after = config.addSlidesAfter ?? 2;

  // Tính initial range
  let start = activeIndex - before;
  let end = activeIndex + after;

  // Điều chỉnh nếu start < 0: mở rộng end để bù
  if (start < 0) {
    end = Math.min(totalSlides - 1, end + Math.abs(start));
    start = 0;
  }

  // Điều chỉnh nếu end >= totalSlides: mở rộng start để bù
  if (end >= totalSlides) {
    start = Math.max(0, start - (end - (totalSlides - 1)));
    end = totalSlides - 1;
  }

  return { start, end };
}
