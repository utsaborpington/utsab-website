"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

/**
 * Translates its image ~0.06x scroll distance (capped 40px) for subtle
 * depth, per design_handoff_utsab_redesign's hero parallax spec.
 */
export default function ParallaxImage({
  src,
  alt,
  wrapperClassName = "",
  imageClassName = "",
  rotateDeg = 0,
  priority = false,
}: {
  src: string;
  alt: string;
  wrapperClassName?: string;
  imageClassName?: string;
  rotateDeg?: number;
  priority?: boolean;
}) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => setOffset(Math.min(window.scrollY * 0.06, 40));
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={wrapperClassName}
      style={{ transform: `translateY(${offset}px) rotate(${rotateDeg}deg)` }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(min-width: 1024px) 520px, 90vw"
        className={imageClassName}
      />
    </div>
  );
}
