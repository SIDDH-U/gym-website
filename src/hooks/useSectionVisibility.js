import { useEffect, useRef, useState } from 'react';

/**
 * Hook to observe section visibility and set data-visible="true"|"false" on the element.
 * Enables CSS offscreen animation pause:
 * [data-visible="false"] *, [data-visible="false"]::before, [data-visible="false"]::after {
 *   animation-play-state: paused !important;
 * }
 */
export function useSectionVisibility(options = { threshold: 0.05, rootMargin: '100px 0px' }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(([entry]) => {
      const visible = entry.isIntersecting;
      setIsVisible(visible);
      if (el) {
        el.setAttribute('data-visible', visible ? 'true' : 'false');
      }
    }, options);

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [options.threshold, options.rootMargin]);

  return [ref, isVisible];
}
