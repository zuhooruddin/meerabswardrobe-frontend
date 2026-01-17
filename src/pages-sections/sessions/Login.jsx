import { Card, Box, CircularProgress, Divider, TextField, Link as MuiLink, Typography } from "@mui/material";
import { styled, keyframes, alpha } from "@mui/material/styles";
import BazaarButton from "components/BazaarButton";
import { H3, H4, Small } from "components/Typography";
import { useFormik } from "formik";
import React, { useCallback, useState, useEffect } from "react";
import * as yup from "yup";
import EyeToggleButton from "./EyeToggleButton";
import SocialButtons from "./SocialButtons";
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import Alert from '@mui/material/Alert';
import { toast } from 'react-toastify';
import useSWR from 'swr'
import axios from 'axios';
import Link from 'next/link';

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

// Modern, clean wrapper
export const Wrapper = styled(Card)(({ theme }) => ({
  width: "100%",
  maxWidth: "480px",
  padding: "3rem",
  borderRadius: "20px",
  background: theme.palette.mode === 'dark' 
    ? theme.palette.background.paper
    : "#FFFFFF",
  boxShadow: theme.palette.mode === 'dark'
    ? "0 24px 48px rgba(0, 0, 0, 0.4)"
    : "0 8px 32px rgba(0, 0, 0, 0.08)",
  border: "none",
  animation: `${fadeIn} 0.4s cubic-bezier(0.4, 0, 0.2, 1)`,
  position: "relative",
  overflow: "hidden",
  [theme.breakpoints.down("sm")]: {
    padding: "2rem 1.5rem",
    borderRadius: "16px",
    maxWidth: "100%",
  },
}));

