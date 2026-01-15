import { Box, Container, Grid, keyframes, styled } from "@mui/material";
import CategoryCard1 from "components/category-cards/CategoryCard1";
import CategoryCard2 from "components/category-cards/CategoryCard2";

import { FlexBox } from "components/flex-box";
import { H3, Paragraph, Span } from "components/Typography";

const slideX = keyframes`
    from { left: 120% }
    to { left: -100% }
`; // custom styled components

const AdWrapper = styled(FlexBox)(({ theme }) => ({
  color: "#fff",
  marginTop: "3rem",
  overflow: "hidden",
  backgroundColor: "#434343",
  position: "relative",
  "::before": {
    inset: 5,
    zIndex: 3,
    content: "''",
    position: "absolute",
    border: "1px dashed #fff",
  },
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
  },
}));
const AdTitle1 = styled(H3)(({ theme }) => ({
  zIndex: 10,
  fontSize: 27,
  padding: "1.5rem",
  position: "relative",
  backgroundColor: "#e0e0e0",
  textTransform: "uppercase",
  color: theme.palette.dark.main,
  "::after": {
    top: -36,
    bottom: 0,
    zIndex: -1,
    right: -17,
    content: "''",
    position: "absolute",
    transform: "rotate(23deg)",
    border: "70px solid #e0e0e0",
  },
  [theme.breakpoints.down("sm")]: {
    marginBottom: 16,
    "::after": {
      display: "none",
    },
  },
}));

const Section3 = (dataa) => {
  console.log(dataa);
  // Construct correct base URL: https://api.meerabs.com/media/
  // Since NEXT_PUBLIC_BACKEND_API_BASE = https://api.meerabs.com/api/
  // We need to replace /api/ with /media/ to get: https://api.meerabs.com/media/
  const backendBase = process.env.NEXT_PUBLIC_BACKEND_API_BASE || '';
  let imgbaseurl = backendBase.replace('/api/', '/media/');
  // If replacement didn't work (no /api/ found), try without trailing slash
  if (imgbaseurl === backendBase) {
    imgbaseurl = backendBase.replace('/api', '/media');
  }
  // Ensure the base URL ends with exactly one /
  imgbaseurl = imgbaseurl.replace(/\/+$/, '') + '/';
  
  const slugbaseurl='category/'
  
  // Helper function to normalize slug (remove leading slashes and path prefixes)
  const normalizeSlug = (slug) => {
    if (!slug) return '';
    // Remove leading slashes
    let normalized = slug.replace(/^\/+/, '');
    // Remove 'categories/' or 'category/' prefix if present
    normalized = normalized.replace(/^(categories|category)\//, '');
    return normalized;
  };
  
  // Filter out null/undefined data and only include valid items
  const dataItems = [dataa.data1, dataa.data2, dataa.data3, dataa.data4, dataa.data5, dataa.data6]
    .filter(item => item && item.id && item.category_slug);
  
  // Don't render if no valid data
  if (dataItems.length === 0) {
    return null;
  }
  
  const data = dataItems.map((item, index) => ({
    url: slugbaseurl + normalizeSlug(item.category_slug),
    title: item.category_name || `Category${index + 3}`,
    id: item.id,
    img: item.image && item.image.trim() !== '' ? imgbaseurl + item.image : '/assets/images/banners/default.png',
  }));
  console.log(data);

  return (
    <Container
      sx={{
        mt: 8,
      }}
    >
      <Grid container spacing={3}>
        {data.map((item) => (
          <Grid item lg={2} md={3} sm={4} xs={6} key={item.id}>
            <CategoryCard2 image={item.img} title={item.title} url={item.url} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Section3;
