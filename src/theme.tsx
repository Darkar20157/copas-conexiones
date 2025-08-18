// theme.tsx
import { createTheme } from "@mui/material/styles";
import { parse, formatHex } from "culori";

// helper para leer y convertir a hex
const getCssVar = (name: string, fallback: string) => {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
  const parsed = parse(value);
  return parsed ? formatHex(parsed) : fallback;
};

export const getAppTheme = () =>
  createTheme({
    palette: {
      mode: document.documentElement.classList.contains("dark") ? "dark" : "light",
      primary: {
        main: getCssVar("--primary", "#9333ea"),
        contrastText: getCssVar("--primary-foreground", "#fff"),
      },
      secondary: {
        main: getCssVar("--secondary", "#be185d"),
        contrastText: getCssVar("--secondary-foreground", "#fff"),
      },
      background: {
        default: getCssVar("--background", "#fff"),
        paper: getCssVar("--card", "#fff"),
      },
      text: {
        primary: getCssVar("--foreground", "#000"),
        secondary: getCssVar("--muted-foreground", "#555"),
      },
    },
    shape: {
      borderRadius: 10,
    },
  });
