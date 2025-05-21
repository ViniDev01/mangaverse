import { createContext, useContext, useEffect, useState } from "react";

const ThemaContext = createContext();

export const ThemaProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Recupera o tema salvo ou usa 'padrao' como fallback
    return localStorage.getItem("theme") || "padrao";
  });

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const applyTheme = (themeOption) => {
    document.documentElement.setAttribute("data-theme", themeOption);
  };

  return (
    <ThemaContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemaContext.Provider>
  );
};

export const useThema = () => useContext(ThemaContext);
