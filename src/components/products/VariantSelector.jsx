import React, { useState, useEffect } from "react";
import { Box, Chip, Typography, styled, Tooltip } from "@mui/material";
import { H6 } from "components/Typography";

const ColorSwatch = styled(Box)(({ theme, selected, available, colorHex }) => ({
  width: 48,
  height: 48,
  borderRadius: "50%",
  cursor: available ? "pointer" : "not-allowed",
  border: selected 
    ? `4px solid ${theme.palette.primary.main}` 
    : available 
    ? `3px solid ${theme.palette.grey[300]}` 
    : `3px solid ${theme.palette.grey[400]}`,
  backgroundColor: colorHex || "#ccc",
  opacity: available ? 1 : 0.4,
  position: "relative",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  boxShadow: selected 
    ? `0 0 0 3px ${theme.palette.primary.light}40, 0 4px 12px rgba(0,0,0,0.15)` 
    : available 
    ? "0 2px 8px rgba(0,0,0,0.1)" 
    : "none",
  "&:hover": {
    transform: available ? "scale(1.15)" : "none",
    boxShadow: available 
      ? `0 0 0 3px ${theme.palette.primary.light}60, 0 6px 16px rgba(0,0,0,0.2)` 
      : "none",
    borderColor: available ? theme.palette.primary.main : undefined,
  },
  "&::after": {
    content: available ? '""' : '"✕"',
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    color: "#fff",
    fontSize: "20px",
    fontWeight: "bold",
    textShadow: "0 0 4px rgba(0,0,0,0.7)",
    display: available ? "none" : "block",
  },
}));

const SizeChip = styled(Chip)(({ theme, selected, available }) => ({
  minWidth: 56,
  height: 44,
  cursor: available ? "pointer" : "not-allowed",
  backgroundColor: selected
    ? theme.palette.primary.main
    : available
    ? theme.palette.background.paper
    : theme.palette.grey[300],
  color: selected
    ? "#fff"
    : available
    ? theme.palette.text.primary
    : theme.palette.text.disabled,
  border: selected
    ? `3px solid ${theme.palette.primary.main}`
    : available
    ? `2px solid ${theme.palette.grey[400]}`
    : `2px solid ${theme.palette.grey[400]}`,
  fontWeight: selected ? 700 : 600,
  fontSize: "14px",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  boxShadow: selected 
    ? `0 4px 12px ${theme.palette.primary.main}40` 
    : available 
    ? "0 2px 6px rgba(0,0,0,0.08)" 
    : "none",
  "&:hover": {
    transform: available ? "translateY(-2px) scale(1.05)" : "none",
    backgroundColor: available
      ? selected
        ? theme.palette.primary.dark
        : theme.palette.grey[100]
      : theme.palette.grey[300],
    boxShadow: available 
      ? selected
        ? `0 6px 16px ${theme.palette.primary.main}50`
        : "0 4px 12px rgba(0,0,0,0.12)"
      : "none",
    borderColor: available ? theme.palette.primary.main : undefined,
  },
  "&.Mui-disabled": {
    opacity: 0.4,
    cursor: "not-allowed",
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
          <H6 
            mb={2} 
            sx={{ 
              fontWeight: 700, 
              fontSize: "15px",
              color: "text.primary",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography component="span" sx={{ fontWeight: 600, color: "text.secondary" }}>
              Color:
            </Typography>
            <Typography 
              component="span" 
              sx={{ 
                fontWeight: selectedColor ? 700 : 400,
                color: selectedColor ? "primary.main" : "text.disabled",
              }}
            >
              {selectedColor || "Please select"}
            </Typography>
            {!selectedColor && (
              <Typography 
                component="span" 
                sx={{ 
                  fontSize: "12px",
                  color: "error.main",
                  ml: 1,
                }}
              >
                *
              </Typography>
            )}
          </H6>
          <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
            {availableColors.map((colorData) => {
              const isSelected = selectedColor === colorData.color;
              return (
                <Tooltip
                  key={colorData.color}
                  title={`${colorData.color}${isSelected ? " (Selected)" : ""}`}
                  arrow
                  placement="top"
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
                    aria-label={`Select color ${colorData.color}`}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if ((e.key === 'Enter' || e.key === ' ') && colorData.available) {
                        e.preventDefault();
                        onColorChange(colorData.color);
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
          <H6 
            mb={2} 
            sx={{ 
              fontWeight: 700, 
              fontSize: "15px",
              color: "text.primary",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography component="span" sx={{ fontWeight: 600, color: "text.secondary" }}>
              Size:
            </Typography>
            <Typography 
              component="span" 
              sx={{ 
                fontWeight: selectedSize ? 700 : 400,
                color: selectedSize ? "primary.main" : "text.disabled",
              }}
            >
              {selectedSize || "Please select"}
            </Typography>
            {!selectedSize && (
              <Typography 
                component="span" 
                sx={{ 
                  fontSize: "12px",
                  color: "error.main",
                  ml: 1,
                }}
              >
                *
              </Typography>
            )}
          </H6>
          <Box display="flex" gap={1.5} flexWrap="wrap">
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
                  aria-label={`Select size ${size}${!isAvailable ? " (Out of stock)" : ""}`}
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

