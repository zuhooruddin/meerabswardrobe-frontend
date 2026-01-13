import { Card, Container, Grid, List, ListItem, styled } from "@mui/material";
import Carousel from "components/carousel/Carousel";
import { carouselStyled } from "components/carousel/CarouselStyled";
import NavLink3 from "components/nav-link/NavLink3";
import ProductCard20 from "components/product-cards/ProductCard20";
import { H3 } from "components/Typography";
import useWindowSize from "hooks/useWindowSize";
import { useEffect, useState } from "react";
import Link from 'next/link';
const StyledListItem = styled(ListItem)(({ theme }) => ({
  fontSize: 13,
  fontWeight: 500,
  cursor: "pointer",
  padding: "10px 0 0 0",
  transition: "all 0.3s",
  ":hover": {
    color: theme.palette.primary.main,
  },
})); // ======================================================================

// ======================================================================
const Section12 = ({ products,data,Section2Name,slug,productreviews}) => {
  const dummyCategories = [
    { category_name: "Sub-Category 1", category_slug: "category-1" },
    { category_name: "Sub-Category 2", category_slug: "category-2" },
    // Add more dummy categories as needed
  ];
  // const imgbaseurl='https://idrisbookbank-dev-server.inara.tech/media/'
  const slugbaseurl='category/'
  const width = useWindowSize();

  // Helper function to normalize slug (remove leading slashes and path prefixes)
  const normalizeSlug = (slug) => {
    if (!slug) return '';
    // Remove leading slashes
    let normalized = slug.replace(/^\/+/, '');
    // Remove 'categories/' or 'category/' prefix if present
    normalized = normalized.replace(/^(categories|category)\//, '');
    return normalized;
  };
  const [visibleSlides, setVisibleSlides] = useState(4);
  useEffect(() => {
    if (width < 426) setVisibleSlides(1);
    else if (width < 650) setVisibleSlides(2);
    else if (width < 1200) setVisibleSlides(3);
    else setVisibleSlides(4);
  }, [width]);
  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item md={3} xs={12}>
          <Card
            elevation={0}
            sx={{
              px: 4,
              height: "100%",
              py: 2,
              borderRadius: "3px",
              border: 0,
            }}
          >
            <H3>{Section2Name&&Section2Name?Section2Name:"Category Name"}</H3>

            <List
              sx={{
                mb: 2,
              }}

            >
               {data.length>0?data.map((data) => (
                         <StyledListItem key={data.category_slug}><Link href={slugbaseurl+normalizeSlug(data.category_slug)
                         }><a>{data.category_name
                         }</a></Link></StyledListItem>

            )):(
              // Render dummy categories when data is empty
              dummyCategories.map((data) => (
                <StyledListItem key={data.category_slug}>
                  <Link href={slugbaseurl + normalizeSlug(data.category_slug)}>
                    <a>{data.category_name}</a>
                  </Link>
                </StyledListItem>
              )))}
            
          
            </List>

            <NavLink3
              href={slugbaseurl+normalizeSlug(slug)}
              text="Browse All"
              color="dark.main"
              hoverColor="dark.main"
              style={{cursor: 'pointer'}}
            />
          </Card>
        </Grid>

        <Grid item md={9} xs={12}>
          <Carousel
            totalSlides={products.length}
            visibleSlides={visibleSlides}
            sx={carouselStyled}
          >
            {products.length>0?products.map((product) => (
              <ProductCard20 product={product} key={product.id} data={productreviews} />
            )):"No Products Added"}
          </Carousel>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Section12;
