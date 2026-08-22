import type { CSSProperties } from "react";
import { imageUrl, renditionUrl, type ImageSource, type RenditionSpec } from "@/lib/cms";
import type { CmsImage } from "@/lib/cms/types";

const DEFAULT_WIDTHS: RenditionSpec[] = ["fill-400x300", "fill-800x600", "max-1600x1200"];

/** [width, height] parsed from a "fill-800x600" / "max-1600x1200" spec. */
function dimsOf(spec: string): [number, number] | null {
  const match = /(\d+)x(\d+)/.exec(spec);
  if (!match) return null;
  return [parseInt(match[1], 10), parseInt(match[2], 10)];
}

function srcsetOf(image: CmsImage): string | undefined {
  const renditions = image.renditions ?? {};
  const parts: string[] = [];
  for (const spec of DEFAULT_WIDTHS) {
    const url = renditions[spec];
    const dims = dimsOf(spec);
    if (url && dims) parts.push(`${url} ${dims[0]}w`);
  }
  return parts.length > 0 ? parts.join(", ") : undefined;
}

export interface ResponsiveImageProps {
  src: ImageSource;
  alt: string;
  /** Sizes attribute; defaults to a sensible responsive hint. */
  sizes?: string;
  className?: string;
  /** Eager-load above-the-fold images (heroes). Defaults to lazy. */
  priority?: boolean;
  /** Absolute-fill mode for photo heroes (object-fit cover, inset 0). */
  fill?: boolean;
  /** Main rendition used for `src` (affects intrinsic width/height). */
  mainRendition?: RenditionSpec;
  /** Extra style, e.g. object-position. */
  style?: CSSProperties;
}

/**
 * Renders an <img> with srcset/sizes + width/height (CLS prevention) when the
 * source is a CMS image carrying renditions. Falls back to a plain URL image
 * in mock mode (NEXT_PUBLIC_CMS_MOCK=1) or when renditions are unavailable.
 */
export default function ResponsiveImage({
  src,
  alt,
  sizes,
  className = "",
  priority = false,
  fill = false,
  mainRendition = "fill-800x600",
  style,
}: ResponsiveImageProps) {
  if (typeof src === "string") {
    const styleObj: CSSProperties | undefined = fill
      ? {
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          ...style,
        }
      : style;
    return (
      // eslint-disable-next-line @next/next/no-img-element -- CMS media; next/image config lands once the CMS origin is known at build time
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        className={className}
        style={styleObj}
      />
    );
  }

  const image = src;
  const srcset = srcsetOf(image);
  const main = renditionUrl(image, mainRendition, DEFAULT_WIDTHS);
  const dims = dimsOf(mainRendition);

  if (!srcset) {
    // No renditions yet (backend follow-up pending): plain URL, no srcset.
    const url = imageUrl(image) || "/hero.jpg";
    return (
      // eslint-disable-next-line @next/next/no-img-element -- CMS media
      <img
        src={url}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        className={className}
        width={dims ? dims[0] : undefined}
        height={dims ? dims[1] : undefined}
        style={
          fill
            ? {
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                ...style,
              }
            : style
        }
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- CMS media
    <img
      src={main}
      srcSet={srcset}
      sizes={sizes ?? "(min-width: 1024px) 33vw, (min-width: 720px) 50vw, 100vw"}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      className={className}
      width={dims ? dims[0] : undefined}
      height={dims ? dims[1] : undefined}
      style={
        fill
          ? {
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              ...style,
            }
          : style
      }
    />
  );
}
