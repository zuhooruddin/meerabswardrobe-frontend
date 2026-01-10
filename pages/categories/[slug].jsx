import { Container } from "@mui/material";
import ShopLayout1 from "components/layouts/ShopLayout1";
import MobileNavigationBar from "components/mobile-navigation/MobileNavigationBar";
import SEO from "components/SEO";
import {  Grid, styled } from "@mui/material";
import axios from "axios";
import { Box} from "@mui/material";
import { useState } from "react";
import useSWR from "swr";
import {  Paragraph, Small } from "components/Typography";
import BazaarCard from "components/BazaarCard";
import { H3 } from "components/Typography";

import { FlexBox } from "components/flex-box";
import LazyImage from "components/LazyImage";
import NavLink from "components/nav-link/NavLink";
import Link from "next/link";
import MegaMenu1 from "components/categories/mega-menu/MegaMenu1";
import StyledMegaMenu from "components/categories/mega-menu/StyledMegaMenu";
import { useRouter } from "next/router";
import Image from "next/image";
import { Button } from "@mui/material";
import BazaarImage from "components/BazaarImage";
import { FlexRowCenter } from "components/flex-box";
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
  [theme.breakpoints.down("sm")]: {
    display: "block",
  },
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
}));
const Allcategories = () => {
  const router = useRouter();
  const {slug} = router.query;
  // console.log("slug is :",slug)

  const handleGoBack = () => router.back();

  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_BASE;
  const imgbaseurl=process.env.NEXT_PUBLIC_BACKEND_API_BASE+'media/'
  const slugbaseurl='/category/'

  const fetcher = (url) => axios.get(url).then((response) => response.data);
  const { data, error } = useSWR(`${apiUrl}showAllNavCategories${slug ? `?slug=${slug}` : ''}`, fetcher);
  var metaDescription = '';
  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;
  function getFullDesc(item) {
    return [item.title].join(", ");
  }
  if(data?.[0]?.menuData?.categories){metaDescription = data[0]['menuData']['categories'].map(getFullDesc);}

  
  return  data && data.length > 0 ? (
    <ShopLayout1>
      <SEO 
        title={data[0]['title']} 
        description={"Buy amazing products from "+data[0]['title']+" not limited to "+metaDescription.toString()}
        metaTitle = {"Shop now  from a wide range of products under the umbrella of "+data[0]['title']+" with Meerab's Wardrobe"}
      />

<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "22px",  margin: '40px 40px 30px 30px', justifyContent: "center" }}>
   {data?.[0]?.menuData?.categories?.map((item, ind) => (

      <StyledBazaarCard key={ind}>
        <ImageWrapper >
          <HoverIconWrapper className="hover-box"></HoverIconWrapper>
          <Link href={item.href}>
            <a>
              <LazyImage
                src={imgbaseurl+item.icon}
                width={300}
                height={300}
                objectFit="contain"
                layout="fixed"
                alt={name}
              />
            </a>
          </Link>
        </ImageWrapper>
        <ContentWrapper>
          <FlexBox>
            <Box flex="1 1 0" minWidth="0px" mr={1}>
              <Link href={item.href}>
                <a>
                  <H3
                    mb={1}
                    title={item.title}
                    fontSize="14px"
                    fontWeight="600"
                    className="title"
                    color="text.secondary"
                    style={{ textAlign: "center" }}
                  >
                    {item.title}
                  </H3>
                </a>
              </Link>
            </Box>
          </FlexBox>
        </ContentWrapper>
      </StyledBazaarCard>
    ))}
</div>


    </ShopLayout1>
  ):  (
    <ShopLayout1>
         <SEO title="Nothing found" />
    <FlexRowCenter px={2} minHeight="50vh" flexDirection="column">
    <BazaarImage
      src="/assets/images/illustrations/404.svg"
      sx={{
        display: "block",
        maxWidth: 320,
        width: "100%",
        mb: 3,
      }}
    />
    <p>Category Not Found</p>

    <FlexBox flexWrap="wrap">
      <Button
        variant="outlined"
        color="primary"
        sx={{
          m: 1,
        }}
        onClick={handleGoBack}
      >
        Go Back
      </Button>

      <Link href="/" passHref>
        <Button
          variant="contained"
          color="primary"
          sx={{
            m: 1,
          }}
        >
          Go to Home
        </Button>
      </Link>
    </FlexBox>
  </FlexRowCenter>
  </ShopLayout1>
  )
  ;
};

export default Allcategories;