// Elegant input field styling
const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    backgroundColor: theme.palette.mode === 'dark' 
      ? alpha(theme.palette.common.white, 0.05)
      : alpha(theme.palette.grey[50], 1),
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    fontFamily: "'Inter', 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif",
    fontSize: "15px",
    "& fieldset": {
      borderColor: theme.palette.mode === 'dark'
        ? alpha(theme.palette.common.white, 0.1)
        : alpha(theme.palette.grey[300], 1),
      borderWidth: "1.5px",
      transition: "all 0.2s ease",
    },
    "&:hover": {
      backgroundColor: theme.palette.mode === 'dark'
        ? alpha(theme.palette.common.white, 0.08)
        : alpha(theme.palette.grey[50], 1),
      "& fieldset": {
        borderColor: theme.palette.mode === 'dark'
          ? alpha(theme.palette.common.white, 0.2)
          : theme.palette.primary.main,
      },
    },
    "&.Mui-focused": {
      backgroundColor: theme.palette.mode === 'dark'
        ? alpha(theme.palette.common.white, 0.08)
        : "#FFFFFF",
      "& fieldset": {
        borderColor: theme.palette.primary.main,
        borderWidth: "2px",
        boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`,
      },
    },
    "&.Mui-error": {
      "& fieldset": {
        borderColor: theme.palette.error.main,
      },
    },
  },
  "& .MuiInputLabel-root": {
    fontFamily: "'Inter', 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif",
    fontSize: "14px",
    fontWeight: 500,
    color: theme.palette.text.secondary,
    "&.Mui-focused": {
      color: theme.palette.primary.main,
    },
  },
  "& .MuiFormHelperText-root": {
    fontFamily: "'Inter', 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif",
    fontSize: "12px",
    marginTop: "6px",
  },
}));

// Premium login button
const LoginButton = styled(BazaarButton)(({ theme, disabled }) => ({
  width: "100%",
  height: "52px",
  borderRadius: "12px",
  fontSize: "16px",
  fontWeight: 600,
  letterSpacing: "0.01em",
  textTransform: "none",
  fontFamily: "'Inter', 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif",
  background: disabled
    ? theme.palette.action.disabledBackground
    : "linear-gradient(135deg, #D23F57 0%, #E94560 100%)",
  color: "#FFFFFF",
  boxShadow: disabled
    ? "none"
    : "0 4px 16px rgba(210, 63, 87, 0.35)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    background: disabled
      ? theme.palette.action.disabledBackground
      : "linear-gradient(135deg, #B8324F 0%, #D23F57 100%)",
    boxShadow: disabled
      ? "none"
      : "0 6px 24px rgba(210, 63, 87, 0.45)",
    transform: disabled ? "none" : "translateY(-1px)",
  },
  "&:active": {
    transform: disabled ? "none" : "translateY(0)",
    boxShadow: disabled
      ? "none"
      : "0 2px 8px rgba(210, 63, 87, 0.3)",
  },
  "&:focus-visible": {
    outline: `3px solid ${alpha(theme.palette.primary.main, 0.3)}`,
    outlineOffset: "2px",
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
    <Wrapper elevation={0}>
      <form onSubmit={handleSubmit} noValidate>
        {/* Header Section - Clear Visual Hierarchy */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "26px", sm: "32px" },
              mb: 1,
              color: "text.primary",
              fontFamily: "'Inter', 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif",
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
            }}
          >
            Welcome Back
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: "15px",
              color: "text.secondary",
              fontWeight: 400,
              fontFamily: "'Inter', 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif",
              mt: 0.5,
            }}
          >
            Sign in to your account to continue
          </Typography>
        </Box>

        {/* Error Alert - Subtle and Clean */}
        {loginError && (
          <Box sx={{ mb: 3 }}>
            {loginError}
          </Box>
        )}

        {/* Form Fields - Elegant Inputs */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, mb: 3 }}>
          <StyledTextField
            fullWidth
            name="email"
            type="email"
            label="Email Address"
            placeholder="Enter your email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!touched.email && !!errors.email}
            helperText={touched.email && errors.email}
            autoComplete="email"
            autoFocus
          />

          <StyledTextField
            fullWidth
            name="password"
            type={passwordVisibility ? "text" : "password"}
            label="Password"
            placeholder="Enter your password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!touched.password && !!errors.password}
            helperText={touched.password && errors.password}
            autoComplete="current-password"
            InputProps={{
              endAdornment: (
                <EyeToggleButton
                  show={passwordVisibility}
                  click={togglePasswordVisibility}
                />
              ),
            }}
          />
        </Box>

        {/* Forgot Password Link - Subtle Secondary Action */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
          <Link href="/forgot-password" passHref>
            <MuiLink
              sx={{
                fontSize: "14px",
                fontWeight: 500,
                color: "text.secondary",
                textDecoration: "none",
                fontFamily: "'Inter', 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif",
                "&:hover": {
                  color: "primary.main",
                  textDecoration: "underline",
                },
                "&:focus-visible": {
                  outline: `2px solid`,
                  outlineColor: "primary.main",
                  outlineOffset: "2px",
                  borderRadius: "4px",
                },
              }}
            >
              Forgot password?
            </MuiLink>
          </Link>
        </Box>

        {/* Primary CTA - Standout Login Button */}
        <LoginButton
          type="submit"
          disabled={isLoading}
          fullWidth
        >
          {isLoading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <CircularProgress size={20} sx={{ color: 'white' }} />
              <span>Signing in...</span>
            </Box>
          ) : (
            "Sign In"
          )}
        </LoginButton>

        {/* Divider with OR */}
        <Box sx={{ my: 3.5, position: "relative" }}>
          <Divider sx={{ borderColor: (theme) => alpha(theme.palette.divider, 0.5) }} />
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              px: 2,
              backgroundColor: "background.paper",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontSize: "13px",
                color: "text.secondary",
                fontWeight: 500,
                fontFamily: "'Inter', 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif",
              }}
            >
              OR
            </Typography>
          </Box>
        </Box>

        {/* Social Login - Clean Integration */}
        <SocialButtons redirect="/signup" redirectText="Sign Up" />

        {/* Sign Up Link - Subtle Secondary Action */}
        <Box
          sx={{
            mt: 3,
            textAlign: "center",
            pt: 2.5,
            borderTop: (theme) => `1px solid ${alpha(theme.palette.divider, 0.5)}`,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontSize: "14px",
              color: "text.secondary",
              fontFamily: "'Inter', 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif",
            }}
          >
            Don&apos;t have an account?{" "}
            <Link href="/signup" passHref>
              <MuiLink
                sx={{
                  fontWeight: 600,
                  color: "primary.main",
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                  "&:focus-visible": {
                    outline: `2px solid`,
                    outlineColor: "primary.main",
                    outlineOffset: "2px",
                    borderRadius: "4px",
                  },
                }}
              >
                Sign Up
              </MuiLink>
            </Link>
          </Typography>
        </Box>
      </form>
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















  