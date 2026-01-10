import { Box, Container, Grid, Typography, styled } from "@mui/material";
import Link from "next/link";
import { memo } from "react";
import BazaarImage from "components/BazaarImage";

const BannerSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 0),
}));

const ImageWrapper = styled(Box)({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  "& img": {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.5s ease-in-out",
  },
});

const ModernBanner = styled(Box)(({ theme }) => ({
  position: "relative",
  height: "250px",
  borderRadius: theme.spacing(1),
  overflow: "hidden",
  cursor: "pointer",
  transition: "all 0.3s ease-in-out",
  boxShadow: theme.shadows[2],
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[6],
    "& .overlay-gradient": {
      opacity: 0.85,
    },
    "& .banner-content": {
      transform: "translate(-50%, -50%) scale(1.03)",
    },
    "& img": {
      transform: "scale(1.08)",
    },
  },
}));

const OverlayGradient = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.7) 100%)",
  opacity: 0.7,
  transition: "opacity 0.3s ease-in-out",
  zIndex: 1,
}));

const BannerContent = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  textAlign: "center",
  color: "#fff",
  zIndex: 2,
  transition: "transform 0.3s ease-in-out",
  width: "90%",
  padding: theme.spacing(1),
}));

const CategoryTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: "1.25rem",
  lineHeight: 1.3,
  textShadow: "1px 1px 4px rgba(0,0,0,0.5)",
  [theme.breakpoints.down("sm")]: {
    fontSize: "1.1rem",
  },
}));

const StyledLink = styled(Link)({
  textDecoration: "none",
  display: "block",
  height: "100%",
});

const Section4Modern = ({ data1, data2, data3 }) => {
  const imgbaseurl = process.env.NEXT_PUBLIC_BACKEND_API_BASE + "media/";

  const banners = [data1, data2, data3]
    .filter((item) => item != null)
    .map((item, index) => ({
      id: item?.id || `banner-${index}`,
      name: item?.category_name || `Category ${index + 1}`,
      slug: item?.category_slug || `category-${index}`,
      image: item?.image ? imgbaseurl + item.image : "/assets/images/banners/default.png",
    }));

  if (banners.length === 0) {
    return null;
  }

  return (
    <BannerSection>
      <Container maxWidth="lg">
        <Grid container spacing={2}>
          {banners.map((banner) => (
            <Grid item xs={12} md={4} key={banner.id}>
              <StyledLink href={`category/${banner.slug}`}>
                <ModernBanner>
                  <ImageWrapper>
                    <BazaarImage
                      src={banner.image}
                      alt={banner.name}
                      width={400}
                      height={250}
                      objectFit="cover"
                    />
                  </ImageWrapper>
                  <OverlayGradient className="overlay-gradient" />
                  <BannerContent className="banner-content">
                    <CategoryTitle variant="h3" component="h2">
                      {banner.name}
                    </CategoryTitle>
                  </BannerContent>
                </ModernBanner>
              </StyledLink>
            </Grid>
          ))}
        </Grid>
      </Container>
    </BannerSection>
  );
};

export default memo(Section4Modern);