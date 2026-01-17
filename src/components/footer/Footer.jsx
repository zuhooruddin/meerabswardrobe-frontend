import { Box, Container, Grid, styled, keyframes } from "@mui/material";
import BazaarIconButton from "components/BazaarIconButton";
import Image from "components/BazaarImage";
import { FlexBox } from "components/flex-box";
import Facebook from "components/icons/Facebook";
import Youtube from "components/icons/Youtube";
import Instagram from "components/icons/Instagram";
import Twitter from "components/icons/Twitter";
import { Paragraph, H6 } from "components/Typography";
import Link from "next/link";
import { useState, useEffect } from "react";

// Gradient animation
const gradientShift = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

// Float animation for decorative elements
const float = keyframes`
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
`;

// Styled link with premium hover effect
const StyledLink = styled("a")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  borderRadius: 8,
  cursor: "pointer",
  position: "relative",
  padding: "12px 0", // Increased padding for better touch targets
  minHeight: "44px", // Minimum touch target height for accessibility
  color: "rgba(255, 255, 255, 0.6)",
  fontSize: "14px",
  fontWeight: 500,
  transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
  "&::before": {
    content: '""',
    position: "absolute",
    left: 0,
    bottom: 8,
    width: 0,
    height: "2px",
    background: "linear-gradient(135deg, #D23F57 0%, #E94560 100%)",
    transition: "width 0.35s ease",
  },
  "&:hover": {
    color: "#ffffff",
    transform: "translateX(8px)",
    "&::before": {
      width: "30px",
    },
  },
}));

// Section title with gradient underline
const SectionTitle = styled(Box)(({ theme }) => ({
  fontSize: "18px",
  fontWeight: 700,
  marginBottom: "28px",
  lineHeight: 1,
  color: "white",
  position: "relative",
  display: "inline-block",
  fontFamily: "'Outfit', sans-serif",
  letterSpacing: "-0.02em",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: "-12px",
    left: 0,
    width: "50px",
    height: "4px",
    background: "linear-gradient(135deg, #D23F57 0%, #E94560 100%)",
    borderRadius: "10px",
  },
}));

// Premium Social Icon Button
const SocialButton = styled(BazaarIconButton)(({ theme }) => ({
  minWidth: "52px",
  minHeight: "52px",
  borderRadius: "14px",
  background: "rgba(255, 255, 255, 0.05)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    background: "linear-gradient(135deg, #D23F57 0%, #E94560 100%)",
    opacity: 0,
    transition: "opacity 0.4s ease",
  },
  "&:hover": {
    transform: "translateY(-6px) scale(1.05)",
    boxShadow: "0 16px 32px rgba(210, 63, 87, 0.4)",
    border: "1px solid transparent",
    "& svg": {
      color: "white",
      transform: "scale(1.1)",
    },
    "&::before": {
      opacity: 1,
    },
  },
  "& svg": {
    position: "relative",
    zIndex: 1,
    transition: "all 0.4s ease",
    color: "rgba(255, 255, 255, 0.7)",
  },
}));

// Footer Wrapper with premium design
const Footwrapper = styled(Box)(() => ({
  "@media only screen and (max-width: 600px)": {
    ".logo": {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: 92,
    },
    ".logo1": {
      display: "flex",
      justifyContent: "center",
    },
  },
}));

// Decorative Circle
const DecorativeCircle = styled(Box)(({ size = 200, top, left, right, bottom }) => ({
  position: "absolute",
  width: size,
  height: size,
  borderRadius: "50%",
  background: "radial-gradient(circle, rgba(210, 63, 87, 0.15) 0%, transparent 70%)",
  filter: "blur(60px)",
  top,
  left,
  right,
  bottom,
  animation: `${float} 8s ease-in-out infinite`,
  pointerEvents: "none",
}));

