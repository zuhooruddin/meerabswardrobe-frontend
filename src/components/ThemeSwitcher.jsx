import React from "react";
import { Box, IconButton, Tooltip, keyframes } from "@mui/material";
import { LightMode, DarkMode } from "@mui/icons-material";
import useSettings from "hooks/useSettings";

// Rotation animation for icon
const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// Twinkle animation for stars
const twinkle = keyframes`
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.3;
    transform: scale(0.8);
  }
`;

// Pulse animation
const pulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(210, 63, 87, 0.4);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(210, 63, 87, 0);
  }
`;

const ThemeSwitcher = ({ iconOnly = false }) => {
  const { settings, toggleTheme } = useSettings();
  const isDark = settings.theme === "dark";

  if (iconOnly) {
    return (
      <Tooltip 
        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"} 
        arrow
        placement="bottom"
      >
        <IconButton
          onClick={toggleTheme}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          sx={{
            width: 48,
            height: 48,
            borderRadius: "14px",
            backgroundColor: isDark 
              ? "rgba(255, 255, 255, 0.05)" 
              : "rgba(241, 245, 249, 0.8)",
            border: isDark
              ? "1px solid rgba(255, 255, 255, 0.1)"
              : "1px solid rgba(0, 0, 0, 0.04)",
            color: isDark ? "#FCD34D" : "#64748B",
            transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              transform: "scale(1.08) rotate(15deg)",
              backgroundColor: isDark 
                ? "rgba(252, 211, 77, 0.15)" 
                : "rgba(210, 63, 87, 0.08)",
              boxShadow: isDark
                ? "0 8px 24px rgba(252, 211, 77, 0.25)"
                : "0 8px 24px rgba(210, 63, 87, 0.2)",
              "& svg": {
                color: isDark ? "#FCD34D" : "#D23F57",
              },
            },
            "& svg": {
              transition: "all 0.35s ease",
            },
          }}
        >
          {isDark ? <LightMode /> : <DarkMode />}
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <Tooltip 
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"} 
      arrow
      placement="bottom"
    >
      <Box
        onClick={toggleTheme}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleTheme();
          }
        }}
        sx={{
          position: "relative",
          width: 76,
          height: 40,
          borderRadius: "20px",
          background: isDark 
            ? "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)" 
            : "linear-gradient(135deg, #3B82F6 0%, #60A5FA 50%, #93C5FD 100%)",
          cursor: "pointer",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: isDark 
            ? "inset 0 2px 12px rgba(0, 0, 0, 0.5), 0 4px 16px rgba(0, 0, 0, 0.3)" 
            : "inset 0 2px 12px rgba(59, 130, 246, 0.3), 0 4px 16px rgba(59, 130, 246, 0.25)",
          border: isDark 
            ? "2px solid rgba(255, 255, 255, 0.1)" 
            : "2px solid rgba(255, 255, 255, 0.5)",
          display: "flex",
          alignItems: "center",
          padding: "4px",
          overflow: "hidden",
          "&:hover": {
            transform: "scale(1.05)",
            boxShadow: isDark 
              ? "inset 0 2px 12px rgba(0, 0, 0, 0.6), 0 8px 24px rgba(0, 0, 0, 0.4)" 
              : "inset 0 2px 12px rgba(59, 130, 246, 0.4), 0 8px 24px rgba(59, 130, 246, 0.35)",
            "& .toggle-thumb": {
              boxShadow: isDark 
                ? "0 4px 16px rgba(252, 211, 77, 0.4), 0 0 20px rgba(252, 211, 77, 0.2)" 
                : "0 4px 16px rgba(251, 191, 36, 0.5), 0 0 20px rgba(251, 191, 36, 0.3)",
            },
          },
          "&:focus-visible": {
            outline: "3px solid #D23F57",
            outlineOffset: "4px",
          },
        }}
      >
        {/* Toggle Circle/Thumb */}
        <Box
          className="toggle-thumb"
          sx={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: isDark 
              ? "linear-gradient(135deg, #FCD34D 0%, #FBBF24 50%, #F59E0B 100%)" 
              : "linear-gradient(135deg, #FFFFFF 0%, #FEF3C7 50%, #FDE68A 100%)",
            position: "absolute",
            left: isDark ? "calc(100% - 34px)" : "6px",
            top: "4px",
            transition: "all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
            boxShadow: isDark 
              ? "0 2px 12px rgba(252, 211, 77, 0.5), inset 0 -2px 4px rgba(245, 158, 11, 0.3)" 
              : "0 2px 12px rgba(251, 191, 36, 0.4), inset 0 -2px 4px rgba(251, 191, 36, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2,
          }}
        >
          {isDark ? (
            <DarkMode sx={{ fontSize: 16, color: "#78350F" }} />
          ) : (
            <LightMode sx={{ fontSize: 16, color: "#F59E0B" }} />
          )}
        </Box>

        {/* Decorative Stars for Dark Mode */}
        {isDark && (
          <>
            <Box
              sx={{
                position: "absolute",
                left: "10px",
                top: "8px",
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                background: "white",
                boxShadow: "0 0 6px 2px rgba(255, 255, 255, 0.6)",
                animation: `${twinkle} 2s infinite ease-in-out`,
              }}
            />
            <Box
              sx={{
                position: "absolute",
                left: "16px",
                top: "20px",
                width: "3px",
                height: "3px",
                borderRadius: "50%",
                background: "white",
                boxShadow: "0 0 4px 1px rgba(255, 255, 255, 0.5)",
                animation: `${twinkle} 2.5s infinite ease-in-out`,
                animationDelay: "0.5s",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                left: "24px",
                top: "12px",
                width: "2px",
                height: "2px",
                borderRadius: "50%",
                background: "white",
                boxShadow: "0 0 3px 1px rgba(255, 255, 255, 0.4)",
                animation: `${twinkle} 3s infinite ease-in-out`,
                animationDelay: "1s",
              }}
            />
          </>
        )}

        {/* Decorative Clouds for Light Mode */}
        {!isDark && (
          <>
            <Box
              sx={{
                position: "absolute",
                right: "10px",
                top: "8px",
                width: "12px",
                height: "4px",
                borderRadius: "4px",
                background: "rgba(255, 255, 255, 0.8)",
                boxShadow: "6px 2px 0 rgba(255, 255, 255, 0.6)",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                right: "8px",
                bottom: "10px",
                width: "8px",
                height: "3px",
                borderRadius: "3px",
                background: "rgba(255, 255, 255, 0.6)",
              }}
            />
          </>
        )}
      </Box>
    </Tooltip>
  );
};

export default ThemeSwitcher;
