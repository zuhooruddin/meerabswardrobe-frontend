/* eslint-disable react-hooks/exhaustive-deps */
import { Add, Favorite, Remove, RemoveRedEye } from "@mui/icons-material";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import { Box, Button, Chip, IconButton, styled, Rating, keyframes } from "@mui/material";
import BazaarCard from "components/BazaarCard";
import LazyImage from "components/LazyImage";
import ProductViewDialog from "components/products/ProductViewDialog";
import VariantSelectionDialog from "components/products/VariantSelectionDialog";
import { H3, H4, H5, Span } from "components/Typography";
import { useAppContext } from "contexts/AppContext";
import Link from "next/link";
import { Fragment, useCallback, useEffect, useState } from "react";
import { FlexBetween, FlexBox } from "components/flex-box";
import { useSession, signIn, signOut } from "next-auth/react";
import { toast } from "react-toastify";
import { Paragraph, Small } from "components/Typography";
import Image from "next/image";
import BazaarButton from "components/BazaarButton";
import { useRouter } from "next/router";
import { FlexRowCenter } from "components/flex-box";

// Premium Animations
const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

// Premium Card Container
const Card = styled(Box)(({ theme }) => ({
  borderRadius: "20px",
  transition: "all 400ms cubic-bezier(0.4, 0, 0.2, 1)",
  backgroundColor: theme.palette.mode === 'dark' ? "#1E293B" : "#FFFFFF",
  border: theme.palette.mode === 'dark' 
    ? "1px solid rgba(255, 255, 255, 0.08)" 
    : "1px solid rgba(0, 0, 0, 0.04)",
  overflow: "hidden",
  position: "relative",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  boxShadow: theme.palette.mode === 'dark'
    ? "0 4px 20px rgba(0, 0, 0, 0.4)"
    : "0 4px 20px rgba(0, 0, 0, 0.05)",
  
  // Premium gradient border effect
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "4px",
    background: "linear-gradient(135deg, #D23F57 0%, #E94560 50%, #FF6B7A 100%)",
    transform: "scaleX(0)",
    transformOrigin: "left",
    transition: "transform 400ms cubic-bezier(0.4, 0, 0.2, 1)",
    zIndex: 10,
  },
  
  // Premium glow effect
  "&::after": {
    content: '""',
    position: "absolute",
    inset: 0,
    borderRadius: "inherit",
    opacity: 0,
    transition: "opacity 400ms ease",
    background: "radial-gradient(circle at center, rgba(210, 63, 87, 0.05) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  
  "&:hover": {
    transform: "translateY(-12px) scale(1.01)",
    boxShadow: theme.palette.mode === 'dark'
      ? "0 24px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(210, 63, 87, 0.15)"
      : "0 24px 60px rgba(0, 0, 0, 0.12), 0 0 40px rgba(210, 63, 87, 0.08)",
    borderColor: "transparent",
    "& .product-actions": {
      right: 14,
    },
    "& img": {
      transform: "scale(1.08)",
    },
    "&::before": {
      transform: "scaleX(1)",
    },
    "&::after": {
      opacity: 1,
    },
  },
}));

// Premium Card Media Container
const CardMedia = styled(Box)(({ theme }) => ({
  width: "100%",
  maxHeight: 320,
  cursor: "pointer",
  overflow: "hidden",
  position: "relative",
  background: theme.palette.mode === 'dark'
    ? "linear-gradient(135deg, #1E293B 0%, #334155 100%)"
    : "linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)",
  "& img": {
    transition: "transform 600ms cubic-bezier(0.4, 0, 0.2, 1)",
  },
  // Subtle gradient overlay on hover
  "&::after": {
    content: '""',
    position: "absolute",
    inset: 0,
    background: "linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.03) 100%)",
    opacity: 0,
    transition: "opacity 400ms ease",
    pointerEvents: "none",
  },
}));

