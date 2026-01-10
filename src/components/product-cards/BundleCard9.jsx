import { Add, Remove,Favorite } from "@mui/icons-material";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import { useSession, signIn, signOut } from 'next-auth/react';
import { toast } from 'react-toastify';

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
import { H5, Span } from "components/Typography";
import { useAppContext } from "contexts/AppContext";
import Link from "next/link";
import React, { useCallback, useState } from "react";
 // styled components
 import axios from "axios";


const Wrapper = styled(Card)(() => ({
  width: "100%",
  overflow: "hidden",
  position: "relative",
  marginBottom: "1.25rem",

  // "& .grid":{
  //   grid-template-columns: auto;
  // }

})); // ===========================================================

// ===========================================================
const BundleCard9 = ({ 
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
  discount = 0,
  category,
  wishList
}) => {

  const [openModal, setOpenModal] = useState(false);
  const toggleDialog = useCallback(() => setOpenModal((open) => !open), []);
  const categoryName = category['name'];
  const { data: session, status } = useSession()

  const server_ip = process.env.NEXT_PUBLIC_BACKEND_API_BASE;
  const itemImgUrl=process.env.NEXT_PUBLIC_BACKEND_API_BASE+'media/'

  const imgbaseurl=process.env.NEXT_PUBLIC_BACKEND_API_BASE
  const addwishtlist = async () => {
    
    let userid = session.user.id
    await fetch(process.env.NEXT_PUBLIC_BACKEND_API_BASE+"updateWishlist", {
      method: "POST",
      body: JSON.stringify({
        userid: userid,
        itemid: id,
      }),
      headers: {
        "Content-Type": "application/json",
        "Authorization":'Bearer '+session.accessToken
      },
    }).then((res) => res.json());
    setIsFavorite((fav) => !fav)
  }

  const [isFavorite, setIsFavorite] = useState(false);

  if (wishList!== undefined && isFavorite === undefined ){
    setIsFavorite((fav) => fav === undefined ? wishList.includes(id) : false)
  }
  const { state, dispatch } = useAppContext();
  const cartItem = state.cart.find((item) => item.id === id);
  const handleCartAmountChange = useCallback(
    (product) => async () =>{
      const response = await  axios({
        method: 'post',
        url: server_ip+'getWebsiteBundleItemDetails',
        data: {
          slug: product.slug
        }
      })
      response.data.bundleItems.map((row,index) => (
        dispatch({
          type: "CHANGE_CART_AMOUNT",
          payload: {
            id:         row.id,
            mrp:        row.mrp,
            salePrice:  row.salePrice,
            price:      row.salePrice,
            sku:        row.sku,
            image:      itemImgUrl+row.image,
            name:       row.name,
            qty:        row.qty,
            bundle:     true,

          },
        })
      ));
      if (product.qty > 0) {
      
        toast.success("Added to cart", { position: toast.POSITION.TOP_RIGHT });
      } else {

        toast.error("Removed from cart", { position: toast.POSITION.TOP_RIGHT });
      }
   
      // dispatch({
        
      //   type: "CHANGE_CART_AMOUNT",
      //   payload: product,
      // }),   []
      
    }
  
  );
  if(session){
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
  
        <Grid container spacing={1} sx={{
          justifyContent:"center",
          alignItems:"center",
        }}>
          <Grid item sm={3} xs={3}>
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
  
              <Image src={`${image}`} alt={name} width="100%"/>
            </Box>
          </Grid>
  
          {/* <ProductViewDialog
            openDialog={openModal}
            handleCloseDialog={toggleDialog}
            product={{
              name,
              mrp:salePrice,
              id,
              description,
              categoryName,
              imgGroup: [image, image],
            }}  
          /> */}
  
          <Grid item sm={9} xs={9}>
            <FlexBox
              flexDirection="column"
              justifyContent="center"
              height="100%"
              p={2}
            >
              <Link href={`/bundle/${slug}`}>
                <a>
                  <H5 fontWeight="600" my="0.5rem">
                    {name}
                  </H5>
                </a>
              </Link>
  
  
              <FlexBox mt={1} mb={2} alignItems="center">
                <H5 fontWeight={600} color="primary.main" mr={1}>
                  Rs. {mrp?.toFixed(2)}
                </H5>
  
                {!! discount && (
                  <Span fontWeight="600" color="grey.600">
                    <del>Rs. {(mrp - (mrp * discount) / 100).toFixed(2)}</del>
                  </Span>
                )}
              </FlexBox>
  
              <FlexBox>
                {!cartItem?.qty && (
                  <Button
                    color="primary"
                    variant="contained"
                    sx={{
                      height: 32,
                    }}
                    onClick={handleCartAmountChange({
                      id,
                      mrp,
                      salePrice,
                      price: salePrice,
                      sku,
                      slug,
                      image,
                      name: name,
                      qty: (cartItem?.qty || 0) + 1,
                    })}
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
                      onClick={handleCartAmountChange({
                        id,
                        mrp,
                        salePrice,
                        price: salePrice,
                        sku,
                        slug,
                        image,
                        name: name,
                        qty: (cartItem?.qty || 0) - 1,
                      })}
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
                      onClick={handleCartAmountChange({
                        id,
                        mrp,
                        salePrice,
                        price: salePrice,
                        sku,
                        image,
                        name: name,
                        qty: (cartItem?.qty || 0) + 1,
                      })}
                    >
                      <Add fontSize="small" />
                    </Button>
  
                  </FlexBetween>
                )}
              </FlexBox>
            </FlexBox>
          </Grid>
        </Grid>
      </Wrapper>
    );
  }
  return (
    <Wrapper>
    

      <Grid container spacing={1} sx={{
        justifyContent:"center",
        alignItems:"center",
      }}>
        <Grid item sm={3} xs={3}>
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

            <Image src={`${image}`} alt={name} width="100%"/>
          </Box>
        </Grid>

        {/* <ProductViewDialog
          openDialog={openModal}
          handleCloseDialog={toggleDialog}
          product={{
            name,
            mrp:salePrice,
            id,
            description,
            categoryName,
            imgGroup: [image, image],
          }}  
        /> */}

        <Grid item sm={9} xs={9}>
          <FlexBox
            flexDirection="column"
            justifyContent="center"
            height="100%"
            p={2}
          >
            <Link href={`/bundle/${slug}`}>
              <a>
                <H5 fontWeight="600" my="0.5rem">
                  {name}
                </H5>
              </a>
            </Link>


            <FlexBox mt={1} mb={2} alignItems="center">
              <H5 fontWeight={600} color="primary.main" mr={1}>
                Rs. {mrp?.toFixed(2)}
              </H5>

              {!! discount && (
                <Span fontWeight="600" color="grey.600">
                  <del>Rs. {(mrp - (mrp * discount) / 100).toFixed(2)}</del>
                </Span>
              )}
            </FlexBox>

            <FlexBox>
              {!cartItem?.qty && (
                <Button
                  color="primary"
                  variant="contained"
                  sx={{
                    height: 32,
                  }}
                  onClick={handleCartAmountChange({
                    id,
                    mrp,
                    salePrice,
                    price: salePrice,
                    sku,
                    slug,
                    image,
                    name: name,
                    qty: (cartItem?.qty || 0) + 1,
                  })}
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
                    onClick={handleCartAmountChange({
                      id,
                      mrp,
                      salePrice,
                      price: salePrice,
                      sku,
                      slug,
                      image,
                      name: name,
                      qty: (cartItem?.qty || 0) - 1,
                    })}
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
                    onClick={handleCartAmountChange({
                      id,
                      mrp,
                      salePrice,
                      price: salePrice,
                      sku,
                      image,
                      name: name,
                      qty: (cartItem?.qty || 0) + 1,
                    })}
                  >
                    <Add fontSize="small" />
                  </Button>

                </FlexBetween>
              )}
            </FlexBox>
          </FlexBox>
        </Grid>
      </Grid>
    </Wrapper>
  );
};


export default BundleCard9;
