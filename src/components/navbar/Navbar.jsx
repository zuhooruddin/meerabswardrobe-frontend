import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  KeyboardArrowDown,
} from "@mui/icons-material";
import ArrowRight from "@mui/icons-material/ArrowRight";
import { Box, Container, MenuItem, styled, keyframes } from "@mui/material";
import BazaarButton from "components/BazaarButton";
import BazaarCard from "components/BazaarCard";
import CategoryMenu from "components/categories/CategoryMenu";
import { FlexBox } from "components/flex-box";
import Category from "components/icons/Category";
import NavLink from "components/nav-link/NavLink";
import { Paragraph } from "components/Typography";
import useSettings from "hooks/useSettings";
import MegaMenu from "./MegaMenu";
import MegaMenu2 from "./MegaMenu2";

// Subtle slide animation
const slideDown = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, -8px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
`;

// Premium navigation link style
const navLinkStyle = {
  cursor: "pointer",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  padding: "10px 16px",
  borderRadius: "12px",
  fontWeight: 500,
  fontSize: "15px",
  position: "relative",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: "4px",
    left: "50%",
    transform: "translateX(-50%)",
    width: 0,
    height: "3px",
    background: "linear-gradient(135deg, #D23F57 0%, #E94560 100%)",
    borderRadius: "2px",
    transition: "width 0.3s ease",
  },
  "&:hover": {
    color: "primary.main",
    backgroundColor: "rgba(210, 63, 87, 0.06)",
    "&::after": {
      width: "60%",
    },
  },
  "&:last-child": {
    marginRight: 0,
  },
};

const StyledNavLink = styled(NavLink)(({ theme }) => ({
  ...navLinkStyle,
  color: theme.palette.text.primary,
}));

const ParentNav = styled(Box)(({ theme }) => ({
  "&:hover": {
    color: theme.palette.primary.main,
    "& > .parent-nav-item": {
      display: "block",
    },
  },
}));

const ParentNavItem = styled(Box)(({ theme }) => ({
  top: 0,
  zIndex: 5,
  left: "100%",
  paddingLeft: 8,
  display: "none",
  position: "absolute",
  [theme.breakpoints.down(1640)]: {
    right: "100%",
    left: "auto",
    paddingRight: 8,
  },
}));

// Premium Navbar Wrapper
const NavBarWrapper = styled(BazaarCard)(({ theme, border }) => ({
  height: "64px",
  display: "block",
  borderRadius: "0px",
  position: "relative",
  zIndex: 999, // Lower than CategoryMenuCard (1600) but above content
  backgroundColor: theme.palette.mode === 'dark' 
    ? "rgba(15, 23, 42, 0.95)" 
    : "rgba(255, 255, 255, 0.98)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  boxShadow: theme.palette.mode === 'dark'
    ? "0 2px 20px rgba(0, 0, 0, 0.3)"
    : "0 2px 20px rgba(0, 0, 0, 0.04)",
  ...(border && {
    borderBottom: theme.palette.mode === 'dark'
      ? "1px solid rgba(255, 255, 255, 0.08)"
      : "1px solid rgba(0, 0, 0, 0.04)",
  }),
  [theme.breakpoints.down(1150)]: {
    display: "none",
  },
}));

const InnerContainer = styled(Container)(() => ({
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
}));



// Premium Category Menu Button
const CategoryMenuButton = styled(BazaarButton)(({ theme }) => ({
  width: "280px",
  height: "46px",
  backgroundColor: theme.palette.mode === 'dark' 
    ? "rgba(255, 255, 255, 0.05)" 
    : "rgba(241, 245, 249, 0.8)",
  borderRadius: "14px",
  padding: "0 20px",
  border: theme.palette.mode === 'dark'
    ? "1px solid rgba(255, 255, 255, 0.08)"
    : "1px solid rgba(0, 0, 0, 0.04)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    backgroundColor: theme.palette.mode === 'dark' 
      ? "rgba(255, 255, 255, 0.08)" 
      : "rgba(241, 245, 249, 1)",
    borderColor: "rgba(210, 63, 87, 0.3)",
    boxShadow: "0 4px 16px rgba(210, 63, 87, 0.1)",
    "& .category-icon": {
      color: "#D23F57",
    },
    "& .dropdown-icon": {
      color: "#D23F57",
      transform: "rotate(90deg)",
    },
  },
  "& .dropdown-icon": {
    transition: "all 0.3s ease",
  },
}));

// Premium Dropdown Card
const DropdownCard = styled(BazaarCard)(({ theme }) => ({
  marginTop: "16px",
  padding: "8px 0",
  minWidth: "220px",
  borderRadius: "16px",
  boxShadow: "0 16px 48px rgba(0, 0, 0, 0.12)",
  border: theme.palette.mode === 'dark'
    ? "1px solid rgba(255, 255, 255, 0.08)"
    : "1px solid rgba(0, 0, 0, 0.04)",
  animation: `${slideDown} 0.25s ease-out`,
  overflow: "hidden",
}));

// Premium Child Navs Wrapper
const ChildNavsWrapper = styled(Box)(() => ({
  zIndex: 5,
  left: "50%",
  top: "100%",
  display: "none",
  position: "absolute",
  transform: "translate(-50%, 0%)",
}));

// Premium Menu Item
const PremiumMenuItem = styled(MenuItem)(({ theme }) => ({
  padding: "12px 20px",
  fontSize: "15px",
  fontWeight: 500,
  transition: "all 0.2s ease",
  borderRadius: "8px",
  margin: "4px 8px",
  "&:hover": {
    backgroundColor: "rgba(210, 63, 87, 0.08)",
    color: "#D23F57",
  },
}));

// ==========================================================

// ==========================================================
const Navbar = ({ navListOpen, hideCategories, elevation, border, navCategories }) => {
  const { settings } = useSettings();
  const navbarNavigations = navCategories;
  
  const renderNestedNav = (list = [], isRoot = false) => {
    return list.map((nav) => {
      if (isRoot) {
        // show megamenu
        if (nav.megaMenu) {
          return (
            <MegaMenu key={nav.title} title={nav.title} menuList={nav.child} />
          );
        }

        // show megamenu with sub
        if (nav.megaMenuWithSub) {
          return (
            <MegaMenu2 key={nav.title} title={nav.title} menuList={nav.child} />
          );
        }

        if (nav.url) {
          return (
            <StyledNavLink href={nav.url} key={nav.title}>
              {nav.title}
            </StyledNavLink>
          );
        }

        if (nav.child) {
          return (
            <FlexBox
              key={nav.title}
              alignItems="center"
              position="relative"
              flexDirection="column"
              sx={{
                "&:hover": {
                  "& > .child-nav-item": {
                    display: "block",
                  },
                },
              }}
            >
              <FlexBox 
                alignItems="center" 
                gap={0.3} 
                sx={{
                  ...navLinkStyle,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {nav.title}
                <KeyboardArrowDown
                  sx={{
                    color: "grey.500",
                    fontSize: "1.2rem",
                    transition: "transform 0.3s ease",
                    ml: 0.5,
                  }}
                />
              </FlexBox>

              <ChildNavsWrapper className="child-nav-item">
                <DropdownCard elevation={3}>
                  {renderNestedNav(nav.child)}
                </DropdownCard>
              </ChildNavsWrapper>
            </FlexBox>
          );
        }
      } else {
        if (nav.url) {
          return (
            <NavLink href={nav.url} key={nav.title}>
              <PremiumMenuItem>{nav.title}</PremiumMenuItem>
            </NavLink>
          );
        }

        if (nav.child) {
          return (
            <ParentNav position="relative" minWidth="230px" key={nav.title}>
              <PremiumMenuItem>
                <Box flex="1 1 0" component="span">
                  {nav.title}
                </Box>

                {settings.direction === "ltr" ? (
                  <ArrowRight fontSize="small" />
                ) : (
                  <ArrowLeft fontSize="small" />
                )}
              </PremiumMenuItem>

              <ParentNavItem className="parent-nav-item">
                <DropdownCard
                  sx={{
                    minWidth: "230px",
                  }}
                  elevation={3}
                >
                  {renderNestedNav(nav.child)}
                </DropdownCard>
              </ParentNavItem>
            </ParentNav>
          );
        }
      }
    });
  };

  return (
    <NavBarWrapper hoverEffect={false} elevation={elevation} border={border}>
      {!hideCategories ? (
        <InnerContainer>
          {/* Category megamenu */}
          <CategoryMenu open={navListOpen} navCategories={navCategories}>
            <CategoryMenuButton variant="text">
              <Category 
                className="category-icon"
                fontSize="small" 
                sx={{
                  transition: "color 0.3s ease",
                }}
              />
              <Paragraph
                fontWeight="600"
                textAlign="left"
                flex="1 1 0"
                ml={1.5}
                color="text.secondary"
                sx={{
                  fontSize: "15px",
                }}
              >
                Categories
              </Paragraph>

              {settings.direction === "ltr" ? (
                <ChevronRight className="dropdown-icon" fontSize="small" />
              ) : (
                <ChevronLeft className="dropdown-icon" fontSize="small" />
              )}
            </CategoryMenuButton>
          </CategoryMenu>

          {/* Horizontal menu */}
          <FlexBox gap={1}>{renderNestedNav(navbarNavigations, true)}</FlexBox>
        </InnerContainer>
      ) : (
        <InnerContainer
          sx={{
            justifyContent: "center",
          }}
        >
          <FlexBox gap={1}>{renderNestedNav(navbarNavigations, true)}</FlexBox>
        </InnerContainer>
      )}
    </NavBarWrapper>
  );
};

// Set default props data
Navbar.defaultProps = {
  elevation: 2,
  navListOpen: false,
  hideCategories: false,
};

export default Navbar;
