import { Favorite, FavoriteBorder, RemoveRedEye } from "@mui/icons-material";
import { Box, Button, IconButton, Rating, styled } from "@mui/material";
import ProductViewDialog from "components/products/ProductViewDialog";
import { H4, Paragraph, Small } from "components/Typography";
import { useAppContext } from "contexts/AppContext";
import currency from "currency.js";
import Image from "next/image";
import Link from "next/link";
import { useSession, signIn, signOut } from 'next-auth/react';

import { useState } from "react"; // custom styled components

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
})); // ==============================================================

// ==============================================================
const BundleCard20 = ({ product, wishList }) => {
  const imgbaseurl=process.env.NEXT_PUBLIC_BACKEND_API_BASE
  const slugbaseurl='/bundle/'
 


  const { data: session, status } = useSession()
  const addwishtlist = async () => {
    
    let userid = session.user.id
    await fetch(process.env.NEXT_PUBLIC_BACKEND_API_BASE+"updateWishlist", {
      method: "POST",
      body: JSON.stringify({
        userid: userid,
        itemid: product.id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());
    setIsFavorite((fav) => !fav)
  }

  const { state, dispatch } = useAppContext();
  const [openDialog, setOpenDialog] = useState(false);
  const [isFavorite, setIsFavorite] = useState(undefined);
  if (wishList!== undefined && isFavorite === undefined ){
    setIsFavorite((fav) => fav === undefined ? wishList.includes(product.id) : false)
  }
  const cartItem = state.cart.find((item) => item.id === product.id); // handle favourite
  const MAX_LENGTH = 18;

  const handleAddToCart = (product) => {
    const payload = {
      id: product.id,
      name: product.name,
      imgUrl: product.image,
      price: product.salePrice,
      qty: (cartItem?.quantity || 0) + 1,
    };
    dispatch({
      type: "CHANGE_CART_AMOUNT",
      payload,
    });
  };
  if (session) {

    return (
      <Card height="100%">
        <CardMedia>
          {/* <Link href={slugbaseurl+`${product.slug}`}> */}
            <a href={slugbaseurl`${product.slug}`}>
            {/* {`slugbaseurl${encodeURIComponent(product.slug)}`} */}
              <Image
                width={300}
                height={300}
                alt="category"
                objectFit="contain"
                layout="responsive"
                className="product-img"
                // src="https://pictures.abebooks.com/isbn/9781338615036-us.jpg"
                src={imgbaseurl+product.image}
              />
            </a>
          {/* </Link> */}

          <AddToCartButton
            className="product-actions"
            onClick={() => setOpenDialog(true)}
          >
            <RemoveRedEye color="disabled" fontSize="small" />
          </AddToCartButton>

          <FavouriteButton className="product-actions" onClick={() => addwishtlist()}>
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
            id: product.id,
            name: product.name,
            mrp: product.salePrice,
            description: product.description,
            categoryName: "Category",
            imgGroup: [product.image, product.image],
          }}
        />

        <Box p={2} textAlign="center">
          <Paragraph style={{ "line-height": "1.5em", "height": "3em", "overflow": "hidden" }}>{product.name}</Paragraph>
          <H4 fontWeight={700} py={0.5}>
            {currency(product.salePrice, {
              separator: ",",
              symbol: 'Rs.'
            }).format()}
          </H4>

          {/* <FlexRowCenter gap={1} mb={2}>
          <Rating
            name="read-only"
            value={4}
            readOnly
            sx={{
              fontSize: 14,
            }}
          />
          <Small fontWeight={600} color="grey.500">
            ({product.reviews})
          </Small>
        </FlexRowCenter> */}

          <Button
            fullWidth
            color="dark"
            variant="outlined"
            onClick={() => handleAddToCart(product)}
          >
            Add To Cart
          </Button>
        </Box>
      </Card>
    );
  }
  else {
    return (
      <Card height="100%">
        <CardMedia>
          <Link href={slugbaseurl+`${product.slug}`}>
            <a>
              <Image
                width={300}
                height={300}
                alt="category"
                objectFit="contain"
                layout="responsive"
                className="product-img"
                // src="https://pictures.abebooks.com/isbn/9781338615036-us.jpg"
                src={imgbaseurl+product.image}
              />
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
            id: product.id,
            name: product.name,
            mrp: product.salePrice,
            description: product.description,
            categoryName: "Category",
            imgGroup: [product.image, product.image],
          }}
        />

        <Box p={2} textAlign="center">

          <Paragraph style={{ "line-height": "1.5em", "height": "3em", "overflow": "hidden" }}>{product.name}</Paragraph>

          <H4 fontWeight={700} py={0.5}>

            {currency(product.salePrice, {
              separator: ",",
              symbol: 'Rs.'
            }).format()}
          </H4>

          {/* <FlexRowCenter gap={1} mb={2}>
          <Rating
            name="read-only"
            value={4}
            readOnly
            sx={{
              fontSize: 14,
            }}
          />
          <Small fontWeight={600} color="grey.500">
            ({product.reviews})
          </Small>
        </FlexRowCenter> */}

          <Button
            fullWidth
            color="dark"
            variant="outlined"
            onClick={() => handleAddToCart(product)}
          >
            Add To Cart
          </Button>
        </Box>
      </Card>
    );
  }


};

export default BundleCard20;
