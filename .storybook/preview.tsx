import { Button, createPalette, createTheme, Paper, ThemeProvider } from '@suid/material';
import { createComputed, createEffect, createMemo, createSignal } from 'solid-js';
import { Preview } from 'storybook-solidjs';

const [mode, setMode] = createSignal<"light" | "dark">("dark");

const palette = createMemo(() => {
  return createPalette({ mode: mode() });
});

const theme = createTheme({ palette: palette });

const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <>
        <Button variant="contained" color="primary" onClick={() => setMode(mode() === "light" ? "dark" : "light")}>mode: {mode()}</Button>
        <ThemeProvider theme={theme}>
          <Paper sx={{ margin: "1em 0" }}>
            <Story />
          </Paper>
        </ThemeProvider>
      </>
    )
  ],
};

export default preview;
