import { KeyboardArrowDown, PersonOutline } from "@mui/icons-material";
import { Badge, Box, Dialog, Drawer, styled, keyframes } from "@mui/material";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import clsx from "clsx";
import BazaarButton from "components/BazaarButton";
import Image from "components/BazaarImage";
import CategoryMenu from "components/categories/CategoryMenu";
import { FlexBox } from "components/flex-box";
import Category from "components/icons/Category";
import ShoppingBagOutlined from "components/icons/ShoppingBagOutlined";
import MiniCart from "components/mini-cart/MiniCart";
import MobileMenu from "components/navbar/MobileMenu";
import GrocerySearchBox from "components/search-box/GrocerySearchBox";
import ThemeSwitcher from "components/ThemeSwitcher";
import { useAppContext } from "contexts/AppContext";
import Link from "next/link";
import Login from "pages-sections/sessions/Login";
import { useState, useEffect } from "react";
import { layoutConstant } from "utils/constants";
import SearchBox from "../search-box/SearchBox";

// Shimmer animation for premium effect
const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

// Pulse animation for cart badge
const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
`;

// Premium Header Wrapper with Glassmorphism
export const HeaderWrapper = styled(Box)(({ theme }) => ({
  zIndex: 1000,
  position: "relative",
  height: layoutConstant.headerHeight,
  transition: "all 350ms cubic-bezier(0.4, 0, 0.2, 1)",
  background: theme.palette.mode === 'dark' 
    ? "rgba(15, 23, 42, 0.95)" 
    : "rgba(255, 255, 255, 0.98)",
  backdropFilter: "blur(24px) saturate(180%)",
  WebkitBackdropFilter: "blur(24px) saturate(180%)",
  boxShadow: theme.palette.mode === 'dark'
    ? "0 4px 30px rgba(0, 0, 0, 0.4)"
    : "0 4px 30px rgba(0, 0, 0, 0.06)",
  borderBottom: theme.palette.mode === 'dark'
    ? "1px solid rgba(255, 255, 255, 0.08)"
    : "1px solid rgba(0, 0, 0, 0.04)",
  [theme.breakpoints.down("sm")]: {
    height: layoutConstant.mobileHeaderHeight,
  },
  "&::before": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "1px",
    background: theme.palette.mode === 'dark'
      ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)"
      : "linear-gradient(90deg, transparent, rgba(0,0,0,0.05), transparent)",
  },
  "&.scrolled": {
    boxShadow: theme.palette.mode === 'dark'
      ? "0 8px 40px rgba(0, 0, 0, 0.5)"
      : "0 8px 40px rgba(0, 0, 0, 0.1)",
    background: theme.palette.mode === 'dark' 
      ? "rgba(15, 23, 42, 0.98)" 
      : "rgba(255, 255, 255, 0.99)",
  },
}));

// Premium Icon Button Wrapper
const IconButtonWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "12px",
  borderRadius: "14px",
  cursor: "pointer",
  transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
  backgroundColor: theme.palette.mode === 'dark' 
    ? "rgba(255, 255, 255, 0.05)" 
    : "rgba(241, 245, 249, 0.8)",
  border: theme.palette.mode === 'dark'
    ? "1px solid rgba(255, 255, 255, 0.08)"
    : "1px solid rgba(0, 0, 0, 0.04)",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    background: "linear-gradient(135deg, rgba(210, 63, 87, 0.15) 0%, rgba(233, 69, 96, 0.1) 100%)",
    opacity: 0,
    transition: "opacity 0.35s ease",
  },
  "&:hover": {
    backgroundColor: theme.palette.mode === 'dark' 
      ? "rgba(255, 255, 255, 0.08)" 
      : "#FCE9EC",
    transform: "translateY(-3px)",
    boxShadow: "0 8px 24px rgba(210, 63, 87, 0.2)",
    borderColor: "rgba(210, 63, 87, 0.3)",
    "& svg": {
      color: "#D23F57",
    },
    "&::before": {
      opacity: 1,
    },
  },
  "&:active": {
    transform: "translateY(-1px)",
  },
  "& svg": {
    transition: "all 0.35s ease",
    color: theme.palette.mode === 'dark' ? "#94A3B8" : "#475569",
  },
}));

// Logo Container with hover effect
const LogoContainer = styled(Box)(({ theme }) => ({
  display: "block",
  alignItems: "center",
  transition: "all 0.3s ease",
  position: "relative",
  "&:hover": {
    transform: "scale(1.02)",
    "& img": {
      filter: "brightness(1.05)",
    },
  },
  "& img": {
    display: "block !important",
    visibility: "visible !important",
  },
}));

// Premium Badge with gradient
const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    background: "linear-gradient(135deg, #D23F57 0%, #E94560 100%)",
    boxShadow: "0 4px 12px rgba(210, 63, 87, 0.4)",
    fontWeight: 700,
    fontSize: "0.75rem",
    minWidth: "22px",
    height: "22px",
    borderRadius: "11px",
    animation: `${pulse} 2s ease-in-out infinite`,
  },
}));

// ==============================================================

// ==============================================================
const Header = ({ isFixed, headerdata, className, searchBoxType = "type2" }) => {
  const theme = useTheme();
  const { state } = useAppContext();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sidenavOpen, setSidenavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const downMd = useMediaQuery(theme.breakpoints.down(1150));

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDialog = () => setDialogOpen(!dialogOpen);
  const toggleSidenav = () => setSidenavOpen(!sidenavOpen);

  const companyLogo = process.env.NEXT_PUBLIC_LOGO_API_URL;
  const comopanyalt = process.env.NEXT_PUBLIC_LOGO_ALT_TEXT;
  const imgbaseurl = process.env.NEXT_PUBLIC_BACKEND_API_BASE + "media/";

  return (
    <HeaderWrapper className={clsx(className, { scrolled })}>
      <Container
        sx={{
          gap: { xs: 1.5, md: 2.5 },
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo Section */}
        <FlexBox
          mr={{ xs: 1, md: 2 }}
          minWidth={{ xs: "120px", md: "170px" }}
          alignItems="center"
          sx={{
            display: "flex",
            flexShrink: 0,
          }}
        >
          <Link href="/">
            <a>
              <LogoContainer
                sx={{
                  maxWidth: { xs: '120px', md: '160px' },
                  width: { xs: '120px', md: '160px' },
                  minWidth: { xs: '120px', md: '160px' },
                  display: 'block',
                }}
              >
              <Image 
                  height={48} 
                  width={160}
                  src={headerdata && headerdata.length > 0 && headerdata[0]?.site_logo 
                    ? imgbaseurl + headerdata[0].site_logo 
                    : '/assets/images/logos/webpack.png'} 
                alt={comopanyalt || "Logo"}
                  priority
                  quality={85}
                  style={{ 
                    display: 'block !important',
                    visibility: 'visible !important',
                    opacity: '1 !important',
                    transition: 'all 0.3s ease',
                    width: '100%',
                    height: 'auto',
                    maxWidth: '100%',
                  }}
                  sizes="(max-width: 768px) 120px, 160px"
              />
              </LogoContainer>
            </a>
          </Link>

          {isFixed && (
            <CategoryMenu navCategories={null}>
              <FlexBox color="grey.600" alignItems="center" ml={2}>
                <BazaarButton 
                  color="inherit"
                  sx={{
                    borderRadius: "12px",
                    padding: "8px 14px",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: theme.palette.mode === 'dark' 
                        ? "rgba(255,255,255,0.05)" 
                        : "rgba(241,245,249,0.8)",
                      color: "#D23F57",
                    },
                  }}
                >
                  <Category fontSize="small" color="inherit" />
                  <KeyboardArrowDown fontSize="small" color="inherit" />
                </BazaarButton>
              </FlexBox>
            </CategoryMenu>
          )}
        </FlexBox>

        {/* Search Section */}
        <FlexBox 
          justifyContent="center" 
          flex="1 1 0"
          sx={{
            maxWidth: { xs: "100%", md: "600px" },
            mx: { xs: 0, md: 3 },
          }}
        >
          {searchBoxType === "type1" && <SearchBox />}
          {searchBoxType === "type2" && <GrocerySearchBox />}
        </FlexBox>

        {/* Action Buttons Section */}
        <FlexBox
          alignItems="center"
          gap={{ xs: 1, md: 1.5 }}
          sx={{
            display: {
              xs: "none",
              md: "flex",
            },
          }}
        >
          {/* User Account Button */}
          <IconButtonWrapper
            component={IconButton}
            onClick={toggleDialog}
            aria-label="User account"
          >
            <PersonOutline />
          </IconButtonWrapper>

          {/* Theme Switcher */}
          <ThemeSwitcher iconOnly={false} />

          {/* Shopping Cart Button */}
          <StyledBadge 
            badgeContent={state.cart.length} 
            color="primary"
            invisible={state.cart.length === 0}
          >
            <IconButtonWrapper
              component={IconButton}
              onClick={toggleSidenav}
              aria-label="Shopping cart"
            >
              <ShoppingBagOutlined />
            </IconButtonWrapper>
          </StyledBadge>
        </FlexBox>

        {/* Login Dialog */}
        <Dialog
          open={dialogOpen}
          fullWidth={isMobile}
          scroll="body"
          onClose={toggleDialog}
          PaperProps={{
            sx: {
              borderRadius: "24px",
              overflow: "hidden",
              boxShadow: "0 32px 80px rgba(0, 0, 0, 0.2)",
              maxWidth: "450px",
            },
          }}
        >
          <Login />
        </Dialog>

        {/* Cart Drawer */}
        <Drawer 
          open={sidenavOpen} 
          anchor="right" 
          onClose={toggleSidenav}
          PaperProps={{
            sx: {
              width: { xs: "100%", sm: "400px" },
              borderRadius: "24px 0 0 24px",
              boxShadow: "-20px 0 60px rgba(0, 0, 0, 0.15)",
            },
          }}
        >
          <MiniCart />
        </Drawer>
      </Container>
    </HeaderWrapper>
  );
};

export default Header;
