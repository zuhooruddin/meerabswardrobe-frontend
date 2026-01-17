import { Add, Remove, Favorite } from "@mui/icons-material";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import {
  Box,
  Button,
  Card,
  Chip,
  Grid,
  IconButton,
  Rating,
  styled,
} from "@mui/material";
import Image from "components/BazaarImage";
import { FlexBetween, FlexBox } from "components/flex-box";
import { H5, Span, Small } from "components/Typography";
import { useAppContext } from "contexts/AppContext";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react"; // styled components
import { useSession, signIn, signOut } from "next-auth/react";
import { toast } from "react-toastify";
import BazaarRating from "components/BazaarRating";
import VariantSelectionDialog from "components/products/VariantSelectionDialog";

const Wrapper = styled(Card)(() => ({
  width: "100%",
  overflow: "hidden",
  position: "relative",
  marginBottom: "1.25rem",
})); // ===========================================================
const StyledChip = styled(Chip)(() => ({
  zIndex: 1,
  top: "10px",
  left: "10px",
  paddingLeft: 3,
  paddingRight: 3,
  fontWeight: 600,
  fontSize: "10px",
  position: "absolute",
}));
// ===========================================================
const SearchCard9 = ({
  id,
  name,
  mrp,
  image,
  slug,
  sku,
  salePrice,
  description,
  // category = "Product Dialog",
  rating = 5,
  hideRating,
  hoverEffect,
  discount,
  stock,
  isNewArrival,
  showProductSize,
  category,
  wishList,
  ProductReviews,
  wishlist,
  // Variant support
  variants,
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


const [currency,setCurrency]=useState('')

useEffect(()=>{
  if (typeof window !== 'undefined' && window.localStorage) {
    const storedCurrency = localStorage.getItem('currency');

    setCurrency(storedCurrency);
  }
},[])



  const { state, dispatch } = useAppContext();
  const cartItem = state.cart.find((item) => item.id === id);
  const { data: session, status } = useSession();
  const [openVariantDialog, setOpenVariantDialog] = useState(false);
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
  const Reviews = ProductReviews.Reviews.filter(
    (item) => item.itemid_id === id
  );

  const totalRatings = Reviews.reduce((total, item) => total + item.rating, 0);

  const averageRating = totalRatings / Reviews.length;

  const roundedAverageRating = Math.min(
    Math.round(averageRating * 100) / 100,
    5
  );

  const total = Reviews.length;
  const [isFavorite, setIsFavorite] = useState(undefined);
  if (Array.isArray(wishlist) && isFavorite === undefined) {
    setIsFavorite((fav) =>
      fav === undefined ? wishlist.some((item) => item.id === id) : false
    );
  }

  const handleCartAmountChange = useCallback((product, amount) => () => {
    // Check if product has variants (via available_colors, available_sizes, or variants array)
    // IMPORTANT: Use robust checking to handle production edge cases
    const hasVariants = (variants !== undefined && variants !== null && Array.isArray(variants) && variants.length > 0) || 
                        (available_colors !== undefined && available_colors !== null && Array.isArray(available_colors) && available_colors.length > 0) ||
                        (available_sizes !== undefined && available_sizes !== null && Array.isArray(available_sizes) && available_sizes.length > 0);
    
    // Debug: Log variant information to help diagnose production issues
    if (amount === true && process.env.NODE_ENV === 'development') {
      console.log('🔍 SearchCard9 variant check:', {
        productId: id,
        productName: name,
        hasVariants,
        variants,
        variantsLength: variants?.length,
        available_colors,
        available_colorsLength: available_colors?.length,
        available_sizes,
        available_sizesLength: available_sizes?.length,
        cartItemVariantId: cartItem?.variant_id,
      });
    }
    
    // If product has variants and item is not in cart with variant info, open variant selection dialog
    if (hasVariants && !cartItem?.variant_id && (amount === true || amount === 1)) {
      setOpenVariantDialog(true);
      return;
    }

    // If no variants or item already has variant info, proceed with normal add/update
    if (!hasVariants || cartItem?.variant_id) {
      const payload = {
        id: id,
        name: name,
        mrp: numericMrp,
        salePrice: finalSalePrice,
        salePrices: finalSalePrice,
        price: finalSalePrice,
        discount: numericDiscount,
        sku: sku,
        slug: slug,
        image: imgbaseurl + image,
        qty: amount || 1,
        // Preserve variant information from cartItem if it exists
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
      if (amount == true) {
        toast.success("Added to cart", { position: toast.POSITION.TOP_RIGHT });
      } else {
        toast.error("Removed from cart", { position: toast.POSITION.TOP_RIGHT });
      }
    }
  }, [variants, available_colors, available_sizes, cartItem, dispatch, id, name]);
  if (session) {
    return (
      <>
      <Wrapper>
        <IconButton
          onClick={() => addwishtlist()}
          size="small"
          sx={{
            position: "absolute",
            top: 15,
            right: 15,
          }}
        >
          {isFavorite ? (
            <Favorite color="primary" fontSize="small" />
          ) : (
            <FavoriteBorder fontSize="small" color="disabled" />
          )}
        </IconButton>

        <Grid container spacing={1}>
          <Grid item sm={1.5} xs={10}>
            <Box position="relative">
              {!!discount && (
                <Chip
                  size="small"
                  color="primary"
                  label={`${discount}% off`}
                  sx={{
                    top: 15,
                    left: 15,
                    px: "5px",
                    fontSize: 10,
                    fontWeight: 600,
                    position: "absolute",
                  }}
                />
              )}

              <Image src={imgbaseurl + image} alt={name} width="100%" />
            </Box>
          </Grid>

          <Grid item sm={9} xs={12}>
            <FlexBox
              flexDirection="column"
              justifyContent="center"
              height="100%"
              p={2}
            >
              <Link href={`/product/${slug}`}>
                <a>
                  <H5 fontWeight="600" my="0.5rem">
                    {name}
                  </H5>
                </a>
              </Link>
              <FlexBox>
                <BazaarRating
                  value={averageRating && averageRating ? averageRating : 0}
                  color="warn"
                  readOnly
                />
                <Small ml={2} fontWeight={600} color="grey.500">
                  ({total && total ? total : 0})
                </Small>
              </FlexBox>

              <FlexBox mt={1} mb={2} alignItems="center">
                <H5 fontWeight={600} color="primary.main" mr={1}>
                  {currency} {finalSalePrice.toFixed(2)}
                </H5>

                {!!discount && (
                  <Span fontWeight="600" color="grey.600">
                    <del> {currency}. {discountprice?.toFixed(2)}</del>
                  </Span>
                )}
              </FlexBox>
              {stock == 0.0 ? (
                <>
                  <StyledChip
                    color="primary"
                    size="small"
                    label="Out of Stock"
                  />
                </>
              ) : (
                <FlexBox>
                  {!cartItem?.qty && (
                    <Button
                      color="primary"
                      variant="contained"
                      sx={{
                        height: 32,
                      }}
                      onClick={handleCartAmountChange(
                        {
                          id,
                          mrp: numericMrp,
                          salePrice: finalSalePrice,
                          salePrices: finalSalePrice,
                          price: finalSalePrice,
                          discount: numericDiscount,
                          sku,
                          slug,
                          image: imgbaseurl + image,
                          name: name,
                          qty: (cartItem?.qty || 0) + 1,
                        },
                        true
                      )}
                    >
                      Add To Cart
                    </Button>
                  )}

                  {!!cartItem?.qty && (
                    <FlexBetween>
                      <Button
                        color="primary"
                        variant="outlined"
                        sx={{
                          padding: "5px",
                        }}
                        onClick={handleCartAmountChange(
                          {
                            id,
                            mrp: numericMrp,
                            salePrice: finalSalePrice,
                            salePrices: finalSalePrice,
                            price: finalSalePrice,
                            discount: numericDiscount,
                            sku,
                            slug,
                            image: imgbaseurl + image,
                            name: name,
                            qty: (cartItem?.qty || 0) - 1,
                          },
                          false
                        )}
                      >
                        <Remove fontSize="small" />
                      </Button>
                      <H5 fontWeight="600" fontSize="15px" mx={1.5}>
                        {cartItem.qty}
                      </H5>
                      <Button
                        color="primary"
                        variant="outlined"
                        sx={{
                          padding: "5px",
                        }}
                        onClick={handleCartAmountChange(
                          {
                            id,
                            mrp,
                            salePrice: finalSalePrice,
                            salePrices: finalSalePrice,
                            price: finalSalePrice,
                            mrp: numericMrp,
                            discount: numericDiscount,
                            sku,
                            image: imgbaseurl + image,
                            name: name,
                            qty: (cartItem?.qty || 0) + 1,
                          },
                          true
                        )}
                      >
                        <Add fontSize="small" />
                      </Button>
                    </FlexBetween>
                  )}
                </FlexBox>
              )}
            </FlexBox>
          </Grid>
        </Grid>
      </Wrapper>

      <VariantSelectionDialog
        open={openVariantDialog}
        onClose={() => setOpenVariantDialog(false)}
        product={{
          id,
          name,
          mrp,
          salePrice: finalSalePrice,
          mrp: numericMrp,
          discount: numericDiscount,
          sku,
          slug,
          image: imgbaseurl + image,
          imgGroup: [imgbaseurl + image, imgbaseurl + image],
          variants,
          available_colors,
          available_sizes,
        }}
      />
      </>
    );
  } else {
    return (
      <>
      <Wrapper>
        <Grid container spacing={1}>
          <Grid item sm={1.5} xs={10}>
            <Box position="relative">
              {!!discount && (
                <Chip
                  size="small"
                  color="primary"
                  label={`${discount}% off`}
                  sx={{
                    top: 15,
                    left: 15,
                    px: "5px",
                    fontSize: 10,
                    fontWeight: 600,
                    position: "absolute",
                  }}
                />
              )}

              <Image src={imgbaseurl + image} alt={name} width="100%" />
            </Box>
          </Grid>

          <Grid item sm={9} xs={12}>
            <FlexBox
              flexDirection="column"
              justifyContent="center"
              height="100%"
              p={2}
            >
              <Link href={`/product/${slug}`}>
                <a>
                  <H5 fontWeight="600" my="0.5rem">
                    {name}
                  </H5>
                </a>
              </Link>
              <FlexBox>
                <BazaarRating
                  value={averageRating && averageRating ? averageRating : 0}
                  color="warn"
                  readOnly
                />
                <Small ml={2} fontWeight={600} color="grey.500">
                  ({total && total ? total : 0})
                </Small>
              </FlexBox>

              <FlexBox mt={1} mb={2} alignItems="center">
                <H5 fontWeight={600} color="primary.main" mr={1}>
                 {currency}. {finalSalePrice?.toFixed(2)}
                </H5>

                {!!discount && (
                  <Span fontWeight="600" color="grey.600">
                    <del>{currency}. {discountprice.toFixed(2)}</del>
                  </Span>
                )}
              </FlexBox>
              {stock == 0.0 ? (
                <>
                  <StyledChip
                    color="primary"
                    size="small"
                    label="Out of Stock"
                  />
                </>
              ) : (
                <FlexBox>
                  {!cartItem?.qty && (
                    <Button
                      color="primary"
                      variant="contained"
                      sx={{
                        height: 32,
                      }}
                      onClick={handleCartAmountChange(
                        {
                          id,
                          mrp: numericMrp,
                          salePrice: finalSalePrice,
                          salePrices: finalSalePrice,
                          price: finalSalePrice,
                          discount: numericDiscount,
                          sku,
                          slug,
                          image: imgbaseurl + image,
                          name: name,
                          qty: (cartItem?.qty || 0) + 1,
                        },
                        true
                      )}
                    >
                      Add To Cart
                    </Button>
                  )}

                  {!!cartItem?.qty && (
                    <FlexBetween>
                      <Button
                        color="primary"
                        variant="outlined"
                        sx={{
                          padding: "5px",
                        }}
                        onClick={handleCartAmountChange(
                          {
                            id,
                            mrp: numericMrp,
                            salePrice: finalSalePrice,
                            salePrices: finalSalePrice,
                            price: finalSalePrice,
                            discount: numericDiscount,
                            sku,
                            slug,
                            image: imgbaseurl + image,
                            name: name,
                            qty: (cartItem?.qty || 0) - 1,
                          },
                          false
                        )}
                      >
                        <Remove fontSize="small" />
                      </Button>
                      <H5 fontWeight="600" fontSize="15px" mx={1.5}>
                        {cartItem.qty}
                      </H5>
                      <Button
                        color="primary"
                        variant="outlined"
                        sx={{
                          padding: "5px",
                        }}
                        onClick={handleCartAmountChange(
                          {
                            id,
                            mrp,
                            salePrice: finalSalePrice,
                            salePrices: finalSalePrice,
                            price: finalSalePrice,
                            mrp: numericMrp,
                            discount: numericDiscount,
                            sku,
                            slug,
                            image: imgbaseurl + image,
                            name: name,
                            qty: (cartItem?.qty || 0) + 1,
                          },
                          true
                        )}
                      >
                        <Add fontSize="small" />
                      </Button>
                    </FlexBetween>
                  )}
                </FlexBox>
              )}
            </FlexBox>
          </Grid>
        </Grid>
      </Wrapper>

      <VariantSelectionDialog
        open={openVariantDialog}
        onClose={() => setOpenVariantDialog(false)}
        product={{
          id,
          name,
          mrp,
          salePrice: finalSalePrice,
          mrp: numericMrp,
          discount: numericDiscount,
          sku,
          slug,
          image: imgbaseurl + image,
          imgGroup: [imgbaseurl + image, imgbaseurl + image],
          variants,
          available_colors,
          available_sizes,
        }}
      />
      </>
    );
  }
};

// ProductCard9.defaultProps = {
//   title:
//     "Apple iPhone 5 Unlocked 16GB 8MP Used Cell-Phone-16gbIOS Used Refurbished 100%Factory Used",
//   imgUrl: "/assets/images/products/macbook.png",
//   off: 50,
//   price: 450,
//   rating: 0,
//   subcategories: [
//     {
//       title: "Bike",
//       url: "/#",
//     },
//     {
//       title: "Ducati",
//       url: "/#",
//     },
//     {
//       title: "Motors",
//       url: "/#",
//     },
//   ],
// };
export default SearchCard9;
