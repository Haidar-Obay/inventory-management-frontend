"use client";

import { ThemeProvider as MUIThemeProvider } from "@mui/material/styles";
import { useTheme } from "next-themes";
import { lightTheme, darkTheme } from "./mui-theme";

interface MUIThemeWrapperProps {
  children: React.ReactNode;
}

export function MUIThemeWrapper({ children }: MUIThemeWrapperProps) {
  const { theme: nextTheme } = useTheme();
  const muiTheme = nextTheme === "dark" ? darkTheme : lightTheme;

  return <MUIThemeProvider theme={muiTheme}>{children}</MUIThemeProvider>;
}
