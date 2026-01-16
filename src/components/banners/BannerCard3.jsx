import { Box, styled } from "@mui/material";
import BazaarImage from "components/BazaarImage";
// custom styled components
const CardWrapper = styled(Box)(() => ({
  overflow: "hidden",
  position: "relative",
}));
const CardContent = styled(Box)(() => ({
  top: 0,
  left: 32,
  zIndex: 1,
  height: "100%",
  display: "flex",
  position: "absolute",
  flexDirection: "column",
  justifyContent: "center",
  
  backgroundRepeat: "round",
  color: "#fff",
  textShadow: "0 2px 8px rgba(0, 0, 0, 0.5), 0 1px 3px rgba(0, 0, 0, 0.7)",
  "& *": {
    textShadow: "inherit",
  },
})); // ========================================================

// ========================================================
const BannerCard3 = ({ img, children, priority = false, ...props }) => {
  return (
    <CardWrapper {...props}>
      <BazaarImage 
        alt="category banner" 
        height={400} 
        width={600} 
        src={img}
        priority={priority}
        quality={85}
        objectFit="cover"
        style={{ width: '100%', height: '100%' }}
        sizes="(max-width: 600px) 100vw, (max-width: 960px) 50vw, 33vw"
      />


      <CardContent>{children}</CardContent>
    </CardWrapper>
  );
};

export default BannerCard3;


