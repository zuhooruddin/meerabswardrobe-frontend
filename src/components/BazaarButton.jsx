import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";

// Premium styled button with enhanced interactions
const BazaarButton = styled(Button)(({ theme }) => ({
  minWidth: 0,
  minHeight: 0,
  fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif",
  fontWeight: 600,
  textTransform: "none",
  borderRadius: "12px",
  transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
  position: "relative",
  overflow: "hidden",
  
  // Shimmer effect on hover
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "-100%",
    width: "100%",
    height: "100%",
    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
    transition: "left 0.5s ease",
  },
  
  "&:hover::before": {
    left: "100%",
  },
  
  // Contained variant styles
  "&.MuiButton-contained": {
    boxShadow: "0 4px 14px rgba(0, 0, 0, 0.1)",
    
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
    },
    
    "&:active": {
      transform: "translateY(0)",
    },
  },
  
  // Primary contained
  "&.MuiButton-containedPrimary": {
    background: "linear-gradient(135deg, #D23F57 0%, #E94560 100%)",
    boxShadow: "0 4px 16px rgba(210, 63, 87, 0.3)",
    
    "&:hover": {
      background: "linear-gradient(135deg, #B72C42 0%, #D23F57 100%)",
      boxShadow: "0 8px 28px rgba(210, 63, 87, 0.4)",
    },
  },
  
  // Outlined variant styles
  "&.MuiButton-outlined": {
    borderWidth: "2px",
    
    "&:hover": {
      borderWidth: "2px",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
    },
  },
  
  // Primary outlined
  "&.MuiButton-outlinedPrimary": {
    borderColor: "#D23F57",
    color: "#D23F57",
    
    "&:hover": {
      background: "linear-gradient(135deg, #D23F57 0%, #E94560 100%)",
      borderColor: "transparent",
      color: "white",
      boxShadow: "0 8px 24px rgba(210, 63, 87, 0.35)",
    },
  },
  
  // Text variant styles
  "&.MuiButton-text": {
    "&:hover": {
      backgroundColor: "rgba(210, 63, 87, 0.08)",
    },
  },
  
  // Size variants
  "&.MuiButton-sizeLarge": {
    padding: "14px 32px",
    fontSize: "1rem",
  },
  
  "&.MuiButton-sizeMedium": {
    padding: "10px 24px",
    fontSize: "0.9375rem",
  },
  
  "&.MuiButton-sizeSmall": {
    padding: "6px 16px",
    fontSize: "0.8125rem",
    borderRadius: "10px",
  },
  
  // Disabled state
  "&.Mui-disabled": {
    opacity: 0.6,
    cursor: "not-allowed",
    pointerEvents: "auto",
  },
}));

export default BazaarButton;
