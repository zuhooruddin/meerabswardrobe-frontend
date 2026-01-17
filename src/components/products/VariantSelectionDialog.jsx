import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Radio,
  RadioGroup,
  FormControlLabel,
  styled,
  Grid,
} from "@mui/material";
import { Close, Check, ShoppingCart } from "@mui/icons-material";
import { H3, H4 } from "components/Typography";
import { useAppContext } from "contexts/AppContext";
import { toast } from "react-toastify";
import LazyImage from "components/LazyImage";
import useSettings from "hooks/useSettings";

const DialogContainer = styled(Box)(({ theme }) => ({
  background: theme.palette.background.paper,
  borderRadius: "16px",
  overflow: "hidden",
  maxWidth: "900px",
  width: "100%",
}));

const MainImageContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  aspectRatio: "1 / 1",
  borderRadius: "12px",
  overflow: "hidden",
  background: theme.palette.grey[100],
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "16px",
  position: "relative",
}));

const ThumbnailContainer = styled(Box)(({ theme, selected }) => ({
  width: "80px",
  height: "80px",
  borderRadius: "8px",
  overflow: "hidden",
  cursor: "pointer",
  border: selected ? `3px solid ${theme.palette.primary.main}` : `2px solid ${theme.palette.grey[300]}`,
  transition: "all 0.3s ease",
  "&:hover": {
    borderColor: theme.palette.primary.main,
    transform: "scale(1.05)",
  },
}));

const ColorSwatch = styled(Box)(({ theme, selected, colorHex }) => ({
  width: "48px",
  height: "48px",
  borderRadius: "50%",
  cursor: "pointer",
  border: selected ? `3px solid ${theme.palette.primary.main}` : `2px solid ${theme.palette.grey[300]}`,
  backgroundColor: colorHex || "#ccc",
  position: "relative",
  transition: "all 0.3s ease",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "&:hover": {
    transform: "scale(1.1)",
    borderColor: theme.palette.primary.main,
  },
  "&::after": {
    content: selected ? '""' : '""',
    position: "absolute",
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    background: selected ? theme.palette.primary.main : "transparent",
    display: selected ? "flex" : "none",
    alignItems: "center",
    justifyContent: "center",
  },
}));

const CheckIcon = styled(Check)(({ theme }) => ({
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  position: "absolute",
  zIndex: 1,
}));

const SizeRadio = styled(Radio)(({ theme }) => ({
  "&.Mui-checked": {
    color: theme.palette.primary.main,
  },
}));

const AddToCartButton = styled(Box)(({ theme, disabled }) => ({
  width: "100%",
  padding: "14px 24px",
  borderRadius: "8px",
  background: disabled
    ? theme.palette.grey[300] 
    : theme.palette.primary.main,
  color: disabled ? theme.palette.text.disabled : "#fff",
  cursor: disabled ? "not-allowed" : "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  fontWeight: 600,
  fontSize: "16px",
  transition: "all 0.3s ease",
  "&:hover": {
    background: disabled 
      ? theme.palette.grey[300] 
      : theme.palette.primary.dark,
    transform: disabled ? "none" : "translateY(-2px)",
    boxShadow: disabled ? "none" : "0 4px 12px rgba(0,0,0,0.15)",
  },
}));

