import { Add, Close, Remove } from "@mui/icons-material";
import {
  Box,
  Dialog,
  DialogContent,
  Divider,
  Grid,
  IconButton,
  styled,
} from "@mui/material";
import BazaarButton from "components/BazaarButton";
import BazaarImage from "components/BazaarImage";
import Carousel from "components/carousel/Carousel";
import { FlexBox } from "components/flex-box";
import { H1, H2, H3, H6, Paragraph } from "components/Typography";
import { useAppContext } from "contexts/AppContext";
import React, { useCallback, useEffect, useState, Fragment, useMemo } from "react";
import { Chip } from "@mui/material";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import VariantSelectionDialog from "./VariantSelectionDialog";

// import {server_ip} from "utils/backend_server_ip.jsx"


const ContentWrapper = styled(Box)(({ theme }) => ({
  "& .carousel:hover": {
    cursor: "pointer",
    "& .carousel__back-button": {
      opacity: 1,
      left: 10,
    },
    "& .carousel__next-button": {
      opacity: 1,
      right: 10,
    },
  },
  "& .carousel__next-button, & .carousel__back-button": {
    opacity: 0,
    boxShadow: "none",
    transition: "all 0.3s",
    background: "transparent",
    color: theme.palette.primary.main,
    ":disabled": {
      color: theme.palette.grey[500],
    },
    ":hover": {
      color: theme.palette.primary.main,
      backgroundColor: "transparent",
    },
  },
  "& .carousel__back-button": {
    left: 0,
  },
  "& .carousel__next-button": {
    right: 0,
  },
})); // =====================================================

