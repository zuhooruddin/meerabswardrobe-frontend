import React, { useState, useEffect } from "react";
import { Box, Chip, Typography, styled, Tooltip } from "@mui/material";
import { H6 } from "components/Typography";

const ColorSwatch = styled(Box)(({ theme, selected, available, colorHex }) => ({
  width: 40,
  height: 40,
  borderRadius: "50%",
  cursor: available ? "pointer" : "not-allowed",
  border: `3px solid ${selected ? theme.palette.primary.main : "transparent"}`,
  backgroundColor: colorHex || "#ccc",
  opacity: available ? 1 : 0.4,
  position: "relative",
  transition: "all 0.2s ease",
  "&:hover": {
    transform: available ? "scale(1.1)" : "none",
    boxShadow: available ? `0 0 0 2px ${theme.palette.primary.light}` : "none",
  },
  "&::after": {
    content: available ? '""' : '"✕"',
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    color: "#fff",
    fontSize: "18px",
    fontWeight: "bold",
    textShadow: "0 0 3px rgba(0,0,0,0.5)",
  },
}));

const SizeChip = styled(Chip)(({ theme, selected, available }) => ({
  minWidth: 50,
  height: 40,
  cursor: available ? "pointer" : "not-allowed",
  backgroundColor: selected
    ? theme.palette.primary.main
    : available
    ? theme.palette.grey[100]
    : theme.palette.grey[300],
  color: selected
    ? "#fff"
    : available
    ? theme.palette.text.primary
    : theme.palette.text.disabled,
  border: `2px solid ${
    selected
      ? theme.palette.primary.main
      : available
      ? theme.palette.grey[300]
      : theme.palette.grey[400]
  }`,
  fontWeight: selected ? 700 : 500,
  transition: "all 0.2s ease",
  "&:hover": {
    transform: available ? "scale(1.05)" : "none",
    backgroundColor: available
      ? selected
        ? theme.palette.primary.dark
        : theme.palette.grey[200]
      : theme.palette.grey[300],
  },
  "&.Mui-disabled": {
    opacity: 0.5,
  },
}));

const VariantSelector = ({
  variants = [],
  selectedColor,
  selectedSize,
  onColorChange,
  onSizeChange,
  productId,
}) => {
  const [availableColors, setAvailableColors] = useState([]);
  const [availableSizes, setAvailableSizes] = useState([]);
  const [sizeAvailability, setSizeAvailability] = useState({});

  useEffect(() => {
    if (!variants || variants.length === 0) return;

    // Get unique colors with their hex codes
    const colorsMap = new Map();
    variants.forEach((variant) => {
      if (variant.status === 1 && variant.stock_quantity > 0) {
        if (!colorsMap.has(variant.color)) {
          colorsMap.set(variant.color, {
            color: variant.color,
            color_hex: variant.color_hex || "#ccc",
            available: true,
          });
        }
      }
    });
    setAvailableColors(Array.from(colorsMap.values()));

    // Get available sizes for selected color (or all sizes if no color selected)
    const sizesForColor = selectedColor
      ? variants.filter(
          (v) =>
            v.color === selectedColor &&
            v.status === 1 &&
            v.stock_quantity > 0
        )
      : variants.filter((v) => v.status === 1 && v.stock_quantity > 0);

    const uniqueSizes = [
      ...new Set(sizesForColor.map((v) => v.size)),
    ].sort();

    setAvailableSizes(uniqueSizes);

    // Create size availability map
    const sizeMap = {};
    uniqueSizes.forEach((size) => {
      const variantForSize = variants.find(
        (v) =>
          v.size === size &&
          (!selectedColor || v.color === selectedColor) &&
          v.status === 1
      );
      sizeMap[size] = variantForSize ? variantForSize.stock_quantity > 0 : false;
    });
    setSizeAvailability(sizeMap);
  }, [variants, selectedColor]);

  // Auto-select first available color if none selected
  useEffect(() => {
    if (!selectedColor && availableColors.length > 0) {
      onColorChange(availableColors[0].color);
    }
  }, [availableColors, selectedColor, onColorChange]);

  // Auto-select first available size if color changes and no size selected
  useEffect(() => {
    if (selectedColor && !selectedSize && availableSizes.length > 0) {
      onSizeChange(availableSizes[0]);
    }
  }, [selectedColor, availableSizes, selectedSize, onSizeChange]);

  if (!variants || variants.length === 0) {
    return null;
  }

  return (
    <Box>
      {/* Color Selector */}
      {availableColors.length > 0 && (
        <Box mb={3}>
          <H6 mb={1.5} sx={{ fontWeight: 600, fontSize: "14px" }}>
            Color: {selectedColor || "Select a color"}
          </H6>
          <Box display="flex" gap={1.5} flexWrap="wrap">
            {availableColors.map((colorData) => {
              const isSelected = selectedColor === colorData.color;
              return (
                <Tooltip
                  key={colorData.color}
                  title={colorData.color}
                  arrow
                >
                  <ColorSwatch
                    selected={isSelected}
                    available={colorData.available}
                    colorHex={colorData.color_hex}
                    onClick={() => {
                      if (colorData.available) {
                        onColorChange(colorData.color);
                        // Reset size when color changes
                        onSizeChange(null);
                      }
                    }}
                  />
                </Tooltip>
              );
            })}
          </Box>
        </Box>
      )}

      {/* Size Selector */}
      {availableSizes.length > 0 && (
        <Box mb={3}>
          <H6 mb={1.5} sx={{ fontWeight: 600, fontSize: "14px" }}>
            Size: {selectedSize || "Select a size"}
          </H6>
          <Box display="flex" gap={1} flexWrap="wrap">
            {availableSizes.map((size) => {
              const isSelected = selectedSize === size;
              const isAvailable = sizeAvailability[size];
              return (
                <SizeChip
                  key={size}
                  label={size}
                  selected={isSelected}
                  available={isAvailable}
                  disabled={!isAvailable}
                  onClick={() => {
                    if (isAvailable) {
                      onSizeChange(size);
                    }
                  }}
                />
              );
            })}
          </Box>
        </Box>
      )}

      {/* Stock Warning */}
      {selectedColor && selectedSize && (
        <Box>
          {(() => {
            const selectedVariant = variants.find(
              (v) =>
                v.color === selectedColor &&
                v.size === selectedSize &&
                v.status === 1
            );
            if (selectedVariant) {
              const stock = selectedVariant.stock_quantity;
              if (stock <= 5 && stock > 0) {
                return (
                  <Typography
                    variant="caption"
                    sx={{ color: "warning.main", fontWeight: 600 }}
                  >
                    Only {stock} left in stock!
                  </Typography>
                );
              } else if (stock === 0) {
                return (
                  <Typography
                    variant="caption"
                    sx={{ color: "error.main", fontWeight: 600 }}
                  >
                    Out of stock
                  </Typography>
                );
              }
            }
            return null;
          })()}
        </Box>
      )}
    </Box>
  );
};

export default VariantSelector;

