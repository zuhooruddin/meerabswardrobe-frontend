import { Badge } from "@mui/material";
import { LightMode, DarkMode } from "@mui/icons-material";
import CategoryOutlined from "components/icons/CategoryOutline";
import Home from "components/icons/Home";
import ShoppingBagOutlined from "components/icons/ShoppingBagOutlined";
import User2 from "components/icons/User2";
import { useAppContext } from "contexts/AppContext";
import useSettings from "hooks/useSettings";
import useWindowSize from "hooks/useWindowSize";
import { iconStyle, StyledBox, StyledNavLink, Wrapper } from "./styles";

const MobileNavigationBar = () => {
  const width = useWindowSize();
  const { state } = useAppContext();
  const { settings, toggleTheme } = useSettings();
  const isDark = settings.theme === "dark";
  
  return width <= 900 ? (
    <Wrapper>
      {list.map((item) => (
        <StyledNavLink href={item.href} key={item.title}>
          {item.title === "Cart" ? (
            <Badge badgeContent={state.cart.length} color="primary">
              <item.icon fontSize="small" sx={iconStyle} />
            </Badge>
          ) : (
            <item.icon sx={iconStyle} fontSize="small" />
          )}

          {item.title}
        </StyledNavLink>
      ))}
      
      {/* Theme Toggle */}
      <StyledBox onClick={toggleTheme}>
        {isDark ? (
          <LightMode fontSize="small" sx={iconStyle} />
        ) : (
          <DarkMode fontSize="small" sx={iconStyle} />
        )}
        Theme
      </StyledBox>
    </Wrapper>
  ) : null;
};

const list = [
  {
    title: "Home",
    icon: Home,
    href: "/",
  },
  {
    title: "Category",
    icon: CategoryOutlined,
    href: "/mobile-category-nav",
  },
  {
    title: "Cart",
    icon: ShoppingBagOutlined,
    href: "/cart",
  },
  {
    title: "Account",
    icon: User2,
    href: "/profile",
  },
];
export default MobileNavigationBar;
