import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "vendor:theme";

export default function useTheme() {
  const [theme, setThemeState] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || "light";
    } catch {
      return "light";
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setThemeState((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  const setTheme = useCallback((next) => {
    setThemeState(next);
  }, []);

  return { theme, toggleTheme, setTheme, isDark: theme === "dark" };
}