const VariantSelectionDialog = ({
  open,
  onClose,
  product,
  onAddToCart,
}) => {
  const { settings } = useSettings();
  const { dispatch } = useAppContext();
  
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const imgbaseurl = process.env.NEXT_PUBLIC_IMAGE_BASE_API_URL;
  const localimageurl = process.env.NEXT_PUBLIC_BACKEND_API_BASE + "media/";
  const [currency, setCurrency] = useState('PKR');

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedCurrency = localStorage.getItem('currency');
      if (storedCurrency) setCurrency(storedCurrency);
    }
  }, []);

  // Consistent discount calculation: discount is applied to MRP, not salePrice
  const numericMrp = product?.mrp != null && !isNaN(product.mrp) ? parseFloat(product.mrp) : 0;
  const numericSalePrice = product?.salePrice != null && !isNaN(product.salePrice) ? parseFloat(product.salePrice) : numericMrp;
  const numericDiscount = product?.discount != null && !isNaN(product.discount) ? parseFloat(product.discount) : 0;
  
  // Calculate discount amount from MRP (original price)
  const calculatedDiscountAmount = numericDiscount > 0 ? (numericMrp * numericDiscount) / 100 : 0;
  
  // Final sale price: if discount exists, use discounted price, otherwise use original salePrice
  const baseFinalSalePrice = numericDiscount > 0 && numericMrp > 0 
    ? (numericMrp - calculatedDiscountAmount) 
    : numericSalePrice;

  const [displayPrice, setDisplayPrice] = useState(() => {
    // Initialize with calculated product price
    return baseFinalSalePrice || 0;
  });

  // Update price when product changes
  useEffect(() => {
    if (product && !selectedVariant) {
      setDisplayPrice(baseFinalSalePrice);
    }
  }, [product, baseFinalSalePrice, selectedVariant]);

  // Load variants
  useEffect(() => {
    if (product?.variants && product.variants.length > 0) {
      setVariants(product.variants);
    } else if (product?.available_colors && product.available_colors.length > 0) {
      const fetchVariants = async () => {
        try {
          setLoading(true);
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_API_BASE}getProductVariants?item_id=${product.id}`
          );
          const data = await response.json();
          if (data.success && data.variants) {
            setVariants(data.variants);
          }
        } catch (error) {
          console.error('Error fetching variants:', error);
          toast.error("Failed to load variant options", { position: toast.POSITION.TOP_RIGHT });
        } finally {
          setLoading(false);
        }
      };
      fetchVariants();
    }
  }, [product]);

  // Get available colors and sizes
  const availableColors = React.useMemo(() => {
    if (!variants || variants.length === 0) return [];
    const colorsMap = new Map();
    variants.forEach((variant) => {
      if (variant.status === 1 && variant.stock_quantity > 0) {
        if (!colorsMap.has(variant.color)) {
          colorsMap.set(variant.color, {
            color: variant.color,
            color_hex: variant.color_hex || "#ccc",
          });
        }
      }
    });
    return Array.from(colorsMap.values());
  }, [variants]);

  const availableSizes = React.useMemo(() => {
    if (!variants || variants.length === 0) return [];
    const sizesForColor = selectedColor
      ? variants.filter(
          (v) =>
            v.color === selectedColor &&
            v.status === 1 &&
            v.stock_quantity > 0
        )
      : variants.filter((v) => v.status === 1 && v.stock_quantity > 0);
    return [...new Set(sizesForColor.map((v) => v.size))].sort();
  }, [variants, selectedColor]);

  // Update selected variant when color/size changes
  useEffect(() => {
    if (selectedColor && selectedSize && variants.length > 0) {
      const variant = variants.find(
        (v) => v.color === selectedColor && v.size === selectedSize && v.status === 1
      );
      setSelectedVariant(variant);
      
      if (variant) {
        // Get variant price (this is typically the variant's MRP)
        const variantPrice = variant.variant_price || variant.actual_price || variant.price;
        
        if (variantPrice && variantPrice > 0) {
          // Check if variant has its own MRP, otherwise use variant price as MRP
          const variantMrp = variant.mrp || variant.variant_mrp || variantPrice;
          
          // Apply discount to variant MRP if discount exists
          if (numericDiscount > 0 && variantMrp > 0) {
            // Calculate discounted price from variant MRP
            const calculatedVariantDiscount = (variantMrp * numericDiscount) / 100;
            const finalVariantPrice = variantMrp - calculatedVariantDiscount;
            setDisplayPrice(parseFloat(finalVariantPrice));
          } else {
            // No discount, use variant price as is
            setDisplayPrice(parseFloat(variantPrice));
          }
        } else {
          // Fallback to calculated product price
          setDisplayPrice(baseFinalSalePrice);
        }
      } else {
        // No variant found, use calculated product price
        setDisplayPrice(baseFinalSalePrice);
      }
    } else {
      setSelectedVariant(null);
      // Use calculated product price when no variant selected
      setDisplayPrice(baseFinalSalePrice);
    }
  }, [selectedColor, selectedSize, variants, product, baseFinalSalePrice, numericDiscount, numericMrp]);

  // Reset selections when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setSelectedColor(null);
      setSelectedSize(null);
      setSelectedVariant(null);
      setSelectedImageIndex(0);
      // Reset to calculated product price when dialog closes
      setDisplayPrice(baseFinalSalePrice);
    } else {
      // When dialog opens, set initial price to calculated product price
      setDisplayPrice(baseFinalSalePrice);
      
      if (availableColors.length > 0 && !selectedColor) {
        // Auto-select first color
        setSelectedColor(availableColors[0].color);
      }
    }
  }, [open, availableColors, selectedColor, product]);

  // Auto-select first size when color is selected
  useEffect(() => {
    if (selectedColor && !selectedSize && availableSizes.length > 0) {
      setSelectedSize(availableSizes[0]);
    }
  }, [selectedColor, availableSizes, selectedSize]);

  const handleAddToCart = useCallback(() => {
    if (!selectedVariant) {
      toast.error("Please select color and size", { position: toast.POSITION.TOP_RIGHT });
      return;
    }

    // Get variant price and apply discount if needed
    const variantPrice = selectedVariant.actual_price || selectedVariant.variant_price || selectedVariant.price;
    // Check if variant has its own MRP, otherwise use variant price as MRP
    const variantMrp = selectedVariant.mrp || selectedVariant.variant_mrp || variantPrice || numericMrp;
    
    let priceToStore = baseFinalSalePrice;
    
    if (variantPrice && variantPrice > 0) {
      // Apply discount to variant MRP if discount exists
      if (numericDiscount > 0 && variantMrp > 0) {
        // Calculate discounted price from variant MRP
        const calculatedVariantDiscount = (variantMrp * numericDiscount) / 100;
        priceToStore = variantMrp - calculatedVariantDiscount;
      } else {
        // No discount, use variant price as is
        priceToStore = parseFloat(variantPrice);
      }
    }
    
    const imageUrl = product.imgGroup?.[selectedImageIndex] || product.imgGroup?.[0] || product.image || product.imgUrl;
    const image = imageUrl?.startsWith('http') ? imageUrl : (imgbaseurl + imageUrl || localimageurl + imageUrl);

    const payload = {
      mrp: variantMrp,
      salePrice: priceToStore,
      salePrices: priceToStore,
      price: priceToStore,
      discount: numericDiscount,
      sku: selectedVariant.sku || product.sku,
      slug: product.slug,
      qty: 1,
      name: product.name,
      image: image,
      id: product.id,
      variant_id: selectedVariant.id,
      selected_color: selectedColor,
      selected_size: selectedSize,
      variant_sku: selectedVariant.sku,
    };

    dispatch({
      type: "CHANGE_CART_AMOUNT",
      payload,
    });

    toast.success("Added to cart", { position: toast.POSITION.TOP_RIGHT });
    onClose();
    
    if (onAddToCart) {
      onAddToCart(payload);
    }
  }, [selectedVariant, selectedColor, selectedSize, product, dispatch, onClose, onAddToCart, imgbaseurl, localimageurl, selectedImageIndex, baseFinalSalePrice, numericMrp, numericDiscount]);

  const isOutOfStock = selectedVariant && selectedVariant.stock_quantity === 0;
  const canAddToCart = selectedVariant && !isOutOfStock;

  // Get product images
  const productImages = product?.imgGroup && product.imgGroup.length > 0 
    ? product.imgGroup 
    : product?.image 
      ? [product.image] 
      : [];

  const mainImage = productImages[selectedImageIndex] || productImages[0] || product?.image || '';
  const imageUrl = mainImage?.startsWith('http') ? mainImage : (imgbaseurl + mainImage || localimageurl + mainImage);

  return (
      <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
          overflow: "hidden",
          background: "transparent",
          boxShadow: "none",
          maxHeight: "90vh",
        },
      }}
      sx={{
        zIndex: 1502, // Higher than ProductViewDialog (1501) to ensure it appears on top
      }}
    >
      <DialogContainer>
        <Box sx={{ position: "relative", p: 3 }}>
          {/* Close Button */}
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              zIndex: 10,
              background: "rgba(255, 255, 255, 0.9)",
              "&:hover": {
                background: "rgba(255, 255, 255, 1)",
              },
            }}
          >
            <Close />
          </IconButton>

          <Grid container spacing={4}>
            {/* Left Side - Product Images */}
            <Grid item xs={12} md={6}>
              <MainImageContainer>
                <LazyImage
                  width={400}
                  height={400}
                  alt={product?.name || "Product"}
                  src={imageUrl}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </MainImageContainer>
              
              {/* Thumbnails */}
              {productImages.length > 1 && (
                <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
                  {productImages.slice(0, 4).map((img, index) => {
                    const thumbUrl = img?.startsWith('http') ? img : (imgbaseurl + img || localimageurl + img);
                    return (
                      <ThumbnailContainer
                        key={index}
                        selected={selectedImageIndex === index}
                        onClick={() => setSelectedImageIndex(index)}
                      >
                        <LazyImage
                          width={80}
                          height={80}
                          alt={`${product?.name} - View ${index + 1}`}
                          src={thumbUrl}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </ThumbnailContainer>
                    );
                  })}
                </Box>
              )}
            </Grid>

            {/* Right Side - Product Info & Variants */}
            <Grid item xs={12} md={6}>
              <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                {/* Product Name & Price */}
                <Box sx={{ mb: 3 }}>
                  <H3
                  sx={{
                    fontWeight: 700,
                      fontSize: "24px",
                      color: "text.primary",
                    mb: 1,
                    lineHeight: 1.3,
                  }}
                >
                    {product?.name || 'Product'}
                  </H3>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, flexWrap: 'wrap' }}>
                  <H4
                  sx={{
                    fontWeight: 800,
                      fontSize: "28px",
                      color: "primary.main",
                  }}
                >
                      {currency} {displayPrice > 0 ? displayPrice.toFixed(2) : baseFinalSalePrice.toFixed(2)}
                  </H4>
                    {numericDiscount > 0 && (() => {
                      // Get variant MRP if available, otherwise use product MRP
                      const displayMrp = selectedVariant 
                        ? (selectedVariant.mrp || selectedVariant.variant_mrp || numericMrp)
                        : numericMrp;
                      
                      // Only show discount if MRP is greater than display price
                      if (displayMrp > 0 && displayMrp > displayPrice) {
                        return (
                          <>
                            <Typography
                              sx={{
                                color: "text.secondary",
                                fontSize: "18px",
                                textDecoration: "line-through",
                                fontWeight: 500,
                              }}
                            >
                              {currency} {displayMrp.toFixed(2)}
                            </Typography>
                            <Box
                              sx={{
                                background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                                color: "white",
                                px: 1.5,
                                py: 0.5,
                                borderRadius: "12px",
                                fontSize: "13px",
                                fontWeight: 700,
                              }}
                            >
                              SAVE {Math.round(numericDiscount)}%
                            </Box>
                          </>
                        );
                      }
                      return null;
                    })()}
                  </Box>
          </Box>

                {/* Variant Selection */}
          {loading ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
                    <Typography sx={{ color: "text.secondary" }}>
                Loading variant options...
              </Typography>
            </Box>
                ) : (
                  <Box sx={{ flex: 1, mb: 3 }}>
                    {/* Color Selection */}
                    {availableColors.length > 0 && (
                      <Box sx={{ mb: 4 }}>
                        <Typography
                          sx={{
                            fontWeight: 600,
                            fontSize: "16px",
                            color: "text.primary",
                            mb: 2,
                          }}
                        >
                          Choose a Color
                        </Typography>
                        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                          {availableColors.map((colorData) => {
                            const isSelected = selectedColor === colorData.color;
                            return (
                              <Box
                                key={colorData.color}
                                sx={{ position: "relative" }}
                              >
                                <ColorSwatch
                                  selected={isSelected}
                                  colorHex={colorData.color_hex}
                                  onClick={() => {
                                    setSelectedColor(colorData.color);
                                    setSelectedSize(null); // Reset size when color changes
                                  }}
                                >
                                  {isSelected && (
                                    <CheckIcon sx={{ color: "#fff", fontSize: "20px" }} />
                                  )}
                                </ColorSwatch>
                              </Box>
                            );
                          })}
                        </Box>
                      </Box>
                    )}

                    {/* Size Selection */}
                    {availableSizes.length > 0 && (
                      <Box sx={{ mb: 4 }}>
                        <Typography
              sx={{
                            fontWeight: 600,
                            fontSize: "16px",
                            color: "text.primary",
                            mb: 2,
                          }}
                        >
                          Choose a Size
                        </Typography>
                        <RadioGroup
                          value={selectedSize || ''}
                          onChange={(e) => setSelectedSize(e.target.value)}
                          sx={{ gap: 1 }}
            >
                          {availableSizes.map((size) => {
                            const variantForSize = variants.find(
                              (v) =>
                                v.size === size &&
                                (!selectedColor || v.color === selectedColor) &&
                                v.status === 1
                            );
                            const isAvailable = variantForSize && variantForSize.stock_quantity > 0;
                            
                            return (
                              <FormControlLabel
                                key={size}
                                value={size}
                                control={<SizeRadio disabled={!isAvailable} />}
                                label={size}
                                disabled={!isAvailable}
                                sx={{
                                  "& .MuiFormControlLabel-label": {
                                    fontSize: "15px",
                                    fontWeight: selectedSize === size ? 600 : 400,
                                    color: isAvailable ? "text.primary" : "text.disabled",
                                  },
                                }}
                              />
                            );
                          })}
                        </RadioGroup>
            </Box>
          )}

          {/* Stock Status */}
          {selectedVariant && (
                      <Box sx={{ mb: 2 }}>
              {isOutOfStock ? (
                <Typography
                  sx={{
                              color: "error.main",
                    fontWeight: 600,
                    fontSize: "14px",
                  }}
                >
                  ⚠️ This variant is out of stock
                </Typography>
              ) : selectedVariant.stock_quantity <= 5 ? (
                <Typography
                  sx={{
                              color: "warning.main",
                    fontWeight: 600,
                    fontSize: "14px",
                  }}
                >
                  ⚠️ Only {selectedVariant.stock_quantity} left in stock!
                </Typography>
              ) : (
                <Typography
                  sx={{
                              color: "success.main",
                    fontWeight: 600,
                    fontSize: "14px",
                  }}
                >
                            ✓ In Stock
                </Typography>
                        )}
                      </Box>
              )}
            </Box>
          )}

          {/* Add to Cart Button */}
          <AddToCartButton
            disabled={!canAddToCart}
                  onClick={canAddToCart ? handleAddToCart : undefined}
          >
                  <ShoppingCart sx={{ fontSize: "20px" }} />
            {!selectedColor || !selectedSize
              ? "Please Select Color & Size"
              : isOutOfStock
              ? "Out of Stock"
              : "Add to Cart"}
          </AddToCartButton>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </DialogContainer>
    </Dialog>
  );
};

export default VariantSelectionDialog;
