import { Button, createPalette, createTheme, Paper, ThemeProvider } from '@suid/material';
import { createMemo, createSignal } from 'solid-js';
import { Preview } from 'storybook-solidjs';

const [mode, setMode] = createSignal<"light" | "dark">("light");

const palette = createMemo(() => {
  return createPalette({ mode: mode() });
});

const theme = createTheme({ palette: palette });

const preview: Preview = {
  parameters: {
    layout: 'centered',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  tags: [
    "autodocs",
  ],
  // not working in non docs, maybe see https://github.com/storybookjs/storybook/issues/30058
  //globalTypes: {
  //  theme: {
  //    description: 'Global theme for components',
  //    toolbar: {
  //      title: "Theme",
  //      icon: 'circlehollow',
  //      items: [
  //        "light",
  //        "dark",
  //      ],
  //      //items: [
  //      //  { value: 'light', icon: 'circlehollow', title: 'light' },
  //      //  { value: 'dark', icon: 'circle', title: 'dark' },
  //      //],
  //      dynamicTitle: true,
  //    },
  //  },
  //},
  //initialGlobals: {
  //  theme: "light",
  //},
  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <div style={{ display: "flex", "flex-direction": "column", gap: "1rem" }}>
          <div>
            <Button variant="contained" color="primary" onClick={() => setMode(mode() === "light" ? "dark" : "light")}>mode: {mode()}</Button>
          </div>
          <div style={{ margin: "auto" }}>
            <Paper>
              <Story />
            </Paper>
          </div>
        </div>
      </ThemeProvider >
    )
  ],
};

export default preview;
