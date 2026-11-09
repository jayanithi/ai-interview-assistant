import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";

import {
  ThemeProvider,
  createTheme,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const ThemeContext = createContext();

export const ThemeProviderCustom = ({ children }) => {

  const [mode, setMode] = useState(
    localStorage.getItem("theme") || "dark"
  );

  useEffect(() => {
    localStorage.setItem("theme", mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode((prev) =>
      prev === "dark" ? "light" : "dark"
    );
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,

          primary: {
            main: "#2563EB",
          },

          background: {
            default:
              mode === "dark"
                ? "#020617"
                : "#FFFFFF",

            paper:
              mode === "dark"
                ? "#0F172A"
                : "#FFFFFF",
          },
          text: {
            primary: mode === "dark" ? "#FFFFFF" : "#0F172A",
            secondary: mode === "dark" ? "#CBD5E1" : "#475569",
          },
          divider:
            mode === "dark"
              ? "rgba(255,255,255,0.12)"
              : "rgba(15,23,42,0.12)",
        },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider
      value={{
        mode,
        toggleTheme,
      }}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeCustom = () =>
  useContext(ThemeContext);