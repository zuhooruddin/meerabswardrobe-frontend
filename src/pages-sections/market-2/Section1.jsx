import { Box, Button, Container, Grid, Stack, styled } from "@mui/material";
import BannerCard3 from "components/banners/BannerCard3";
import CarouselCard4 from "components/carousel-cards/CarouselCard4";
import Carousel from "components/carousel/Carousel";
import NavLink3 from "components/nav-link/NavLink3";
import { H1, H4, Paragraph, Span } from "components/Typography";

import React, { useState, useEffect } from "react";
import Link from "next/link";

// ======================================================
const Section1 = (data) => {

  const imgbaseurl = process.env.NEXT_PUBLIC_BACKEND_API_BASE + "media/";
  const slugbaseurl = "category/";

  // Helper function to normalize slug (remove leading slashes and path prefixes)
  const normalizeSlug = (slug) => {
    if (!slug) return '';
    // Remove leading slashes
    let normalized = slug.replace(/^\/+/, '');
    // Remove 'categories/' or 'category/' prefix if present
    normalized = normalized.replace(/^(categories|category)\//, '');
    return normalized;
  };

  // custom css
  const bannerHeight = "245.5px"; 
  const bannerWidth = "100%"; 
  const defaultDummyImages = [
    { image: "/assets/images/banners/s1.png" },
    { image: "/assets/images/banners/s2.png" },
    { image: "/assets/images/banners/s3.png" },
    { image: "/assets/images/banners/banner-4.png" },
    { image: "/assets/images/banners/banner-5.png" },
  ];  
  const carouselStyles = {
    overflow: "hidden",
    borderRadius: "3px",
    "& .carousel__dot-group": {
      mt: 0,
      left: 0,
      right: 0,
      bottom: 10,
      position: "absolute",
      "& div": {
        borderColor: "dark.main",
        "::after": {
          backgroundColor: "dark.main",
        },
      },
    },
  }; // CAROUSEL TEXT CONTENTS

  const carouselContent1 = (
    <>
      <Box
        pl={{
          md: 10,
        }}
      >
        {/* <Button variant="contained" size="large" color="dark">
          Shop Now
        </Button> */}
      </Box>
    </>
  );
  const carouselContent2 = (
    <>
      <Box
        pl={{
          md: 10,
        }}
      >
        {/* <Button variant="contained" size="large" color="dark">
          Shop Now
        </Button> */}
      </Box>
    </>
  );
  const carouselContent3 = (
    <>
      <Box
        pl={{
          md: 10,
        }}
      >
        {/* <Button variant="contained" size="large" color="dark">
          Shop Now
        </Button> */}
      </Box>
    </>
  );
  const Footwrapper = styled(Box)(() => ({
    "@media only screen and (max-width: 600px)": {
      ".logo": {
        width: "100%",
        height: "100%",
      },
    },
  }));

  return (
    <Footwrapper>
      <Box pt={3}>
        <Container>
          {/* {individualboxsequence.map((item) => (
                <h4>{item.category_slug}</h4>
           ))}
   */}

          {/* {data.map((product) => (
   <h2>{product.Section1SequenceData.name}</h2>
   ))} */}






          <Grid container spacing={2}>
            <Grid item md={9} xs={12}>
              <Carousel
                spacing="0px"
                totalSlides={5}
                infinite={true}
                showDots={true}
                autoPlay={true}
                visibleSlides={1}
                showArrow={true}
                sx={carouselStyles}
              >
                {/* {data.slidersListLocal.map((slider) => (
                  <CarouselCard4
                  key={data.data1.id}

                    content={carouselContent1}
                    mode="light"
                    bgImage={imgbaseurl+slider.image}
                  />
                ))} */}


{data.slidersListLocal.length > 0 ? (
  data.slidersListLocal.map((slider, index) => (
    <CarouselCard4
      key={slider.id || slider.slug || `slider-${index}`}
      content={carouselContent1}
      mode="light"
      bgImage={imgbaseurl + slider.image}
      priority={index === 0} // Mark first slider as priority for LCP
      fetchPriority={index === 0 ? "high" : "auto"}
    />
  ))
) : (
  defaultDummyImages.map((dummyImage, index) => (
    <CarouselCard4
      key={`dummy-slider-${index}`}
      content={carouselContent1}
      mode="light"
      bgImage={dummyImage.image}
      priority={index === 0}
      fetchPriority={index === 0 ? "high" : "auto"}
    />
  ))
)}

                {/* <CarouselCard4
                content={carouselContent1}
                mode="light"
                bgImage="/assets/images/banners/Web-Banner-TCS.png"
                
              />
              <CarouselCard4
                content={carouselContent2}
                mode="light"
                bgImage="/assets/images/banners/Web-Banner-BSS.png"
              />
               <CarouselCard4
                content={carouselContent3}
                mode="light"
                bgImage="/assets/images/banners/last.png"
              /> */}
              </Carousel>
            </Grid>

            <Grid item md={3} xs={12}>
              <Stack
                height="100%"
                width="100%"
                direction={{
                  md: "column",
                  sm: "row",
                  xs: "row",
                }}
                spacing={1}
              >
                {/* <BannerCard3 flex={1} img={imgbaseurl+data.data1.image}> */}
                <Link href={data.data1 && data.data1.category_slug ? slugbaseurl + normalizeSlug(data.data1.category_slug) : ''}>

                  <a>
                    <BannerCard3
                      className="logo"
                      flex={1}
                      img={data.data1 && data.data1.image ? imgbaseurl + data.data1.image : '/assets/images/banners/default3.png'}
                      sx={{
                        height: bannerHeight, // set the fixed height for the banner
                        width: bannerWidth, // set the fixed width for the banner
                        position: "relative",
                        overflow: "hidden",
                        "&:hover img": {
                          filter: "brightness(50%)",
                          transition: "filter 0.5s ease-in-out",
                        },
                        "&:hover h4": {
                          color: "#fff",
                          transition: "color 0.5s ease-in-out",
                        },
                      }}
                    >
                      <H4 fontSize={20} lineHeight={1.2} mb={2} color="#fff">
                        <br />
                        {data.data1 && data.data1.category_name ? data.data1.category_name : 'Category1'}
                      </H4>
                      <NavLink3
                        href={data.data1 && data.data1.category_slug ? slugbaseurl + normalizeSlug(data.data1.category_slug) : ''}

                        text="Shop Now"
                        color="#fff"
                      />
                    </BannerCard3>
                  </a>
                </Link>

                {/* <BannerCard3 flex={1} img={imgbaseurl+data.data2.image}> */}
                <Link href={slugbaseurl + normalizeSlug(data.data2.category_slug)}>
                  <a>
                    <BannerCard3
                      className="logo"
                      flex={1}
                      img={data.data2.image && data.data2.image?imgbaseurl + data.data2.image:'/assets/images/banners/default3.png'}
                      sx={{
                        height: bannerHeight, // set the fixed height for the banner
                        width: bannerWidth, // set the fixed width for the banner
                        position: "relative",
                        overflow: "hidden",
                        "&:hover img": {
                          filter: "brightness(50%)",
                          transition: "filter 0.5s ease-in-out",
                        },
                        "&:hover h4": {
                          color: "#fff",
                          transition: "color 0.5s ease-in-out",
                        },
                      }}
                    >
                      <H4 fontSize={20} lineHeight={1.2} mb={2} color="#fff">
                        <br />
                        {data.data2.category_name&&data.data2.category_name?data.data2.category_name:'Category2'}
                      </H4>
                      <NavLink3
                        href={slugbaseurl + normalizeSlug(data.data2.category_slug)}
                        text="Shop Now"
                        color="#fff"
                      />
                    </BannerCard3>
                  </a>
                </Link>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Footwrapper>
  );
};

export default Section1;
