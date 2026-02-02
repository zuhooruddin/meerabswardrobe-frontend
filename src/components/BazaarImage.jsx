import { compose, display, spacing, styled } from "@mui/system";
import NextImage from "next/image";
import React from "react";

// Use Next.js Image component for automatic optimization, lazy loading, and caching
const BazaarImage = styled(({ src, alt = "", width, height, objectFit = "cover", priority = false, quality = 85, fill, ...rest }) => {
  // Normalize src to ensure consistency between server and client
  const normalizedSrc = src || '/assets/images/banners/default.png';
  
  // If it's an external URL that Next.js can optimize, use NextImage
  // Otherwise fall back to regular img tag for external images that can't be optimized
  const isExternal = normalizedSrc && (normalizedSrc.startsWith('http://') || normalizedSrc.startsWith('https://'));
  const canOptimize = !isExternal || (
    normalizedSrc.includes('api.meerabs.com') || 
    normalizedSrc.includes('meerabs.com') ||
    normalizedSrc.startsWith('/')
  );

  // Use fill layout if fill prop is provided or if in a positioned container
  if (canOptimize && fill) {
    // Extract style props that conflict with Next.js Image
    const { display, width, height, maxWidth, ...safeStyle } = rest.style || {};
    return (
      <NextImage
        src={normalizedSrc}
        alt={alt || 'Image'}
        layout="fill"
        objectFit={objectFit}
        style={safeStyle}
        priority={priority}
        quality={quality}
        loading={priority ? "eager" : "lazy"}
        sizes={rest.sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
        {...rest}
      />
    );
  }

  // Use width/height layout if both are provided
  if (canOptimize && width && height) {
    // Extract style props that conflict with Next.js Image
    const { display, maxWidth, objectFit: styleObjectFit, ...safeStyle } = rest.style || {};
    return (
      <NextImage
        src={normalizedSrc}
        alt={alt || 'Image'}
        width={width}
        height={height}
        objectFit={objectFit}
        style={safeStyle}
        priority={priority}
        quality={quality}
        loading={priority ? "eager" : "lazy"}
        {...rest}
      />
    );
  }

  // Fallback to regular img for external images that can't be optimized
  return (
    <img
      src={normalizedSrc}
      alt={alt || 'Image'}
      width={width}
      height={height}
      style={{ objectFit, display: 'block', ...rest.style }}
      loading={priority ? "eager" : "lazy"}
      {...rest}
    />
  );
})(compose(spacing, display));

BazaarImage.defaultProps = {
  display: "block",
};

export default BazaarImage;
