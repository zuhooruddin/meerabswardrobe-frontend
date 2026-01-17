import { Card, Box, CircularProgress, Divider } from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import BazaarButton from "components/BazaarButton";
import BazaarTextField from "components/BazaarTextField";
import { H3, H4, Small } from "components/Typography";
import { useFormik } from "formik";
import React, { useCallback, useState, useEffect } from "react";
import * as yup from "yup";
import EyeToggleButton from "./EyeToggleButton";
import SocialButtons from "./SocialButtons";
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Alert from '@mui/material/Alert';
import { toast } from 'react-toastify';
import useSWR from 'swr'
import axios from 'axios';




const fbStyle = {
  background: "#3B5998",
  color: "white",
};
const googleStyle = {
  background: "#4285F4",
  color: "white",
};
// Premium fade-in animation
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const Wrapper = styled(({ children, passwordVisibility, ...rest }) => (
  <Card {...rest}>{children}</Card>
))(({ theme, passwordVisibility }) => ({
  width: 560,
  padding: "3rem 3.5rem",
  borderRadius: "24px",
  background: theme.palette.mode === 'dark' 
    ? "rgba(15, 23, 42, 0.95)" 
    : "rgba(255, 255, 255, 0.98)",
  backdropFilter: "blur(24px) saturate(180%)",
  WebkitBackdropFilter: "blur(24px) saturate(180%)",
  boxShadow: theme.palette.mode === 'dark'
    ? "0 20px 60px rgba(0, 0, 0, 0.5)"
    : "0 20px 60px rgba(0, 0, 0, 0.1)",
  border: theme.palette.mode === 'dark'
    ? "1px solid rgba(255, 255, 255, 0.1)"
    : "1px solid rgba(0, 0, 0, 0.05)",
  animation: `${fadeIn} 0.4s ease-out`,
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "4px",
    background: "linear-gradient(90deg, #D23F57 0%, #E94560 50%, #D23F57 100%)",
    backgroundSize: "200% 100%",
  },
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    padding: "2rem 2.5rem",
    borderRadius: "16px",
  },
  ".passwordEye": {
    color: passwordVisibility
      ? theme.palette.grey[600]
      : theme.palette.grey[400],
  },
  ".facebookButton": {
    marginBottom: 10,
    ...fbStyle,
    "&:hover": fbStyle,
  },
  ".googleButton": { ...googleStyle, "&:hover": googleStyle },
  ".agreement": {
    marginTop: 12,
    marginBottom: 24,
  },
}));

