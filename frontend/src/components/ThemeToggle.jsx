import React from "react";

import {
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  DarkMode,
  LightMode,
} from "@mui/icons-material";

import { useThemeCustom } from "../context/ThemeContext";

const ThemeToggle = () => {
  const { mode, toggleTheme } = useThemeCustom();
  const label = mode === "dark" ? "Switch to light mode" : "Switch to dark mode";

  return (
    <Tooltip title={label}>
      <IconButton
        aria-label={label}
        onClick={toggleTheme}
        sx={{
          width: 40,
          height: 40,
          flexShrink: 0,
          color: "text.primary",
          backgroundColor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          boxShadow: 2,
          "&:hover": {
            backgroundColor: "action.hover",
          },
        }}
      >
        {mode === "dark" ? <LightMode /> : <DarkMode />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;
