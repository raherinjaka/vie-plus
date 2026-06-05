"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

const ThemeContext = createContext<{
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;  // ← ajoute ça
} | null>(null);

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark"); // Thème par défaut

  useEffect(() => {
    // Vérifie si l'utilisateur avait déjà enregistré un choix dans le navigateur
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    // On met à jour les classes sur la balise <html>
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook personnalisé pour utiliser le thème facilement dans nos boutons
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme doit être utilisé dans un ThemeProvider");
  return context;
};