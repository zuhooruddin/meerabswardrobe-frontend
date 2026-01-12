/* eslint-disable react-hooks/exhaustive-deps */
import { Add, Remove, LocalShipping, VerifiedUser, Autorenew, ShoppingCartOutlined, FavoriteBorder, Share, Category } from "@mui/icons-material";
import { Box, Grid, Chip, Divider, Tooltip, useTheme, IconButton, styled, keyframes } from "@mui/material";
import BazaarAvatar from "components/BazaarAvatar";
import BazaarButton from "components/BazaarButton";
import LazyImage from "components/LazyImage";
import { H1, H2, H3, H4, H5, H6, Span, Paragraph } from "components/Typography";
import { useAppContext } from "contexts/AppContext";
import useSettings from "hooks/useSettings";
import { useRouter } from "next/router";
import Link from "next/link";
import React, { useCallback, useState, useMemo, useEffect } from "react";
import { FlexBox, FlexRowCenter } from "../flex-box";
import { toast } from "react-toastify";
import BazaarRating from "components/BazaarRating";
import VariantSelector from "./VariantSelector";

// Premium Animations
const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Premium Styled Components
const ProductCard = styled(Box)(({ theme, isDark }) => ({
  background: isDark 
    ? "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)"
    : "linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)",
  borderRadius: "28px",
  padding: "32px",
  boxShadow: isDark
    ? "0 12px 48px rgba(0, 0, 0, 0.5)"
    : "0 12px 48px rgba(0, 0, 0, 0.08)",
  border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)"}`,
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  position: "relative",
  overflow: "hidden",
  animation: `${fadeInUp} 0.6s ease-out`,
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "5px",
    background: "linear-gradient(90deg, #D23F57 0%, #E94560 50%, #FF6B7A 100%)",
  },
  [theme.breakpoints.down("sm")]: {
    padding: "20px",
    borderRadius: "20px",
  },
}));

const ImageGalleryCard = styled(Box)(({ theme, isDark }) => ({
  background: isDark 
    ? "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)"
    : "linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)",
  borderRadius: "24px",
  padding: "24px",
  position: "relative",
  cursor: "zoom-in",
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    transform: "scale(1.02)",
    boxShadow: isDark
      ? "0 16px 48px rgba(0, 0, 0, 0.6)"
      : "0 16px 48px rgba(0, 0, 0, 0.12)",
  },
  [theme.breakpoints.down("sm")]: {
    padding: "16px",
    borderRadius: "18px",
  },
}));

const ThumbnailButton = styled(Box)(({ theme, isSelected, isDark }) => ({
  width: 72,
  height: 72,
  minWidth: 72,
  borderRadius: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
  background: isSelected 
    ? (isDark ? "rgba(210, 63, 87, 0.2)" : "rgba(210, 63, 87, 0.1)")
    : (isDark ? "#0F172A" : "#F8FAFC"),
  border: isSelected ? "3px solid #D23F57" : `2px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.06)"}`,
  boxShadow: isSelected 
    ? "0 8px 24px rgba(210, 63, 87, 0.3)"
    : (isDark ? "0 2px 8px rgba(0, 0, 0, 0.3)" : "0 2px 8px rgba(0, 0, 0, 0.04)"),
  "&:hover": {
    transform: "translateY(-4px) scale(1.05)",
    boxShadow: isDark 
      ? "0 12px 32px rgba(0, 0, 0, 0.5)" 
      : "0 12px 32px rgba(0, 0, 0, 0.1)",
    borderColor: "#D23F57",
  },
  [theme.breakpoints.down("sm")]: {
    width: 60,
    height: 60,
    minWidth: 60,
    borderRadius: "12px",
  },
}));

const PriceCard = styled(Box)(({ theme, isDark }) => ({
  background: isDark
    ? "linear-gradient(135deg, #450A0A 0%, #7F1D1D 50%, #991B1B 100%)"
    : "linear-gradient(135deg, #FFF1F2 0%, #FCE7E8 50%, #FECDD3 100%)",
  padding: "28px",
  borderRadius: "24px",
  border: `2px solid ${isDark ? "rgba(255, 107, 138, 0.3)" : "rgba(210, 63, 87, 0.15)"}`,
  boxShadow: isDark
    ? "0 12px 36px rgba(255, 107, 138, 0.2)"
    : "0 12px 36px rgba(210, 63, 87, 0.12)",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: isDark
      ? "radial-gradient(circle at top right, rgba(255, 107, 138, 0.15), transparent 70%)"
      : "radial-gradient(circle at top right, rgba(210, 63, 87, 0.08), transparent 70%)",
    pointerEvents: "none",
  },
  [theme.breakpoints.down("sm")]: {
    padding: "20px",
    borderRadius: "18px",
  },
}));

