import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  Button,
  Typography,
  IconButton,
  Divider,
  styled,
  useTheme,
} from "@mui/material";
import { Close, ShoppingCart } from "@mui/icons-material";
import { H3, H4, H6 } from "components/Typography";
import VariantSelector from "./VariantSelector";
import BazaarButton from "components/BazaarButton";
import { useAppContext } from "contexts/AppContext";
import { toast } from "react-toastify";
import LazyImage from "components/LazyImage";
import useSettings from "hooks/useSettings";

const DialogContainer = styled(Box)(({ theme, isDark }) => ({
  background: isDark
    ? "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)"
    : "linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)",
  borderRadius: "24px",
  overflow: "hidden",
}));

const ProductImageContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  aspectRatio: "1 / 1",
  borderRadius: "16px",
  overflow: "hidden",
  background: theme.palette.mode === 'dark' ? "#0F172A" : "#F8FAFC",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const AddToCartButton = styled(BazaarButton)(({ theme, isDark, disabled }) => ({
  height: 56,
  borderRadius: "16px",
  fontSize: "16px",
  fontWeight: 700,
  textTransform: "none",
  background: disabled
    ? (isDark ? "#374151" : "#E5E7EB")
    : isDark
    ? "linear-gradient(135deg, #FF6B8A 0%, #FF8FA3 100%)"
    : "linear-gradient(135deg, #D23F57 0%, #E94560 100%)",
  color: disabled ? (isDark ? "#9CA3AF" : "#6B7280") : "#FFFFFF",
  boxShadow: disabled
    ? "none"
    : isDark
    ? "0 16px 40px rgba(255, 107, 138, 0.4)"
    : "0 16px 40px rgba(210, 63, 87, 0.3)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    transform: disabled ? "none" : "translateY(-2px) scale(1.02)",
    boxShadow: disabled
      ? "none"
      : isDark
      ? "0 20px 50px rgba(255, 107, 138, 0.5)"
      : "0 20px 50px rgba(210, 63, 87, 0.4)",
  },
  "&:disabled": {
    cursor: "not-allowed",
    opacity: 0.6,
  },
}));

