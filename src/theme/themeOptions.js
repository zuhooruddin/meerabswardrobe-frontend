import { components } from "./components";
import { blue, marron, paste, primary, themeColors, darkThemeColors } from "./themeColors";
import { typography } from "./typography";
const THEMES = {
  GIFT: "GIFT",
  HEALTH: "HEALTH",
  DEFAULT: "DEFAULT",
  GROCERY: "GROCERY",
  FURNITURE: "FURNITURE",
};
const breakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920,
  },
};
/*
WE CREATED MULTIPLE THEME OPTIONS FOR DIFFERENT SHOP VARIATION.

YOU CAN JUST KEEP [THEMES.DEFAULT] AND REMOVE OTHER THEME OPTIONS.
*/

// Light theme options
const themesOptions = {
  [THEMES.DEFAULT]: {
    typography,
    breakpoints,
    components: { ...components },
    palette: {
      mode: 'light',
      primary: { ...primary, light: primary[100] },
      ...themeColors,
    },
  },
  [THEMES.GROCERY]: {
    typography,
    breakpoints,
    components: { ...components },
    palette: {
      mode: 'light',
      primary: { ...primary, light: primary[100] },
      ...themeColors,
    },
  },
  [THEMES.FURNITURE]: {
    typography,
    breakpoints,
    components: { ...components },
    palette: {
      mode: 'light',
      primary: { ...paste, light: paste[100] },
      ...themeColors,
    },
  },
  [THEMES.HEALTH]: {
    typography,
    breakpoints,
    components: { ...components },
    palette: {
      mode: 'light',
      primary: { ...blue, light: blue[100] },
      ...themeColors,
    },
  },
  [THEMES.GIFT]: {
    typography,
    breakpoints,
    components: { ...components },
    palette: {
      mode: 'light',
      primary: { ...marron, light: marron[100] },
      ...themeColors,
    },
  },
};

// Dark theme options
const darkThemesOptions = {
  [THEMES.DEFAULT]: {
    typography,
    breakpoints,
    components: { ...components },
    palette: {
      mode: 'dark',
      primary: { ...primary, light: primary[100] },
      ...darkThemeColors,
    },
  },
  [THEMES.GROCERY]: {
    typography,
    breakpoints,
    components: { ...components },
    palette: {
      mode: 'dark',
      primary: { ...primary, light: primary[100] },
      ...darkThemeColors,
    },
  },
  [THEMES.FURNITURE]: {
    typography,
    breakpoints,
    components: { ...components },
    palette: {
      mode: 'dark',
      primary: { ...paste, light: paste[100] },
      ...darkThemeColors,
    },
  },
  [THEMES.HEALTH]: {
    typography,
    breakpoints,
    components: { ...components },
    palette: {
      mode: 'dark',
      primary: { ...blue, light: blue[100] },
      ...darkThemeColors,
    },
  },
  [THEMES.GIFT]: {
    typography,
    breakpoints,
    components: { ...components },
    palette: {
      mode: 'dark',
      primary: { ...marron, light: marron[100] },
      ...darkThemeColors,
    },
  },
};

const themeOptions = (publicRuntimeConfig, pathname, isDark = false) => {
  let themeOptions;
  const themeSource = isDark ? darkThemesOptions : themesOptions;
  
  /*
    YOU CAN ALSO REMOVE updateTheme function
    AND FOLLOWING ENTIRE switch case BLOCK.
  */

  const updateTheme = (themeName) => {
    publicRuntimeConfig.theme = themeName;
    themeOptions = themeSource[publicRuntimeConfig.theme];
  };

  switch (pathname) {
    // case "/":
    //    ('case 1 /');
    //   updateTheme(THEMES.DEFAULT);
    //   break;
    case "/":
    case "/grocery1":
    case "/grocery2":
    case "/grocery3":
    case "/gadget-shop":
    case "/fashion-shop":
    case "/market-1":
      updateTheme(THEMES.DEFAULT);
      break;

    case "/furniture-shop":
      updateTheme(THEMES.FURNITURE);
      break;

    case "/healthbeauty-shop":
      updateTheme(THEMES.HEALTH);
      break;

    case "/gift-shop":
      updateTheme(THEMES.GIFT);
      break;

    default:
      themeOptions = themeSource[publicRuntimeConfig.theme];
      break;
  }
  /*
        IF YOU REMOVE THE switch case, YOU NEED TO ASSIGN VALUE TO themeOptions
        E.G. themeOptions = themesOptions[THEMES.DEFAULT];
    */
  // themeOptions = themesOptions[THEMES.DEFAULT];

  return themeOptions;
};

export default themeOptions;
