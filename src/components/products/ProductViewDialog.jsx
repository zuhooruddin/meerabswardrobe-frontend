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
import { useCallback, useEffect, useState, Fragment } from "react";
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
  const imgurl = process.env.IMAGE_BASE_URL;


const [currency,setCurrency]=useState('')

useEffect(()=>{
  if (typeof window !== 'undefined' && window.localStorage) {
    const storedCurrency = localStorage.getItem('currency');

    setCurrency(storedCurrency);
  }
},[])



  const { state, dispatch } = useAppContext();
  const router = useRouter();
  const [openVariantDialog, setOpenVariantDialog] = useState(false);
  
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
      
      // Professional logging for debugging (production-safe)
      if (addflag && typeof window !== 'undefined' && window.console) {
        console.log('🔍 ProductViewDialog Variant Check:', {
          productId: product.id,
          productName: product.name,
          hasVariants,
          variants: product.variants,
          variantsLength: product.variants?.length || 0,
          available_colors: product.available_colors,
          available_colorsLength: product.available_colors?.length || 0,
          available_sizes: product.available_sizes,
          available_sizesLength: product.available_sizes?.length || 0,
          cartItemVariantId: cartItem?.variant_id || null,
          addflag,
          amount,
        });
      }
      
      // If product has variants and item is not in cart with variant info, open variant selection dialog
      if (hasVariants && !cartItem?.variant_id && (addflag === true || addflag === 1)) {
        // First open the variant dialog, then close the parent dialog
        // This ensures the variant dialog opens even for non-logged-in users
        setOpenVariantDialog(true);
        // Close parent dialog after a small delay to ensure variant dialog state is set
        setTimeout(() => {
          handleCloseDialog();
        }, 100);
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
          imgUrl: product.imgGroup[0],
          image: product.imgGroup[0],
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
    [dispatch, product, cartItem, handleCloseDialog, hasProductVariants]
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
              <Carousel totalSlides={product.imgGroup.length} visibleSlides={1}>
                {product.imgGroup.map((item, index) => (
                  <BazaarImage
                    key={index}
                    src={item}
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
      onClose={() => setOpenVariantDialog(false)}
      product={{
        ...product,
        variants: product?.variants || [],
        available_colors: product?.available_colors || [],
        available_sizes: product?.available_sizes || [],
      }}
    />
    </Fragment>
  );
};

export default ProductViewDialog;
