// Premium Typography Configuration
// Using distinctive, modern fonts for a professional e-commerce experience

export const fontSize = 15;

export const fontFamily = [
  "Plus Jakarta Sans",
  "DM Sans",
  "-apple-system",
  "BlinkMacSystemFont",
  "Segoe UI",
  "Roboto",
  "Helvetica Neue",
  "sans-serif",
].join(",");

export const displayFontFamily = [
  "Outfit",
  "Plus Jakarta Sans",
  "DM Sans",
  "sans-serif",
].join(",");

export const typography = {
  fontSize,
  fontFamily,
  htmlFontSize: 16,
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightSemiBold: 600,
  fontWeightBold: 700,
  fontWeightExtraBold: 800,
  
  h1: {
    fontFamily: displayFontFamily,
    fontSize: "clamp(2rem, 5vw, 3.5rem)",
    fontWeight: 800,
    lineHeight: 1.15,
    letterSpacing: "-0.03em",
  },
  h2: {
    fontFamily: displayFontFamily,
    fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: "-0.025em",
  },
  h3: {
    fontFamily: displayFontFamily,
    fontSize: "clamp(1.5rem, 3vw, 2rem)",
    fontWeight: 700,
    lineHeight: 1.25,
    letterSpacing: "-0.02em",
  },
  h4: {
    fontFamily: displayFontFamily,
    fontSize: "clamp(1.25rem, 2.5vw, 1.5rem)",
    fontWeight: 600,
    lineHeight: 1.3,
    letterSpacing: "-0.015em",
  },
  h5: {
    fontFamily: displayFontFamily,
    fontSize: "1.125rem",
    fontWeight: 600,
    lineHeight: 1.4,
    letterSpacing: "-0.01em",
  },
  h6: {
    fontFamily: displayFontFamily,
    fontSize: "1rem",
    fontWeight: 600,
    lineHeight: 1.5,
    letterSpacing: "-0.005em",
  },
  subtitle1: {
    fontSize: "1rem",
    fontWeight: 500,
    lineHeight: 1.6,
    letterSpacing: "0.01em",
  },
  subtitle2: {
    fontSize: "0.875rem",
    fontWeight: 500,
    lineHeight: 1.6,
    letterSpacing: "0.01em",
  },
  body1: {
    fontSize,
    lineHeight: 1.7,
    letterSpacing: "0.01em",
  },
  body2: {
    fontSize: "0.875rem",
    lineHeight: 1.7,
    letterSpacing: "0.01em",
  },
  button: {
    fontFamily,
    fontWeight: 600,
    textTransform: "none",
    letterSpacing: "0.02em",
    fontSize: "0.9375rem",
  },
  caption: {
    fontSize: "0.75rem",
    lineHeight: 1.5,
    letterSpacing: "0.02em",
  },
  overline: {
    fontSize: "0.75rem",
    fontWeight: 700,
    lineHeight: 1.5,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  },
};
