import { bgcolor, borderRadius, compose, spacing, styled } from "@mui/system";
import NextImage from "next/image";
import React from "react";
const LazyImage = styled(({ borderRadius, loading = "lazy", ...rest }) => {
  // Ensure aspect ratio is maintained for better CLS
  const { width, height, style = {}, objectFit, ...otherProps } = rest;
  const aspectRatio = width && height ? width / height : 1;
  
  return (
    <NextImage 
      loading={loading} 
      {...otherProps}
      width={width}
      height={height}
      objectFit={objectFit || 'contain'}
      style={{
        ...style,
        aspectRatio: aspectRatio,
      }}
    />
  );
})(compose(spacing, borderRadius, bgcolor));
export default LazyImage;