// Premium Action Button
const ActionButton = styled(IconButton)(({ theme, delay = 0 }) => ({
  position: "absolute",
  right: -60,
  transition: `all 0.35s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`,
  background: theme.palette.mode === 'dark' 
    ? "rgba(30, 41, 59, 0.95)" 
    : "rgba(255, 255, 255, 0.98)",
  backdropFilter: "blur(10px)",
  boxShadow: "0 6px 20px rgba(0, 0, 0, 0.12)",
  borderRadius: "14px",
  padding: "12px",
  border: theme.palette.mode === 'dark'
    ? "1px solid rgba(255, 255, 255, 0.1)"
    : "1px solid rgba(0, 0, 0, 0.04)",
  
  "&:hover": {
    background: "linear-gradient(135deg, #D23F57 0%, #E94560 100%)",
    color: "white",
    transform: "scale(1.12)",
    boxShadow: "0 10px 30px rgba(210, 63, 87, 0.4)",
    border: "1px solid transparent",
  },
  
  "&:active": {
    transform: "scale(1.05)",
  },
}));

// Premium Badge/Chip
const StyledChip = styled(Chip)(({ theme }) => ({
  zIndex: 5,
  top: "14px",
  left: "14px",
  paddingLeft: 10,
  paddingRight: 10,
  fontWeight: 700,
  fontSize: "11px",
  position: "absolute",
  borderRadius: "24px",
  letterSpacing: "0.5px",
  textTransform: "uppercase",
  backdropFilter: "blur(10px)",
  boxShadow: "0 6px 16px rgba(0, 0, 0, 0.15)",
}));

// Premium Add to Cart Button
const AddToCartBtn = styled(Button)(({ theme }) => ({
  width: "100%",
  padding: "14px",
  borderRadius: "14px",
  fontWeight: 600,
  fontSize: "14px",
  letterSpacing: "0.02em",
  transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
  marginTop: "14px",
  position: "relative",
  overflow: "hidden",
  
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "-100%",
    width: "100%",
    height: "100%",
    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
    transition: "left 0.5s ease",
  },
  
  "&:hover::before": {
    left: "100%",
  },
}));

// Premium Quantity Controls
const QuantityButton = styled(BazaarButton)(({ theme }) => ({
  padding: "10px",
  borderRadius: "12px",
  minWidth: "44px",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "scale(1.08)",
    boxShadow: "0 4px 12px rgba(210, 63, 87, 0.25)",
  },
}));

// ========================================================

