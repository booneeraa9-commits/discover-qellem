"use client";

import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { resolveImageUrl, type ImageSource } from "@/lib/cms";
import { useT } from "@/lib/i18n-client";

export interface LightboxImage {
  src: ImageSource;
  caption?: string;
}

export interface LightboxProps {
  images: LightboxImage[];
  index: number;
  open: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  /** Resolve the caption shown under the current image. Falls back to image.caption. */
  caption?: (image: LightboxImage, index: number) => string;
}

const SWIPE_THRESHOLD_PX = 48;

export function Lightbox({
  images,
  index,
  open,
  onClose,
  onPrev,
  onNext,
  caption,
}: LightboxProps) {
  const { t } = useT();
  const closeRef = useRef<HTMLButtonElement>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);
  const restoreFocus = useRef<Element | null>(null);

  // Keep the latest callbacks in refs so the effect below only binds once per
  // open/close cycle, even when the parent re-renders with new closures.
  const onCloseRef = useRef(onClose);
  const onPrevRef = useRef(onPrev);
  const onNextRef = useRef(onNext);

  useEffect(() => {
    onCloseRef.current = onClose;
    onPrevRef.current = onPrev;
    onNextRef.current = onNext;
  });

  useEffect(() => {
    if (!open) return;

    restoreFocus.current = document.activeElement;

    const order = () =>
      [closeRef.current, prevRef.current, nextRef.current].filter(
        (el): el is HTMLButtonElement => el !== null,
      );

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        onPrevRef.current();
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        onNextRef.current();
        return;
      }
      if (event.key === "Tab") {
        // Keep keyboard focus cycling through the lightbox controls only.
        const controls = order();
        if (controls.length === 0) return;
        const first = controls[0];
        const last = controls[controls.length - 1];
        const active = document.activeElement;
        if (event.shiftKey) {
          if (active === first || !controls.includes(active as HTMLButtonElement)) {
            event.preventDefault();
            last.focus();
          }
        } else if (active === last || !controls.includes(active as HTMLButtonElement)) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      const el = restoreFocus.current;
      if (el instanceof HTMLElement) el.focus();
    };
  }, [open]);

  const handleTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = (event.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < SWIPE_THRESHOLD_PX) return;
    if (dx > 0) onPrevRef.current();
    else onNextRef.current();
  };

  if (!open || images.length === 0) return null;

  const current = images[index] ?? images[0];
  const cap = caption ? caption(current, index) : current.caption;

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={t("lightbox.label")}
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="lb-stage"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="lb-close"
          ref={closeRef}
          onClick={onClose}
          aria-label={t("lightbox.close")}
        >
          <X aria-hidden="true" />
        </button>
        <button
          type="button"
          className="lb-prev"
          ref={prevRef}
          onClick={onPrev}
          aria-label={t("lightbox.previous")}
        >
          <ChevronLeft aria-hidden="true" />
        </button>
        {/* eslint-disable-next-line @next/next/no-img-element -- CMS-provided photo */}
        <img className="lb-img" src={resolveImageUrl(current.src)} alt={cap ?? ""} />
        {cap ? <div className="lb-cap">{cap}</div> : null}
        <button
          type="button"
          className="lb-next"
          ref={nextRef}
          onClick={onNext}
          aria-label={t("lightbox.next")}
        >
          <ChevronRight aria-hidden="true" />
        </button>
        <div className="lb-count" aria-live="polite">
          {index + 1} / {images.length}
        </div>
      </div>
    </div>
  );
}
