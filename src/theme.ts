import { createPalette, createTheme } from "@suid/material";
import { createMemo } from "solid-js";
import { lightBlue } from "@suid/material/colors";
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

  const dark = createMemo(() => mode() === "dark");

  const palette = createMemo(() => {
    return createPalette({
      mode: mode(),
      primary: {
        main: lightBlue[dark() ? 300 : 800],
      },
    });
  });

  const theme = createTheme({
    palette: {
      mode: mode(),
      stage1: palette().primary,
      stage2: palette().secondary,
      knockout: palette().error,
      mixed: palette().primary,
      ladies: palette().secondary,
      board: palette().error,
      tertiary: palette().error,
    },
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