const AddToCartButton = styled(BazaarButton)(({ theme, isDark }) => ({
  height: 60,
  borderRadius: "18px",
  fontSize: "17px",
  fontWeight: 700,
  textTransform: "none",
  background: isDark
    ? "linear-gradient(135deg, #FF6B8A 0%, #FF8FA3 100%)"
    : "linear-gradient(135deg, #D23F57 0%, #E94560 100%)",
  boxShadow: isDark
    ? "0 16px 40px rgba(255, 107, 138, 0.4)"
    : "0 16px 40px rgba(210, 63, 87, 0.3)",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "-100%",
    width: "100%",
    height: "100%",
    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
    transition: "left 0.6s ease",
  },
  "&:hover": {
    transform: "translateY(-4px) scale(1.02)",
    boxShadow: isDark
      ? "0 20px 50px rgba(255, 107, 138, 0.5)"
      : "0 20px 50px rgba(210, 63, 87, 0.4)",
    "&::before": {
      left: "100%",
    },
  },
  "&:active": {
    transform: "translateY(-2px) scale(0.98)",
  },
  [theme.breakpoints.down("sm")]: {
    height: 54,
    fontSize: "15px",
    borderRadius: "14px",
  },
}));

const QuantityButton = styled(BazaarButton)(({ theme, isDark, variant }) => ({
  padding: "14px",
  minWidth: 52,
  minHeight: 52,
  borderRadius: "14px",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  ...(variant === "decrease" && {
    background: isDark
      ? "linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)"
      : "white",
    border: isDark ? "none" : "2px solid #FEE2E2",
    "&:hover": {
      background: isDark
        ? "linear-gradient(135deg, #B91C1C 0%, #991B1B 100%)"
        : "#FEE2E2",
      transform: "scale(1.1)",
      boxShadow: "0 6px 16px rgba(220, 38, 38, 0.3)",
    },
  }),
  ...(variant === "increase" && {
    background: isDark
      ? "linear-gradient(135deg, #10B981 0%, #059669 100%)"
      : "white",
    border: isDark ? "none" : "2px solid #D1FAE5",
    "&:hover": {
      background: isDark
        ? "linear-gradient(135deg, #059669 0%, #047857 100%)"
        : "#D1FAE5",
      transform: "scale(1.1)",
      boxShadow: "0 6px 16px rgba(16, 185, 129, 0.3)",
    },
  }),
  [theme.breakpoints.down("sm")]: {
    minWidth: 44,
    minHeight: 44,
    padding: "10px",
  },
}));

const DetailRow = styled(FlexBox)(({ theme, isDark }) => ({
  alignItems: "center",
  padding: "12px 16px",
  borderRadius: "12px",
  marginBottom: "10px",
  background: isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.02)",
  transition: "all 0.25s ease",
  "&:hover": {
    background: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)",
    transform: "translateX(6px)",
  },
}));

const FeatureCard = styled(FlexBox)(({ theme, isDark, color }) => ({
  alignItems: "center",
  padding: "14px 18px",
  borderRadius: "14px",
  background: isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.02)",
  border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)"}`,
  transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    background: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)",
    transform: "translateX(10px)",
    borderColor: color,
    boxShadow: `0 4px 16px ${color}20`,
  },
}));

const CategoryBadge = styled(Chip)(({ theme, isDark }) => ({
  background: isDark
    ? "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)"
    : "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)",
  color: isDark ? "#FFFFFF" : "#1D4ED8",
  fontWeight: 600,
  fontSize: "13px",
  height: "32px",
  borderRadius: "16px",
  border: `1px solid ${isDark ? "rgba(59, 130, 246, 0.3)" : "rgba(59, 130, 246, 0.2)"}`,
  "& .MuiChip-icon": {
    color: isDark ? "#93C5FD" : "#3B82F6",
  },
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
  },
  transition: "all 0.3s ease",
}));

