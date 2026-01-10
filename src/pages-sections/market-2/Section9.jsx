import { Box, Button, Container } from "@mui/material";
import Carousel from "components/carousel/Carousel";
import { carouselStyled } from "components/carousel/CarouselStyled";
import { FlexBetween, FlexBox } from "components/flex-box";
import ProductCard20 from "components/product-cards/ProductCard20";
import { H2, Paragraph } from "components/Typography";
import useWindowSize from "hooks/useWindowSize";
import shuffle from "lodash/shuffle";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from 'next-auth/react';

const Section9 = ({data}) => {
  const { data: session} = useSession()

  const width = useWindowSize();
  const [visibleSlides, setVisibleSlides] = useState(4);
  const [selected, setSelected] = useState("new");
  const [newArrivalProducts, setNewArrivalProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const server_ip = process.env.NEXT_PUBLIC_BACKEND_API_BASE;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(server_ip + "getFearuredProduct", {
          params: {
            type: selected,
          },
        });
        const fetchedProducts = response.data;
        const shuffledProducts = shuffle(fetchedProducts);
        setNewArrivalProducts(
          shuffledProducts.filter((product) => product.isNewArrival)
        );
        setFeaturedProducts(
          shuffledProducts.filter((product) => product.isFeatured)
        );
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [selected]);

  useEffect(() => {
    if (width < 426) setVisibleSlides(1);
    else if (width < 650) setVisibleSlides(2);
    else if (width < 1024) setVisibleSlides(3);
    else if (width < 1200) setVisibleSlides(4);
    else setVisibleSlides(5);
  }, [width]);

  const handleSelected = (item) => () => setSelected(item);

  const activeColor = (item) => (item === selected ? "error" : "dark");

  return (
    <Container sx={{ mb: 8 }}>
      <FlexBetween gap={2} flexWrap="wrap" mb={3}>
        <Box>
          <br />
          <br />
          <H2 fontSize={20}>Selected Products</H2>
          <Paragraph>All our new arrivals and featured products</Paragraph>
        </Box>
        <FlexBox
          flexWrap="wrap"
          gap={1}
          sx={{
            "& button": {
              flexGrow: 1,
            },
          }}
        >
          <Button
            variant="outlined"
            color={activeColor("new")}
            onClick={handleSelected("new")}
          >
            New Arrivals
          </Button>
          <Button
            variant="outlined"
            color={activeColor("featured")}
            onClick={handleSelected("featured")}
          >
            Featured
          </Button>
        </FlexBox>
      </FlexBetween>

      {selected === "new" && newArrivalProducts.length > 0 && (
        <Carousel
          totalSlides={newArrivalProducts.length}
          visibleSlides={visibleSlides}
          sx={carouselStyled}
        >
          {newArrivalProducts.map((product) => (
            <ProductCard20 product={product} key={product.id} data={data} wishList={session && session.wishlist &&  session.wishlist.length>0 ? session.wishlist : null}
            />
          ))}
        </Carousel>
      )}

      {selected === "featured" && featuredProducts.length > 0 && (
        <Carousel
          totalSlides={featuredProducts.length}
          visibleSlides={visibleSlides}
          sx={carouselStyled}
        >
          {featuredProducts.map((product) => (
            <ProductCard20 product={product} key={product.id} data={data} wishList={session && session.wishlist &&  session.wishlist.length>0 ? session.wishlist : null}
            />
          ))}
        </Carousel>
      )}

      {selected === "new" && newArrivalProducts.length === 0 && (
        <Box>No New Products</Box>
      )}

      {selected === "featured" && featuredProducts.length === 0 && (
        <Box>No Featured Products</Box>
      )}
    </Container>
  );
};

export default Section9;
