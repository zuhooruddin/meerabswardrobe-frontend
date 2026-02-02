import { Box, styled } from "@mui/material";
import { H4 } from "components/Typography";
import Image from "next/image";
import Link from "next/link";

// Professional styled components
const Wrapper = styled(Box)(({ theme }) => ({
  cursor: "pointer",
  overflow: "hidden",
  borderRadius: "12px",
  position: "relative",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)",
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  backgroundColor: theme.palette.background.paper,
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0.6) 100%)",
    zIndex: 1,
    transition: "opacity 0.4s ease",
    opacity: 0.7,
  },
  "& img": {
    transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), filter 0.4s ease",
  },
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.12)",
    "&::before": {
      opacity: 0.85,
    },
    "& img": {
      transform: "scale(1.08)",
      filter: "brightness(1.05)",
    },
    "& .category-title": {
      backgroundColor: "rgba(0, 0, 0, 0.85)",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
    },
    "& .category-title h4": {
      color: "#ffffff",
      transform: "scale(1.02)",
    },
  },
}));

const CategoryTitle = styled(Box)(({ theme }) => ({
  left: 12,
  right: 12,
  bottom: 8,
  padding: "12px 16px",
  textAlign: "center",
  borderRadius: "8px",
  position: "absolute",
  zIndex: 2,
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  backgroundColor: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(10px)",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  "& h4": {
    margin: 0,
    fontWeight: 600,
    fontSize: "12px",
    lineHeight: 1.2,
    color: theme.palette.text.primary,
    transition: "all 0.4s ease",
    textTransform: "capitalize",
    letterSpacing: "0.3px",
  },
  [theme.breakpoints.down("sm")]: {
    left: 8,
    right: 8,
    bottom: 8,
    padding: "10px 12px",
    "& h4": {
      fontSize: "12px",
    },
  },
})); // ============================================================

// ============================================================
const CategoryCard2 = ({ image, title, url }) => {
  return (
    <Link href={url} style={{ textDecoration: 'none', display: 'block' }}>
      <Wrapper position="relative" sx={{ aspectRatio: '1/1' }} aria-label={`Browse ${title} products`}>
        <Box
          position="absolute"
          top={0}
          left={0}
          width="100%"
          height="100%"
          sx={{
            zIndex: 0,
          }}
        >
          <Image
            src={image || '/assets/images/banners/default.png'}
            alt={title ? `${title} - Shop premium women's clothing` : 'Category'}
            layout="fill"
            sizes="(max-width: 600px) 45vw, (max-width: 960px) 30vw, 200px"
            objectFit="cover"
            quality={85}
            loading="lazy"
          />
        </Box>

        <CategoryTitle className="category-title">
          <H4>{title}</H4>
        </CategoryTitle>
      </Wrapper>
    </Link>
  );
};

export default CategoryCard2;