// ========================================================
const ProductCard1 = ({
  id,
  name,
  mrp,
  image,
  imageUrl,
  slug,
  sku,
  salePrice,
  description,
  rating = 5,
  hideRating,
  hoverEffect,
  stock,
  isNewArrival,
  discount,
  showProductSize,
  wishList,
  publisherFlag,
  category,
  pageIndex,
  pageSize,
  getCurrentScrollPosition,
  sorting,
  ProductReviews,
  wishlist,
  // Variant support
  variants,
  price_range,
  available_colors,
  available_sizes,
}) => {
  // Consistent discount calculation: discount is applied to MRP, not salePrice
  const numericMrp = mrp != null && !isNaN(mrp) ? parseFloat(mrp) : 0;
  const numericSalePrice = salePrice != null && !isNaN(salePrice) ? parseFloat(salePrice) : numericMrp;
  const numericDiscount = discount != null && !isNaN(discount) ? parseFloat(discount) : 0;
  
  // Calculate discount amount from MRP (original price)
  const calculatedDiscountAmount = numericDiscount > 0 ? (numericMrp * numericDiscount) / 100 : 0;
  
  // Final sale price: if discount exists, use discounted price, otherwise use original salePrice
  const finalSalePrice = numericDiscount > 0 && numericMrp > 0 
    ? (numericMrp - calculatedDiscountAmount) 
    : numericSalePrice;
  
  // For display: show original price (MRP) when discount exists
  const discountprice = numericDiscount > 0 ? numericMrp : numericSalePrice;
  
  // Use finalSalePrice for all price references (don't reassign prop)

  const imgbaseurl = process.env.NEXT_PUBLIC_IMAGE_BASE_API_URL;
  var image = image ? image : imageUrl;
  const categoryName = "";
  const { data: session, status } = useSession();
  const router = useRouter();
  const { state, dispatch } = useAppContext();
  const [openModal, setOpenModal] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openVariantDialog, setOpenVariantDialog] = useState(false);
  const [currency, setCurrency] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedCurrency = localStorage.getItem('currency');
      setCurrency(storedCurrency);
    }
  }, []);

  const Reviews = ProductReviews?.Reviews?.filter(
    (item) => item.itemid_id === id
  ) || [];

  const totalRatings = Reviews.reduce((total, item) => total + item.rating, 0);
  const averageRating = totalRatings / Reviews.length;
  const roundedAverageRating = Math.min(
    Math.round(averageRating * 100) / 100,
    5
  );
  const total = Reviews.length;

  const toggleIsFavorite = () => setIsFavorite((fav) => !fav);

  const addwishtlist = async () => {
    let userid = session.user.id;
    await fetch(process.env.NEXT_PUBLIC_BACKEND_API_BASE + "updateWishlist", {
      method: "POST",
      body: JSON.stringify({
        userid: userid,
        itemid: id,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + session.accessToken,
      },
    }).then((res) => res.json());
    setIsFavorite((fav) => !fav);
  };
  
  const [isFavorite, setIsFavorite] = useState(undefined);
  if (Array.isArray(wishlist) && isFavorite === undefined) {
    setIsFavorite((fav) =>
      fav === undefined ? wishlist.some((item) => item.id === id) : false
    );
  }

  const toggleDialog = useCallback(() => setOpenModal((open) => !open), []);
  const cartItem = state.cart.find((item) => item.id === id);
  
  const handleCartAmountChange = useCallback(
    (amount, addedflag) => () => {
      // Check if product has variants (via available_colors or variants prop)
      const hasVariants = (variants && variants.length > 0) || (available_colors && available_colors.length > 0);
      
      // If product has variants and item is not in cart with variant info, open variant selection dialog
      if (hasVariants && !cartItem?.variant_id && addedflag) {
        setOpenVariantDialog(true);
        return;
      }

      // If no variants or item already has variant info, proceed with normal add/update
      if (!hasVariants || cartItem?.variant_id) {
        const payload = {
        mrp: numericMrp,
        salePrice: finalSalePrice,
        salePrices: finalSalePrice,
        price: finalSalePrice,
        discount: numericDiscount,
        qty: amount,
        name: name,
        sku: sku,
        slug: slug,
        image: imgbaseurl + image,
        id: id,
        // Preserve variant information if cartItem has it
        ...(cartItem?.variant_id && {
          variant_id: cartItem.variant_id,
          selected_color: cartItem.selected_color,
          selected_size: cartItem.selected_size,
          variant_sku: cartItem.variant_sku,
        }),
      };

        dispatch({
          type: "CHANGE_CART_AMOUNT",
          payload,
        });
        if (addedflag == true) {
          toast.success("Added to cart", { position: toast.POSITION.TOP_RIGHT });
        } else {
          toast.error("Removed from cart", {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      }
    },
    [variants, available_colors, mrp, finalSalePrice, numericMrp, numericDiscount, name, sku, imgbaseurl, image, id, cartItem, dispatch]
  );
  
  const myFunction = () => {
    const currentScrollPosition = getCurrentScrollPosition?.();
    sessionStorage.setItem(
      router.asPath + "__pp",
      JSON.stringify({
        pageIndexRoute: pageIndex,
        pageSizeRoute: pageSize,
        scrollPos: currentScrollPosition,
        sorting: sorting,
      })
    );
  };

  // Render badge based on stock and new arrival status
  const renderBadge = () => {
    if (stock === "0.00" && isNewArrival === 1) {
      return (
        <StyledChip
          color="secondary"
          size="small"
          label="Out of Stock • New"
          sx={{
            background: "linear-gradient(135deg, #1E293B 0%, #334155 100%)",
          }}
        />
      );
    } else if (isNewArrival === 1 && stock > "0.00") {
      if (discount > 0) {
        return (
          <StyledChip
            color="primary"
            size="small"
            label="New • Sale"
            sx={{
              background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
            }}
          />
        );
      }
      return (
        <StyledChip
          color="secondary"
          size="small"
          label="New Arrival"
          sx={{
            background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
          }}
        />
      );
    } else if (isNewArrival < 1 && stock === "0.00") {
      if (discount > 0) {
        return (
          <StyledChip
            color="secondary"
            size="small"
            label="Out of Stock • Sale"
            sx={{
              background: "linear-gradient(135deg, #64748B 0%, #475569 100%)",
            }}
          />
        );
      }
      return (
        <StyledChip
          color="secondary"
          size="small"
          label="Out of Stock"
          sx={{
            background: "linear-gradient(135deg, #64748B 0%, #475569 100%)",
          }}
        />
      );
    } else if (discount > 0) {
      return (
        <StyledChip
          color="primary"
          size="small"
          label={`${Math.round(numericDiscount)}% Off`}
          sx={{
            background: "linear-gradient(135deg, #D23F57 0%, #E94560 100%)",
          }}
        />
      );
    }
    return null;
  };

  // Card Content Component
  const CardContent = ({ showWishlist = false }) => (
    <Card height="100%">
      <CardMedia>
        <Link href={`/product/${slug}`}>
          <a onClick={myFunction}>
            {renderBadge()}
            
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "16px",
              }}
            >
              <Image
                width={300}
                height={300}
                alt={name ? `${name} - Buy Premium Women's Clothing Online at Meerab's Wardrobe` : "Women's Clothing"}
                title={name || "Women's Clothing"}
                objectFit="contain"
                layout="intrinsic"
                src={imgbaseurl + image}
                loading="lazy"
                style={{
                  transition: "transform 600ms cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              />
            </Box>
          </a>
        </Link>

        <ActionButton
          className="product-actions"
          onClick={() => setOpenDialog(true)}
          aria-label={`View details for ${name}`}
          sx={{ top: 14 }}
          delay={0}
        >
          <RemoveRedEye color="disabled" fontSize="small" />
        </ActionButton>
        
        {showWishlist && (
          <ActionButton
            className="product-actions"
            onClick={() => addwishtlist()}
            aria-label={isFavorite ? `Remove ${name} from wishlist` : `Add ${name} to wishlist`}
            sx={{ top: 68 }}
            delay={50}
          >
            {isFavorite ? (
              <Favorite color="primary" fontSize="small" />
            ) : (
              <FavoriteBorder color="disabled" fontSize="small" />
            )}
          </ActionButton>
        )}
      </CardMedia>

      <ProductViewDialog
        openDialog={openDialog}
        handleCloseDialog={() => setOpenDialog(false)}
        product={{
          name,
          mrp: numericMrp,
          id,
          salePrice: finalSalePrice,
          discount: numericDiscount,
          sku,
          slug,
          description,
          categoryName,
          stock,
          imgGroup: [imgbaseurl + image, imgbaseurl + image],
          variants,
          available_colors,
          available_sizes,
        }}
      />

      <VariantSelectionDialog
        open={openVariantDialog}
        onClose={() => setOpenVariantDialog(false)}
        product={{
          name,
          mrp: numericMrp,
          id,
          salePrice: finalSalePrice,
          discount: numericDiscount,
          sku,
          slug,
          description,
          categoryName,
          stock,
          imgGroup: [imgbaseurl + image, imgbaseurl + image],
          image: imgbaseurl + image,
          variants,
          available_colors,
          available_sizes,
        }}
      />

      <Box 
        p={2.5} 
        textAlign="center"
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Paragraph
          sx={{
            lineHeight: "1.5em",
            height: "3em",
            overflow: "hidden",
            fontSize: "15px",
            fontWeight: 500,
            color: "text.primary",
            transition: "color 0.3s ease",
            mb: 1,
            "&:hover": {
              color: "primary.main",
            },
          }}
        >
          {name}
        </Paragraph>

        <H4 fontWeight={700} py={0.5}>
          <FlexBox
            alignItems="center"
            gap={1}
            mt={0.5}
            flexDirection="column"
          >
            <Box
              fontWeight="700"
              fontSize="1.25rem"
              color="primary.main"
              sx={{
                textAlign: "center",
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
                fontFamily: "'Outfit', sans-serif",
                letterSpacing: "-0.02em",
                flexWrap: "wrap",
                gap: 0.5,
              }}
            >
              {/* Show "From ₹X" if product has variants */}
              {((variants && variants.length > 0) || (price_range && price_range.min_price !== price_range.max_price)) ? (
                <>
                  <Box component="span">From</Box>
                  <Box component="span">
                    {currency}. {price_range 
                      ? (isNaN(price_range.min_price) ? '0.00' : price_range.min_price.toFixed(2))
                      : (isNaN(finalSalePrice) ? '0.00' : finalSalePrice.toFixed(2))}
                  </Box>
                  {price_range && price_range.max_price > price_range.min_price && (
                    <Box
                      component="span"
                      sx={{
                        color: "text.secondary",
                        fontWeight: "400",
                        fontSize: "0.9rem",
                      }}
                    >
                      - {currency}. {isNaN(price_range.max_price) ? '0.00' : price_range.max_price.toFixed(2)}
                    </Box>
                  )}
                </>
              ) : (
                <>
                  {currency}. {isNaN(finalSalePrice) ? '0.00' : finalSalePrice.toFixed(2)}
                  {!!numericDiscount && numericDiscount > 0 && (
                    <Box
                      component="span"
                      sx={{
                        color: "grey.500",
                        fontWeight: "400",
                        fontSize: "0.875rem",
                        ml: 1.5,
                        textDecoration: "line-through",
                      }}
                    >
                      {currency}.{isNaN(discountprice) ? '0.00' : discountprice.toFixed(2)}
                    </Box>
                  )}
                </>
              )}
            </Box>
          </FlexBox>
        </H4>
        
        <FlexRowCenter gap={1} mb={2}>
          <Rating
            name="read-only"
            value={averageRating && averageRating ? averageRating : 0}
            readOnly
            sx={{
              fontSize: 16,
              "& .MuiRating-iconFilled": {
                color: "#F59E0B",
              },
              "& .MuiRating-iconEmpty": {
                color: "grey.300",
              },
            }}
          />
          <Small 
            fontWeight={600} 
            color="grey.500"
            sx={{
              padding: "2px 8px",
              borderRadius: "6px",
              backgroundColor: "grey.100",
              fontSize: "12px",
            }}
          >
            ({total && total ? total : 0})
          </Small>
        </FlexRowCenter>
        
        <Box sx={{ mt: "auto" }}>
          {stock == 0.0 ? (
            <AddToCartBtn
              color="primary"
              variant="contained"
              disabled={true}
              fullWidth
              sx={{
                background: "grey.300",
                "&:disabled": {
                  background: "linear-gradient(135deg, #CBD5E1 0%, #94A3B8 100%)",
                  color: "white",
                },
              }}
            >
              Out of Stock
            </AddToCartBtn>
          ) : !cartItem?.qty ? (
            <AddToCartBtn
              fullWidth
              variant="outlined"
              onClick={handleCartAmountChange(1, true)}
              sx={{
                borderColor: "grey.300",
                borderWidth: 2,
                color: "text.primary",
                "&:hover": {
                  borderColor: "primary.main",
                  background: "linear-gradient(135deg, #D23F57 0%, #E94560 100%)",
                  color: "white",
                  transform: "translateY(-3px)",
                  boxShadow: "0 8px 24px rgba(210, 63, 87, 0.35)",
                },
              }}
            >
              Add to Cart
            </AddToCartBtn>
          ) : (
            <FlexBox
              alignItems="center"
              mt={2}
              sx={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "row",
                gap: 1.5,
              }}
            >
              <QuantityButton
                size="small"
                color="primary"
                variant="outlined"
                onClick={handleCartAmountChange(cartItem?.qty - 1, false)}
              >
                <Remove fontSize="small" />
              </QuantityButton>

              <H3 
                fontWeight="700" 
                sx={{
                  minWidth: "50px",
                  textAlign: "center",
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: "1.25rem",
                }}
              >
                {cartItem?.qty.toString().padStart(2, "0")}
              </H3>

              <QuantityButton
                size="small"
                color="primary"
                variant="outlined"
                onClick={handleCartAmountChange(cartItem?.qty + 1, true)}
              >
                <Add fontSize="small" />
              </QuantityButton>
            </FlexBox>
          )}
        </Box>
      </Box>
    </Card>
  );

  // Render based on session
  if (session) {
    return <CardContent showWishlist={true} />;
  } else {
    return <CardContent showWishlist={false} />;
  }
};

export default ProductCard1;
