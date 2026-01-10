import { Apps, FilterList, ViewList } from "@mui/icons-material";
import {
  Box,
  Card,
  Container,
  Grid,
  IconButton,
  MenuItem,
  TextField,
} from "@mui/material";
import SEO from "components/SEO";
import useMediaQuery from "@mui/material/useMediaQuery";
import { FlexBox } from "components/flex-box";
import ShopLayout1 from "components/layouts/ShopLayout1";
import BundleCard1List from "components/products/BundleCard1List";
import BundleCard9List from "components/products/BundleCard9List";
import { H5, H3, Paragraph } from "components/Typography";
import { useCallback, useState } from "react";
import api from "utils/api/market-2";

const BundleSearchResult = (props) => {
  const { searchCategory, bundleDetail } = props;
  const [view, setView] = useState("grid");
  const downMd = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const toggleView = useCallback((v) => () => setView(v), []);
  return (
    <ShopLayout1>
      <SEO
        title={bundleDetail["title"]}
        description={
          bundleDetail["metaDescription"] &&
          bundleDetail["metaDescription"] != "undefined"
            ? bundleDetail["metaDescription"]
            : "Home Delivery Service for your favorite brand bundles of " +
              bundleDetail["title"] +
              ". Order products from Meerab's Wardrobe and get at your doorstep across Pakistan."
        }
        metaTitle={
          bundleDetail["metaTitle"] && bundleDetail["metaTitle"] != "undefined"
            ? bundleDetail["metaTitle"]
            : "Buy " + bundleDetail["title"] + " Bundles"
        }
      />
      <Container
        sx={{
          mt: 4,
          mb: 6,
        }}
      >
        <Card
          elevation={1}
          sx={{
            mb: "55px",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            p: {
              sm: "1rem 1.25rem",
              md: "0.5rem 1.25rem",
              xs: "1.25rem 1.25rem 0.25rem",
            },
          }}
        >
          <Box>
            <H5>Searching for “ {bundleDetail["title"]} ”</H5>
            {/* <Paragraph color="grey.600">{categoryDetail['title']?searchCategory.length:0} results found</Paragraph> */}
          </Box>

          <FlexBox
            alignItems="center"
            columnGap={4}
            flexWrap="wrap"
            my="0.5rem"
          >
            <FlexBox alignItems="center" my="0.25rem">
              <Paragraph color="grey.600" mr={1}>
                View:
              </Paragraph>

              <IconButton onClick={toggleView("grid")}>
                <Apps
                  color={view === "grid" ? "primary" : "inherit"}
                  fontSize="small"
                />
              </IconButton>

              <IconButton onClick={toggleView("list")}>
                <ViewList
                  color={view === "list" ? "primary" : "inherit"}
                  fontSize="small"
                />
              </IconButton>
            </FlexBox>
          </FlexBox>
        </Card>

        <Grid container spacing={3}>
          <Grid item md={12} xs={12}>
            {bundleDetail["title"] ? (
              view === "grid" ? (
                <BundleCard1List category={bundleDetail} />
              ) : (
                <BundleCard9List category={bundleDetail} />
              )
            ) : (
              <Box>
                <H3 color="red">No Result Found</H3>
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </ShopLayout1>
  );
};

export async function getServerSideProps(context) {
  const catSlug = context.query["slug"];
  const bundleDetail = await api
    .getbundleDetail(catSlug)
    .then((response) => {
      return response.data.result;
    })
    .catch((error) => {});

  return {
    props: {
      bundleDetail,
    },
  };
}
export default BundleSearchResult;
