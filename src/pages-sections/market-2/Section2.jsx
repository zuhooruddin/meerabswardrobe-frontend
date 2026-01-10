import { Box, Container, Card, Grid, keyframes, styled } from "@mui/material";
import CategoryCard1 from "components/category-cards/CategoryCard1";
import { FlexBox } from "components/flex-box";
import { H3, Paragraph, Span } from "components/Typography";
import { FlexBetween } from "components/flex-box";
import { H2 } from "components/Typography";
import Link from 'next/link';
import { carouselStyled } from "components/carousel/CarouselStyled";
import Carousel from "components/carousel/Carousel";
import { useEffect, useState } from "react"; // ======================================================================

import useWindowSize from "hooks/useWindowSize";

import shuffle from "lodash/shuffle";



const slideX = keyframes`
    from { left: 120% }
    to { left: -100% }
`; // custom styled components



const Section2 = (data) => {
  const imgbaseurl=process.env.NEXT_PUBLIC_BACKEND_API_BASE
  const slugbaseurl='brand/'
  const width = useWindowSize();
  const [visibleSlides, setVisibleSlides] = useState(4);
  const [selected, setSelected] = useState("new");
  const [filteredProducts, setFilteredProducts] = useState([]);
  useEffect(() => setFilteredProducts(shuffle(data)), [selected, data]);
  useEffect(() => {
    if (width < 426) setVisibleSlides(1);
    else if (width < 650) setVisibleSlides(2);
    else if (width < 1024) setVisibleSlides(3);
    else if (width < 1200) setVisibleSlides(4);
    else setVisibleSlides(5);
  }, [width]);

  // Don't render if no data
  if (!data?.data || !Array.isArray(data.data) || data.data.length === 0) {
    return null;
  }

  return (
    <Container sx={{ mt: 8 }}>
      <FlexBetween mb={3}>
        <H2 style={{ color: '#B72C42', fontSize: 20 }}>Brand Bundles</H2>
        <Link href="/brands">
          <a 
            style={{ 
              color: '#B72C42', 
              fontSize: 16, 
              fontWeight: 600,
              textDecoration: 'underline',
              padding: '8px 12px',
              display: 'inline-block',
              minHeight: '44px',
              minWidth: '44px',
              lineHeight: '28px'
            }}
            aria-label="View all brand bundles"
          >
            View All
          </a>
        </Link>
      </FlexBetween>
        <Carousel
        totalSlides={data.data.length}
        visibleSlides={visibleSlides}
        sx={carouselStyled}
      >
          {data.data.map((item) => (
            <Grid item lg={2} md={3} sm={4} xs={6} key={item.id}>
              <CategoryCard1 image={imgbaseurl+item.icon} title={item.name} url={slugbaseurl+item.slug} />
            </Grid>
          ))}
          </Carousel>
    </Container>
  );
};

export default Section2;
