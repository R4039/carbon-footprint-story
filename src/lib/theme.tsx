import { createContext, useContext, type ReactNode } from "react";

type Theme = "day";
type Ctx = { theme: Theme; toggle: () => void; setTheme: (t: Theme) => void };

const ThemeContext = createContext<Ctx | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Day-only experience — dark mode disabled by product decision.
  if (typeof document !== "undefined") {
    document.documentElement.classList.remove("dark");
    document.documentElement.dataset.theme = "day";
  }
  return (
    <ThemeContext.Provider value={{ theme: "day", toggle: () => {}, setTheme: () => {} }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) return { theme: "day" as Theme, toggle: () => {}, setTheme: () => {} };
  return ctx;
}
