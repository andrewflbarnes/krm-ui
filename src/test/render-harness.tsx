import { ParentProps } from "solid-js";
import { useKingsTheme } from "@/theme";
import { ThemeProvider } from "@suid/material";

/**
  * HOC providing  theming and other context to children intended for tests.
  * This should only be used to manage high level context wrapping the
  * application - test and component specific data should reside in appropriate
  * test files.
  */
export default function RenderHarness(props: ParentProps) {
  const { theme } = useKingsTheme()
  return (
    <ThemeProvider theme={theme}>
      {props.children}
    </ThemeProvider>
  )
}
