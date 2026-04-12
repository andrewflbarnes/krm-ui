import { Paper, ThemeProvider } from '@suid/material';
import { createEffect } from 'solid-js';
import { createJSXDecorator, Preview } from 'storybook-solidjs-vite';
import "../src/utils/stringutils"
import { useKingsTheme } from '../src/theme';

const preview: Preview = {
  parameters: {
    layout: 'padded',
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
  decorators: [
    createJSXDecorator((Story, context) => {
      const {
        theme,
        setMode,
      } = useKingsTheme(context.globals.backgrounds?.value === "dark" ? "dark" : "light")
      createEffect(() => {
        setMode(context.globals.backgrounds?.value === "dark" ? "dark" : "light")
      })

      return (
        <ThemeProvider theme={theme}>
          <Paper style={{ display: "flex", "justify-content": "center", "align-items": "center", padding: "2em", height: "100%" }}>
            <Story />
          </Paper>
        </ThemeProvider >
      )
    })
  ],
};

export default preview;
