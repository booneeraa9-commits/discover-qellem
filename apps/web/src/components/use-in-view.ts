"use client";

import { useEffect, useRef, useState } from "react";

export interface UseInViewOptions {
  /** Whether to keep the element "in view" after the first intersection. Default true. */
  once?: boolean;
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
}

export interface UseInViewResult<T extends Element> {
  ref: React.RefObject<T | null>;
  isInView: boolean;
}

/**
 * IntersectionObserver wrapper: returns a ref to attach to an element and a
 * boolean that flips to true when the element scrolls into view. Falls back to
 * "immediately visible" when IntersectionObserver is unavailable.
 */
export function useInView<T extends Element>(options: UseInViewOptions = {}): UseInViewResult<T> {
  const { once = true, threshold = 0.1, root = null, rootMargin = "0px" } = options;
  const ref = useRef<T | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      // Mark visible on the next frame (callback, not effect body, so it does
      // not trip react-hooks/set-state-in-effect).
      const raf = requestAnimationFrame(() => setIsInView(true));
      return () => cancelAnimationFrame(raf);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsInView(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setIsInView(false);
          }
        }
      },
      { threshold, root, rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once, threshold, root, rootMargin]);

  return { ref, isInView };
}
