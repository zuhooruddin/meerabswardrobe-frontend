import { Container } from "@mui/material";
import ShopLayout1 from "components/layouts/ShopLayout1";
import MobileNavigationBar from "components/mobile-navigation/MobileNavigationBar";
import SEO from "components/SEO";
import StructuredData from "components/schema/StructuredData";
import { H2, H3, H5, Small, Paragraph } from "components/Typography";
import { Box, Button, Card, Grid, styled } from "@mui/material";
import LazyImage from "components/LazyImage";
import Setting from "components/Setting";
import Link from "next/link";
import { CreditCard, Email, Phone, Place } from "@mui/icons-material";
import { FlexBox } from "components/flex-box";
import axios from "axios";
import { useEffect, useState } from "react";

const HeroSection = styled(Box)(({ theme }) => ({
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  padding: "60px 0",
  marginBottom: "40px",
  textAlign: "center",
}));

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
}));

const LocationCard = styled(Card)(({ theme }) => ({
  padding: "30px",
  height: "100%",
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  borderRadius: "12px",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  width: "50px",
  height: "50px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
  marginBottom: "15px",
}));

const ContactItem = styled(Box)({
  marginBottom: "12px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
});

const ContactUs = (props) => {
  const imgbaseurl = process.env.NEXT_PUBLIC_BACKEND_API_BASE + "media/";
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_BASE;

  const title = "contact-us";
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
        console.log("Response", response.data);
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
  };

  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://chitralhive.com";
  
  // LocalBusiness structured data for contact page
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${baseUrl}/contact-us#localbusiness`,
    "name": "Chitral Hive",
    "image": `${baseUrl}/images/og-image.jpg`,
    "description": "Chitral Hive - Authentic Chitrali Products Online Store. Shop traditional crafts, local specialties, handmade items, and unique products from Chitral.",
    "url": baseUrl,
    "telephone": "+92-323-9119309",
    "email": "zuhooruddin055@gmail.com",
    "address": [
      {
        "@type": "PostalAddress",
        "streetAddress": "Chitral",
        "addressLocality": "Chitral",
        "addressRegion": "Khyber Pakhtunkhwa",
        "postalCode": "17200",
        "addressCountry": "PK"
      },
      {
        "@type": "PostalAddress",
        "streetAddress": "Upper Chitral",
        "addressLocality": "Upper Chitral",
        "addressRegion": "Khyber Pakhtunkhwa",
        "postalCode": "17200",
        "addressCountry": "PK"
      },
      {
        "@type": "PostalAddress",
        "streetAddress": "Islamabad",
        "addressLocality": "Islamabad",
        "addressRegion": "Federal Capital",
        "postalCode": "44000",
        "addressCountry": "PK"
      }
    ],
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "35.8514",
      "longitude": "71.7864"
    },
    "priceRange": "$$",
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "09:00",
      "closes": "18:00"
    },
    "sameAs": [
      "https://www.facebook.com/chitralhive",
      "https://www.instagram.com/chitralhive",
      "https://twitter.com/chitralhive"
    ],
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+92-323-9119309",
        "contactType": "Customer Service",
        "areaServed": "PK",
        "availableLanguage": ["en", "ur"]
      },
      {
        "@type": "ContactPoint",
        "telephone": "+92-340-7964648",
        "contactType": "Customer Service",
        "areaServed": "PK",
        "availableLanguage": ["en", "ur"]
      }
    ]
  };

  return (
    <ShopLayout1>
      <StructuredData data={localBusinessSchema} />
      <SEO
        title="Contact Us - Get in Touch"
        description="Get in touch with Chitral Hive for authentic Chitrali products. We are here to help with your orders and inquiries. Contact us via phone, email, or visit our stores in Chitral, Upper Chitral, and Islamabad."
        metaTitle="Contact Us"
        canonical={`${baseUrl}/contact-us`}
      />
      
      <HeroSection>
        <Container>
          <H2 sx={{ color: "white", mb: 2, fontWeight: 700 }}>Get in Touch</H2>
          <Paragraph
            sx={{
              color: "rgba(255,255,255,0.9)",
              fontSize: "18px",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            Have questions? We would love to hear from you. Send us a message and we will respond as soon as possible.
          </Paragraph>
        </Container>
      </HeroSection>

      <Container sx={{ mb: "80px" }}>
        {data &&
          data
            .filter((item) => item.status === 1)
            .map((item) => (
              <Box
                key={item.id}
                sx={{ mb: 4 }}
                dangerouslySetInnerHTML={{ __html: item.value }}
              />
            ))}

        <Grid container spacing={4}>
          {/* ==================== CHITRAL LOCATION ================== */}
          <Grid item xs={12} md={4}>
            <LocationCard>
              <iframe
                src="https://maps.google.com/maps?q=Chitral,Pakistan&t=&z=13&ie=UTF8&iwloc=&output=embed"
                style={{ width: "100%", height: "250px", borderRadius: "8px" }}
                frameBorder="0"
                allowFullScreen=""
                aria-hidden="false"
                tabIndex="0"
              ></iframe>
              
              <Box sx={{ mt: 3 }}>
                <H3 sx={{ mb: 2, fontWeight: 600, color: "#667eea" }}>Chitral</H3>
                
                <Box sx={{ mb: 3 }}>
                  <IconWrapper>
                    <Place fontSize="medium" />
                  </IconWrapper>
                  <H5 sx={{ mb: 1, fontWeight: 600 }}>Location</H5>
                  <Paragraph sx={{ color: "#666", fontSize: "15px" }}>
                    Chitral, Khyber Pakhtunkhwa, Pakistan
                  </Paragraph>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <IconWrapper>
                    <Phone fontSize="medium" />
                  </IconWrapper>
                  <H5 sx={{ mb: 2, fontWeight: 600 }}>Call Us</H5>
                  <ContactItem>
                    <a
                      href="tel:03239119309"
                      style={{
                        color: "#667eea",
                        textDecoration: "none",
                        fontWeight: 500,
                        fontSize: "16px",
                      }}
                    >
                      03239119309
                    </a>
                  </ContactItem>
                  <ContactItem>
                    <a
                      href="tel:03407964648"
                      style={{
                        color: "#667eea",
                        textDecoration: "none",
                        fontWeight: 500,
                        fontSize: "16px",
                      }}
                    >
                      03407964648
                    </a>
                  </ContactItem>
                </Box>

                <Box>
                  <IconWrapper>
                    <Email fontSize="medium" />
                  </IconWrapper>
                  <H5 sx={{ mb: 2, fontWeight: 600 }}>Email Us</H5>
                  <ContactItem>
                    <a
                      href="mailto:zuhooruddin055@gmail.com"
                      style={{
                        color: "#667eea",
                        textDecoration: "none",
                        fontWeight: 500,
                        fontSize: "16px",
                        wordBreak: "break-all",
                      }}
                    >
                      zuhooruddin055@gmail.com
                    </a>
                  </ContactItem>
                </Box>
              </Box>
            </LocationCard>
          </Grid>

          {/* ==================== UPPER CHITRAL LOCATION ================== */}
          <Grid item xs={12} md={4}>
            <LocationCard>
              <iframe
                src="https://maps.google.com/maps?q=Upper+Chitral,Pakistan&t=&z=13&ie=UTF8&iwloc=&output=embed"
                style={{ width: "100%", height: "250px", borderRadius: "8px" }}
                frameBorder="0"
                allowFullScreen=""
                aria-hidden="false"
                tabIndex="0"
              ></iframe>
              
              <Box sx={{ mt: 3 }}>
                <H3 sx={{ mb: 2, fontWeight: 600, color: "#667eea" }}>Upper Chitral</H3>
                
                <Box sx={{ mb: 3 }}>
                  <IconWrapper>
                    <Place fontSize="medium" />
                  </IconWrapper>
                  <H5 sx={{ mb: 1, fontWeight: 600 }}>Location</H5>
                  <Paragraph sx={{ color: "#666", fontSize: "15px" }}>
                    Upper Chitral, Khyber Pakhtunkhwa, Pakistan
                  </Paragraph>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <IconWrapper>
                    <Phone fontSize="medium" />
                  </IconWrapper>
                  <H5 sx={{ mb: 2, fontWeight: 600 }}>Call Us</H5>
                  <ContactItem>
                    <a
                      href="tel:03239119309"
                      style={{
                        color: "#667eea",
                        textDecoration: "none",
                        fontWeight: 500,
                        fontSize: "16px",
                      }}
                    >
                      03239119309
                    </a>
                  </ContactItem>
                  <ContactItem>
                    <a
                      href="tel:03407964648"
                      style={{
                        color: "#667eea",
                        textDecoration: "none",
                        fontWeight: 500,
                        fontSize: "16px",
                      }}
                    >
                      03407964648
                    </a>
                  </ContactItem>
                </Box>

                <Box>
                  <IconWrapper>
                    <Email fontSize="medium" />
                  </IconWrapper>
                  <H5 sx={{ mb: 2, fontWeight: 600 }}>Email Us</H5>
                  <ContactItem>
                    <a
                      href="mailto:zuhooruddin055@gmail.com"
                      style={{
                        color: "#667eea",
                        textDecoration: "none",
                        fontWeight: 500,
                        fontSize: "16px",
                        wordBreak: "break-all",
                      }}
                    >
                      zuhooruddin055@gmail.com
                    </a>
                  </ContactItem>
                </Box>
              </Box>
            </LocationCard>
          </Grid>

          {/* ==================== ISLAMABAD LOCATION ================== */}
          <Grid item xs={12} md={4}>
            <LocationCard>
              <iframe
                src="https://maps.google.com/maps?q=Islamabad,Pakistan&t=&z=13&ie=UTF8&iwloc=&output=embed"
                style={{ width: "100%", height: "250px", borderRadius: "8px" }}
                frameBorder="0"
                allowFullScreen=""
                aria-hidden="false"
                tabIndex="0"
              ></iframe>
              
              <Box sx={{ mt: 3 }}>
                <H3 sx={{ mb: 2, fontWeight: 600, color: "#667eea" }}>Islamabad</H3>
                
                <Box sx={{ mb: 3 }}>
                  <IconWrapper>
                    <Place fontSize="medium" />
                  </IconWrapper>
                  <H5 sx={{ mb: 1, fontWeight: 600 }}>Location</H5>
                  <Paragraph sx={{ color: "#666", fontSize: "15px" }}>
                    Islamabad, Federal Capital, Pakistan
                  </Paragraph>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <IconWrapper>
                    <Phone fontSize="medium" />
                  </IconWrapper>
                  <H5 sx={{ mb: 2, fontWeight: 600 }}>Call Us</H5>
                  <ContactItem>
                    <a
                      href="tel:03239119309"
                      style={{
                        color: "#667eea",
                        textDecoration: "none",
                        fontWeight: 500,
                        fontSize: "16px",
                      }}
                    >
                      03239119309
                    </a>
                  </ContactItem>
                  <ContactItem>
                    <a
                      href="tel:03407964648"
                      style={{
                        color: "#667eea",
                        textDecoration: "none",
                        fontWeight: 500,
                        fontSize: "16px",
                      }}
                    >
                      03407964648
                    </a>
                  </ContactItem>
                </Box>

                <Box>
                  <IconWrapper>
                    <Email fontSize="medium" />
                  </IconWrapper>
                  <H5 sx={{ mb: 2, fontWeight: 600 }}>Email Us</H5>
                  <ContactItem>
                    <a
                      href="mailto:zuhooruddin055@gmail.com"
                      style={{
                        color: "#667eea",
                        textDecoration: "none",
                        fontWeight: 500,
                        fontSize: "16px",
                        wordBreak: "break-all",
                      }}
                    >
                      zuhooruddin055@gmail.com
                    </a>
                  </ContactItem>
                </Box>
              </Box>
            </LocationCard>
          </Grid>
        </Grid>
      </Container>
    </ShopLayout1>
  );
};

export default ContactUs;
