import { Container } from "@mui/material";
import ShopLayout1 from "components/layouts/ShopLayout1";
import MobileNavigationBar from "components/mobile-navigation/MobileNavigationBar";
import SEO from "components/SEO";
import { H4, H6, Small,Paragraph } from "components/Typography";
import { Box, Button, Card, Grid, styled } from "@mui/material";
import LazyImage from "components/LazyImage";
import Setting from "components/Setting";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";


const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  boxShadow: "none",
  background:"white !important",
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
const AboutUs = (props) => {
  const imgbaseurl=process.env.NEXT_PUBLIC_BACKEND_API_BASE+'media/'
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_BASE;

  const  title  = 'about-us';
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
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
  };
  
  return (
    <ShopLayout1>
      <SEO 
        title="About Us" 
        description={"Learn about Meerab's Wardrobe - your trusted online marketplace for premium women's clothing in Europe. Discover elegant dresses, trendy fashion, and contemporary styles. Shop now and get quality fashion delivered across Europe."}
        metaTitle = "About Us"
      />
      <Container
      sx={{
        mb: "70px",
      }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Link href="/">
              <a>
                <LazyImage
                  width={385}
                  height={342}
                  alt="banner"
                  layout="responsive"
                  objectFit="contain"
                  src={imgbaseurl+"about_us.png"}
                />
              </a>
            </Link>
          </Grid>

          <Grid item xs={12} md={8}>
          {data &&
  data
    .filter((item) => item.status === 1)
    .map((item) => (
      <div key={item.id} dangerouslySetInnerHTML={{ __html: item.value }} />
    ))}
          </Grid>
        </Grid>
      </Container>
    </ShopLayout1>
  );
};


export default AboutUs;
