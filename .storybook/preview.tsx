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
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  // not working see https://github.com/storybookjs/storybook/issues/30058
  // though this doesn't cover it not working at all :(
  //globalTypes: {
  //  theme: {
  //    name: 'Theme',
  //    description: 'Global theme for components',
  //    defaultValue: 'light',
  //    toolbar: {
  //      // The icon for the toolbar item
  //      icon: 'circlehollow',
  //      // Array of options
  //      items: [
  //        { value: 'light', icon: 'circlehollow', title: 'light' },
  //        { value: 'dark', icon: 'circle', title: 'dark' },
  //      ],
  //      // Property that specifies if the name of the item will be displayed
  //      showName: true,
  //    },
  //  },
  //},
  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <div style={{ display: "flex", "flex-direction": "column", gap: "1rem" }}>
          <div>
            <Button variant="contained" color="primary" onClick={() => setMode(mode() === "light" ? "dark" : "light")}>mode: {mode()}</Button>
          </div>
          <div style={{ margin: "auto" }}>
            <Paper elevation={0}>
              <Story />
            </Paper>
          </div>
        </div>
      </ThemeProvider >
    )
  ],
};

export default preview;