const StyledChip1 = styled(Chip)(() => ({
  zIndex: 1,
  top: "40px",
  left: "35px",
  paddingLeft: 3,
  paddingRight: 3,
  fontWeight: 600,
  fontSize: "10px",
  position: "absolute",
}));
// =====================================================
const ProductViewDialog = (props) => {
  const { product, openDialog, handleCloseDialog } = props;
  
  const [currency, setCurrency] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedCurrency = localStorage.getItem('currency');
      if (storedCurrency) setCurrency(storedCurrency);
    }
  }, []);

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



  const { state, dispatch } = useAppContext();
  const router = useRouter();
  const [openVariantDialog, setOpenVariantDialog] = useState(false);
  
  // Get product images - same logic as ProductIntro.jsx
  // Check for gallery field first (from API), then imgGroup, then fallback to single image
  const productImages = useMemo(() => {
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
  
  // Professional helper function to detect if a product has any variants
  const hasProductVariants = useCallback(() => {
    if (!product) return false;
    
    // Check variants array
    const hasVariantsArray = 
      product.variants !== undefined && 
      product.variants !== null && 
      Array.isArray(product.variants) && 
      product.variants.length > 0;
    
    // Check available_colors array
    const hasColors = 
      product.available_colors !== undefined && 
      product.available_colors !== null && 
      Array.isArray(product.available_colors) && 
      product.available_colors.length > 0;
    
    // Check available_sizes array
    const hasSizes = 
      product.available_sizes !== undefined && 
      product.available_sizes !== null && 
      Array.isArray(product.available_sizes) && 
      product.available_sizes.length > 0;
    
    return hasVariantsArray || hasColors || hasSizes;
  }, [product]);
  
  // Check for cart item - if product has variants, match by variant_id too
  const cartItem = hasProductVariants()
    ? state.cart.find((item) => 
        item.id === product.id && 
        (!item.variant_id || item.variant_id === product.selectedVariant?.id)
      )
    : state.cart.find((item) => item.id === product.id);
  
  const handleCartAmountChange = useCallback(
    (amount, addflag) => () => {
      // Validate product object before proceeding
      if (!product || typeof product !== 'object') {
        console.error('ProductViewDialog: Invalid product object received for handleCartAmountChange.');
        toast.error('Product data is missing or invalid.', { position: toast.POSITION.TOP_RIGHT });
        return;
      }

      const hasVariants = hasProductVariants();
      
      
      // If product has variants and item is not in cart with variant info, open variant selection dialog
      if (hasVariants && !cartItem?.variant_id && (addflag === true || addflag === 1)) {
        // Open the variant dialog - it will appear on top due to higher z-index (1502 vs 1501)
        // Don't close parent dialog to prevent unmounting the variant dialog
        setOpenVariantDialog(true);
        return;
      }

      // If no variants or item already has variant info, proceed with normal add/update
      if (!hasVariants || cartItem?.variant_id) {
        const payload = {
          ...product,
          mrp: product.mrp,
          salePrice: product.salePrice,
          salePrices: product.salePrice,
          qty: amount,
          price: product.salePrice,
          sku: product.sku,
          slug: product.slug,
          name: product.name,
          imgUrl: productImages[0] || getImageUrl(product?.image || product?.imgUrl || ''),
          image: productImages[0] || getImageUrl(product?.image || product?.imgUrl || ''),
          id: product.id,
          // Preserve variant information if cartItem has it
          ...(cartItem?.variant_id && {
            variant_id: cartItem.variant_id,
            selected_color: cartItem.selected_color,
            selected_size: cartItem.selected_size,
            variant_sku: cartItem.variant_sku,
          }),
        };
        if (addflag == true) {
          dispatch({ type: "CHANGE_CART_AMOUNT", payload });
          toast.success("Added to cart", { position: toast.POSITION.TOP_RIGHT });
        } else {
          dispatch({ type: "CHANGE_CART_AMOUNT", payload });
          toast.error("Removed from cart", {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      }
    },
    [dispatch, product, cartItem, handleCloseDialog, hasProductVariants, productImages, getImageUrl]
  );
  return (
    <Fragment>
    <Dialog
      open={openDialog}
      maxWidth={false}
      onClose={handleCloseDialog}
      sx={{
        zIndex: 1501,
      }}
    >
      <DialogContent
        sx={{
          maxWidth: 900,
          width: "100%",
        }}
      >
        <ContentWrapper>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              {productImages.length > 0 ? (
                <Carousel totalSlides={productImages.length} visibleSlides={1}>
                  {productImages.map((item, index) => (
                    <BazaarImage
                      key={index}
                      src={item}
                      alt={product?.name ? `${product.name} - Image ${index + 1}` : `Product Image ${index + 1}`}
                      sx={{
                        mx: "auto",
                        width: "100%",
                        objectFit: "contain",
                        height: {
                          sm: 400,
                          xs: 250,
                        },
                      }}
                    />
                  ))}
                </Carousel>
              ) : (
                <BazaarImage
                  src={getImageUrl(product?.image || product?.imgUrl || '')}
                  alt={product?.name || 'Product Image'}
                  sx={{
                    mx: "auto",
                    width: "100%",
                    objectFit: "contain",
                    height: {
                      sm: 400,
                      xs: 250,
                    },
                  }}
                />
              )}
            </Grid>

            <Grid item md={6} xs={12} alignSelf="center">
              <H2>{product.name}</H2>
              {product.categoryName === "" ||
              product.categoryName === undefined ? (
                ""
              ) : (
              <Paragraph
                py={1}
                color="grey.700"
                fontWeight={600}
                fontSize={13}
              >
                CATEGORY: {product.categoryName}
              </Paragraph>
              )}

              <H1 color="primary.main">{currency}. {product.salePrice}</H1>

              {/* <FlexBox alignItems="center" gap={1}>
                <BazaarRating
                  color="warn"
                  fontSize="1.25rem"
                  value={4}
                  readOnly
                />
                <H6 lineHeight="1">(50)</H6>
              </FlexBox> */}

              <Paragraph my={2}>
                {/* Sed egestas, ante et vulputate volutpat, eros pede semper est,
                vitae luctus metus libero eu augue. Morbi purus liberpuro ate
                vol faucibus adipiscing. */}
                {product.description}
              </Paragraph>

              <Divider
                sx={{
                  mb: 2,
                }}
              />

              {product.stock == 0.0 ? (
                <>
                  <StyledChip1
                    color="primary"
                    size="small"
                    label="Out of Stock"
                  />
                  <BazaarButton
                    color="primary"
                    variant="contained"
                    disabled={true}
                    sx={{
                      mb: 4.5,
                      px: "1.75rem",
                      height: 40,
                    }}
                  >
                    Add to Cart
                  </BazaarButton>
                </>
              ) : !cartItem?.qty ? (
                <BazaarButton
                  size="large"
                  color="primary"
                  variant="contained"
                  onClick={handleCartAmountChange(1, true)}
                  sx={{
                    height: 45,
                  }}
                >
                  Add to Cart
                </BazaarButton>
              ) : (
                <FlexBox alignItems="center">
                  <BazaarButton
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{
                      p: ".6rem",
                      height: 45,
                      minWidth: "44px",
                      minHeight: "44px",
                    }}
                    onClick={handleCartAmountChange(cartItem?.qty - 1, false)}
                    aria-label={`Decrease quantity of ${product.name}`}
                  >
                    <Remove fontSize="small" />
                  </BazaarButton>

                  <H3 fontWeight="600" mx={2.5}>
                    {cartItem?.qty.toString().padStart(2, "0")}
                  </H3>

                  <BazaarButton
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{
                      p: ".6rem",
                      height: 45,
                      minWidth: "44px",
                      minHeight: "44px",
                    }}
                    onClick={handleCartAmountChange(cartItem?.qty + 1, true)}
                    aria-label={`Increase quantity of ${product.name}`}
                  >
                    <Add fontSize="small" />
                  </BazaarButton>
                </FlexBox>
              )}
            </Grid>
          </Grid>
        </ContentWrapper>

        <IconButton
          sx={{
            position: "absolute",
            top: 3,
            right: 3,
            minWidth: "44px",
            minHeight: "44px",
          }}
          onClick={handleCloseDialog}
          aria-label="Close product dialog"
        >
          <Close fontSize="small" color="secondary" />
        </IconButton>
      </DialogContent>
    </Dialog>

    <VariantSelectionDialog
      open={openVariantDialog}
      onClose={() => {
        setOpenVariantDialog(false);
        // Close parent dialog when variant dialog closes
        handleCloseDialog();
      }}
      product={{
        ...product,
        // Ensure we pass original MRP and discount, not pre-calculated prices
        mrp: product?.mrp, // Original MRP
        salePrice: product?.salePrice, // Original salePrice (before discount calculation)
        discount: product?.discount, // Discount percentage
        imgGroup: productImages.length > 0 ? productImages : (product?.imgGroup || []),
        gallery: product?.gallery || productImages,
        variants: product?.variants || [],
        available_colors: product?.available_colors || [],
        available_sizes: product?.available_sizes || [],
      }}
    />
    </Fragment>
  );
};

export default ProductViewDialog;
