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
                : "#F8FAFC",

            paper:
              mode === "dark"
                ? "#0F172A"
                : "#FFFFFF",
          },
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
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeCustom = () =>
  useContext(ThemeContext);