import { Box, styled, keyframes } from "@mui/material";
import navigations from "data/navigations";
import CategoryMenuItem from "./CategoryMenuItem";
import MegaMenu1 from "./mega-menu/MegaMenu1";
import MegaMenu2 from "./mega-menu/MegaMenu2";
import Dress from "components/icons/Dress";
import api from "utils/api/market-2";

import {server_ip} from "utils/backend_server_ip.jsx"
import useSWR from 'swr';
import axios from 'axios';

// Premium slide down animation
const slideDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
    visibility: hidden;
  }
  to {
    opacity: 1;
    transform: translateY(0);
    visibility: visible;
  }
`;

// Premium Wrapper with better z-index and modern styling
const Wrapper = styled(Box)(({ theme, position, open }) => ({
  zIndex: 9999, // Very high z-index to ensure it's always on top of everything
  borderRadius: "16px",
  padding: "12px 0",
  transformOrigin: "top",
  boxShadow: theme.palette.mode === 'dark'
    ? "0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)"
    : "0 20px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.04)",
  position: "fixed", // Always use fixed when portaled
  transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)",
  backgroundColor: theme.palette.mode === 'dark' 
    ? "#1E293B" 
    : "#FFFFFF",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  minWidth: "420px",
  maxWidth: "450px",
  maxHeight: "80vh",
  overflowY: "auto",
  overflowX: "visible",
  
  // Use opacity and visibility instead of scaleY for better rendering
  opacity: open ? 1 : 0,
  visibility: open ? "visible" : "hidden",
  transform: open ? "translateY(0)" : "translateY(-10px)",
  
  // Animation when opening
  animation: open ? `${slideDown} 0.3s cubic-bezier(0.4, 0, 0.2, 1)` : "none",
  
  // Custom scrollbar
  "&::-webkit-scrollbar": {
    width: "8px",
  },
  "&::-webkit-scrollbar-track": {
    background: theme.palette.mode === 'dark' ? "#1E293B" : "#F1F5F9",
    borderRadius: "10px",
  },
  "&::-webkit-scrollbar-thumb": {
    background: theme.palette.mode === 'dark' ? "#4B5563" : "#CBD5E1",
    borderRadius: "10px",
    "&:hover": {
      background: theme.palette.mode === 'dark' ? "#6B7280" : "#94A3B8",
    },
  },
}));

// Styles for the menu items
const StyledCategoryMenuItem = styled(CategoryMenuItem)(({ theme }) => ({
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark'
      ? "rgba(210, 63, 87, 0.15)"
      : "rgba(210, 63, 87, 0.08)",
    textDecoration: 'none',
  },
  '&:not(:last-child)': {
    marginBottom: theme.spacing(0.5),
  },
}));

const CategoryMenuCard = (props) => {
  const { open, position, navCategories, className, style } = props;
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_BASE;
  const megaMenu = {
    MegaMenu1,
    MegaMenu2,
  };
  
  const fetcher = (url) => axios.get(url).then(response => response.data);
 
  const { data, error, isLoading } = useSWR(
    apiUrl + 'getNavCategories', 
    fetcher, 
    {
      revalidateOnMount: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000, // Cache for 1 minute
    }
  );

  // Use navCategories prop if available, otherwise use fetched data
  const categoriesToDisplay = navCategories || data || [];
  const hasCategories = categoriesToDisplay && categoriesToDisplay.length > 0;
  const shouldShow = open && (hasCategories || isLoading || error);

  // Always render the wrapper, even if empty, so it can be shown/hidden properly
  return (
    <Wrapper 
      open={shouldShow} 
      position={position} 
      className={className}
      sx={style}
      onClick={(e) => {
        // Stop propagation to prevent closing when clicking inside menu
        e.stopPropagation();
      }}
      onMouseDown={(e) => {
        // Prevent default to avoid any focus issues
        e.stopPropagation();
      }}
    >
      {isLoading ? (
        <Box sx={{ p: 2, textAlign: "center", color: "text.secondary" }}>
          Loading categories...
        </Box>
      ) : error ? (
        <Box sx={{ p: 2, textAlign: "center", color: "error.main" }}>
          Failed to load categories
        </Box>
      ) : hasCategories ? categoriesToDisplay.map((item, index) => {
        let MegaMenu = megaMenu[item.menuComponent];
        return (
          <StyledCategoryMenuItem
            key={item.title || item.id || index}
            href={item.href || '#'}
            title={item.title}
            caret={!!(item.menuData?.categories && Object.keys(item.menuData.categories).length > 0)}
          >
            {!!(item.menuData?.categories && Object.keys(item.menuData.categories).length > 0) && MegaMenu ? (
              <MegaMenu data={item.menuData || {}} />
            ) : null}
          </StyledCategoryMenuItem>
        );
      }) : (
        <Box sx={{ p: 2, textAlign: "center", color: "text.secondary" }}>
          No categories available
        </Box>
      )}
    </Wrapper>
  );
};

CategoryMenuCard.defaultProps = {
  position: "absolute",
};

export default CategoryMenuCard;
