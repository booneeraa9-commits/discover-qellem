"use client";

import { Lightbox, type LightboxImage } from "./Lightbox";
import { useLightbox } from "./use-lightbox";
import { useT } from "@/lib/i18n-client";

export interface GalleryProps {
  images: LightboxImage[];
  /** Alt-text resolver; defaults to the image caption. */
  getAlt?: (image: LightboxImage, index: number) => string;
  className?: string;
}

/**
 * Photo gallery grid wired to the <Lightbox>. Clicking a tile opens the
 * lightbox at that image; keyboard (Esc, arrows, Tab) and touch swipe are
 * handled inside the lightbox.
 */
export function Gallery({ images, getAlt, className = "" }: GalleryProps) {
  const { t } = useT();
  const { open, index, openAt, close, next, prev } = useLightbox(images);

  return (
    <>
      <div className={`gallery ${className}`.trim()}>
        {images.map((image, i) => (
          <button
            key={`${image.src}-${i}`}
            type="button"
            className="g-item"
            onClick={() => openAt(i)}
            aria-label={`${t("lightbox.open")} ${i + 1}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- CMS-provided photo; next/image wiring lands in Sprint 3 */}
            <img
              src={image.src}
              alt={getAlt ? getAlt(image, i) : (image.caption ?? "")}
              loading="lazy"
            />
            {image.caption ? <span className="g-cap">{image.caption}</span> : null}
          </button>
        ))}
      </div>
      <Lightbox
        images={images}
        index={index}
        open={open}
        onClose={close}
        onPrev={prev}
        onNext={next}
      />
    </>
  );
}