const Footer = ({ footerData: initialFooterData }) => {
  const [mounted, setMounted] = useState(false);
  const [footerData, setFooterData] = useState(initialFooterData);

  useEffect(() => {
    setMounted(true);
    if (initialFooterData) {
      setFooterData(initialFooterData);
    }
  }, [initialFooterData]);

  const imgbaseurl = process.env.NEXT_PUBLIC_BACKEND_API_BASE + "media/";
  const defaultLogo = "/assets/images/logos/webpack.png";

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Footer component - footerData:', footerData);
    }
  }, [footerData]);

  return (
    <Footwrapper>
      <footer>
        <Box 
          sx={{
            background: "linear-gradient(180deg, #0F172A 0%, #020617 100%)",
            position: "relative",
            overflow: "hidden",
            // Premium gradient top border
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "5px",
              background: "linear-gradient(90deg, #D23F57 0%, #E94560 25%, #FF6B7A 50%, #E94560 75%, #D23F57 100%)",
              backgroundSize: "200% 100%",
              animation: `${gradientShift} 4s ease infinite`,
            },
          }}
        >
          {/* Decorative Elements */}
          <DecorativeCircle size={400} top="-100px" left="-100px" />
          <DecorativeCircle size={300} bottom="-50px" right="-50px" />
          <DecorativeCircle size={200} top="50%" left="50%" />
          
          <Container
            sx={{
              p: "1rem",
              color: "white",
              position: "relative",
              zIndex: 1,
            }}
          >
            <Box py={{ xs: 6, md: 10 }} overflow="hidden">
              <Grid container spacing={4}>
                {/* Column 1: Logo and Description */}
                <Grid item lg={4} md={6} sm={6} xs={12}>
                  <Link href="/" passHref>
                    <a aria-label="Chitral Hive - Go to homepage" style={{ minHeight: '48px', minWidth: '160px', display: 'inline-block' }}>
                      <Box
                        sx={{
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "scale(1.03)",
                            filter: "brightness(1.1)",
                          },
                        }}
                      >
                      <Image
                          mb={3}
                          width={160}
                          height={48}
                        src={footerData?.footer_logo ? imgbaseurl + footerData.footer_logo : defaultLogo}
                          alt="Chitral Hive Logo"
                        style={{ 
                          display: 'block', 
                          maxWidth: '160px', 
                          height: 'auto',
                          objectFit: 'contain',
                          filter: 'brightness(1.1) contrast(1.1)',
                          transition: 'all 0.3s ease',
                        }}
                        quality={95}
                        loading="lazy"
                      />
                      </Box>
                    </a>
                  </Link>

                  <Paragraph 
                    mb={3} 
                    sx={{
                      color: "rgba(255, 255, 255, 0.6)",
                      fontSize: "15px",
                      lineHeight: 1.8,
                      maxWidth: "320px",
                    }}
                  >
                    {footerData?.footer_description || "Discover authentic Chitrali products. Quality craftsmanship delivered to your doorstep."}
                  </Paragraph>
                  
                  {/* Newsletter Signup */}
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      mt: 3,
                      maxWidth: "320px",
                    }}
                  >
                    <Box
                      component="input"
                      placeholder="Enter your email"
                      sx={{
                        flex: 1,
                        padding: "14px 18px",
                        borderRadius: "12px",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        background: "rgba(255, 255, 255, 0.05)",
                        color: "white",
                        fontSize: "14px",
                        outline: "none",
                        transition: "all 0.3s ease",
                        "&::placeholder": {
                          color: "rgba(255, 255, 255, 0.4)",
                        },
                        "&:focus": {
                          borderColor: "rgba(210, 63, 87, 0.5)",
                          background: "rgba(255, 255, 255, 0.08)",
                          boxShadow: "0 0 0 4px rgba(210, 63, 87, 0.1)",
                        },
                      }}
                    />
                    <Box
                      component="button"
                      sx={{
                        padding: "14px 20px",
                        borderRadius: "12px",
                        border: "none",
                        background: "linear-gradient(135deg, #D23F57 0%, #E94560 100%)",
                        color: "white",
                        fontWeight: 600,
                        fontSize: "14px",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 8px 24px rgba(210, 63, 87, 0.4)",
                        },
                      }}
                    >
                      Subscribe
                    </Box>
                  </Box>
                </Grid>

                {/* Column 2: Links */}
                {footerData?.column_two_heading && footerData?.column_two_links && (
                  <Grid item lg={2} md={6} sm={6} xs={12}>
                    <SectionTitle>
                      {footerData.column_two_heading}
                    </SectionTitle>

                    <Box sx={{ mt: 4 }}>
                      {footerData.column_two_links
                        .filter((item) => item.column === 2)
                        .map((item, ind) => (
                          <Link href={item.link} key={ind} passHref>
                            <StyledLink>{item.name}</StyledLink>
                          </Link>
                        ))}
                    </Box>
                  </Grid>
                )}

                {/* Column 3: Links */}
                {footerData?.column_three_heading && footerData?.column_three_links && (
                  <Grid item lg={3} md={6} sm={6} xs={12}>
                    <SectionTitle>
                      {footerData.column_three_heading}
                    </SectionTitle>
                    
                    <Box sx={{ mt: 4 }}>
                      {footerData.column_three_links
                        .filter((item) => item.column === 3)
                        .map((item, ind) => (
                          <Link href={item.link} key={ind} passHref>
                            <StyledLink>{item.name}</StyledLink>
                          </Link>
                        ))}
                    </Box>
                  </Grid>
                )}
                
                {/* Column 4: Contact & Social */}
                <Grid item lg={3} md={6} sm={6} xs={12}>
                  <SectionTitle>
                    {footerData?.footer_fourth_column_heading || "Get in Touch"}
                  </SectionTitle>
                  
                  {footerData?.footer_fourth_column_content && (
                    <Box
                      sx={{
                        mt: 4,
                        color: "rgba(255, 255, 255, 0.6)",
                        fontSize: "14px",
                        lineHeight: 1.8,
                        "& p": {
                          marginBottom: "10px",
                        },
                        "& a": {
                          color: "rgba(255, 255, 255, 0.8)",
                          transition: "color 0.3s ease",
                          "&:hover": {
                            color: "#D23F57",
                          },
                        },
                      }}
                      dangerouslySetInnerHTML={{
                        __html: footerData.footer_fourth_column_content,
                      }}
                    />
                  )}

                  {/* Social Icons */}
                  <FlexBox gap={1.5} mt={4}>
                    {footerData?.facebook && (
                      <a
                        href={footerData.facebook}
                        target="_blank"
                        rel="noreferrer noopener"
                        aria-label="Visit our Facebook page"
                      >
                        <SocialButton aria-label="Facebook">
                          <Facebook fontSize="small" />
                        </SocialButton>
                      </a>
                    )}

                    {footerData?.instagram && (
                      <a
                        href={footerData.instagram}
                        target="_blank"
                        rel="noreferrer noopener"
                        aria-label="Visit our Instagram page"
                      >
                        <SocialButton aria-label="Instagram">
                          <Instagram fontSize="small" />
                        </SocialButton>
                      </a>
                    )}

                    {footerData?.youtube && (
                      <a
                        href={footerData.youtube}
                        target="_blank"
                        rel="noreferrer noopener"
                        aria-label="Visit our YouTube channel"
                      >
                        <SocialButton aria-label="YouTube">
                          <Youtube fontSize="small" />
                        </SocialButton>
                      </a>
                    )}

                    {footerData?.twitter && (
                      <a
                        href={footerData.twitter}
                        target="_blank"
                        rel="noreferrer noopener"
                        aria-label="Visit our Twitter page"
                      >
                        <SocialButton aria-label="Twitter">
                          <Twitter fontSize="small" />
                        </SocialButton>
                      </a>
                    )}
                  </FlexBox>
                </Grid>
              </Grid>

              {/* Bottom Bar */}
              <Box
                sx={{
                  mt: 8,
                  pt: 4,
                  borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Paragraph
                  sx={{
                    color: "rgba(255, 255, 255, 0.5)",
                    fontSize: "14px",
                  }}
                >
                  © {new Date().getFullYear()} Meerabs Wardrobe. All rights reserved.
                </Paragraph>
                
                <FlexBox gap={3}>
                  <Link href="/privacy-policy" passHref>
                    <Box
                      component="a"
                      sx={{
                        color: "rgba(255, 255, 255, 0.5)",
                        fontSize: "14px",
                        transition: "color 0.3s ease",
                        "&:hover": {
                          color: "#D23F57",
                        },
                      }}
                    >
                      Privacy Policy
                    </Box>
                  </Link>
                  <Link href="/return-policy" passHref>
                    <Box
                      component="a"
                      sx={{
                        color: "rgba(255, 255, 255, 0.5)",
                        fontSize: "14px",
                        transition: "color 0.3s ease",
                        "&:hover": {
                          color: "#D23F57",
                        },
                      }}
                    >
                      Return Policy
                    </Box>
                  </Link>
                </FlexBox>
              </Box>
            </Box>
          </Container>
        </Box>
      </footer>
    </Footwrapper>
  );
};

export default Footer;
