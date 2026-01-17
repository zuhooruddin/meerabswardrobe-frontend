import { Box, Button, alpha } from "@mui/material";
import { styled } from "@mui/material/styles";
import Image from "components/BazaarImage";
import { useSession, signIn } from 'next-auth/react';

// Modern social button styling
const SocialButton = styled(Button)(({ theme }) => ({
  width: "100%",
  height: "48px",
  borderRadius: "12px",
  fontSize: "15px",
  fontWeight: 500,
  textTransform: "none",
  fontFamily: "'Inter', 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif",
  border: `1.5px solid ${theme.palette.mode === 'dark' 
    ? alpha(theme.palette.common.white, 0.1)
    : alpha(theme.palette.grey[300], 1)}`,
  backgroundColor: theme.palette.mode === 'dark'
    ? alpha(theme.palette.common.white, 0.05)
    : "#FFFFFF",
  color: theme.palette.text.primary,
  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    backgroundColor: theme.palette.mode === 'dark'
      ? alpha(theme.palette.common.white, 0.08)
      : alpha(theme.palette.grey[50], 1),
    borderColor: theme.palette.mode === 'dark'
      ? alpha(theme.palette.common.white, 0.2)
      : theme.palette.grey[400],
    transform: "translateY(-1px)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
  },
  "&:active": {
    transform: "translateY(0)",
  },
  "&:focus-visible": {
    outline: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
    outlineOffset: "2px",
  },
}));

const SocialButtons = (props) => {
  const { redirect = "/login", redirectText = "Login" } = props;
 
  return (
    <Box>
      <SocialButton
        onClick={() => signIn("google")}
        startIcon={
          <Image 
            src="/assets/images/icons/google-1.svg" 
            alt="Google" 
            width={20}
            height={20}
          />
        }
        sx={{
          mb: 2,
        }}
      >
        Continue with Google
      </SocialButton>
    </Box>
  );
};

export default SocialButtons;
