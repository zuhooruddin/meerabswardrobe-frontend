import { Card } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";

// Premium Card Component with Modern Styling
const BazaarCard = styled(({ hoverEffect, children, ...rest }) => (
  <Card {...rest}>{children}</Card>
))(({ theme, hoverEffect }) => ({
  borderRadius: "16px",
  overflow: "hidden",
  transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
  backgroundColor: theme.palette.mode === 'dark' 
    ? "#1E293B" 
    : "#FFFFFF",
  border: theme.palette.mode === 'dark'
    ? "1px solid rgba(255, 255, 255, 0.08)"
    : "1px solid rgba(0, 0, 0, 0.04)",
  boxShadow: theme.palette.mode === 'dark'
    ? "0 4px 20px rgba(0, 0, 0, 0.3)"
    : "0 4px 20px rgba(0, 0, 0, 0.05)",
  position: "relative",
  
  // Premium gradient border effect on hover
  "&::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    borderRadius: "inherit",
    padding: "1px",
    background: "linear-gradient(135deg, rgba(210, 63, 87, 0.3) 0%, rgba(233, 69, 96, 0.1) 50%, transparent 100%)",
    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
    WebkitMaskComposite: "xor",
    maskComposite: "exclude",
    opacity: 0,
    transition: "opacity 0.35s ease",
    pointerEvents: "none",
  },
  
  "&:hover": {
    ...(hoverEffect && {
      transform: "translateY(-6px)",
      boxShadow: theme.palette.mode === 'dark'
        ? "0 16px 48px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(210, 63, 87, 0.2)"
        : "0 16px 48px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(210, 63, 87, 0.1)",
      "&::before": {
        opacity: 1,
      },
    }),
  },
}));

BazaarCard.defaultProps = {
  hoverEffect: false,
};

export default BazaarCard;
