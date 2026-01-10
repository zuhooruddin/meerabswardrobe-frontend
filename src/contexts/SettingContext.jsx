import { createContext, useEffect, useState } from "react"; // ============================================================

// ============================================================
// SET "rtl" OR "ltr" HERE AND "light" OR "dark" FOR THEME
// THEN GOTO BROWSER CONSOLE AND RUN localStorage.clear() TO CLEAR LOCALSTORAGE
const initialSettings = {
  direction: "ltr",
  theme: "light", // "light" or "dark"
};
export const SettingsContext = createContext({
  settings: initialSettings,
  updateSettings: (arg) => {},
  toggleTheme: () => {},
}); // ============================================================

// ============================================================
const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(initialSettings);

  const updateSettings = (updatedSetting) => {
    setSettings(updatedSetting);
    window.localStorage.setItem(
      "bazaar_settings",
      JSON.stringify(updatedSetting)
    );
    
    // Update document class for CSS variables
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-theme', updatedSetting.theme);
    }
  };

  const toggleTheme = () => {
    const newTheme = settings.theme === "light" ? "dark" : "light";
    const updatedSetting = { ...settings, theme: newTheme };
    updateSettings(updatedSetting);
  };

  useEffect(() => {
    if (!window) return null;
    const getItem = window.localStorage.getItem("bazaar_settings");
    if (getItem) {
      const parsedSettings = JSON.parse(getItem);
      setSettings(parsedSettings);
      // Set initial theme attribute
      document.documentElement.setAttribute('data-theme', parsedSettings.theme || 'light');
    } else {
      // Set default theme attribute
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);
  
  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        toggleTheme,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsProvider;
