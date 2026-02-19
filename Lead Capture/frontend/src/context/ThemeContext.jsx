import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.className = darkMode
      ? "bg-dark text-light"
      : "";
  }, [darkMode]);

  return (
    <ThemeContext.Provider
      value={{ darkMode, toggleTheme: () => setDarkMode(!darkMode) }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
export default ThemeProvider;