const VariantSelectionDialog = ({
  open,
  onClose,
  product,
  onAddToCart,
}) => {
  const theme = useTheme();
  const { settings } = useSettings();
  const isDark = settings.theme === 'dark';
  const { state, dispatch } = useAppContext();
  
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [variants, setVariants] = useState([]);
  const [displayPrice, setDisplayPrice] = useState(product?.salePrice || 0);
  const [loading, setLoading] = useState(false);

  const imgbaseurl = process.env.NEXT_PUBLIC_IMAGE_BASE_API_URL;
  const localimageurl = process.env.NEXT_PUBLIC_BACKEND_API_BASE + "media/";
  const [currency, setCurrency] = useState('PKR');

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedCurrency = localStorage.getItem('currency');
      if (storedCurrency) setCurrency(storedCurrency);
    }
  }, []);

  // Load variants
  useEffect(() => {
    if (product?.variants && product.variants.length > 0) {
      setVariants(product.variants);
    } else if (product?.available_colors && product.available_colors.length > 0) {
      // Fetch variants if not provided
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

  // Update selected variant when color/size changes
  useEffect(() => {
    if (selectedColor && selectedSize && variants.length > 0) {
      const variant = variants.find(
        (v) => v.color === selectedColor && v.size === selectedSize && v.status === 1
      );
      setSelectedVariant(variant);
      
      // Update display price based on selected variant
      if (variant) {
        const variantPrice = variant.variant_price || variant.actual_price;
        if (variantPrice && variantPrice > 0) {
          setDisplayPrice(parseFloat(variantPrice));
        } else {
          setDisplayPrice(product?.salePrice || 0);
        }
      } else {
        setDisplayPrice(product?.salePrice || 0);
      }
    } else {
      setSelectedVariant(null);
      setDisplayPrice(product?.salePrice || 0);
    }
  }, [selectedColor, selectedSize, variants, product]);

  // Reset selections when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setSelectedColor(null);
      setSelectedSize(null);
      setSelectedVariant(null);
    }
  }, [open]);

  const handleAddToCart = useCallback(() => {
    if (!selectedVariant) {
      toast.error("Please select color and size", { position: toast.POSITION.TOP_RIGHT });
      return;
    }

    const priceToStore = selectedVariant.actual_price || selectedVariant.variant_price || product.salePrice;
    const imageUrl = product.imgGroup?.[0] || product.image || product.imgUrl;
    const image = imageUrl?.startsWith('http') ? imageUrl : (imgbaseurl + imageUrl || localimageurl + imageUrl);

    const payload = {
      mrp: product.mrp,
      salePrice: priceToStore,
      salePrices: priceToStore,
      sku: selectedVariant.sku || product.sku,
      slug: product.slug,
      price: priceToStore,
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
  }, [selectedVariant, selectedColor, selectedSize, product, dispatch, onClose, onAddToCart, imgbaseurl, localimageurl]);

  const isOutOfStock = selectedVariant && selectedVariant.stock_quantity === 0;
  const canAddToCart = selectedVariant && !isOutOfStock;

  return (
      <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "24px",
          overflow: "hidden",
          background: "transparent",
          boxShadow: "none",
          maxHeight: "90vh",
        },
      }}
      sx={{
        zIndex: 1500,
      }}
    >
      <DialogContainer isDark={isDark}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "24px",
            borderBottom: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)"}`,
          }}
        >
          <H3
            sx={{
              fontWeight: 700,
              fontSize: "20px",
              color: isDark ? "#F9FAFB" : "#0F172A",
            }}
          >
            Select Options
          </H3>
          <IconButton
            onClick={onClose}
            sx={{
              color: isDark ? "#9CA3AF" : "#64748B",
              "&:hover": {
                background: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            <Close />
          </IconButton>
        </Box>

        <DialogContent 
          sx={{ 
            padding: "24px",
            maxHeight: "70vh",
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)",
              borderRadius: "4px",
              "&:hover": {
                background: isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)",
              },
            },
          }}
        >
          {/* Product Info */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <ProductImageContainer>
                <LazyImage
                  width={120}
                  height={120}
                  alt={product?.name || "Product"}
                  src={
                    product?.imgGroup?.[0] 
                      ? (product.imgGroup[0].startsWith('http') ? product.imgGroup[0] : imgbaseurl + product.imgGroup[0])
                      : product?.image 
                        ? (product.image.startsWith('http') ? product.image : imgbaseurl + product.image)
                        : ""
                  }
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    padding: "16px",
                  }}
                />
              </ProductImageContainer>
              <Box sx={{ flex: 1 }}>
                <H4
                  sx={{
                    fontWeight: 700,
                    fontSize: "18px",
                    color: isDark ? "#F9FAFB" : "#0F172A",
                    mb: 1,
                    lineHeight: 1.3,
                  }}
                >
                  {product?.name}
                </H4>
                <H3
                  sx={{
                    fontWeight: 800,
                    fontSize: "24px",
                    background: isDark
                      ? "linear-gradient(135deg, #FECDD3 0%, #FFB3C1 100%)"
                      : "linear-gradient(135deg, #D23F57 0%, #E94560 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {currency} {displayPrice?.toFixed(2) || '0.00'}
                </H3>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ mb: 3, borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)" }} />

          {/* Variant Selector */}
          {loading ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography sx={{ color: isDark ? "#9CA3AF" : "#64748B" }}>
                Loading variant options...
              </Typography>
            </Box>
          ) : variants.length > 0 ? (
            <Box
              sx={{
                background: isDark
                  ? "rgba(255, 255, 255, 0.05)"
                  : "rgba(0, 0, 0, 0.02)",
                padding: "20px",
                borderRadius: "16px",
                border: `2px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)"}`,
                mb: 3,
              }}
            >
              <VariantSelector
                variants={variants}
                selectedColor={selectedColor}
                selectedSize={selectedSize}
                onColorChange={setSelectedColor}
                onSizeChange={setSelectedSize}
                productId={product?.id}
              />
            </Box>
          ) : (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography sx={{ color: isDark ? "#9CA3AF" : "#64748B" }}>
                No variant options available
              </Typography>
            </Box>
          )}

          {/* Stock Status */}
          {selectedVariant && (
            <Box sx={{ mb: 3 }}>
              {isOutOfStock ? (
                <Typography
                  sx={{
                    color: isDark ? "#FCA5A5" : "#B91C1C",
                    fontWeight: 600,
                    fontSize: "14px",
                    padding: "12px",
                    background: isDark
                      ? "rgba(127, 29, 29, 0.2)"
                      : "rgba(254, 226, 226, 0.5)",
                    borderRadius: "12px",
                    textAlign: "center",
                  }}
                >
                  ⚠️ This variant is out of stock
                </Typography>
              ) : selectedVariant.stock_quantity <= 5 ? (
                <Typography
                  sx={{
                    color: isDark ? "#FCD34D" : "#D97706",
                    fontWeight: 600,
                    fontSize: "14px",
                    padding: "12px",
                    background: isDark
                      ? "rgba(120, 53, 15, 0.2)"
                      : "rgba(254, 243, 199, 0.5)",
                    borderRadius: "12px",
                    textAlign: "center",
                  }}
                >
                  ⚠️ Only {selectedVariant.stock_quantity} left in stock!
                </Typography>
              ) : (
                <Typography
                  sx={{
                    color: isDark ? "#6EE7B7" : "#047857",
                    fontWeight: 600,
                    fontSize: "14px",
                    padding: "12px",
                    background: isDark
                      ? "rgba(6, 78, 59, 0.2)"
                      : "rgba(209, 250, 229, 0.5)",
                    borderRadius: "12px",
                    textAlign: "center",
                  }}
                >
                  ✓ In Stock ({selectedVariant.stock_quantity} available)
                </Typography>
              )}
            </Box>
          )}

          {/* Add to Cart Button */}
          <AddToCartButton
            fullWidth
            variant="contained"
            disabled={!canAddToCart}
            onClick={handleAddToCart}
            isDark={isDark}
            sx={{ mt: 3 }}
          >
            <ShoppingCart sx={{ mr: 1.5, fontSize: "22px" }} />
            {!selectedColor || !selectedSize
              ? "Please Select Color & Size"
              : isOutOfStock
              ? "Out of Stock"
              : "Add to Cart"}
          </AddToCartButton>
        </DialogContent>
      </DialogContainer>
    </Dialog>
  );
};

export default VariantSelectionDialog;

