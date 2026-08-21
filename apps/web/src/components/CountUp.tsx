"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "./use-in-view";

export interface CountUpProps {
  to: number;
  /** Animation duration in ms. */
  duration?: number;
  /** Text appended after the number, e.g. " km²". */
  suffix?: string;
  /** Format with thousands separators (1,254,817). Default true. */
  format?: boolean;
}

/**
 * Counts from 0 to `to` over `duration` once it scrolls into view, easing
 * out cubic. Respects prefers-reduced-motion by jumping straight to the
 * final value.
 */
export function CountUp({ to, duration = 1200, suffix = "", format = true }: CountUpProps) {
  const { ref, isInView } = useInView<HTMLSpanElement>();
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!isInView || started.current) return;
    started.current = true;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = reduced ? 1 : Math.min(1, (now - start) / duration);
      const eased = reduced ? 1 : 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(to * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isInView, to, duration]);

  const text = format ? value.toLocaleString("en-US") : String(value);

  return (
    <span ref={ref}>
      {text}
      {suffix}
    </span>
  );
}