const Login = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const fetcher = async (url) => await axios.get(url).then((res) => res.data);
  const server_ip = process.env.NEXT_PUBLIC_BACKEND_API_BASE;
  const { data, error } = useSWR(server_ip + 'getGeneralSetting', fetcher);

  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const togglePasswordVisibility = useCallback(() => {
    setPasswordVisibility((visible) => !visible);
  }, []);

  const handleFormSubmit = async (values) => {
    setIsLoading(true);
    setLoginError('');
    
    try {
      const result = await signIn("credentials", {
      username: values.email,
      password: values.password,
        role: 3,
        callbackUrl: `${window.location.origin}/`,
      redirect: false,
      });

      if (result?.error !== null) {
        if (result?.status === 401) {
          setLoginError(
            <Alert 
              variant="filled" 
              severity="error"
              sx={{
                borderRadius: "12px",
                mb: 2,
                "& .MuiAlert-message": {
                  fontWeight: 500,
                },
              }}
            >
              Invalid credentials. Please check your email and password and try again.
            </Alert>
          );
          toast.error("Invalid credentials. Please try again.", {
            position: toast.POSITION.TOP_RIGHT,
          });
        } else {
              setLoginError(
            <Alert 
              variant="filled" 
              severity="error"
              sx={{
                borderRadius: "12px",
                mb: 2,
                "& .MuiAlert-message": {
                  fontWeight: 500,
                },
              }}
            >
              Login failed. Please try again.
            </Alert>
          );
          toast.error("Login failed. Please try again.", {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      } else {
        toast.success("Login successful! Welcome back.", {
          position: toast.POSITION.TOP_RIGHT,
        });
        if (result?.url) {
          router.push(result.url);
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError(
        <Alert 
          variant="filled" 
          severity="error"
          sx={{
            borderRadius: "12px",
            mb: 2,
            "& .MuiAlert-message": {
              fontWeight: 500,
            },
          }}
        >
          An error occurred. Please try again later.
        </Alert>
      );
      toast.error("An error occurred. Please try again.", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues,
      onSubmit: handleFormSubmit,
      validationSchema: formSchema,
    });

  const title = process.env.NEXT_PUBLIC_COMPANY_TITLE;
  const siteName = data && data.length > 0 ? data[0].site_name : 'Site';

  if (session) {
    router.push('/profile');
    return null;
    }
   
  return (
    <Wrapper elevation={3} passwordVisibility={passwordVisibility}>
      <form onSubmit={handleSubmit}>
        {/* Error Alert */}
        {loginError && (
          <Box 
            sx={{ 
              mb: 3, 
              animation: "fadeIn 0.3s ease-out",
              "@keyframes fadeIn": {
                from: {
                  opacity: 0,
                  transform: "translateY(20px)",
                },
                to: {
                  opacity: 1,
                  transform: "translateY(0)",
                },
              },
            }}
          >
        {loginError}
          </Box>
        )}

        {/* Header Section */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <H3
            sx={{
              fontWeight: 800,
              fontSize: { xs: "24px", sm: "28px" },
              mb: 1,
              background: "linear-gradient(135deg, #D23F57 0%, #E94560 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.02em",
            }}
          >
            Welcome Back
        </H3>
          <H4
            sx={{
              fontWeight: 600,
              fontSize: "16px",
              color: "text.secondary",
              mb: 0.5,
            }}
          >
            {siteName}
          </H4>
        <Small
          display="block"
            fontSize="14px"
            fontWeight="500"
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            Sign in to continue shopping
        </Small>
        </Box>

        {/* Email Field */}
        <BazaarTextField
          mb={2}
          fullWidth
          name="email"
          size="medium"
          type="email"
          variant="outlined"
          onBlur={handleBlur}
          value={values.email}
          onChange={handleChange}
          label="Email Address"
          placeholder="your.email@example.com"
          error={!!touched.email && !!errors.email}
          helperText={touched.email && errors.email}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              transition: "all 0.3s ease",
              "&:hover": {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "primary.main",
                },
              },
              "&.Mui-focused": {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderWidth: "2px",
                },
              },
            },
          }}
        />

        {/* Password Field */}
        <BazaarTextField
          mb={3}
          fullWidth
          size="medium"
          name="password"
          label="Password"
          autoComplete="current-password"
          variant="outlined"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.password}
          placeholder="Enter your password"
          type={passwordVisibility ? "text" : "password"}
          error={!!touched.password && !!errors.password}
          helperText={touched.password && errors.password}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              transition: "all 0.3s ease",
              "&:hover": {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "primary.main",
                },
              },
              "&.Mui-focused": {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderWidth: "2px",
                },
              },
            },
          }}
          InputProps={{
            endAdornment: (
              <EyeToggleButton
                show={passwordVisibility}
                click={togglePasswordVisibility}
              />
            ),
          }}
        />

        {/* Login Button */}
        <BazaarButton
          fullWidth
          type="submit"
          color="primary"
          variant="contained"
          disabled={isLoading}
          sx={{
            mb: 2.5,
            height: 48,
            borderRadius: "12px",
            fontSize: "16px",
            fontWeight: 700,
            textTransform: "none",
            background: "linear-gradient(135deg, #D23F57 0%, #E94560 100%)",
            boxShadow: "0 4px 14px rgba(210, 63, 87, 0.4)",
            transition: "all 0.3s ease",
            "&:hover": {
              background: "linear-gradient(135deg, #B8324F 0%, #D23F57 100%)",
              boxShadow: "0 6px 20px rgba(210, 63, 87, 0.5)",
              transform: "translateY(-2px)",
            },
            "&:disabled": {
              background: "rgba(0, 0, 0, 0.12)",
              boxShadow: "none",
            },
          }}
        >
          {isLoading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={20} sx={{ color: 'white' }} />
              <span>Signing in...</span>
            </Box>
          ) : (
            "Sign In"
          )}
        </BazaarButton>

        <Divider sx={{ my: 3 }}>
          <Small color="text.secondary" fontWeight={500}>
            OR
          </Small>
        </Divider>

      </form>
      
      {/* Social Login Section */}
      <SocialButtons redirect="/signup" redirectText="Sign Up" />
    </Wrapper>
  );
};

const initialValues = {
  email: "",
  password: "",
};
const formSchema = yup.object().shape({
  password: yup.string().required("Password is required"),
  email: yup.string(  ).email("invalid email").required("Email is required"),
});
export default Login;















  