/* eslint-disable react/no-unescaped-entities */
import { Box, styled } from "@mui/material";
import React, { useEffect } from "react";
import Image from "next/image"; // custom styled components

const CardWrapper = styled(Box)(({ theme, mode }) => ({
  minHeight: 500,
  position: "relative",
  display: "flex",
  alignItems: "center",
  overflow: "hidden",
  backgroundColor: mode === "dark" ? "#000" : "#fff",
  color: mode === "light" ? theme.palette.dark.main : "#fff",
  [theme.breakpoints.down("md")]: {
    minHeight: 200,
    justifyContent: "center",
    padding: 106,
    textAlign: "center",
  },
}));

const ImageWrapper = styled(Box)(() => ({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  zIndex: 0,
  "& img": {
    objectFit: "cover",
  },
}));

const ContentWrapper = styled(Box)(() => ({
  position: "relative",
  zIndex: 1,
  width: "100%",
  height: "100%",
})); // ===============================================================

// ===============================================================
const CarouselCard4 = ({ bgImage, mode = "dark", content, priority = false, fetchPriority = "auto" }) => {
  // Use Next.js Image component for automatic optimization, WebP/AVIF conversion, and lazy loading
  // Note: fetchPriority is not available in Next.js 12, so we use link preload as a workaround
  
  // Add preload link for priority images (LCP optimization)
  useEffect(() => {
    if (priority && bgImage && typeof document !== 'undefined') {
      // Check if link already exists to prevent duplicates
      const existingLink = document.querySelector(`link[href="${bgImage}"]`);
      if (!existingLink) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = bgImage;
        // Add fetchpriority attribute if supported (Next.js 13+)
        if (fetchPriority === 'high') {
          link.setAttribute('fetchpriority', 'high');
        }
        document.head.appendChild(link);
        
        return () => {
          // Cleanup on unmount
          const linkToRemove = document.querySelector(`link[href="${bgImage}"]`);
          if (linkToRemove) {
            document.head.removeChild(linkToRemove);
          }
        };
      }
    }
  }, [bgImage, priority, fetchPriority]);
  
  return (
    <CardWrapper mode={mode}>
      {bgImage && (
        <ImageWrapper>
          <Image
            src={bgImage}
            alt="Carousel banner"
            layout="fill"
            priority={priority}
            quality={60}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1920px"
            objectFit="cover"
            loading={priority ? "eager" : "lazy"}
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2YwZjBmMCIvPjwvc3ZnPg=="
          />
        </ImageWrapper>
      )}
      <ContentWrapper>
        {content}
      </ContentWrapper>
    </CardWrapper>
  );
};

export default CarouselCard4;
