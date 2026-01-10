import { Box, styled } from "@mui/material";
import BazaarImage from "components/BazaarImage";

const CardWrapper = styled(Box)(({ theme }) => ({
  overflow: "hidden",
  position: "relative",
  backgroundColor: 'white',
  height: 80, // set a fixed height for the banner
  width: "100%",
  maxWidth: "100%",

  [theme.breakpoints.down("sm")]: {
    height: 70,
  },
}));

const CardContent = styled(Box)(({ theme }) => ({
  top: 0,
  left: 32,
  zIndex: 1,
  height: "100%",
  display: "flex",
  position: "absolute",
  flexDirection: "column",
  justifyContent: "center",
  backgroundRepeat: "round",

  [theme.breakpoints.down("sm")]: {
    left: 16,
    paddingRight: 16,
  },

  [theme.breakpoints.down("xs")]: {
    left: 12,
    paddingRight: 12,
  },
}));

const BannerCard6 = ({ img, children, ...props }) => {
  return (
    <CardWrapper {...props}>
      <BazaarImage
        alt="category"
        height="100%"
        width="100%"
        src={img}
        style={{ objectFit: "contain" }} // use objectFit: "cover"
      />
      <CardContent>{children}</CardContent>
    </CardWrapper>
  );
};

export default BannerCard6;