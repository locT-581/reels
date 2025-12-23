'use client';

import type { CSSPanSlideProps } from './types';
import React, { memo } from 'react';

/**
 * CSSPanSlide - Component con của CSSPanSwiper
 *
 * Lưu ý: Component này chỉ là marker/wrapper.
 * Việc render thực sự được xử lý bởi CSSPanSwiper parent.
 *
 * Props được truyền qua sẽ được CSSPanSwiper đọc và apply.
 */
function CSSPanSlideComponent({ children }: CSSPanSlideProps) {
  return (
    <>{children}</>
  );
}

export const CSSPanSlide = memo(CSSPanSlideComponent);
CSSPanSlide.displayName = 'CSSPanSlide';
