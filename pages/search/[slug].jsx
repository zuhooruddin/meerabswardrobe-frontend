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
import useMediaQuery from "@mui/material/useMediaQuery";
import SEO from "components/SEO";
import { FlexBox } from "components/flex-box";
import ShopLayout1 from "components/layouts/ShopLayout1";
import SearchCard1List from "components/products/SearchCard1List";
import SearchCard9List from "components/products/SearchCard9List";
import { H5,H3, Paragraph } from "components/Typography";
import { useCallback, useState } from "react";
import api from "utils/api/market-2";

const ProductSearchResult = (props) => {
  const {catSlug,ProductReviews} = props;
  const [view, setView] = useState("grid");
  const downMd = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const toggleView = useCallback((v) => () => setView(v), []);
  return (
    <ShopLayout1>
    
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
            <H5>Searching for “ {catSlug} ”</H5>
            {/* <Paragraph color="grey.600">{categoryDetail['title']?searchCategory.length:0} results found</Paragraph> */}
          </Box>

          <FlexBox
            alignItems="center"
            columnGap={4}
            flexWrap="wrap"
            my="0.5rem"
          >
            {/* <FlexBox alignItems="center" gap={1} flex="1 1 0">
              <Paragraph color="grey.600" whiteSpace="pre">
                Short by:
              </Paragraph>

              <TextField
                select
                fullWidth
                size="small"
                variant="outlined"
                placeholder="Short by"
                defaultValue={sortOptions[0].value}
                sx={{
                  flex: "1 1 0",
                  minWidth: "150px",
                }}
              >
                {sortOptions.map((item) => (
                  <MenuItem value={item.value} key={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </TextField>
            </FlexBox> */}

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

              {/* {downMd && (
                <Sidenav
                  handle={
                    <IconButton>
                      <FilterList fontSize="small" />
                    </IconButton>
                  }
                >
                  <ProductFilterCard />
                </Sidenav>
              )} */}
            </FlexBox>
          </FlexBox>
        </Card>

        <Grid container spacing={3}>
          {/* <Grid
            item
            md={3}
            sx={{
              display: {
                md: "block",
                xs: "none",
              },
            }}
          >
            <ProductFilterCard />
          </Grid> */}

          <Grid item md={12} xs={12}>
            {
            view === "grid" ? <SearchCard1List category={catSlug} ProductReviews={ProductReviews && ProductReviews?ProductReviews:[]} /> : <SearchCard9List category={catSlug} ProductReviews={ProductReviews && ProductReviews?ProductReviews:[]} />
         
            }
            
          </Grid>
        </Grid>
      </Container>
    </ShopLayout1>
  );
};



export async function getServerSideProps(context) {
  const catSlug = context.query['slug'];
  const ProductReviews=await api.getReviews()


  return {
    props: {
     
      catSlug,ProductReviews
    },
  };
}
export default ProductSearchResult;
