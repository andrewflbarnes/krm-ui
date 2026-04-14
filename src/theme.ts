import { createPalette, createTheme } from "@suid/material";
import { createMemo, createSignal } from "solid-js";

export const useKingsTheme = (initialMode?: "light" | "dark") => {
  const [mode, setMode] = createSignal<"light" | "dark">(initialMode);

  const palette = createMemo(() => {
    return createPalette({
      mode: mode(),
      primary: { main: "#1565c0" },
      secondary: { main: "#e65100" },
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

export const DIVISION_ACCENT = {
  mixed: {
    text: "primary",
    background: "primary.main",
  },
  ladies: {
    text: "secondary",
    background: "secondary.main",
  },
  board: {
    text: "info",
    background: "info.main",
  }
} as const;
