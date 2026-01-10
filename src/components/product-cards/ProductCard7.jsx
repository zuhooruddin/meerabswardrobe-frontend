/* eslint-disable react-hooks/exhaustive-deps */
import { Add, Close, Remove } from "@mui/icons-material";
import { Button, Card, IconButton, styled } from "@mui/material";
import Image from "components/BazaarImage";
import { FlexBox } from "components/flex-box";
import { Span, H3 } from "components/Typography";
import { useAppContext } from "contexts/AppContext";
import Link from "next/link";
import React, { useCallback,useState,useEffect } from "react"; // styled components
import { server_ip } from "utils/backend_server_ip.jsx";

const Wrapper = styled(Card)(({ theme }) => ({
  display: "flex",
  overflow: "hidden",
  alignItems: "center",
  position: "relative",
  borderRadius: "10px",
  marginBottom: "1.5rem",
  boxShadow: theme.shadows[2],
  backgroundColor: theme.palette.background.paper,
  "@media only screen and (max-width: 425px)": {
    flexWrap: "wrap",
    img: {
      height: "auto",
      minWidth: "100%",
    },
  },
})); // =========================================================

// =========================================================
const ProductCard7 = ({
  id,
  name,
  qty,
  mrp,
  image,
  slug,
  sku,
  salePrice,
  discount,
  description,
}) => {
  const imgbaseurl = process.env.NEXT_PUBLIC_BACKEND_API_BASE;

  const { dispatch } = useAppContext(); 

const[currency,setCurrency]=useState('')

useEffect(()=>{
  if (typeof window !== 'undefined' && window.localStorage) {
    const storedCurrency = localStorage.getItem('currency');

    setCurrency(storedCurrency);
  }
},[])



  const handleCartAmountChange = useCallback(
    (amount) => () => {
      dispatch({
        type: "CHANGE_CART_AMOUNT",
        payload: {
          id,
          name,
          mrp,
          salePrice,
          price: salePrice,
          sku,
          slug,
          // price,
          image,
          qty: amount,
        },
      });
    },
    []
  );
  return (
    <Wrapper>
      <Image
        alt={name}
        width={140}
        height={140}
        display="block"
        src={`${image}` || "/assets/images/products/iphone-xi.png"}
      />

      <IconButton
        size="small"
        onClick={handleCartAmountChange(0)}
        sx={{
          position: "absolute",
          right: 15,
          top: 15,
        }}
      >
        <Close fontSize="small" />
      </IconButton>

      <FlexBox p={2} rowGap={2} width="100%" flexDirection="column">
        <Link href={`/product/${id}`}>
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

        <FlexBox gap={1} flexWrap="wrap" alignItems="center">
          <Span color="grey.600">
            {currency}. {salePrice.toFixed(2)} x {qty}
          </Span>

          <Span fontWeight={600} color="primary.main">
           {currency}. {(salePrice * qty).toFixed(2)}
          </Span>
        </FlexBox>

        <FlexBox alignItems="center">
          <Button
            color="primary"
            sx={{
              p: "5px",
            }}
            variant="outlined"
            disabled={qty === 1}
            onClick={handleCartAmountChange(qty - 1)}
          >
            <Remove fontSize="small" />
          </Button>

          <Span mx={1} fontWeight={600} fontSize={15}>
            {qty}
          </Span>
          <Button
            color="primary"
            sx={{
              p: "5px",
            }}
            variant="outlined"
            onClick={handleCartAmountChange(qty + 1)}
          >
            <Add fontSize="small" />
          </Button>
        </FlexBox>
      </FlexBox>
    </Wrapper>
  );
};

export default ProductCard7;
