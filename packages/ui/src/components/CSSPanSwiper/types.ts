export type Direction = 'horizontal' | 'vertical';

export type CSSPanSwiperRef = {
  /**
   * Slide đến index cụ thể
   * @param index - Target slide index
   * @param behaviorOrSpeed - ScrollBehavior ('smooth' | 'instant') hoặc custom speed (ms)
   */
  slideTo: (index: number, behaviorOrSpeed?: ScrollBehavior | number) => void;
  /**
   * Slide đến slide tiếp theo
   * @param behaviorOrSpeed - ScrollBehavior hoặc custom speed (ms)
   */
  slideNext: (behaviorOrSpeed?: ScrollBehavior | number) => void;
  /**
   * Slide đến slide trước
   * @param behaviorOrSpeed - ScrollBehavior hoặc custom speed (ms)
   */
  slidePrev: (behaviorOrSpeed?: ScrollBehavior | number) => void;
  /** Index hiện tại */
  activeIndex: number;
  /** Tổng số slides */
  totalSlides: number;
  /** Đang ở slide cuối? */
  isEnd: boolean;
  /** Đang ở slide đầu? */
  isBeginning: boolean;
  /** Cho phép touch/swipe - có thể thay đổi runtime */
  allowTouchMove: boolean;
  /** Container element ref */
  containerEl: HTMLDivElement | null;
};

export type VirtualConfig = {
  /** Bật virtual slides */
  enabled?: boolean;
  /** Số slides render trước active slide */
  addSlidesBefore?: number;
  /** Số slides render sau active slide */
  addSlidesAfter?: number;
};

export type CSSPanSwiperProps = {
  /** Hướng swipe */
  direction?: Direction;
  /** Index ban đầu */
  initialSlide?: number;
  /** Cho phép touch/swipe */
  allowTouchMove?: boolean;
  /** Cấu hình virtual slides */
  virtual?: VirtualConfig | boolean;
  /**
   * Tốc độ animation mặc định cho programmatic scroll (ms)
   * Nếu set, sẽ sử dụng custom JS animation thay vì native scroll
   * Lưu ý: Chỉ ảnh hưởng đến slideTo/slideNext/slidePrev, KHÔNG ảnh hưởng đến user swipe
   */
  speed?: number;
  /** Class cho container */
  className?: string;
  /** Style cho container */
  style?: React.CSSProperties;
  /** Callback khi swiper được mount */
  onSwiper?: (swiper: CSSPanSwiperRef) => void;
  /** Callback khi slide change */
  onSlideChange?: (index: number) => void;
  /** Callback khi scroll kết thúc (debounced) */
  onScrollEnd?: (index: number) => void;
  /** Children (CSSPanSlide components) */
  children: React.ReactNode;
  /** Debounce time for scroll end detection (ms) */
  scrollEndDebounce?: number;
};

export type CSSPanSlideProps = {
  /** Index cho virtual slides */
  virtualIndex?: number;
  /** Class cho slide */
  className?: string;
  /** Style cho slide */
  style?: React.CSSProperties;
  /** ID cho slide */
  id?: string;
  /** Children content */
  children: React.ReactNode;
};

// Internal context type
export type SwiperContextValue = {
  activeIndex: number;
  direction: Direction;
  virtualConfig: VirtualConfig | null;
};
