import { createPalette, createTheme } from "@suid/material";
import { createMemo } from "solid-js";
import { deepOrange, indigo, teal } from "@suid/material/colors";
import { initialisableAtomWithStorage } from "@/utils/jotai-utils";

type ThemeMode = "dark" | "light"

const useThemeMode = initialisableAtomWithStorage<ThemeMode>("theme-mode", "dark")

export const useKingsTheme = () => {
  const [mode, baseSetMode] = useThemeMode()
  switch (mode()) {
    case "dark":
    case "light":
      break;
    default:
      baseSetMode("dark")
  }

  const setMode = (newMode: ThemeMode | ((current: ThemeMode) => ThemeMode)) => {
    if (typeof newMode === "function") {
      newMode = newMode(mode())
    }
    switch (newMode) {
      case "dark":
      case "light":
        baseSetMode(newMode)
        break;
      default:
        console.error(`Invalid theme mode: ${mode()}.`)
    }
  }

  // color calculations are only done on existing color types
  const basePalette = createPalette({
    primary: {
      main: teal[400],
    },
    secondary: {
      main: indigo[400],
    },
    info: {
      main: deepOrange[400],
    },
  })

  const palette = createMemo(() => {
    return createPalette({
      mode: mode(),
      // standard colors
      primary: basePalette.primary,
      secondary: basePalette.secondary,
      // additional colors
      tertiary: basePalette.info,
      // stage colors
      stage1: basePalette.primary,
      stage2: basePalette.secondary,
      knockout: basePalette.info,
      // division colors
      mixed: basePalette.primary,
      ladies: basePalette.secondary,
      board: basePalette.info,
    });
  });

  const theme = createTheme({
    palette: palette,
    shape: { borderRadius: 4 },
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
