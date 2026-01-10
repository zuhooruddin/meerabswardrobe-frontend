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

  const title = "return-policy";
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
        title="Frequently Asked Questions - Chitral Hive"
        description="Find answers to common questions about Chitrali products, shipping, delivery, payment methods, and more. Get help with ordering dry fruits, honey, and authentic Chitrali products online in Pakistan."
        metaTitle="FAQ - Chitrali Products Questions & Answers | Chitral Hive"
        keywords="Chitrali products FAQ, dry fruits questions, Chitrali honey FAQ, online shopping Pakistan FAQ, Chitral Hive help, product delivery questions, payment methods Pakistan, Chitrali products information"
        canonical="https://chitralhive.com/faq"
      />
      <Container
        sx={{
          mb: "70px",
          mt: 4,
        }}
      >
        <Box component="header" sx={{ mb: 4, textAlign: "center" }}>
          <H2 component="h1" sx={{ mb: 2 }}>
            Frequently Asked Questions About Chitrali Products
          </H2>
          <Paragraph color="text.secondary">
            Find answers to common questions about our authentic Chitrali products, shipping, and services
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
