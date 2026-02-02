import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  Tooltip,
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
  [theme.breakpoints.down('sm')]: {
    borderRadius: "12px",
    maxWidth: "100%",
  },
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
  [theme.breakpoints.down('sm')]: {
    borderRadius: "8px",
    marginBottom: "12px",
  },
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
  [theme.breakpoints.down('sm')]: {
    width: "60px",
    height: "60px",
    borderRadius: "6px",
    border: selected ? `2px solid ${theme.palette.primary.main}` : `1.5px solid ${theme.palette.grey[300]}`,
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
  [theme.breakpoints.down('sm')]: {
    width: "40px",
    height: "40px",
    border: selected ? `2.5px solid ${theme.palette.primary.main}` : `1.5px solid ${theme.palette.grey[300]}`,
    "&::after": {
      width: "16px",
      height: "16px",
    },
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
  borderRadius: "12px",
  background: disabled
    ? theme.palette.grey[300] 
    : "linear-gradient(135deg, #D23F57 0%, #E94560 100%)",
  color: disabled ? theme.palette.text.disabled : "#fff",
  cursor: disabled ? "not-allowed" : "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  fontWeight: 700,
  fontSize: "16px",
  letterSpacing: "0.02em",
  transition: "all 0.3s ease",
  boxShadow: disabled ? "none" : "0 4px 14px rgba(210, 63, 87, 0.4)",
  "&:hover": {
    background: disabled 
      ? theme.palette.grey[300] 
      : "linear-gradient(135deg, #B8324F 0%, #D23F57 100%)",
    transform: disabled ? "none" : "translateY(-2px)",
    boxShadow: disabled ? "none" : "0 6px 20px rgba(210, 63, 87, 0.5)",
  },
  "&:active": {
    transform: disabled ? "none" : "translateY(0)",
  },
  [theme.breakpoints.down('sm')]: {
    padding: "12px 20px",
    fontSize: "14px",
    borderRadius: "10px",
    gap: "6px",
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
  const [currency, setCurrency] = useState('Euro');

  // Image URL construction - same as ProductIntro.jsx
  const imgbaseurl = process.env.NEXT_PUBLIC_IMAGE_BASE_API_URL;
  const backendBase = process.env.NEXT_PUBLIC_BACKEND_API_BASE || '';
  
  // Extract domain from backendBase: https://api.meerabs.com
  const domainMatch = backendBase.match(/^(https?:\/\/[^\/]+)/);
  const domain = domainMatch ? domainMatch[1] : 'https://api.meerabs.com';
  
  // Construct media URL: https://api.meerabs.com/media/
  const localimageurl = domain + '/media/';

  // Professional helper function to normalize image URLs - same as ProductIntro.jsx
  const getImageUrl = useCallback((imagePath) => {
    if (!imagePath) {
      return '';
    }
    
    // If already a full URL (starts with http/https), return as is (but normalize double paths)
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      let url = imagePath;
      // Remove duplicate paths if present
      if (url.includes('/api/media//api/media/') || url.includes('/api/media//media/')) {
        url = url.replace(/\/api\/media\/+\/api\/media\//g, '/media/');
        url = url.replace(/\/api\/media\/+\/media\//g, '/media/');
      }
      return url;
    }
    
    // Normalize the path by removing any existing /api/media/, /media/, or api/media/ prefixes
    let normalizedPath = imagePath;
    
    // Remove /api/media/ if present
    if (normalizedPath.includes('/api/media/')) {
      const parts = normalizedPath.split('/api/media/');
      normalizedPath = parts[parts.length - 1];
    }
    
    // Remove /media/ if present at the start
    if (normalizedPath.startsWith('/media/')) {
      normalizedPath = normalizedPath.substring(7);
    } else if (normalizedPath.startsWith('media/')) {
      normalizedPath = normalizedPath.substring(6);
    }
    
    // Remove /api/media/ if present at the start (after previous checks)
    if (normalizedPath.startsWith('/api/media/')) {
      normalizedPath = normalizedPath.substring(11);
    } else if (normalizedPath.startsWith('api/media/')) {
      normalizedPath = normalizedPath.substring(10);
    }
    
    // Remove leading slash if present
    normalizedPath = normalizedPath.startsWith('/') ? normalizedPath.substring(1) : normalizedPath;
    
    // Use the base URL
    let baseUrl = localimageurl;
    baseUrl = baseUrl.replace(/\/api\/media\//g, '/media/');
    baseUrl = baseUrl.replace(/\/api\/media$/g, '/media/');
    baseUrl = baseUrl.replace(/\/+$/, '') + '/';
    
    // Ensure normalizedPath doesn't start with /
    normalizedPath = normalizedPath.startsWith('/') ? normalizedPath.substring(1) : normalizedPath;
    
    // Construct final URL
    return baseUrl + normalizedPath;
  }, [localimageurl]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedCurrency = localStorage.getItem('currency');
      if (storedCurrency) setCurrency(storedCurrency);
    }
  }, []);

  // Map color names to hex codes
  const getColorHex = useCallback((colorName, providedHex) => {
    // If hex is provided and valid, use it
    if (providedHex && /^#[0-9A-F]{6}$/i.test(providedHex)) {
      return providedHex;
    }
    
    // Map common color names to hex codes
    const colorMap = {
      // Basic colors
      'black': '#000000',
      'white': '#FFFFFF',
      'grey': '#808080',
      'gray': '#808080',
      'red': '#FF0000',
      'blue': '#0000FF',
      'green': '#008000',
      'yellow': '#FFFF00',
      'orange': '#FFA500',
      'purple': '#800080',
      'pink': '#FFC0CB',
      'brown': '#A52A2A',
      'beige': '#F5F5DC',
      'navy': '#000080',
      'maroon': '#800000',
      'olive': '#808000',
      'lime': '#00FF00',
      'aqua': '#00FFFF',
      'teal': '#008080',
      'silver': '#C0C0C0',
      'gold': '#FFD700',
      'bronze': '#CD7F32',
      
      // Extended colors
      'burgundy': '#800020',
      'wine': '#722F37',
      'crimson': '#DC143C',
      'scarlet': '#FF2400',
      'coral': '#FF7F50',
      'salmon': '#FA8072',
      'peach': '#FFE5B4',
      'apricot': '#FBCEB1',
      'tan': '#D2B48C',
      'khaki': '#C3B091',
      'mustard': '#FFDB58',
      'amber': '#FFBF00',
      'ivory': '#FFFFF0',
      'cream': '#FFFDD0',
      'champagne': '#F7E7CE',
      'coffee': '#6F4E37',
      'chocolate': '#7B3F00',
      'caramel': '#AF6E4D',
      'honey': '#FFC30B',
      'mint': '#98FF98',
      'emerald': '#50C878',
      'jade': '#00A86B',
      'turquoise': '#40E0D0',
      'cyan': '#00FFFF',
      'sky blue': '#87CEEB',
      'royal blue': '#4169E1',
      'indigo': '#4B0082',
      'violet': '#8A2BE2',
      'lavender': '#E6E6FA',
      'lilac': '#C8A2C8',
      'plum': '#8E4585',
      'magenta': '#FF00FF',
      'fuchsia': '#FF00FF',
      'rose': '#FF007F',
      'blush': '#DE5D83',
      'dusty rose': '#C9A9A6',
      'mauve': '#E0B0FF',
      'taupe': '#483C32',
      'charcoal': '#36454F',
      'slate': '#708090',
      'steel': '#4682B4',
      'gunmetal': '#2C3539',
      'bronze': '#CD7F32',
      'copper': '#B87333',
      'rust': '#B7410E',
      'terracotta': '#E2725B',
      'coral': '#FF7F50',
      'salmon': '#FA8072',
      'peach': '#FFE5B4',
      'nude': '#E3BC9A',
      'skin': '#E8B4A0',
      'beige': '#F5F5DC',
      'ivory': '#FFFFF0',
      'cream': '#FFFDD0',
      'off white': '#FAF9F6',
      'ecru': '#C2B280',
      
      // Special colors from product names
      'dalia': '#FF69B4',
      'crystal': '#B8E6E6',
      'sapphire': '#0F52BA',
      'zircon': '#E8E8E8',
      'feroza': '#00CED1',
      'asmani nila': '#1E90FF',
      'pista': '#90EE90',
      'bottle green': '#006A4E',
      'mehroon': '#800000',
      'perple': '#800080',
    };
    
    // Normalize color name for lookup
    const normalizedColor = (colorName || '').toLowerCase().trim();
    
    // Try exact match first
    if (colorMap[normalizedColor]) {
      return colorMap[normalizedColor];
    }
    
    // Try partial match (e.g., "dark blue" contains "blue")
    for (const [key, hex] of Object.entries(colorMap)) {
      if (normalizedColor.includes(key) || key.includes(normalizedColor)) {
        return hex;
      }
    }
    
    // If no match found, return a default color based on first letter
    // This provides some variety instead of all grey
    const firstChar = normalizedColor.charAt(0);
    const defaultColors = {
      'a': '#FF6B6B', 'b': '#4ECDC4', 'c': '#45B7D1', 'd': '#FFA07A',
      'e': '#98D8C8', 'f': '#F7DC6F', 'g': '#BB8FCE', 'h': '#85C1E2',
      'i': '#F8B739', 'j': '#52BE80', 'k': '#E74C3C', 'l': '#3498DB',
      'm': '#9B59B6', 'n': '#1ABC9C', 'o': '#E67E22', 'p': '#E91E63',
      'q': '#00BCD4', 'r': '#F44336', 's': '#795548', 't': '#607D8B',
      'u': '#3F51B5', 'v': '#9C27B0', 'w': '#FFFFFF', 'x': '#FFC107',
      'y': '#FFEB3B', 'z': '#009688'
    };
    
    return defaultColors[firstChar] || '#CCCCCC';
  }, []);

  // Consistent discount calculation: discount is applied to MRP, not salePrice
  // Use useMemo to ensure recalculation when product values change
  // IMPORTANT: Always calculate from MRP when discount exists to avoid double discounting
  const { numericMrp, numericDiscount, baseFinalSalePrice } = useMemo(() => {
    // Always use the MRP passed from product cards (this should be the original MRP before discount)
    let mrp = product?.mrp != null && !isNaN(product.mrp) ? parseFloat(product.mrp) : 0;
    const discount = product?.discount != null && !isNaN(product.discount) ? parseFloat(product.discount) : 0;
    const passedSalePrice = product?.salePrice != null && !isNaN(product.salePrice) ? parseFloat(product.salePrice) : 0;
    
    // CRITICAL: When discount exists, ALWAYS calculate from MRP, ignoring any passed salePrice
    // This prevents double discounting (product cards may pass already-discounted prices)
    let finalPrice;
    if (discount > 0 && mrp > 0) {
      // Calculate discount amount from MRP (original price)
      const discountAmount = (mrp * discount) / 100;
      // Calculate final price by applying discount to MRP
      finalPrice = mrp - discountAmount;
    } else if (passedSalePrice > 0) {
      // No discount, use passed salePrice
      finalPrice = passedSalePrice;
    } else {
      // Fallback to MRP
      finalPrice = mrp;
    }
    
    
    return {
      numericMrp: mrp,
      numericDiscount: discount,
      baseFinalSalePrice: finalPrice,
    };
  }, [product?.mrp, product?.discount, product?.salePrice, product?.id]);

  // Initialize displayPrice from memoized value
  const [displayPrice, setDisplayPrice] = useState(baseFinalSalePrice || 0);

  // Update price when product or baseFinalSalePrice changes - ensure we always use the latest calculation
  useEffect(() => {
    if (product && !selectedVariant) {
      // Always use the memoized baseFinalSalePrice which is always up-to-date
      setDisplayPrice(baseFinalSalePrice);
    }
  }, [product?.mrp, product?.discount, product?.salePrice, product?.id, selectedVariant, baseFinalSalePrice]);

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
          // Use getColorHex to get proper color hex from name or provided hex
          const colorHex = getColorHex(variant.color, variant.color_hex);
          colorsMap.set(variant.color, {
            color: variant.color,
            color_hex: colorHex,
          });
        }
      }
    });
    return Array.from(colorsMap.values());
  }, [variants, getColorHex]);

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
        // Get variant price - prioritize variant_price (MRP) if available
        const variantMrp = variant.variant_price;
        const variantActualPrice = variant.actual_price || variant.price;
        
        if (variantMrp && variantMrp > 0) {
          // Variant has explicit MRP - check if it matches product MRP
          const priceDifference = Math.abs(variantMrp - numericMrp);
          const isSameBasePrice = priceDifference < 0.01; // Allow small floating point differences
          
          let finalVariantPrice = parseFloat(variantMrp);
          
          // Only apply product discount if variant uses the same base price as product
          // This prevents double discounting when variant has different pricing structure
          if (numericDiscount > 0 && numericMrp > 0 && isSameBasePrice) {
            // Variant uses same base price as product, apply product discount
            const discountAmount = (finalVariantPrice * numericDiscount) / 100;
            finalVariantPrice = finalVariantPrice - discountAmount;
          }
          // If variant has different base price, use it as-is (no discount applied)
          
          setDisplayPrice(finalVariantPrice);
        } else if (variantActualPrice && variantActualPrice > 0) {
          // No explicit variant MRP, use actual_price as-is (backend calculated, may already be final)
          // Don't apply discount to avoid double discounting
          setDisplayPrice(parseFloat(variantActualPrice));
        } else {
          // Fallback to memoized calculated product price
          setDisplayPrice(baseFinalSalePrice);
        }
      } else {
        // No variant found, use memoized calculated product price
        setDisplayPrice(baseFinalSalePrice);
      }
    } else {
      setSelectedVariant(null);
      // Use memoized calculated product price when no variant selected
      setDisplayPrice(baseFinalSalePrice);
    }
  }, [selectedColor, selectedSize, variants, product?.mrp, product?.discount, product?.salePrice, product?.id, numericDiscount, numericMrp, baseFinalSalePrice]);

  // Reset selections when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setSelectedColor(null);
      setSelectedSize(null);
      setSelectedVariant(null);
      setSelectedImageIndex(0);
    } else {
      // When dialog opens, use memoized calculated price
      setDisplayPrice(baseFinalSalePrice);
      
      if (availableColors.length > 0 && !selectedColor) {
        // Auto-select first color
        setSelectedColor(availableColors[0].color);
      }
    }
  }, [open, availableColors, selectedColor, baseFinalSalePrice]);

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

    // Get variant price - prioritize variant_price (MRP) if available
    const variantMrp = selectedVariant.variant_price;
    const variantActualPrice = selectedVariant.actual_price || selectedVariant.price;
    let priceToStore;
    
    if (variantMrp && variantMrp > 0) {
      // Variant has explicit MRP - check if it matches product MRP
      const priceDifference = Math.abs(variantMrp - numericMrp);
      const isSameBasePrice = priceDifference < 0.01; // Allow small floating point differences
      
      let finalVariantPrice = parseFloat(variantMrp);
      
      // Only apply product discount if variant uses the same base price as product
      // This prevents double discounting when variant has different pricing structure
      if (numericDiscount > 0 && numericMrp > 0 && isSameBasePrice) {
        // Variant uses same base price as product, apply product discount
        const discountAmount = (finalVariantPrice * numericDiscount) / 100;
        finalVariantPrice = finalVariantPrice - discountAmount;
      }
      // If variant has different base price, use it as-is (no discount applied)
      
      priceToStore = finalVariantPrice;
    } else if (variantActualPrice && variantActualPrice > 0) {
      // No explicit variant MRP, use actual_price as-is (backend calculated, may already be final)
      // Don't apply discount to avoid double discounting
      priceToStore = parseFloat(variantActualPrice);
    } else {
      // No variant price, use calculated product price
      priceToStore = baseFinalSalePrice;
    }
    
    // Use variant MRP if available, otherwise use product MRP
    const variantMrpForCart = variantMrp && variantMrp > 0 
      ? parseFloat(variantMrp)
      : (variantActualPrice && variantActualPrice > 0 ? parseFloat(variantActualPrice) : numericMrp);
    
    const imageUrl = productImages[selectedImageIndex] || productImages[0] || getImageUrl(product?.image || product?.imgUrl || '');
    const image = imageUrl;

    const payload = {
      mrp: variantMrpForCart,
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
  }, [selectedVariant, selectedColor, selectedSize, product, dispatch, onClose, onAddToCart, selectedImageIndex, baseFinalSalePrice, numericMrp, numericDiscount, productImages, getImageUrl]);

  const isOutOfStock = selectedVariant && selectedVariant.stock_quantity === 0;
  const canAddToCart = selectedVariant && !isOutOfStock;

  // Get product images - same logic as ProductIntro.jsx
  // Check for gallery field first (from API), then imgGroup, then fallback to single image
  const productImages = React.useMemo(() => {
    let images = [];
    
    // Priority 1: Check for gallery field (from getItemDetailWithVariants API)
    if (product?.gallery && Array.isArray(product.gallery) && product.gallery.length > 0) {
      images = product.gallery;
    }
    // Priority 2: Check for imgGroup field (from getItemDetail API or product cards)
    else if (product?.imgGroup && Array.isArray(product.imgGroup) && product.imgGroup.length > 0) {
      images = product.imgGroup;
    }
    // Priority 3: Fallback to single image
    else if (product?.image) {
      images = [product.image];
    }
    // Priority 4: Fallback to imgUrl
    else if (product?.imgUrl) {
      images = [product.imgUrl];
    }
    
    // Remove duplicates by converting to Set and back to array
    // Also filter out empty/null values and normalize URLs
    const uniqueImages = Array.from(
      new Set(
        images
          .filter(img => img && (typeof img === 'string' ? img.trim() !== '' : true))
          .map(img => getImageUrl(typeof img === 'string' ? img : ''))
          .filter(url => url && url.trim() !== '')
      )
    );
    
    return uniqueImages.length > 0 ? uniqueImages : [];
  }, [product?.gallery, product?.imgGroup, product?.image, product?.imgUrl, getImageUrl]);

  const mainImage = productImages[selectedImageIndex] || productImages[0] || getImageUrl(product?.image || product?.imgUrl || '');
  const imageUrl = mainImage;

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
          maxHeight: { xs: "95vh", sm: "90vh" },
          margin: { xs: "8px", sm: "16px" },
          width: { xs: "calc(100% - 16px)", sm: "auto" },
          display: "flex",
          flexDirection: "column",
        },
      }}
      sx={{
        zIndex: 1502, // Higher than ProductViewDialog (1501) to ensure it appears on top
      }}
    >
      <DialogContainer>
        <Box sx={{ 
          position: "relative", 
          p: { xs: 2, sm: 3 },
          maxHeight: { xs: "95vh", sm: "auto" },
          overflowY: { xs: "auto", sm: "visible" },
          overflowX: "hidden",
        }}>
          {/* Close Button */}
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              top: { xs: 8, sm: 16 },
              right: { xs: 8, sm: 16 },
              zIndex: 10,
              background: "rgba(255, 255, 255, 0.9)",
              width: { xs: 32, sm: 40 },
              height: { xs: 32, sm: 40 },
              "&:hover": {
                background: "rgba(255, 255, 255, 1)",
              },
            }}
          >
            <Close sx={{ fontSize: { xs: 20, sm: 24 } }} />
          </IconButton>

          <Grid container spacing={{ xs: 2, sm: 4 }}>
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
                <Box sx={{ display: "flex", gap: { xs: 1, sm: 2 }, justifyContent: "center", flexWrap: "wrap" }}>
                    {productImages.slice(0, 4).map((img, index) => {
                    const thumbUrl = img; // Already normalized by getImageUrl in productImages
                    return (
                      <ThumbnailContainer
                        key={index}
                        selected={selectedImageIndex === index}
                        onClick={() => setSelectedImageIndex(index)}
                      >
                        <LazyImage
                          width={80}
                          height={80}
                          alt={`${product?.name || 'Product'} - View ${index + 1}`}
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
              <Box sx={{ 
                height: "100%", 
                display: "flex", 
                flexDirection: "column",
                minHeight: { xs: "auto", sm: "100%" },
              }}>
                {/* Product Name & Price */}
                <Box sx={{ mb: { xs: 2, sm: 3 } }}>
                  <H3
                  sx={{
                    fontWeight: 700,
                      fontSize: { xs: "18px", sm: "24px" },
                      color: "text.primary",
                    mb: 1,
                    lineHeight: 1.3,
                  }}
                >
                    {product?.name || 'Product'}
                  </H3>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: { xs: 1, sm: 2 }, flexWrap: 'wrap' }}>
                  <H4
                  sx={{
                    fontWeight: 800,
                      fontSize: { xs: "22px", sm: "28px" },
                      color: "primary.main",
                  }}
                >
                      {currency} {(displayPrice > 0 ? displayPrice : baseFinalSalePrice).toFixed(2)}
                  </H4>
                    {numericDiscount > 0 && numericMrp > 0 && numericMrp > baseFinalSalePrice && (
                      <>
                        <Typography
                          sx={{
                            color: "text.secondary",
                            fontSize: { xs: "14px", sm: "18px" },
                            textDecoration: "line-through",
                            fontWeight: 500,
                          }}
                        >
                          {currency} {numericMrp.toFixed(2)}
                        </Typography>
                        <Box
                          sx={{
                            background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                            color: "white",
                            px: { xs: 1, sm: 1.5 },
                            py: { xs: 0.25, sm: 0.5 },
                            borderRadius: { xs: "8px", sm: "12px" },
                            fontSize: { xs: "11px", sm: "13px" },
                            fontWeight: 700,
                          }}
                        >
                          SAVE {Math.round(numericDiscount)}%
                        </Box>
                      </>
                    )}
                  </Box>
          </Box>

                {/* Variant Selection */}
          {loading ? (
            <Box sx={{ textAlign: "center", py: { xs: 3, sm: 4 } }}>
                    <Typography sx={{ color: "text.secondary", fontSize: { xs: "14px", sm: "16px" } }}>
                Loading variant options...
              </Typography>
            </Box>
                ) : (
                  <Box sx={{ flex: 1, mb: { xs: 2, sm: 3 } }}>
                    {/* Color Selection */}
                    {availableColors.length > 0 && (
                      <Box sx={{ mb: { xs: 2.5, sm: 4 } }}>
                        <Typography
                          sx={{
                            fontWeight: 600,
                            fontSize: { xs: "14px", sm: "16px" },
                            color: "text.primary",
                            mb: { xs: 1.5, sm: 2 },
                          }}
                        >
                          Choose a Color
                        </Typography>
                        <Box sx={{ display: "flex", gap: { xs: 1.5, sm: 2 }, flexWrap: "wrap" }}>
                          {availableColors.map((colorData) => {
                            const isSelected = selectedColor === colorData.color;
                            return (
                              <Tooltip
                                key={colorData.color}
                                title={colorData.color}
                                arrow
                                placement="top"
                              >
                                <Box
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
                                      <CheckIcon sx={{ color: "#fff", fontSize: { xs: "16px", sm: "20px" } }} />
                                    )}
                                  </ColorSwatch>
                                </Box>
                              </Tooltip>
                            );
                          })}
                        </Box>
                      </Box>
                    )}

                    {/* Size Selection */}
                    {availableSizes.length > 0 && (
                      <Box sx={{ mb: { xs: 2.5, sm: 4 } }}>
                        <Typography
              sx={{
                            fontWeight: 600,
                            fontSize: { xs: "14px", sm: "16px" },
                            color: "text.primary",
                            mb: { xs: 1.5, sm: 2 },
                          }}
                        >
                          Choose a Size
                        </Typography>
                        <RadioGroup
                          value={selectedSize || ''}
                          onChange={(e) => setSelectedSize(e.target.value)}
                          sx={{ gap: { xs: 0.5, sm: 1 } }}
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
                                    fontSize: { xs: "13px", sm: "15px" },
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
                      <Box sx={{ mb: { xs: 1.5, sm: 2 } }}>
                        {isOutOfStock ? (
                          <Typography
                            sx={{
                              color: "error.main",
                              fontWeight: 600,
                              fontSize: { xs: "12px", sm: "14px" },
                            }}
                          >
                            ⚠️ This variant is out of stock
                          </Typography>
                        ) : selectedVariant.stock_quantity <= 5 ? (
                          <Typography
                            sx={{
                              color: "warning.main",
                              fontWeight: 600,
                              fontSize: { xs: "12px", sm: "14px" },
                            }}
                          >
                            ⚠️ Only {selectedVariant.stock_quantity} left in stock!
                          </Typography>
                        ) : (
                          <Typography
                            sx={{
                              color: "success.main",
                              fontWeight: 600,
                              fontSize: { xs: "12px", sm: "14px" },
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
                  <ShoppingCart sx={{ fontSize: { xs: "18px", sm: "20px" } }} />
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
