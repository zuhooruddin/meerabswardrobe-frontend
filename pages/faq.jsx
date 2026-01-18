import { Container } from "@mui/material";
import ShopLayout1 from "components/layouts/ShopLayout1";
import MobileNavigationBar from "components/mobile-navigation/MobileNavigationBar";
import SEO from "components/SEO";
import { H4, H2, Small, Paragraph } from "components/Typography";
import { Box, Button, Card, Grid, styled } from "@mui/material";
import LazyImage from "components/LazyImage";
import Setting from "components/Setting";
import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from "react";
const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  boxShadow: "none",
  background: "white !important",
  alignItems: "center",
  padding: "20px 50px",
  justifyContent: "center",
  background: theme.palette.paste[50],
  [theme.breakpoints.down("sm")]: {
    padding: "20px 30px",
    "& h3": {
      fontSize: 20,
    },
  },
})); // ======================================================

// ======================================================
const FAQPage = (props) => {
  const imgbaseurl = process.env.NEXT_PUBLIC_BACKEND_API_BASE + "media/";
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_BASE;

  const title = "faq";
  const [data, setData] = useState(null);
  useEffect(() => {
    if (title) {
      fetchData();
    }
  }, [title]);

  const fetchData = () => {
    const url = `${apiUrl}get_dynamictext?key=${encodeURIComponent(title)}`;

    axios
      .get(url)
      .then((response) => {
        setData(response.data);
        console.log("Respomse", response.data);
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
  };

  return (
    <ShopLayout1>
      <SEO 
        title="Frequently Asked Questions - Meerab's Wardrobe"
        description="Find answers to common questions about women's clothing, shipping, delivery, payment methods, and more. Get help with ordering premium fashion and women's clothing online in Europe."
        metaTitle="FAQ - Women's Clothing Questions & Answers | Meerab's Wardrobe"
        keywords="women's clothing FAQ, fashion questions, clothing FAQ, online shopping Europe FAQ, Meerab's Wardrobe help, product delivery questions, payment methods Europe, women's fashion information"
        canonical={`${process.env.NEXT_PUBLIC_URL || "https://meerabs.com"}/faq`}
      />
      <Container
        sx={{
          mb: "70px",
          mt: 4,
        }}
      >
        <Box component="header" sx={{ mb: 4, textAlign: "center" }}>
          <H2 component="h1" sx={{ mb: 2 }}>
            Frequently Asked Questions About Women's Clothing
          </H2>
          <Paragraph color="text.secondary">
            Find answers to common questions about our premium women's clothing, shipping, and services
          </Paragraph>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            {data && data
              .filter((item) => item.status === 1)
              .map((item) => (
                <Box
                  key={item.id}
                  component="article"
                  sx={{ mb: 3 }}
                  dangerouslySetInnerHTML={{ __html: item.value }}
                />
              ))}
          </Grid>
        </Grid>
      </Container>
    </ShopLayout1>
  );
};

export default FAQPage;
