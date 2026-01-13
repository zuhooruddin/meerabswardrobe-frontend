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
import BazaarButton from "components/BazaarButton";
import { toast } from "react-toastify";
import { FlexRowCenter } from "components/flex-box";
import BazaarRating from "components/BazaarRating";
import VariantSelectionDialog from "components/products/VariantSelectionDialog";

const Wrapper = styled(Card)(() => ({
  width: "100%",
  overflow: "hidden",
  position: "relative",
  marginBottom: "1.25rem",
})); // ===========================================================
const StyledChip1 = styled(Chip)(() => ({
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
const ProductCard9 = ({
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
  showProductSize,
  stock,
  isNewArrival,
  category,
  wishList,
  ProductReviews,
  wishlist,
  // Variant support
  variants,
  available_colors,
  available_sizes,
}) => {
  const discountprice = salePrice;
  const calculatedDiscountAmount = (salePrice * discount) / 100;
  const calculatedDiscountedSubtotal = salePrice - calculatedDiscountAmount;

  salePrice = calculatedDiscountedSubtotal;

  const imgbaseurl = process.env.NEXT_PUBLIC_IMAGE_BASE_API_URL;


const[currency,setCurrency]=useState('')

useEffect(()=>{


  if (typeof window !== 'undefined' && window.localStorage) {
    const storedCurrency = localStorage.getItem('currency');

    setCurrency(storedCurrency);
  }

  
},[])



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
  const { state, dispatch } = useAppContext();
  const cartItem = state.cart.find((item) => item.id === id);
  const { data: session, status } = useSession();
  const [openVariantDialog, setOpenVariantDialog] = useState(false);

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
    // Check if product has variants (via available_colors or variants prop)
    const hasVariants = (variants && variants.length > 0) || (available_colors && available_colors.length > 0);
    
    // If product has variants and item is not in cart with variant info, open variant selection dialog
    if (hasVariants && !cartItem?.variant_id && amount === true) {
      setOpenVariantDialog(true);
      return;
    }

    // If no variants or item already has variant info, proceed with normal add/update
    if (!hasVariants || cartItem?.variant_id) {
      const payload = {
        ...product,
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
  }, [variants, available_colors, cartItem, dispatch]);
  if (session) {
    return (
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

              <Image
                src={imgbaseurl + image}
                alt={name}
                width="100%"
                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
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
                  {currency}. {salePrice.toFixed(2)}
                </H5>

                {!!discount && (
                  <Span fontWeight="600" color="grey.600">
                    <del> {currency}. {discountprice?.toFixed(2)}</del>
                  </Span>
                )}
              </FlexBox>

              {stock == 0.0 ? (
                <>
                  <StyledChip1
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
                          mrp,
                          salePrice,
                          price: salePrice,
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
                            mrp,
                            salePrice,
                            price: salePrice,
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
                            salePrice,
                            price: salePrice,
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
    );
  } else {
    return (
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
                 {currency}. {salePrice?.toFixed(2)}
                </H5>

                {!!discount && (
                  <Span fontWeight="600" color="grey.600">
                    <del>{currency}. {discountprice.toFixed(2)}</del>
                  </Span>
                )}
              </FlexBox>

              <FlexBox>
                {stock == 0.0 ? (
                  <>
                    <StyledChip1
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
                            mrp,
                            salePrice,
                            price: salePrice,
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
                              mrp,
                              salePrice,
                              price: salePrice,
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
                              salePrice,
                              price: salePrice,
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
          salePrice,
          sku,
          slug,
          image: imgbaseurl + image,
          imgGroup: [imgbaseurl + image, imgbaseurl + image],
          variants,
          available_colors,
          available_sizes,
        }}
      />
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
export default ProductCard9;
