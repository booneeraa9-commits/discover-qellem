"use client";

import type { CSSProperties, ReactNode } from "react";
import { useInView } from "./use-in-view";

export interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Extra transition delay in seconds (stagger). */
  delay?: number;
}

/**
 * Fades and translates children up when they scroll into view
 * (0.55s var(--ease-out)). Gated by prefers-reduced-motion: the
 * .reveal base style collapses to fully visible for users who request it.
 */
export function Reveal({ children, className = "", delay = 0 }: RevealProps) {
  const { ref, isInView } = useInView<HTMLDivElement>();

  const style: CSSProperties | undefined = delay
    ? { transitionDelay: `${delay}s` }
    : undefined;

  return (
    <div
      ref={ref}
      className={`reveal ${isInView ? "visible" : ""} ${className}`.trim()}
      style={style}
    >
      {children}
    </div>
  );
}
