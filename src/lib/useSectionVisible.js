'use client';

import { useEffect, useState } from 'react';

/**
 * Returns true when the observed element intersects the viewport.
 * Use to pause canvas/WebGL loops when a section is off-screen.
 */
export function useSectionVisible(ref, { rootMargin = '80px 0px', threshold = 0.01, initial = false } = {}) {
  const [isVisible, setIsVisible] = useState(initial);

  useEffect(() => {
    const el = ref?.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin, threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, rootMargin, threshold]);

  return isVisible;
}
