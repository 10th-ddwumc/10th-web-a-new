import React, { createContext, useContext, useState, useEffect } from 'react';

const THEME_KEY = 'app-theme'; // 기존 'theme' 문자열 대신 사용
const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
} as const;

type Theme = typeof THEMES[keyof typeof THEMES];

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {

    return (localStorage.getItem(THEME_KEY) as Theme) || THEMES.LIGHT;
  });

  useEffect(() => {

    localStorage.setItem(THEME_KEY, theme);


    if (theme === THEMES.DARK) {
      document.documentElement.classList.add(THEMES.DARK);
    } else {
      document.documentElement.classList.remove(THEMES.DARK);
    }
  }, [theme]);

  const toggleTheme = () => {

    setTheme((prev) => (prev === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};