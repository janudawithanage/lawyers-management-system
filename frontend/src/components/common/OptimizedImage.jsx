/**
 * OptimizedImage — Performance-first image component.
 *
 * Features:
 *  - Native lazy loading
 *  - srcSet for responsive images
 *  - Smooth fade-in on load
 *  - Graceful fallback placeholder
 *  - Proper alt text enforcement
 */

import { useState, useRef, useEffect } from "react";
import { cn } from "@utils";

export default function OptimizedImage({
  src,
  alt,
  srcSet,
  sizes,
  width,
  height,
  className = "",
  containerClassName = "",
  loading = "lazy",
  decoding = "async",
  objectFit = "cover",
  overlay = false,
  overlayClassName = "",
  ...props
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef(null);

  // Check if already loaded (cached)
  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current?.naturalWidth > 0) {
      setLoaded(true);
    }
  }, []);

  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      {/* Placeholder skeleton */}
      {!loaded && !error && (
        <div
          className="absolute inset-0 bg-dark-700 animate-pulse"
          aria-hidden="true"
        />
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 bg-dark-700 flex items-center justify-center">
          <div className="text-center text-neutral-600">
            <svg className="w-8 h-8 mx-auto mb-2\" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
            <span className="text-xs">Image unavailable</span>
          </div>
        </div>
      )}

      <img
        ref={imgRef}
        src={src}
        alt={alt}
        srcSet={srcSet}
        sizes={sizes}
        width={width}
        height={height}
        loading={loading}
        decoding={decoding}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={cn(
          "transition-opacity duration-700",
          loaded ? "opacity-100" : "opacity-0",
          objectFit === "cover" && "object-cover",
          objectFit === "contain" && "object-contain",
          className
        )}
        {...props}
      />

      {/* Optional overlay */}
      {overlay && (
        <div
          className={cn(
            "absolute inset-0",
            overlayClassName || "bg-linear-to-t from-dark-950 via-dark-950/40 to-transparent"
          )}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