// ================================================================
const ProductIntro = ({ product, slug, total, average, category }) => {
  const theme = useTheme();
  const { settings } = useSettings();
  const isDark = settings.theme === 'dark';
  
  const {
    id,
    mrp,
    length,
    width,
    height,
    name,
    imgGroup,
    manufacturer,
    author,
    aliasCode,
    stock,
    weight,
    isbn,
    salePrice,
    sku,
    publisherFlag,
    discount,
    categoryName,
    categorySlug,
  } = product;

  // Price calculations
  const numericSalePrice = salePrice != null && salePrice !== '' && !isNaN(salePrice) 
    ? parseFloat(salePrice) 
    : (mrp != null && mrp !== '' && !isNaN(mrp) ? parseFloat(mrp) : 0);
  const numericDiscount = discount != null && discount !== '' && !isNaN(discount) 
    ? parseFloat(discount) 
    : 0;
  
  const discountprice = numericSalePrice;
  const calculatedDiscountAmount = (numericSalePrice * numericDiscount) / 100;
  const calculatedDiscountedSubtotal = numericSalePrice - calculatedDiscountAmount;

  const salePrices = isNaN(calculatedDiscountedSubtotal) || calculatedDiscountedSubtotal <= 0 
    ? numericSalePrice 
    : calculatedDiscountedSubtotal;

  const [currency, setCurrency] = useState('PKR');
  const [selectedImage, setSelectedImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Ensure imgGroup is always an array
  const imageGroup = useMemo(() => {
    if (!imgGroup || !Array.isArray(imgGroup) || imgGroup.length === 0) {
      return product.imgUrl ? [product.imgUrl] : [];
    }
    return imgGroup;
  }, [imgGroup, product.imgUrl]);
  
  // Ensure selectedImage is within bounds
  useEffect(() => {
    if (imageGroup && imageGroup.length > 0 && selectedImage >= imageGroup.length) {
      setSelectedImage(0);
    }
  }, [imageGroup, selectedImage]);
  
  // Reset zoom when image changes
  useEffect(() => {
    if (isViewerOpen) {
      setZoomLevel(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [currentImage, isViewerOpen]);
  

  
  
  // Variant selection state (for clothing products)
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [variants, setVariants] = useState(product.variants || product.available_colors ? [] : []);
  const [displayPrice, setDisplayPrice] = useState(salePrices);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedCurrency = localStorage.getItem('currency');
      if (storedCurrency) setCurrency(storedCurrency);
    }
  }, []);

  const imgurl = process.env.NEXT_PUBLIC_IMAGE_BASE_API_URL;
  const localimageurl = process.env.NEXT_PUBLIC_BACKEND_API_BASE + "media/";

  const router = useRouter();
  const routerId = router.query.id;
  const { state, dispatch } = useAppContext();
  const cartList = state.cart;
  const cartItem = cartList.find(
    (item) => item.id === id || item.id === routerId
  );

  const handleImageClick = (ind) => () => {
    if (imageGroup && ind >= 0 && ind < imageGroup.length) {
      setSelectedImage(ind);
      if (isViewerOpen) {
        setCurrentImage(ind);
        setZoomLevel(1);
        setPosition({ x: 0, y: 0 });
      }
    }
  };

  const openImageViewer = useCallback((index) => {
    if (imageGroup && imageGroup.length > 0) {
      const safeIndex = Math.max(0, Math.min(index, imageGroup.length - 1));
      setCurrentImage(safeIndex);
      setSelectedImage(safeIndex); // Sync with selected image
      setZoomLevel(1);
      setPosition({ x: 0, y: 0 });
      setIsViewerOpen(true);
    }
  }, [imageGroup]);

  const closeImageViewer = () => {
    setIsViewerOpen(false);
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 5));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.5, 1));
    if (zoomLevel <= 1) {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleNextImage = () => {
    if (imageGroup && currentImage < imageGroup.length - 1) {
      setCurrentImage(currentImage + 1);
      setZoomLevel(1);
      setPosition({ x: 0, y: 0 });
    }
  };

  const handlePrevImage = () => {
    if (currentImage > 0) {
      setCurrentImage(currentImage - 1);
      setZoomLevel(1);
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseDown = (e) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && zoomLevel > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.2 : 0.2;
      setZoomLevel((prev) => Math.max(1, Math.min(5, prev + delta)));
    }
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isViewerOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeImageViewer();
      } else if (e.key === 'ArrowRight') {
        handleNextImage();
      } else if (e.key === 'ArrowLeft') {
        handlePrevImage();
      } else if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      } else if (e.key === '-') {
        handleZoomOut();
      } else if (e.key === '0') {
        handleResetZoom();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isViewerOpen, currentImage, imageGroup]);

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
          setDisplayPrice(salePrices);
        }
      } else {
        setDisplayPrice(salePrices);
      }
    } else {
      setSelectedVariant(null);
      setDisplayPrice(salePrices);
    }
  }, [selectedColor, selectedSize, variants, salePrices]);

  // Fetch variants if product has variants support
  useEffect(() => {
    if (product.variants && product.variants.length > 0) {
      setVariants(product.variants);
    } else if (product.available_colors && product.available_colors.length > 0) {
      // Product has variant support but variants not loaded, fetch them
      const fetchVariants = async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_API_BASE}getProductVariants?item_id=${product.id}`
          );
          const data = await response.json();
          if (data.success && data.variants) {
            setVariants(data.variants);
          }
        } catch (error) {
          console.error('Error fetching variants:', error);
        }
      };
      fetchVariants();
    }
  }, [product]);

  const handleCartAmountChange = useCallback(
    (amount, addflag) => () => {
      // For clothing products with variants, validate selection
      if (variants.length > 0 && !selectedVariant) {
        toast.error("Please select color and size", { position: toast.POSITION.TOP_RIGHT });
        return;
      }

      // Use variant price if available, otherwise use product price
      const priceToStore = selectedVariant 
        ? (selectedVariant.actual_price || selectedVariant.variant_price || salePrices)
        : (salePrices > 0 ? salePrices : numericSalePrice);

      const payload = {
          mrp,
          salePrice: priceToStore,
          salePrices: priceToStore,
        sku: selectedVariant ? selectedVariant.sku : sku,
          slug,
          price: priceToStore,
          qty: amount,
          name: name,
          image: localimageurl + imgGroup[0],
          id: id || routerId,
        // Variant information for clothing products
        ...(selectedVariant && {
          variant_id: selectedVariant.id,
          selected_color: selectedColor,
          selected_size: selectedSize,
          variant_sku: selectedVariant.sku,
        }),
      };

      dispatch({
        type: "CHANGE_CART_AMOUNT",
        payload,
      });
      
      if (addflag) {
        toast.success("Added to cart", { position: toast.POSITION.TOP_RIGHT });
      } else {
        toast.error("Removed from cart", { position: toast.POSITION.TOP_RIGHT });
      }
    },
    [salePrices, numericSalePrice, mrp, sku, slug, name, localimageurl, imgGroup, id, routerId, dispatch, selectedVariant, selectedColor, selectedSize, variants]
  );

  // Product features for trust badges
  const productFeatures = useMemo(() => [
    { icon: LocalShipping, text: "Free Shipping on Orders over Rs. 2000", color: "#10B981" },
    { icon: VerifiedUser, text: "100% Premium Quality", color: "#3B82F6" },
    { icon: Autorenew, text: "Easy 7 Days Return Policy", color: "#8B5CF6" },
  ], []);

  // Product details for display
  const productDetails = useMemo(() => {
    const details = [];
    if (manufacturer && manufacturer !== "NOT AVAILABLE" && manufacturer !== "null") {
      details.push({ label: "Manufacturer", value: manufacturer });
    }
    if (author && author !== "NOT AVAILABLE" && author !== "null") {
      details.push({ label: "Author", value: author });
    }
    if (weight && weight !== "NOT AVAILABLE" && weight !== "0" && weight !== "null") {
      details.push({ label: "Weight", value: `${weight} grams` });
    }
    if (isbn && isbn !== "NOT AVAILABLE" && isbn !== "null") {
      details.push({ label: "ISBN", value: isbn });
    }
    if (sku && sku !== "") {
      details.push({ label: "SKU / CODE", value: sku, mono: true });
    }
    return details;
  }, [manufacturer, author, weight, isbn, sku]);

  return (
    <Box 
      width="100%" 
      sx={{ 
        px: { xs: 1, sm: 2, md: 0 },
      }}
    >
      <Grid container spacing={{ xs: 2, md: 4 }} justifyContent="space-around">
        {/* Image Gallery Section - Professional Design */}
     {/* Image Gallery Section - Professional E-commerce Design */}
     <Grid item md={6} xs={12}>
          <Box
            sx={{
              position: "sticky",
              top: 100,
              [theme.breakpoints.down("md")]: {
                position: "relative",
                top: 0,
              },
            }}
          >
            <Box
              sx={{
                background: isDark ? "#FFFFFF" : "#FFFFFF",
                borderRadius: "12px",
                border: isDark ? "1px solid #E5E7EB" : "1px solid #E5E7EB",
                overflow: "hidden",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)",
                position: "relative",
              }}
            >
              {/* Discount Badge - Professional Style */}
            {!!numericDiscount && numericDiscount > 0 && (
                <Box
                sx={{
                  position: "absolute",
                    top: 16,
                    right: 16,
                    zIndex: 10,
                    background: "#DC2626",
                  color: "white",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    fontSize: "13px",
                    fontWeight: 700,
                    letterSpacing: "0.5px",
                    boxShadow: "0 2px 8px rgba(220, 38, 38, 0.25)",
                  }}
                >
                  -{Math.round(numericDiscount)}% OFF
                </Box>
              )}

              {/* Main Product Image - Professional Layout with In-Place Zoom */}
              {imageGroup && imageGroup.length > 0 && (
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "1 / 1",
                    background: "#FAFAFA",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    borderRadius: "12px",
                  }}
                >
                  {/* Zoom Container */}
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      height: "100%",
                      overflow: "hidden",
                      cursor: isViewerOpen && zoomLevel > 1 ? (isDragging ? "grabbing" : "grab") : "zoom-in",
                    }}
                    onMouseDown={isViewerOpen ? handleMouseDown : undefined}
                    onMouseMove={isViewerOpen ? handleMouseMove : undefined}
                    onMouseUp={isViewerOpen ? handleMouseUp : undefined}
                    onMouseLeave={isViewerOpen ? handleMouseUp : undefined}
                    onWheel={isViewerOpen ? handleWheel : undefined}
                    onClick={() => {
                      if (!isViewerOpen) {
                        openImageViewer(selectedImage);
                      }
                    }}
                  >
                    <Box
                      sx={{
                        width: "100%",
                        height: "100%",
                        transform: isViewerOpen
                          ? `scale(${zoomLevel}) translate(${position.x / zoomLevel}px, ${position.y / zoomLevel}px)`
                          : "scale(1)",
                        transition: isViewerOpen && !isDragging ? "transform 0.2s ease" : "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <LazyImage
                        width={800}
                        height={800}
                        alt={name ? `${name} - Premium Women's Clothing | Buy Online in Europe at Meerab's Wardrobe` : "Women's Clothing"}
                        loading="eager"
                        priority
                        objectFit="contain"
                        src={localimageurl + imageGroup[selectedImage]}
                        title={name || "Women's Clothing"}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          padding: "32px",
                          userSelect: "none",
                          pointerEvents: "none",
                        }}
                        sizes="(max-width: 768px) 100vw, 50vw"
                        quality={100}
                      />
                    </Box>
                  </Box>

                  {/* Zoom Controls - Only show when zoomed */}
                  {isViewerOpen && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.5,
                        zIndex: 10,
                      }}
                    >
                      {/* Close Button */}
                      <IconButton
                        onClick={closeImageViewer}
                        size="small"
                        sx={{
                          background: "rgba(255, 255, 255, 0.95)",
                          color: "#374151",
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                          "&:hover": {
                            background: "#FFFFFF",
                          },
                        }}
                      >
                        <Box
                          component="svg"
                          sx={{ width: 18, height: 18 }}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </Box>
                      </IconButton>

                      {/* Zoom Controls */}
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          background: "rgba(255, 255, 255, 0.95)",
                          borderRadius: "8px",
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                          overflow: "hidden",
                        }}
                      >
                        <IconButton
                          onClick={handleZoomIn}
                          disabled={zoomLevel >= 5}
                          size="small"
                          sx={{
                            color: "#374151",
                            borderRadius: 0,
                            "&:hover": {
                              background: "#F3F4F6",
                            },
                            "&:disabled": {
                              opacity: 0.3,
                            },
                          }}
                        >
                          <Box
                            component="svg"
                            sx={{ width: 16, height: 16 }}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v16m8-8H4"
                            />
                          </Box>
                        </IconButton>

                        <Box
                          sx={{
                            padding: "4px 8px",
                            fontSize: "11px",
                            fontWeight: 600,
                            color: "#1F2937",
                            textAlign: "center",
                            borderTop: "1px solid #E5E7EB",
                            borderBottom: "1px solid #E5E7EB",
                            background: "#F9FAFB",
                          }}
                        >
                          {Math.round(zoomLevel * 100)}%
                        </Box>

                        <IconButton
                          onClick={handleZoomOut}
                          disabled={zoomLevel <= 1}
                          size="small"
                          sx={{
                            color: "#374151",
                            borderRadius: 0,
                            "&:hover": {
                              background: "#F3F4F6",
                            },
                            "&:disabled": {
                              opacity: 0.3,
                            },
                          }}
                        >
                          <Box
                            component="svg"
                            sx={{ width: 16, height: 16 }}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M20 12H4"
                            />
                          </Box>
                        </IconButton>

                        {zoomLevel > 1 && (
                          <IconButton
                            onClick={handleResetZoom}
                            size="small"
                            sx={{
                              color: "#374151",
                              fontSize: "10px",
                              fontWeight: 500,
                              borderTop: "1px solid #E5E7EB",
                              borderRadius: 0,
                              "&:hover": {
                                background: "#F3F4F6",
                              },
                            }}
                          >
                            Reset
                          </IconButton>
                        )}
                      </Box>
                    </Box>
                  )}

                  {/* Zoom Hint - Show when not zoomed */}
                  {!isViewerOpen && (
                    <Box
                      className="zoom-hint"
                      sx={{
                        position: "absolute",
                        bottom: 16,
                        right: 16,
                        display: "flex",
                        alignItems: "center",
                        gap: 0.75,
                        padding: "8px 12px",
                        background: "rgba(255, 255, 255, 0.95)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(0, 0, 0, 0.08)",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#374151",
                        opacity: 0,
                        transition: "opacity 0.2s ease",
                        pointerEvents: "none",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <Box
                        component="svg"
                        sx={{ width: 14, height: 14 }}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                        />
                      </Box>
                      Click to zoom
                    </Box>
                  )}
                </Box>
              )}

              {/* Zoom functionality is now in-place in the image container above */}

              {/* Thumbnail Gallery - Clean & Professional */}
              {imageGroup && imageGroup.length > 1 && (
                <Box
                  sx={{
                    borderTop: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "#E5E7EB"}`,
                    padding: "12px",
                    background: isDark ? "#1E293B" : "#FFFFFF",
                  }}
                >
                  <FlexBox
                    gap={1}
                    sx={{
                      overflowX: "auto",
                      overflowY: "hidden",
                      justifyContent: { xs: "flex-start", sm: "center" },
                      scrollBehavior: "smooth",
                      "&::-webkit-scrollbar": {
                        height: "3px",
                      },
                "&::-webkit-scrollbar-track": {
                        background: isDark ? "#0F172A" : "#F9FAFB",
                },
                "&::-webkit-scrollbar-thumb": {
                        background: isDark ? "#475569" : "#CBD5E1",
                        borderRadius: "2px",
                        "&:hover": {
                          background: isDark ? "#64748B" : "#94A3B8",
                        },
                },
              }}
            >
                    {imageGroup.map((url, ind) => (
                      <Box
                  key={ind}
                  onClick={handleImageClick(ind)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleImageClick(ind)();
                    }
                  }}
                        role="button"
                        tabIndex={0}
                        aria-label={`View ${name} image ${ind + 1}`}
                        aria-pressed={selectedImage === ind}
                        sx={{
                          position: "relative",
                          width: 70,
                          height: 70,
                          minWidth: 70,
                          borderRadius: "6px",
                          overflow: "hidden",
                          cursor: "pointer",
                          border: `2px solid ${
                            selectedImage === ind
                              ? "#D23F57"
                              : isDark
                              ? "rgba(255, 255, 255, 0.1)"
                              : "#E5E7EB"
                          }`,
                          background: isDark ? "#0F172A" : "#FAFAFA",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            borderColor: selectedImage === ind
                              ? "#D23F57"
                              : isDark
                              ? "rgba(255, 255, 255, 0.2)"
                              : "#CBD5E1",
                            transform: "translateY(-2px)",
                            boxShadow: isDark
                              ? "0 4px 8px rgba(0, 0, 0, 0.3)"
                              : "0 4px 8px rgba(0, 0, 0, 0.1)",
                          },
                        }}
                >
                  <BazaarAvatar
                          src={localimageurl + url}
                    variant="square"
                          sx={{
                            width: "100%",
                            height: "100%",
                            borderRadius: "4px",
                            objectFit: "cover",
                          }}
                    alt={`${name} - Image ${ind + 1}`}
                  />
                        {selectedImage === ind && (
                          <Box
                            sx={{
                              position: "absolute",
                              inset: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              background: "rgba(210, 63, 87, 0.15)",
                              pointerEvents: "none",
                            }}
                          />
                        )}
                      </Box>
              ))}
            </FlexBox>
                </Box>
              )}
            </Box>
          </Box>
        </Grid>

        {/* Product Details Section */}
        <Grid item md={6} xs={12}>
          <ProductCard isDark={isDark} sx={{ animationDelay: "0.2s" }}>
            {/* Category Badge */}
            {(categoryName || category || product.category) && (
              <Box mb={2}>
                <Link href={`/category/${categorySlug || product.categorySlug || ''}`} passHref>
                  <a style={{ textDecoration: 'none' }}>
                    <CategoryBadge
                      icon={<Category sx={{ fontSize: 16 }} />}
                      label={categoryName || category || product.category || 'Category'}
                      isDark={isDark}
                      clickable
                    />
                  </a>
                </Link>
              </Box>
            )}

            {/* Product Title */}
            <H1 
              mb={2.5} 
              component="h1" 
              sx={{ 
                fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2.25rem" }, 
                fontWeight: 800,
                color: isDark ? "#F9FAFB" : "#0F172A",
                lineHeight: 1.2,
                letterSpacing: "-0.025em",
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              {name}
            </H1>

            {/* Rating Section */}
            <FlexBox 
              alignItems="center" 
              mb={3} 
              sx={{
                background: isDark
                  ? "linear-gradient(135deg, #422006 0%, #713F12 100%)"
                  : "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)",
                padding: { xs: "10px 14px", md: "14px 20px" },
                borderRadius: "16px",
                width: "fit-content",
                border: `1px solid ${isDark ? "rgba(251, 191, 36, 0.2)" : "rgba(251, 191, 36, 0.3)"}`,
                boxShadow: "0 4px 16px rgba(251, 191, 36, 0.15)",
              }}
            >
              <Box 
                sx={{ 
                  fontWeight: 700, 
                  color: isDark ? "#FCD34D" : "#92400E", 
                  mr: 1.5, 
                  fontSize: { xs: "13px", md: "15px" } 
                }}
              >
                Rating:
              </Box>
              <Box mx={1}>
                <BazaarRating
                  color="warn"
                  fontSize={{ xs: "1.1rem", md: "1.35rem" }}
                  value={average || 0}
                  readOnly
                />
              </Box>
              <H6 sx={{ 
                color: isDark ? "#FCD34D" : "#92400E", 
                fontWeight: 700, 
                fontSize: { xs: "13px", md: "15px" },
                ml: 0.5,
              }}>
                ({total || 0} reviews)
              </H6>
            </FlexBox>

            {/* Product Details */}
            {productDetails.length > 0 && (
              <Box sx={{ mb: 3 }}>
                {productDetails.map((detail, idx) => (
                  <DetailRow key={idx} isDark={isDark}>
                    <Span sx={{ 
                      fontWeight: 600, 
                      color: isDark ? "#9CA3AF" : "#64748B", 
                      fontSize: "14px", 
                      minWidth: "120px" 
                    }}>
                      {detail.label}:
                    </Span>
                    <H6 
                      ml={1} 
                      sx={{ 
                        color: isDark ? "#E5E7EB" : "#1E293B", 
                        fontSize: "14px",
                        fontFamily: detail.mono ? "'JetBrains Mono', monospace" : "inherit",
                      }}
                    >
                      {detail.value}
                    </H6>
                  </DetailRow>
                ))}
                
                {/* Dimensions */}
                {(length != 0.0 || width != 0.0 || height != 0.0) && (
                  <DetailRow isDark={isDark}>
                    <Span sx={{ 
                      fontWeight: 600, 
                      color: isDark ? "#9CA3AF" : "#64748B", 
                      fontSize: "14px", 
                      minWidth: "120px" 
                    }}>
                      Dimensions:
                    </Span>
                    <H6 ml={1} sx={{ color: isDark ? "#E5E7EB" : "#1E293B", fontSize: "14px" }}>
                      {length && length != 0.0 ? `L: ${length}` : ""}
                      {length != 0.0 && width != 0.0 ? " × " : ""}
                      {width && width != 0.0 ? `W: ${width}` : ""}
                      {(length != 0.0 || width != 0.0) && height != 0.0 ? " × " : ""}
                      {height && height != 0.0 ? `H: ${height}` : ""}
                    </H6>
                  </DetailRow>
                )}
              </Box>
            )}

            <Divider sx={{ my: 3, borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)" }} />

            {/* Pricing Card */}
            <PriceCard isDark={isDark} sx={{ mb: 3 }}>
              <FlexBox alignItems="baseline" flexWrap="wrap" position="relative" zIndex={1}>
                <H2 
                  component="h2" 
                  sx={{ 
                    background: isDark
                      ? "linear-gradient(135deg, #FECDD3 0%, #FFB3C1 100%)"
                      : "linear-gradient(135deg, #D23F57 0%, #E94560 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontSize: { xs: "2rem", md: "2.75rem" },
                    fontWeight: 900,
                    lineHeight: 1,
                    letterSpacing: "-0.03em",
                    fontFamily: "'Outfit', sans-serif",
                  }}
                >
                  {currency} {displayPrice?.toFixed(2) || salePrices?.toFixed(2) || '0.00'}
                </H2>
                
                {!!numericDiscount && numericDiscount > 0 && (
                  <>
                    <H4 
                      component="span" 
                      sx={{ 
                        color: isDark ? "#9CA3AF" : "#64748B",
                        ml: 2,
                        fontSize: { xs: "1rem", md: "1.2rem" },
                        textDecoration: "line-through",
                      }}
                    >
                      {currency} {discountprice?.toFixed(2) || '0.00'}
                    </H4>
                    <Chip
                      label={`SAVE ${Math.round(numericDiscount)}%`}
                      sx={{
                        background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                        color: "white",
                        height: "32px",
                        borderRadius: "16px",
                        fontSize: "13px",
                        fontWeight: 700,
                        ml: 2,
                        boxShadow: "0 4px 14px rgba(16, 185, 129, 0.35)",
                      }}
                    />
                  </>
                )}
              </FlexBox>
              
              {/* Variant Selector for Clothing Products - Show prominently */}
              {(variants && variants.length > 0) || (product.available_colors && product.available_colors.length > 0) ? (
                <Box 
                  mt={3} 
                  position="relative" 
                  zIndex={1}
                  sx={{
                    background: isDark 
                      ? "rgba(255, 255, 255, 0.05)" 
                      : "rgba(0, 0, 0, 0.02)",
                    padding: "20px",
                    borderRadius: "16px",
                    border: `2px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)"}`,
                  }}
                >
                  <H6 
                    mb={2} 
                    sx={{ 
                      fontWeight: 700, 
                      fontSize: "16px",
                      color: isDark ? "#F9FAFB" : "#0F172A",
                    }}
                  >
                    Select Options:
                  </H6>
                  {variants && variants.length > 0 ? (
                    <VariantSelector
                      variants={variants}
                      selectedColor={selectedColor}
                      selectedSize={selectedSize}
                      onColorChange={setSelectedColor}
                      onSizeChange={setSelectedSize}
                      productId={id}
                    />
                  ) : (
                    <Box>
                      <H6 mb={1.5} sx={{ fontWeight: 600, fontSize: "14px", color: isDark ? "#D1D5DB" : "#475569" }}>
                        Loading variant options...
                      </H6>
                    </Box>
                  )}
                </Box>
              ) : null}
              
              {/* Stock Status - Show variant stock if variant selected */}
              <FlexBox alignItems="center" mt={3} position="relative" zIndex={1}>
                {(() => {
                  // Check variant stock if variant is selected
                  if (selectedVariant) {
                    const variantStock = selectedVariant.stock_quantity || 0;
                    if (variantStock === 0) {
                      return (
                        <Chip
                          label="⚠️ This variant is out of stock"
                          sx={{
                            background: isDark
                              ? "linear-gradient(135deg, #7F1D1D 0%, #991B1B 100%)"
                              : "linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)",
                            color: isDark ? "#FCA5A5" : "#B91C1C",
                            height: "40px",
                            px: 2.5,
                            fontWeight: 700,
                            fontSize: "15px",
                            borderRadius: "14px",
                            border: `2px solid ${isDark ? "#DC2626" : "#FCA5A5"}`,
                          }}
                        />
                      );
                    } else if (variantStock <= 5) {
                      return (
                        <Chip
                          icon={<VerifiedUser sx={{ color: isDark ? "#FCD34D" : "#D97706", fontSize: 20 }} />}
                          label={`⚠️ Only ${variantStock} left in stock!`}
                          sx={{
                            background: isDark
                              ? "linear-gradient(135deg, #78350F 0%, #92400E 100%)"
                              : "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)",
                            color: isDark ? "#FCD34D" : "#D97706",
                            height: "40px",
                            px: 2.5,
                            fontWeight: 700,
                            fontSize: "15px",
                            borderRadius: "14px",
                            border: `2px solid ${isDark ? "#F59E0B" : "#FCD34D"}`,
                          }}
                        />
                      );
                    } else {
                      return (
                        <Chip
                          icon={<VerifiedUser sx={{ color: isDark ? "#6EE7B7" : "#047857", fontSize: 20 }} />}
                          label={`✓ In Stock (${variantStock} available)`}
                          sx={{
                            background: isDark
                              ? "linear-gradient(135deg, #064E3B 0%, #065F46 100%)"
                              : "linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)",
                            color: isDark ? "#6EE7B7" : "#047857",
                            height: "40px",
                            px: 2.5,
                            fontWeight: 700,
                            fontSize: "15px",
                            borderRadius: "14px",
                            border: `2px solid ${isDark ? "#10B981" : "#6EE7B7"}`,
                          }}
                        />
                      );
                    }
                  }
                  // Fallback to product stock
                  return stock === "0.00" ? (
                    <Chip
                      label="⚠️ Out of Stock"
                      sx={{
                        background: isDark
                          ? "linear-gradient(135deg, #7F1D1D 0%, #991B1B 100%)"
                          : "linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)",
                        color: isDark ? "#FCA5A5" : "#B91C1C",
                        height: "40px",
                        px: 2.5,
                        fontWeight: 700,
                        fontSize: "15px",
                        borderRadius: "14px",
                        border: `2px solid ${isDark ? "#DC2626" : "#FCA5A5"}`,
                      }}
                    />
                  ) : (
                    <Chip
                      icon={<VerifiedUser sx={{ color: isDark ? "#6EE7B7" : "#047857", fontSize: 20 }} />}
                      label="✓ In Stock - Ready to Ship"
                      sx={{
                        background: isDark
                          ? "linear-gradient(135deg, #064E3B 0%, #065F46 100%)"
                          : "linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)",
                        color: isDark ? "#6EE7B7" : "#047857",
                        height: "40px",
                        px: 2.5,
                        fontWeight: 700,
                        fontSize: "15px",
                        borderRadius: "14px",
                        border: `2px solid ${isDark ? "#10B981" : "#6EE7B7"}`,
                      }}
                    />
                  );
                })()}
              </FlexBox>
            </PriceCard>

            {/* Add to Cart / Quantity Controls */}
            {(() => {
              // Check if product has variants
              const hasVariants = (variants && variants.length > 0) || (product.available_colors && product.available_colors.length > 0);
              
              // Check stock status
              const isOutOfStock = stock === "0.00" || (selectedVariant && selectedVariant.stock_quantity === 0);
              
              // Check if variant selection is required but not done
              const needsVariantSelection = hasVariants && !selectedVariant;
              
              if (isOutOfStock) {
                return (
                  <AddToCartButton
                    disabled
                    fullWidth
                    isDark={isDark}
                    sx={{
                      mb: 3,
                      background: isDark ? "#374151" : "#E5E7EB",
                      color: isDark ? "#9CA3AF" : "#6B7280",
                      boxShadow: "none",
                      cursor: "not-allowed",
                      "&:hover": {
                        transform: "none",
                        boxShadow: "none",
                      },
                    }}
                  >
                    Out of Stock - Notify When Available
                  </AddToCartButton>
                );
              }
              
              if (needsVariantSelection) {
                return (
                  <AddToCartButton
                    fullWidth
                    variant="contained"
                    isDark={isDark}
                    disabled
                    sx={{ 
                      mb: 3, 
                      opacity: 0.6, 
                      cursor: "not-allowed",
                      background: isDark ? "#374151" : "#E5E7EB",
                      "&:hover": {
                        transform: "none",
                        boxShadow: "none",
                      },
                    }}
                  >
                    <ShoppingCartOutlined sx={{ mr: 1.5, fontSize: "22px" }} />
                    Please Select Color & Size First
                  </AddToCartButton>
                );
              }
              
              if (!cartItem?.qty) {
                return (
                  <AddToCartButton
                    fullWidth
                    variant="contained"
                    isDark={isDark}
                    onClick={handleCartAmountChange(1, true)}
                    aria-label={`Add ${name} to cart`}
                    sx={{ mb: 3 }}
                  >
                    <ShoppingCartOutlined sx={{ mr: 1.5, fontSize: "22px" }} />
                    Add to Cart
                  </AddToCartButton>
                );
              }
              
              // Quantity controls
              return (
                <FlexBox 
                  alignItems="center" 
                  justifyContent="space-between" 
                  mb={3} 
                  sx={{
                    background: isDark
                      ? "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)"
                      : "linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)",
                    padding: { xs: "14px 18px", md: "18px 24px" },
                    borderRadius: "18px",
                    border: `2px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)"}`,
                    boxShadow: isDark
                      ? "0 6px 20px rgba(0, 0, 0, 0.4)"
                      : "0 6px 20px rgba(0, 0, 0, 0.06)",
                  }}
                >
                  <QuantityButton
                    variant="decrease"
                    isDark={isDark}
                    onClick={handleCartAmountChange(cartItem?.qty - 1, false)}
                    aria-label={`Decrease quantity of ${name}`}
                  >
                    <Remove fontSize="small" />
                  </QuantityButton>

                  <H3 
                    fontWeight="800" 
                    sx={{ 
                      fontSize: { xs: "1.5rem", md: "1.75rem" },
                      color: isDark ? "#F9FAFB" : "#0F172A",
                      minWidth: "60px",
                      textAlign: "center",
                      fontFamily: "'Outfit', sans-serif",
                    }}
                  >
                    {cartItem?.qty.toString().padStart(2, "0")}
                  </H3>

                  <QuantityButton
                    variant="increase"
                    isDark={isDark}
                    onClick={handleCartAmountChange(cartItem?.qty + 1, true)}
                    aria-label={`Increase quantity of ${name}`}
                  >
                    <Add fontSize="small" />
                  </QuantityButton>
                </FlexBox>
              );
            })()}

            {/* Trust Badges / Features */}
            <Box>
              <Grid container spacing={1.5}>
                {productFeatures.map((feature, idx) => (
                  <Grid item xs={12} key={idx}>
                    <FeatureCard isDark={isDark} color={feature.color}>
                      <feature.icon sx={{ 
                        color: feature.color, 
                        fontSize: "26px", 
                        mr: 2,
                      }} />
                      <Span sx={{ 
                        fontSize: "14px", 
                        fontWeight: 600,
                        color: isDark ? "#D1D5DB" : "#475569",
                      }}>
                        {feature.text}
                      </Span>
                    </FeatureCard>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </ProductCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductIntro;
