import { Box, styled } from "@mui/material";
import BazaarImage from "components/BazaarImage";

const CardWrapper = styled(Box)(() => ({
  overflow: "hidden",
  position: "relative",
    backgroundColor:'white',
  height: 200, // set a fixed height for the banner

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
}));

const BannerCard4 = ({ img, children, ...props }) => {
  return (
    <CardWrapper {...props}>
      <BazaarImage
        alt="category"
        height="100%"
        width="100%"
        src={img}
        objectFit="cover"
      />
      <CardContent>{children}</CardContent>
    </CardWrapper>
  );
};

export default BannerCard4;