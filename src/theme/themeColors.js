// =================================================================
// =================================================================
export const grey = {
  900: "#1a202c",
  // Main Text - darker for better contrast
  800: "#2B3445",
  // Paragraph
  700: "#4B566B",
  600: "#6B7280",
  // Low Priority form Title/Text
  500: "#9CA3AF",
  400: "#D1D5DB",
  // Border
  300: "#E5E7EB",
  200: "#F3F4F6",
  // Line Stroke
  100: "#F8FAFC",
  50: "#FAFAFA",
};
export const primary = {
  100: "#FDF4FF",
  200: "#FAE8FF",
  300: "#F5D0FE",
  400: "#E879F9",
  500: "#D946A0",
  600: "#C026D3",
  700: "#A21CAF",
  800: "#86198F",
  900: "#701A75",
  main: "#D946A0", // Elegant pink-magenta for Meerab's Wardrobe
  light: "#FDF4FF",
  dark: "#86198F",
  contrastText: "#FFFFFF",
};
export const secondary = {
  100: "#e8e8ee",
  200: "#b9bacb",
  300: "#8a8ca8",
  400: "#5b5d85",
  500: "#141850",
  600: "#0F3460",
  700: "#101340",
  800: "#0e1138",
  900: "#0c0e30",
  // main: "#0F3460",
  main: "#cc0000",
  // dark: "#0c0e30",
  dark: "#303444",
};
export const error = {
  100: "#FFEAEA",
  200: "#FFCBCB",
  300: "#FFA9A9",
  400: "#FF6D6D",
  500: "#FF5353",
  600: "#FF4C4C",
  700: "#FF4242",
  800: "#FF3939",
  900: "#FF2929",
  main: "#E94560",
};
export const success = {
  100: "#E7F9ED",
  200: "#C2F1D1",
  300: "#99E8B3",
  400: "#52D77E",
  500: "#33D067",
  600: "#2ECB5F",
  700: "#27C454",
  800: "#20BE4A",
  900: "#0b7724",
  main: "rgb(51, 208, 103)",
};
export const blue = {
  50: "#f3f5f9",
  100: "#DBF0FE",
  200: "#B8DEFE",
  300: "#94C9FE",
  400: "#7AB6FD",
  500: "#4E97FD",
  600: "#3975D9",
  700: "#2756B6",
  800: "#183C92",
  900: "#0E2979",
  main: "#4E97FD",
  contrastText: "#FFFFFF",
};
export const marron = {
  50: "#f3f5f9",
  100: "#F6F2ED",
  200: "#F8DBD1",
  300: "#EBBCB3",
  400: "#D89C98",
  600: "#A3545C",
  700: "#883948",
  800: "#6E2438",
  900: "#5B162F",
  main: "#BE7374",
};
export const paste = {
  50: "#F5F5F5",
  100: "#DDFBF1",
  200: "#BDF7E8",
  300: "#97E8DA",
  400: "#76D2CA",
  600: "#36929A",
  700: "#257181",
  800: "#175368",
  900: "#0E3D56",
  main: "#4BB4B4",
  contrastText: "#FFFFFF",
};
export const warning = {
  100: "#FFF8E5",
  main: "#FFCD4E",
  contrastText: "#FFFFFF",
};
export const dark = {
  main: "#222",
};
export const white = {
  main: "#fff",
};
// Light theme colors
export const themeColors = {
  dark,
  grey,
  paste,
  error,
  marron,
  warning,
  success,
  secondary,
  info: blue,
  divider: grey[200],
  background: {
    default: "#F8FAFC",
    paper: "#FFFFFF",
  },
  text: {
    primary: grey[900],
    secondary: grey[700],
    disabled: grey[400],
  },
  action: {
    hover: "rgba(217, 70, 160, 0.08)",
    selected: "rgba(217, 70, 160, 0.12)",
    focus: "rgba(217, 70, 160, 0.12)",
  },
};

// Dark theme colors
export const darkThemeColors = {
  dark: {
    main: "#ffffff",
  },
  grey: {
    900: "#F9FAFB",
    800: "#E5E7EB",
    700: "#D1D5DB",
    600: "#9CA3AF",
    500: "#6B7280",
    400: "#4B5563",
    300: "#374151",
    200: "#2B3445",
    100: "#1F2937",
    50: "#111827",
  },
  paste,
  error,
  marron,
  warning,
  success,
  secondary,
  info: blue,
  divider: "rgba(255, 255, 255, 0.12)",
  background: {
    default: "#0F172A", // Dark navy background
    paper: "#1E293B",   // Slightly lighter for cards
  },
  text: {
    primary: "#F9FAFB",
    secondary: "#D1D5DB",
    disabled: "#6B7280",
  },
  action: {
    hover: "rgba(217, 70, 160, 0.15)",
    selected: "rgba(217, 70, 160, 0.2)",
    focus: "rgba(217, 70, 160, 0.2)",
  },
};
