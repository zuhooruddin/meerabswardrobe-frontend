import ShopLayout1 from "components/layouts/ShopLayout1";
import SEO from "components/SEO";
import {styled } from "@mui/material";
import { Box, Grid} from "@mui/material";
import BazaarCard from "components/BazaarCard";
import { H3 } from "components/Typography";
import { FlexBox } from "components/flex-box";
import LazyImage from "components/LazyImage";
import Link from "next/link";
import api from "utils/api/fashion-shop-2"; 

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
const ProductBundles = (data) => {
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_BASE;
  const imgbaseurl=process.env.NEXT_PUBLIC_BACKEND_API_BASE;
  const slugbaseurl='bundle/'

  return data && data.productbundles ?  (
    <ShopLayout1>
      <SEO 
        title="Schools" 
        description={"Shop premium women's clothing online in Europe at Meerab's Wardrobe. Discover elegant dresses, trendy fashion, and contemporary styles. Order now and get it delivered to your doorstep across Europe."}
        metaTitle="products"
      />
  
      <div style={{ margin: "50px 10px 20px 20px" }}>
        <h1 style={{ textAlign: "left" }}>Product Bundles</h1>
  
        {data && data.productbundles ? (
          <Grid container spacing={2}>
            {data.productbundles.map((item, ind) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={ind}>
                <StyledBazaarCard>
                  <ImageWrapper>
                    <HoverIconWrapper className="hover-box"></HoverIconWrapper>
                    <Link href={slugbaseurl+item.slug}>
                      <a>
                        <LazyImage
                          src={imgbaseurl+item.image}
                          width={300}
                          height={300}
                          objectFit="contain"
                          layout="fixed"
                          alt={item.name}
                        />
                      </a>
                    </Link>
                  </ImageWrapper>
                  <ContentWrapper>
                    <FlexBox>
                      <Box flex="1 1 0" minWidth="0px" mr={1}>
                        <Link href={slugbaseurl+item.slug}>
                          <a>
                            <H3
                              mb={1}
                              title={item.name}
                              fontSize="14px"
                              fontWeight="600"
                              className="title"
                              color="text.secondary"
                              style={{ textAlign: "center" }}
                            >
                              {item.name}
                            </H3>
                          </a>
                        </Link>
                      </Box>
                    </FlexBox>
                  </ContentWrapper>
                </StyledBazaarCard>
              </Grid>
            ))}
          </Grid>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </ShopLayout1>
  ):(
    <div>Loading............</div>
  );
  
  
};
export async function getServerSideProps(context) {

    const productbundles=await api.getProductBundles();

      return {
      props: {
    productbundles
        
  
      }
    };
  }

export default ProductBundles;
