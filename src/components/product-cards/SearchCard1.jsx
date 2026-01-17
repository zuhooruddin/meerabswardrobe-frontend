/* eslint-disable react-hooks/exhaustive-deps */
import { Add, Favorite, Remove, RemoveRedEye } from "@mui/icons-material";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import { Box, Button, Chip, IconButton, styled, Rating } from "@mui/material";
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
import { FlexRowCenter } from "components/flex-box";
import { useRouter } from "next/router";

const StyledBazaarCard = styled(BazaarCard)(() => ({
  height: "100%",
  margin: "auto",
  display: "flex",
  overflow: "hidden",
  borderRadius: "8px",
  position: "relative",
  flexDirection: "column",
  justifyContent: "space-between",
  transition: "all 250ms ease-in-out",
  ":hover": {
    "& .hover-box": {
      opacity: 1,
    },
  },
}));
const CardMedia = styled(Box)(() => ({
  width: "100%",
  maxHeight: 300,
  cursor: "pointer",
  overflow: "hidden",
  position: "relative",
  "& img": {
    transition: "0.3s",
  },
}));
const AddToCartButton = styled(IconButton)(() => ({
  top: 10,
  right: -40,
  position: "absolute",
  transition: "right 0.3s .1s",
}));
const FavouriteButton = styled(IconButton)(() => ({
  top: 45,
  right: -40,
  position: "absolute",
  transition: "right 0.3s .2s",
}));
const Card = styled(Box)(({ theme }) => ({
  borderRadius: "3px",
  transition: "all 0.3s",
  backgroundColor: theme.palette.common.white,
  border: `1px solid ${theme.palette.grey[100]}`,
  ":hover": {
    "& .product-actions": {
      right: 5,
    },
    "& img": {
      transform: "scale(1.1)",
    },
    border: `1px solid ${theme.palette.dark.main}`,
  },
}));
const ImageWrapper = styled(Box)(({ theme }) => ({
  textAlign: "center",
  position: "relative",
  display: "inline-block",
  [theme.breakpoints.down("sm")]: {
    display: "block",
  },
}));
const StyledChip = styled(Chip)(() => ({
  zIndex: 1,
  top: "10px",
  left: "0px",
  paddingLeft: 3,
  paddingRight: 3,
  fontWeight: 600,
  fontSize: "10px",
  position: "initial",
}));
const StyledChip1 = styled(Chip)(() => ({
  zIndex: 1,
  top: "10px",
  left: "15px",
  paddingLeft: 3,
  paddingRight: 3,
  fontWeight: 600,
  fontSize: "10px",
  position: "absolute",
}));
const HoverIconWrapper = styled(Box)(({ theme }) => ({
  zIndex: 2,
  top: "7px",
  opacity: 0,
  right: "15px",
  display: "flex",
  cursor: "pointer",
  position: "absolute",
  flexDirection: "column",
  transition: "all 0.3s ease-in-out",
}));
const ContentWrapper = styled(Box)(() => ({
  padding: "1rem",
  "& .title, & .categories": {
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
})); // ========================================================

// ========================================================
const SearchCard1 = ({
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
  stock,
  isNewArrival,
  discount,
  showProductSize,
  wishList,
  category,
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
  
  // Use finalSalePrice for all price references
  salePrice = finalSalePrice;

  const imgbaseurl = process.env.NEXT_PUBLIC_IMAGE_BASE_API_URL;

  const categoryName = "";
  const { data: session, status } = useSession();
  const router = useRouter();

  const { state, dispatch } = useAppContext();
  const [openModal, setOpenModal] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openVariantDialog, setOpenVariantDialog] = useState(false);

  const[currency,setCurrency]=useState('')

  useEffect(()=>{
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedCurrency = localStorage.getItem('currency');

      setCurrency(storedCurrency);
    }

  },[])

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
  // Check for cart item with variant matching (if product has variants)
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
        if (addedflag == true) {
          toast.success("Added to cart", { position: toast.POSITION.TOP_RIGHT });
        } else {
          toast.error("Removed from cart", {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      }
    },
    [mrp, salePrice, name, sku, slug, imgbaseurl, image, id, cartItem, dispatch, variants, available_colors]
  );

  if (session) {
    return (
      <Card height="100%">
        <CardMedia>
          <Link href={`/product/${slug}`}>
            <a>
              {/* {!!discount && (
        <StyledChip color="primary" size="small" label='Sale' />

    )}
   {stock == "0.00" && isNewArrival == 1 ? (
                <StyledChip color="secondary" size="small" label="Out of Stock | New Arrival" sx={{ml:1}} />
              ) : (
                isNewArrival == 1 && stock >"0.00"  ?(
                  <StyledChip1 color="secondary"  size="small" label="New Arrival" />

                ):(
                  isNewArrival <1 && stock =="0.00"  ?(
                    <StyledChip1 color="secondary"  size="small" label="Out of Stock" />
  
                  ):("")
                )
              
              
              )} */}

              {stock === "0.00" && isNewArrival === 1 ? (
                <StyledChip
                  color="secondary"
                  size="small"
                  label="Out of Stock | New Arrival"
                  sx={{ ml: 1 }}
                />
              ) : isNewArrival === 1 && stock > "0.00" ? (
                discount > 0 ? (
                  <StyledChip1
                    color="secondary"
                    size="small"
                    label="New Arrival | Sale"
                  />
                ) : (
                  <StyledChip1
                    color="secondary"
                    size="small"
                    label="New Arrival"
                  />
                )
              ) : isNewArrival < 1 && stock === "0.00" ? (
                discount > 0 ? (
                  <StyledChip1
                    color="secondary"
                    size="small"
                    label="Out of Stock | Sale"
                  />
                ) : (
                  <StyledChip1
                    color="secondary"
                    size="small"
                    label="Out of Stock"
                  />
                )
              ) : discount > 0 ? (
                <StyledChip1 color="secondary" size="small" label="Sale" />
              ) : (
                ""
              )}

              <div className="product-img-container">
                <Image
                  width={300}
                  height={300}
                  alt="category"
                  objectFit="contain"
                  layout="intrinsic"
                  className="product-img"
                  src={imgbaseurl + image}
                  media={{
                    // Adjust image size for screens smaller than 600px wide
                    "(max-width: 600px)": {
                      width: "100%",
                      height: "auto",
                    },
                  }}
                />
              </div>

              <style>
                {`
.product-img-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
`}
              </style>
            </a>
          </Link>

          <AddToCartButton
            className="product-actions"
            onClick={() => setOpenDialog(true)}
          >
            <RemoveRedEye color="disabled" fontSize="small" />
          </AddToCartButton>
          <FavouriteButton
            className="product-actions"
            onClick={() => addwishtlist()}
          >
            {isFavorite ? (
              <Favorite color="primary" fontSize="small" />
            ) : (
              <FavoriteBorder color="disabled" fontSize="small" />
            )}
          </FavouriteButton>
        </CardMedia>

        <ProductViewDialog
          openDialog={openDialog}
          handleCloseDialog={() => setOpenDialog(false)}
          product={{
            name,
            mrp,
            id,
            salePrice,
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
            mrp,
            id,
            salePrice,
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

        <Box p={2} textAlign="center">
          <Paragraph
            style={{ lineHeight: "1.5em", height: "3em", overflow: "hidden" }}
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
                fontWeight="600"
                color="primary.main"
                sx={{
                  textAlign: "center",
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                }}
              >
                {currency}. {isNaN(salePrice) ? '0.00' : salePrice.toFixed(2)}
                {!!numericDiscount && numericDiscount > 0 && (
                  <H5>
                    <Box
                      color="grey.600"
                      fontWeight="200"
                      sx={{
                        justifyContent: "center",
                        alignItems: "center",
                        display: "flex",
                        ml: "15px",
                      }}
                    >
                      <del>{currency}.{isNaN(discountprice) ? '0.00' : discountprice.toFixed(2)}</del>
                    </Box>
                  </H5>
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
                fontSize: 14,
              }}
            />
            <Small fontWeight={600} color="grey.500">
              ({total && total ? total : 0})
            </Small>
          </FlexRowCenter>

          {stock == 0.0 ? (
            <>
              <Button
                color="primary"
                variant="contained"
                disabled={true}
                fullWidth
              >
                Add to Cart
              </Button>
            </>
          ) : !cartItem?.qty ? (
            <Button
              fullWidth
              color="dark"
              variant="outlined"
              onClick={handleCartAmountChange(1, true)}
            >
              Add to Cart
            </Button>
          ) : (
            <FlexBox
              alignItems="center"
              mb={4.5}
              sx={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "row",
              }}
            >
              <BazaarButton
                size="small"
                sx={{
                  p: 1,
                }}
                color="primary"
                variant="outlined"
                onClick={handleCartAmountChange(cartItem?.qty - 1, false)}
              >
                <Remove fontSize="small" />
              </BazaarButton>

              <H3 fontWeight="600" mx={2.5}>
                {cartItem?.qty.toString().padStart(2, "0")}
              </H3>

              <BazaarButton
                size="small"
                sx={{
                  p: 1,
                }}
                color="primary"
                variant="outlined"
                onClick={handleCartAmountChange(cartItem?.qty + 1, true)}
              >
                <Add fontSize="small" />
              </BazaarButton>
            </FlexBox>
          )}
        </Box>
      </Card>
    );
  } else {
    return (
      <Card height="100%">
        <CardMedia>
          <Link href={`/product/${slug}`}>
            <a>
              {/* {!!discount && (
          <StyledChip color="primary" size="small" label='Sale' />
  
      )}
     {stock == "0.00" && isNewArrival == 1 ? (
                <StyledChip color="secondary" size="small" label="Out of Stock | New Arrival" sx={{ml:1}} />
              ) : (
                isNewArrival == 1 && stock >"0.00"  ?(
                  <StyledChip1 color="secondary"  size="small" label="New Arrival" />

                ):(
                  isNewArrival <1 && stock =="0.00"  ?(
                    <StyledChip1 color="secondary"  size="small" label="Out of Stock" />
  
                  ):("")
                )
              
              
              )} */}

              {stock === "0.00" && isNewArrival === 1 ? (
                <StyledChip
                  color="secondary"
                  size="small"
                  label="Out of Stock | New Arrival"
                  sx={{ ml: 1 }}
                />
              ) : isNewArrival === 1 && stock > "0.00" ? (
                discount > 0 ? (
                  <StyledChip1
                    color="secondary"
                    size="small"
                    label="New Arrival | Sale"
                  />
                ) : (
                  <StyledChip1
                    color="secondary"
                    size="small"
                    label="New Arrival"
                  />
                )
              ) : isNewArrival < 1 && stock === "0.00" ? (
                discount > 0 ? (
                  <StyledChip1
                    color="secondary"
                    size="small"
                    label="Out of Stock | Sale"
                  />
                ) : (
                  <StyledChip1
                    color="secondary"
                    size="small"
                    label="Out of Stock"
                  />
                )
              ) : discount > 0 ? (
                <StyledChip1 color="secondary" size="small" label="Sale" />
              ) : (
                ""
              )}

              <div className="product-img-container">
                <Image
                  width={300}
                  height={300}
                  alt="category"
                  objectFit="contain"
                  layout="intrinsic"
                  className="product-img"
                  src={imgbaseurl + image}
                  media={{
                    // Adjust image size for screens smaller than 600px wide
                    "(max-width: 600px)": {
                      width: "100%",
                      height: "auto",
                    },
                  }}
                />
              </div>

              <style>
                {`
  .product-img-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  `}
              </style>
            </a>
          </Link>

          <AddToCartButton
            className="product-actions"
            onClick={() => setOpenDialog(true)}
          >
            <RemoveRedEye color="disabled" fontSize="small" />
          </AddToCartButton>
        </CardMedia>

        <ProductViewDialog
          openDialog={openDialog}
          handleCloseDialog={() => setOpenDialog(false)}
          product={{
            name,
            mrp,
            id,
            salePrice,
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
            mrp,
            id,
            salePrice,
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

        <Box p={2} textAlign="center">
          <Paragraph
            style={{ lineHeight: "1.5em", height: "3em", overflow: "hidden" }}
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
                fontWeight="600"
                color="primary.main"
                sx={{
                  textAlign: "center",
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                }}
              >
               {currency}. {salePrice.toFixed(2)}
                {!!discount && (
                  <H5>
                    <Box
                      color="grey.600"
                      fontWeight="200"
                      sx={{
                        justifyContent: "center",
                        alignItems: "center",
                        display: "flex",
                        ml: "15px",
                      }}
                    >
                      <del>{currency}.{discountprice?.toFixed(2)}</del>
                    </Box>
                  </H5>
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
                fontSize: 14,
              }}
            />
            <Small fontWeight={600} color="grey.500">
              ({total && total ? total : 0})
            </Small>
          </FlexRowCenter>

          {stock == 0.0 ? (
            <>
              <Button
                color="primary"
                variant="contained"
                disabled={true}
                fullWidth
              >
                Add to Cart
              </Button>
            </>
          ) : !cartItem?.qty ? (
            <Button
              fullWidth
              color="dark"
              variant="outlined"
              onClick={handleCartAmountChange(1, true)}
            >
              Add to Cart
            </Button>
          ) : (
            <FlexBox
              alignItems="center"
              mb={4.5}
              sx={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "row",
              }}
            >
              <BazaarButton
                size="small"
                sx={{
                  p: 1,
                }}
                color="primary"
                variant="outlined"
                onClick={handleCartAmountChange(cartItem?.qty - 1, false)}
              >
                <Remove fontSize="small" />
              </BazaarButton>

              <H3 fontWeight="600" mx={2.5}>
                {cartItem?.qty.toString().padStart(2, "0")}
              </H3>

              <BazaarButton
                size="small"
                sx={{
                  p: 1,
                }}
                color="primary"
                variant="outlined"
                onClick={handleCartAmountChange(cartItem?.qty + 1, true)}
              >
                <Add fontSize="small" />
              </BazaarButton>
            </FlexBox>
          )}
        </Box>
      </Card>
    );
  }
};

export default SearchCard1;
