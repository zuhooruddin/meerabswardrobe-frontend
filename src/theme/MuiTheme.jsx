import { CssBaseline } from "@mui/material";
import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider,
} from "@mui/material/styles";
import useSettings from "hooks/useSettings";
import { merge } from "merge";
import getConfig from "next/config";
import { useRouter } from "next/router";
import customThemeOptions from "./themeOptions"; // =======================================================

// =======================================================
const MuiTheme = ({ children }) => {
  const { settings } = useSettings();
  const { pathname } = useRouter();
  const { publicRuntimeConfig } = getConfig(); // Value is coming from next.config.js
  
  const isDark = settings.theme === "dark";

  const themeOptions = customThemeOptions(publicRuntimeConfig, pathname, isDark);
  let theme = createTheme(
    merge({}, { 
      ...themeOptions, 
      direction: settings.direction,
    })
  );
  theme = responsiveFontSizes(theme); // theme shadows

  // Modern, refined shadows for better depth perception
  // Adjust shadows based on theme
  if (isDark) {
    theme.shadows[1] = "0px 2px 8px rgba(0, 0, 0, 0.4)";
    theme.shadows[2] = "0px 4px 16px rgba(0, 0, 0, 0.5)";
    theme.shadows[3] = "0px 8px 28px rgba(0, 0, 0, 0.6)";
    theme.shadows[4] = "0px 12px 36px rgba(0, 0, 0, 0.7)";
    theme.shadows[5] = "0px 16px 52px rgba(0, 0, 0, 0.8)";
  } else {
    theme.shadows[1] = "0px 2px 4px rgba(0, 0, 0, 0.08)";
    theme.shadows[2] = "0px 4px 12px rgba(0, 0, 0, 0.1)";
    theme.shadows[3] = "0px 8px 24px rgba(0, 0, 0, 0.12)";
    theme.shadows[4] = "0px 12px 32px rgba(0, 0, 0, 0.15)";
    theme.shadows[5] = "0px 16px 48px rgba(0, 0, 0, 0.18)";
  }
  
  // Add custom shape for modern rounded corners
  theme.shape = {
    ...theme.shape,
    borderRadius: 8, // Modern 8px border radius
  };
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default MuiTheme;
