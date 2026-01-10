import { Box, Container, styled } from "@mui/material";
import { H3,H4, Paragraph, Span } from "components/Typography";
import WhiteButton from "components/WhiteButton";
import Link from 'next/link'
import NavLink3 from "components/nav-link/NavLink3";
import BannerCard6 from "components/banners/BannerCard6";

const BannerWrapper = styled(Box)(({ theme, img }) => ({
  gap: "5rem",
  padding: "2rem",
  display: "flex",
  flexWrap: "wrap",
  overflow: "hidden",
  borderRadius: "3px",
  alignItems: "center",
  backgroundSize: "cover",
  justifyContent: "flex-start",
  backgroundPosition: "center left",
  backgroundRepeat: "no-repeat",
  backgroundImage: `url(${img})`,

  [theme.breakpoints.down("lg")]: {
    gap: "3rem",
    padding: "1.5rem",
  },

  [theme.breakpoints.down("md")]: {
    gap: "2rem",
    padding: "1.5rem",
    flexDirection: "column",
    justifyContent: "center",
    backgroundPosition: "center",
  },

  [theme.breakpoints.down("sm")]: {
    gap: "1rem",
    padding: "1rem",
  },
}));



const NavLinkWrapper = styled(NavLink3)`
  cursor: pointer;
`;

const CustomLink = ({ children, href }) => (
  <Link href={href}>
    <a style={{ cursor: "pointer" }}>{children}</a>
  </Link>
);

const Section7 = ({ data1 }) => {
  const slugbaseurl = 'category/'
  const imgbaseurl = process.env.NEXT_PUBLIC_BACKEND_API_BASE + 'media/'
  const words = data1 && data1.category_name ? data1.category_name.split(' ') : ["Category 13"];;

  return (
    <Container sx={{ my: { xs: 4, sm: 6, md: 8 }, px: { xs: 2, sm: 3 } }}>
      <CustomLink href={slugbaseurl + data1.category_slug}>
        { /* Use BannerWrapper for desktop view and MobileBannerWrapper for mobile view */ }
        { /* You can determine which to use based on the screen size */ }
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <BannerWrapper img={data1.image&& data1.image?imgbaseurl + data1.image:'/assets/images/banners/category-1.png'}>
            <Box textAlign="left">
              <H3 fontSize={{ xs: 24, sm: 28, md: 32, lg: 34 }} lineHeight={1} fontWeight={500}>
                {words.map((word, index) => (
                  <Span
                    key={index}
                    color={index % 2 === 0 ? '#2b3445' : 'primary.main'}
                  >
                    {word}{' '}
                  </Span>
                ))}
              </H3>
              <NavLinkWrapper
                href={slugbaseurl + data1.category_slug}
                text="Shop Now"
                color="dark.main"
                hoverColor="dark.main"
              />
            </Box>
          </BannerWrapper>
        </Box>
        <Box sx={{ 
          display: { xs: 'flex', md: 'none' }, 
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Box sx={{ width: '100%', maxWidth: '100%' }}>
            <BannerCard6 img={ data1.image&& data1.image?imgbaseurl + data1.image:'/assets/images/banners/category-1.png'}>
              <H4 color="black" fontSize={{ xs: 16, sm: 18, md: 20 }} lineHeight={1}>
                {words.map((word, index) => (
                  <Span
                    key={index}
                    color={index % 2 === 0 ? '#2b3445' : 'primary.main'}
                  >
                    {word}{' '}
                  </Span>
                ))}
              </H4>
              <NavLink3
                href={slugbaseurl+data1.category_slug}
                text="Shop Now"
                color="black"
                hoverColor="white"
              />
            </BannerCard6>
          </Box>
        </Box>
             
      </CustomLink>
    </Container>
  );
};

export default Section7;
