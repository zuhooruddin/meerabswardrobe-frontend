import { Box, Container, styled, Tab, Tabs } from "@mui/material";
import ShopLayout1 from "components/layouts/ShopLayout1";
import BundleIntro from "components/products/BundleIntro";
import { H2,H3 } from "components/Typography";
import SEO from "components/SEO";
import { Button } from "@mui/material";
import BazaarImage from "components/BazaarImage";
import { FlexBox, FlexRowCenter } from "components/flex-box";
import { useEffect, useState } from "react";
import {
  getFrequentlyBought,
  getRelatedProducts,
} from "utils/api/related-products";
import api from "utils/api/market-2";
import { useRouter } from "next/router";
import Link from "next/link";
const StyledTabs = styled(Tabs)(({ theme }) => ({
  minHeight: 0,
  marginTop: 80,
  marginBottom: 24,
  borderBottom: `1px solid ${theme.palette.text.disabled}`,
  "& .inner-tab": {
    minHeight: 40,
    fontWeight: 600,
    textTransform: "capitalize",
  },
})); // ===============================================================

// ===============================================================
const BundleDetails = (props) => {
  const {bundle,bundleitems,category,bundleType} = props;

  const router = useRouter();

  const handleGoBack = () => router.back();

  const [product, setProduct] = useState(bundleitems);
  const [selectedOption, setSelectedOption] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [frequentlyBought, setFrequentlyBought] = useState([]);

  useEffect(() => {
    getRelatedProducts().then((data) => setRelatedProducts(data));
    getFrequentlyBought().then((data) => setFrequentlyBought(data));
  }, []);

  const handleOptionClick = (_, value) => setSelectedOption(value);

  if(!bundle || !bundleitems || !product || !product.length ){
    return (
      <ShopLayout1>
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
      <p>Bundle Not Found</p>

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
      {/* <ErrorContainer>
        <h1>404 - Product not found</h1>
        <p>Please enter product name in search bar above</p>
        <a href="/">Home</a>
      </ErrorContainer> */}
      </ShopLayout1>
    );
  }

  return (
    <ShopLayout1>
      {bundleType=="BRAND"?
      <SEO title={bundle['name'] +" | "+ category  } 
           description={bundle['metaDescription'] && bundle['metaDescription']!="undefined"?bundle['metaDescription']:"Looking for "+ bundle['name'] + " Bundle/Pack/Package for "+category+"? Order online from Our Store."}
           metaTitle = {bundle['metaTitle'] && bundle['metaTitle']!="undefined"?bundle['metaTitle']:"Buy " + bundle['name'] + " Bundle/Package/Pack for "+category}
      />
      :
      <SEO title={bundle['name']} 
           description={bundle['metaDescription'] && bundle['metaDescription']!="undefined"?bundle['metaDescription']:"Looking for "+ bundle['name'] + " Bundle/Package? Order online from Our Stor "}
           metaTitle = {bundle['metaTitle'] && bundle['metaTitle']!="undefined"?bundle['metaTitle']:"Buy " + bundle['name'] + " Bundle/Package"}
      />
      }
      <Container
        sx={{
          my: 4,
        }}
      >
        {product ? <BundleIntro product={product} bundle={bundle} /> : <H2>Loading...</H2>}
      </Container>
    </ShopLayout1>
  );
}; 

export async function getServerSideProps(context) {
  const slug = context.query['slug'];
  const bundleDetails = await api.getbundleitemDetail(slug).then((response) => {
    return response.data
  }).catch((error) => {
  });
  return {
    props: { bundle:bundleDetails["bundle"],bundleitems:bundleDetails["bundleItems"],category:bundleDetails["category"],bundleType:bundleDetails["bundleType"] },
  };
}

export default BundleDetails;
