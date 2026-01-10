import { blue, dark, grey, primary } from "./themeColors";
import { fontFamily, fontSize, displayFontFamily } from "./typography";

// =========================================================
// Premium MUI Component Styles for Modern E-commerce
// =========================================================
export const components = {
  MuiCssBaseline: {
    styleOverrides: {
      html: {
        scrollBehavior: "smooth",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      },
      body: {
        fontFamily,
        fontSize,
        lineHeight: 1.7,
      },
      // Prevent layout shifts from font loading
      "@font-face": {
        fontDisplay: "swap",
      },
      // Reserve space for text to prevent CLS
      "h1, h2, h3, h4, h5, h6": {
        fontDisplay: "swap",
      },
      p: {
        lineHeight: 1.8,
      },
      button: {
        fontFamily,
        fontSize,
      },
      ".MuiRating-sizeSmall": {
        fontSize: "20px",
      },
      a: {
        textDecoration: "none",
        color: "inherit",
      },
      ul: {
        margin: 0,
        padding: 0,
        listStyle: "none",
      },
      "#nprogress .bar": {
        top: 0,
        left: 0,
        position: "fixed",
        overflow: "hidden",
        height: "4px !important",
        background: "linear-gradient(135deg, #D23F57 0%, #E94560 50%, #FF6B7A 100%)",
        zIndex: "99999999 !important",
        borderRadius: "0px 300px 300px 0px !important",
        boxShadow: "0 0 20px rgba(210, 63, 87, 0.6), 0 0 8px rgba(210, 63, 87, 0.4)",
      },
      "#nprogress .peg": {
        boxShadow: "0 0 20px rgba(210, 63, 87, 0.6), 0 0 8px rgba(210, 63, 87, 0.5)",
      },
    },
  },
  
  MuiInputLabel: {
    styleOverrides: {
      root: {
        zIndex: 0,
        fontWeight: 500,
        "&.Mui-focused": {
          color: primary.main,
        },
      },
    },
  },
  
  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: 20,
        boxShadow: "0 24px 80px rgba(0, 0, 0, 0.2)",
        overflow: "hidden",
      },
    },
  },
  
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: "16px",
        transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: "0 4px 24px rgba(0, 0, 0, 0.06)",
        border: "1px solid rgba(0, 0, 0, 0.04)",
        overflow: "hidden",
        "&:hover": {
          boxShadow: "0 16px 48px rgba(0, 0, 0, 0.12)",
          transform: "translateY(-4px)",
        },
      },
    },
  },
  
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: "none",
      },
      rounded: {
        borderRadius: "16px",
      },
      elevation1: {
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)",
      },
      elevation2: {
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -1px rgba(0, 0, 0, 0.04)",
      },
      elevation3: {
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)",
      },
      elevation4: {
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.02)",
      },
    },
  },
  
  MuiPagination: {
    defaultProps: {
      variant: "outlined",
      color: "primary",
      shape: "rounded",
    },
    styleOverrides: {
      root: {
        "& .MuiPaginationItem-root": {
          borderRadius: "12px",
          fontWeight: 600,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-2px)",
          },
          "&.Mui-selected": {
            background: "linear-gradient(135deg, #D23F57 0%, #E94560 100%)",
            color: "white",
            boxShadow: "0 4px 12px rgba(210, 63, 87, 0.35)",
            "&:hover": {
              background: "linear-gradient(135deg, #B72C42 0%, #D23F57 100%)",
            },
          },
        },
      },
    },
  },
  
  MuiMenuItem: {
    styleOverrides: {
      root: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 16,
        paddingRight: 16,
        borderRadius: 8,
        margin: "4px 8px",
        transition: "all 0.2s ease",
        "&:hover": {
          backgroundColor: "rgba(210, 63, 87, 0.08)",
        },
        "&.Mui-selected": {
          backgroundColor: "rgba(210, 63, 87, 0.12)",
          "&:hover": {
            backgroundColor: "rgba(210, 63, 87, 0.16)",
          },
        },
      },
    },
  },
  
  MuiMenu: {
    styleOverrides: {
      paper: {
        borderRadius: 16,
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.12)",
        border: "1px solid rgba(0, 0, 0, 0.04)",
        marginTop: 8,
      },
      list: {
        padding: "8px 0",
      },
    },
  },
  
  MuiSvgIcon: {
    styleOverrides: {
      root: {
        "& .secondary": {
          opacity: 0.4,
        },
      },
    },
  },
  
  MuiTextField: {
    defaultProps: {
      size: "small",
      variant: "outlined",
    },
    styleOverrides: {
      root: ({ ownerState }) => ({
        "& .MuiOutlinedInput-root": {
          borderRadius: "12px",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: grey[400],
          },
          "&.Mui-focused": {
            boxShadow: "0 0 0 4px rgba(210, 63, 87, 0.1)",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: primary.main,
              borderWidth: 2,
            },
          },
        },
        ...(ownerState.color === "info" && {
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            fontWeight: 500,
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: grey[300],
          },
        }),
      }),
    },
  },
  
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius: "12px",
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: grey[200],
          transition: "border-color 0.2s ease",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: grey[400],
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: primary.main,
        },
      },
      input: {
        padding: "14px 16px",
      },
    },
  },
  
  MuiSelect: {
    styleOverrides: {
      select: {
        borderRadius: "12px",
      },
    },
  },
  
  MuiButton: {
    styleOverrides: {
      root: ({ ownerState }) => ({
        minWidth: 0,
        minHeight: 0,
        fontFamily,
        fontWeight: 600,
        textTransform: "none",
        letterSpacing: "0.02em",
        borderRadius: "12px",
        padding: "12px 28px",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: "none",
        position: "relative",
        overflow: "hidden",
        
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: "-100%",
          width: "100%",
          height: "100%",
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
          transition: "left 0.5s ease",
        },
        
        "&:hover::before": {
          left: "100%",
        },
        
        ...(ownerState.variant === "contained" && {
          boxShadow: "0 4px 14px rgba(0, 0, 0, 0.1)",
          "&:hover": {
            transform: "translateY(-3px)",
            boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
          },
          "&:active": {
            transform: "translateY(-1px)",
          },
        }),
        
        ...(ownerState.variant === "contained" && ownerState.color === "primary" && {
          background: "linear-gradient(135deg, #D23F57 0%, #E94560 100%)",
          boxShadow: "0 4px 16px rgba(210, 63, 87, 0.3)",
          "&:hover": {
            background: "linear-gradient(135deg, #B72C42 0%, #D23F57 100%)",
            boxShadow: "0 8px 28px rgba(210, 63, 87, 0.4)",
            transform: "translateY(-3px)",
          },
        }),
        
        ...(ownerState.variant === "outlined" && {
          borderWidth: 2,
          "&:hover": {
            borderWidth: 2,
            transform: "translateY(-2px)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
          },
        }),
        
        ...(ownerState.color === "info" && {
          borderRadius: "12px",
        }),
        
        ...(ownerState.color === "dark" && {
          color: "#fff",
          backgroundColor: "#1E293B",
          borderRadius: "12px",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            backgroundColor: "#334155",
            transform: "translateY(-3px)",
            boxShadow: "0 8px 24px rgba(30, 41, 59, 0.3)",
          },
        }),
        
        ...(ownerState.color === "dark" && ownerState.variant === "outlined" && {
          color: dark.main,
          backgroundColor: "transparent",
          borderColor: dark.main,
          borderRadius: "12px",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            backgroundColor: dark.main,
            color: "white",
            transform: "translateY(-2px)",
            boxShadow: "0 4px 16px rgba(30, 41, 59, 0.25)",
          },
        }),
      }),
      
      sizeLarge: {
        padding: "16px 36px",
        fontSize: "1rem",
        borderRadius: "14px",
      },
      sizeMedium: {
        padding: "12px 28px",
        fontSize: "0.9375rem",
      },
      sizeSmall: {
        padding: "8px 18px",
        fontSize: "0.8125rem",
        borderRadius: "10px",
      },
    },
    defaultProps: {
      color: "inherit",
      disableElevation: true,
    },
  },
  
  MuiIconButton: {
    styleOverrides: {
      root: {
        borderRadius: "12px",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        },
      },
    },
  },
  
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: "10px",
        fontWeight: 600,
        fontSize: "0.8125rem",
        transition: "all 0.2s ease",
        "&:hover": {
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        },
      },
      filled: {
        "&.MuiChip-colorPrimary": {
          background: "linear-gradient(135deg, #D23F57 0%, #E94560 100%)",
          boxShadow: "0 2px 8px rgba(210, 63, 87, 0.3)",
        },
        "&.MuiChip-colorSecondary": {
          background: "linear-gradient(135deg, #1E293B 0%, #334155 100%)",
          boxShadow: "0 2px 8px rgba(30, 41, 59, 0.3)",
        },
        "&.MuiChip-colorSuccess": {
          background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
          boxShadow: "0 2px 8px rgba(16, 185, 129, 0.3)",
        },
        "&.MuiChip-colorWarning": {
          background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
          boxShadow: "0 2px 8px rgba(245, 158, 11, 0.3)",
        },
        "&.MuiChip-colorError": {
          background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
          boxShadow: "0 2px 8px rgba(239, 68, 68, 0.3)",
        },
      },
    },
  },
  
  MuiAlert: {
    styleOverrides: {
      root: {
        borderRadius: "14px",
        fontWeight: 500,
        padding: "14px 20px",
      },
      standardSuccess: {
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        border: "1px solid rgba(16, 185, 129, 0.3)",
        "& .MuiAlert-icon": {
          color: "#10B981",
        },
      },
      standardError: {
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        border: "1px solid rgba(239, 68, 68, 0.3)",
        "& .MuiAlert-icon": {
          color: "#EF4444",
        },
      },
      standardWarning: {
        backgroundColor: "rgba(245, 158, 11, 0.1)",
        border: "1px solid rgba(245, 158, 11, 0.3)",
        "& .MuiAlert-icon": {
          color: "#F59E0B",
        },
      },
      standardInfo: {
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        border: "1px solid rgba(59, 130, 246, 0.3)",
        "& .MuiAlert-icon": {
          color: "#3B82F6",
        },
      },
    },
  },
  
  MuiBadge: {
    styleOverrides: {
      badge: {
        fontWeight: 700,
        fontSize: "0.75rem",
        minWidth: "20px",
        height: "20px",
        borderRadius: "10px",
        padding: "0 6px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
      },
      colorPrimary: {
        background: "linear-gradient(135deg, #D23F57 0%, #E94560 100%)",
      },
    },
  },
  
  MuiTabs: {
    styleOverrides: {
      root: {
        minHeight: "48px",
      },
      indicator: {
        height: 3,
        borderRadius: "3px 3px 0 0",
        background: "linear-gradient(135deg, #D23F57 0%, #E94560 100%)",
      },
    },
  },
  
  MuiTab: {
    styleOverrides: {
      root: {
        minHeight: "48px",
        fontWeight: 600,
        textTransform: "none",
        fontSize: "0.9375rem",
        transition: "all 0.3s ease",
        borderRadius: "12px 12px 0 0",
        "&:hover": {
          backgroundColor: "rgba(210, 63, 87, 0.04)",
        },
        "&.Mui-selected": {
          color: primary.main,
        },
      },
    },
  },
  
  MuiDivider: {
    styleOverrides: {
      root: {
        borderColor: "rgba(0, 0, 0, 0.06)",
      },
    },
  },
  
  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        backgroundColor: "#1E293B",
        borderRadius: "10px",
        padding: "10px 14px",
        fontSize: "0.8125rem",
        fontWeight: 500,
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
      },
      arrow: {
        color: "#1E293B",
      },
    },
  },
  
  MuiDrawer: {
    styleOverrides: {
      paper: {
        borderRadius: "24px 0 0 24px",
        boxShadow: "-20px 0 60px rgba(0, 0, 0, 0.15)",
      },
    },
  },
  
  MuiAccordion: {
    styleOverrides: {
      root: {
        borderRadius: "16px !important",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
        border: "1px solid rgba(0, 0, 0, 0.04)",
        overflow: "hidden",
        "&:before": {
          display: "none",
        },
        "&.Mui-expanded": {
          margin: "8px 0",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
        },
      },
    },
  },
  
  MuiAccordionSummary: {
    styleOverrides: {
      root: {
        padding: "4px 20px",
        minHeight: "56px",
        "&.Mui-expanded": {
          minHeight: "56px",
          borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
        },
      },
      content: {
        margin: "12px 0",
        "&.Mui-expanded": {
          margin: "12px 0",
        },
      },
    },
  },
  
  MuiAccordionDetails: {
    styleOverrides: {
      root: {
        padding: "20px",
      },
    },
  },
  
  MuiSkeleton: {
    styleOverrides: {
      root: {
        borderRadius: "8px",
        backgroundColor: "rgba(0, 0, 0, 0.06)",
      },
      rectangular: {
        borderRadius: "12px",
      },
    },
  },
  
  MuiRating: {
    styleOverrides: {
      root: {
        color: "#F59E0B",
      },
      iconEmpty: {
        color: grey[300],
      },
    },
  },
  
  MuiLinearProgress: {
    styleOverrides: {
      root: {
        borderRadius: "8px",
        height: "8px",
        backgroundColor: grey[200],
      },
      bar: {
        borderRadius: "8px",
        background: "linear-gradient(135deg, #D23F57 0%, #E94560 100%)",
      },
    },
  },
  
  MuiCircularProgress: {
    styleOverrides: {
      root: {
        color: primary.main,
      },
    },
  },
  
  MuiSwitch: {
    styleOverrides: {
      root: {
        width: 52,
        height: 30,
        padding: 0,
      },
      switchBase: {
        padding: 3,
        "&.Mui-checked": {
          transform: "translateX(22px)",
          color: "#fff",
          "& + .MuiSwitch-track": {
            background: "linear-gradient(135deg, #D23F57 0%, #E94560 100%)",
            opacity: 1,
          },
        },
      },
      thumb: {
        width: 24,
        height: 24,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
      },
      track: {
        borderRadius: 15,
        backgroundColor: grey[300],
        opacity: 1,
      },
    },
  },
  
  MuiCheckbox: {
    styleOverrides: {
      root: {
        borderRadius: "6px",
        transition: "all 0.2s ease",
        "&:hover": {
          backgroundColor: "rgba(210, 63, 87, 0.04)",
        },
        "&.Mui-checked": {
          color: primary.main,
        },
      },
    },
  },
  
  MuiRadio: {
    styleOverrides: {
      root: {
        transition: "all 0.2s ease",
        "&:hover": {
          backgroundColor: "rgba(210, 63, 87, 0.04)",
        },
        "&.Mui-checked": {
          color: primary.main,
        },
      },
    },
  },
  
  MuiBreadcrumbs: {
    styleOverrides: {
      root: {
        fontSize: "0.875rem",
      },
      separator: {
        color: grey[400],
      },
      li: {
        "& a": {
          color: grey[600],
          transition: "color 0.2s ease",
          "&:hover": {
            color: primary.main,
          },
        },
      },
    },
  },
  
  MuiSlider: {
    styleOverrides: {
      root: {
        height: 8,
        "& .MuiSlider-track": {
          background: "linear-gradient(135deg, #D23F57 0%, #E94560 100%)",
          border: "none",
        },
        "& .MuiSlider-rail": {
          backgroundColor: grey[300],
        },
        "& .MuiSlider-thumb": {
          width: 24,
          height: 24,
          backgroundColor: "#fff",
          boxShadow: "0 4px 12px rgba(210, 63, 87, 0.3)",
          "&:hover, &.Mui-focusVisible": {
            boxShadow: "0 6px 16px rgba(210, 63, 87, 0.4)",
          },
        },
      },
    },
  },
  
  MuiStepLabel: {
    styleOverrides: {
      label: {
        fontWeight: 500,
        "&.Mui-active": {
          fontWeight: 600,
          color: primary.main,
        },
        "&.Mui-completed": {
          fontWeight: 600,
        },
      },
    },
  },
  
  MuiStepIcon: {
    styleOverrides: {
      root: {
        "&.Mui-active": {
          color: primary.main,
        },
        "&.Mui-completed": {
          color: "#10B981",
        },
      },
    },
  },
};
