/* eslint-disable react-hooks/exhaustive-deps */
import { Add, Favorite, Remove, RemoveRedEye } from "@mui/icons-material";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import { Box, Button, Chip, IconButton, styled } from "@mui/material";
import BazaarCard from "components/BazaarCard";
import LazyImage from "components/LazyImage";
import ProductViewDialog from "components/products/ProductViewDialog";
import { H3, Span } from "components/Typography";
import { useAppContext } from "contexts/AppContext";
import Link from "next/link";
import { Fragment, useCallback, useState,useEffect } from "react";
import { FlexBox } from "../flex-box";
import { useSession, signIn, signOut } from 'next-auth/react';
import axios from "axios";
import { toast } from 'react-toastify';



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
const ImageWrapper = styled(Box)(({ theme }) => ({
  textAlign: "center",
  position: "relative",
  display: "inline-block",
  padding:"20px",
  [theme.breakpoints.down("sm")]: {
    display: "block",
  },
}));
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
const BundleCard1 = ({
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
  showProductSize,
  category,
  wishList,
  stock,
  props
}) => {
  const imgurl = process.env.NEXT_PUBLIC_IMAGE_BASE_API_URL;
  const server_ip = process.env.NEXT_PUBLIC_BACKEND_API_BASE;
  const itemImgUrl=process.env.NEXT_PUBLIC_BACKEND_API_BASE+'media/'


const[currency,setCurrency]=useState('')

useEffect(()=>{
  if (typeof window !== 'undefined' && window.localStorage) {
    const storedCurrency = localStorage.getItem('currency');

    setCurrency(storedCurrency);
  }
},[])

  const { data: session, status } = useSession()
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

  const { state, dispatch } = useAppContext();
  const [openModal, setOpenModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  if (wishList!== undefined && isFavorite === undefined ){
    setIsFavorite((fav) => fav === undefined ? wishList.includes(id) : false)
  }
  const categoryName = category['name'];
  const toggleIsFavorite = () => setIsFavorite((fav) => !fav);

  const toggleDialog = useCallback(() => setOpenModal((open) => !open), []);
  const cartItem = state.cart.find((item) => item.id === id);
  const handleCartAmountChange = useCallback(
    

    (product) => async () => {
      const response = await axios({
        method: 'post',
        url: server_ip+'getWebsiteBundleItemDetails',
        data: {
          slug: product.slug
        }
      });
    
      const validItems = response?.data?.bundleItems?.filter((item) => item.qty > 0);
    
      validItems.forEach((item) => {
        dispatch({
          type: "CHANGE_CART_AMOUNT",
          payload: {
            id:         item.id,
            mrp:        item.mrp,
            salePrice:  item.salePrice,
            price:      item.salePrice,
            sku:        item.sku,
            slug:item.slug,
            image:      imgurl+item.image,
            name:       item.name,
            qty:        item.qty,
            bundle:     true
          },
        });
      });
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
  if (session){
    return (
      <StyledBazaarCard hoverEffect={hoverEffect}>
        <ImageWrapper>
          {!!discount && (
            <StyledChip color="primary" size="small" label={`${discount} off`} />
          )}
  
          <HoverIconWrapper className="hover-box">
           
  
            <IconButton onClick={() => addwishtlist()}>
            {isFavorite ? (
              <Favorite color="primary" fontSize="small" />
            ) : (
              <FavoriteBorder fontSize="small" color="disabled" />
            )}
          </IconButton>
          </HoverIconWrapper>
  
          <Link href={`/bundle/${slug}`}>
            <a>
              <LazyImage
                src={`${image}`}
                width={0}
                height={0}
                objectFit="contain"
                layout="responsive"
                alt={name}
              />
            </a>
          </Link>
        </ImageWrapper>
  
        <ProductViewDialog
          openDialog={openModal}
          handleCloseDialog={toggleDialog}
          product={{
            name,
            mrp,
            id,
            description,
            categoryName,
            imgGroup: [image, image],
          }}
        />
  
        <ContentWrapper>
          <FlexBox>
            <Box flex="1 1 0" minWidth="0px" mr={1}>
              <Link href={`/bundle/${slug}`}>
                <a>
                  <H3
                    mb={1}
                    title={name}
                    fontSize="14px"
                    fontWeight="600"
                    className="title"
                    color="text.secondary"
                  >
                    {name}
                  </H3>
                </a>
              </Link>
  
            
  
              {showProductSize && (
                <Span color="grey.600" mb={1} display="block">
                  300ml
                </Span>
              )}
  
  <FlexBox alignItems="center" gap={1} mt={0.5}>
                <Box fontWeight="600" color="primary.main">
                  {currency}. {(salePrice).toFixed(2)}
                </Box>
  
                {!!discount && (
                  <Box color="grey.600" fontWeight="600">
                    <del>{mrp?.toFixed(2)}</del>
                  </Box>
                )}
              </FlexBox>
            </Box>
  
            <FlexBox
              width="30px"
              alignItems="center"
              className="add-cart"
              flexDirection="column-reverse"
              justifyContent={!!cartItem?.qty ? "space-between" : "flex-start"}
            >
             
  
             {!!cartItem?.qty && (
                <Fragment>
                 
  
                  <Button
                    color="primary"
                    variant="outlined"
                    sx={{
                      padding: "3px",
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
            
                </Fragment>
                
              )}
               <Box color="text.primary" fontWeight="600">
                    {cartItem?.qty}
                  </Box>
               
                  <Button
                color="primary"
                variant="outlined"
                sx={{
                  padding: "3px",
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
                <Add fontSize="small" />
              </Button>
            </FlexBox>
          </FlexBox>
        </ContentWrapper>
      </StyledBazaarCard>
    );
  }
  return (
    <StyledBazaarCard hoverEffect={hoverEffect}>
      <ImageWrapper>
        {!!discount && (
          <StyledChip color="primary" size="small" label={`${discount} off`} />
        )}

      

        <Link href={`/bundle/${slug}`}>
          <a>
            <LazyImage
              src={`${image}`}
              width={0}
              height={0}
              objectFit="contain"
              layout="responsive"
              alt={name}
            />
          </a>
        </Link>
      </ImageWrapper>

      <ProductViewDialog
        openDialog={openModal}
        handleCloseDialog={toggleDialog}
        product={{
          name,
          mrp,
          id,
          slug,
          description,
          categoryName,
          imgGroup: [image, image],
        }}
      />

      <ContentWrapper>
        <FlexBox>
          <Box flex="1 1 0" minWidth="0px" mr={1}>
            <Link href={`/bundle/${slug}`}>
              <a>
                <H3
                  mb={1}
                  title={name}
                  fontSize="14px"
                  fontWeight="600"
                  className="title"
                  color="text.secondary"
                >
                  {name}
                </H3>
              </a>
            </Link>

          

            {showProductSize && (
              <Span color="grey.600" mb={1} display="block">
                300ml
              </Span>
            )}

<FlexBox alignItems="center" gap={1} mt={0.5}>
              <Box fontWeight="600" color="primary.main">
                {currency}. {(salePrice).toFixed(2)}
              </Box>

              {!!discount && (
                <Box color="grey.600" fontWeight="600">
                  <del>{mrp?.toFixed(2)}</del>
                </Box>
              )}
            </FlexBox>
          </Box>

          <FlexBox
            width="30px"
            alignItems="center"
            className="add-cart"
            flexDirection="column-reverse"
            justifyContent={!!cartItem?.qty ? "space-between" : "flex-start"}
          >
             {!!cartItem?.qty && (
                <Fragment>
                 
  
                  <Button
                    color="primary"
                    variant="outlined"
                    sx={{
                      padding: "3px",
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
            
                </Fragment>
                
              )}
               <Box color="text.primary" fontWeight="600">
                    {cartItem?.qty}
                  </Box>
               
                  <Button
                color="primary"
                variant="outlined"
                sx={{
                  padding: "3px",
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
                <Add fontSize="small" />
              </Button>
              
          </FlexBox>
        </FlexBox>
      </ContentWrapper>
    </StyledBazaarCard>
  );
  
};



export default BundleCard1;
