"use client";

import { useCallback, useState } from "react";
import type { LightboxImage } from "./Lightbox";

export interface UseLightbox {
  open: boolean;
  index: number;
  openAt: (index: number) => void;
  close: () => void;
  next: () => void;
  prev: () => void;
}

/**
 * Controlled lightbox state for a list of images. Wrap a gallery grid and the
 * <Lightbox> component together:
 *
 *   const lb = useLightbox(images);
 *   ...grid buttons call lb.openAt(i)...
 *   <Lightbox images={images} index={lb.index} open={lb.open}
 *             onClose={lb.close} onPrev={lb.prev} onNext={lb.next} />
 */
export function useLightbox(images: LightboxImage[]): UseLightbox {
  const count = images.length;
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const openAt = useCallback(
    (i: number) => {
      if (count === 0) return;
      setIndex(Math.max(0, Math.min(i, count - 1)));
      setOpen(true);
    },
    [count],
  );

  const close = useCallback(() => setOpen(false), []);

  const next = useCallback(() => {
    if (count === 0) return;
    setIndex((i) => (i + 1) % count);
  }, [count]);

  const prev = useCallback(() => {
    if (count === 0) return;
    setIndex((i) => (i - 1 + count) % count);
  }, [count]);

  return { open, index, openAt, close, next, prev };
}
