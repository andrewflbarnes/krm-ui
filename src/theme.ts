import { createPalette, createTheme } from "@suid/material";
import { createMemo, createSignal } from "solid-js";
import { lightBlue } from "@suid/material/colors";

export const useKingsTheme = (initialMode?: "light" | "dark") => {
  const [mode, setMode] = createSignal<"light" | "dark">(initialMode);

  const dark = () => mode() === "dark";

  const palette = createMemo(() => {
    return createPalette({
      mode: mode(),
      primary: {
        main: lightBlue[dark() ? 300 : 800],
      },
    });
  });

  const theme = createTheme({
    palette: palette,
    shape: { borderRadius: 10 },
    typography: {
      h1: { fontWeight: 700, letterSpacing: "-1px" },
      h4: { fontWeight: 600 },
      h6: { fontWeight: 600 },
      button: { textTransform: "none", fontWeight: 600 },
    },
    components: {
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
      },
    },
  });

  return {
    palette,
    theme,
    mode,
    setMode,
  }
}

export type BaseColor = 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | 'default';

export const baseColors = {
  primary: {
    text: "primary",
    background: "primary.main",
  },
  secondary: {
    text: "secondary",
    background: "secondary.main",
  },
  teriary: {
    text: "error",
    background: "error.main",
  }
} as const

export const STAGE_ACCENT = {
  stage1: baseColors.primary,
  stage2: baseColors.secondary,
  knockout: baseColors.teriary,
} as const;

export const DIVISION_ACCENT = {
  mixed: baseColors.primary,
  ladies: baseColors.secondary,
  board: baseColors.teriary,
} as const;
