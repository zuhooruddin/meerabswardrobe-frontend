/* eslint-disable react/no-unescaped-entities */
import { Box, styled } from "@mui/material";
import React from "react";
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
  // Note: When priority={true}, Next.js automatically handles preloading internally via <link rel="preload">
  // Manual preload links are not needed and can cause warnings because Next.js uses optimized URLs
  
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
