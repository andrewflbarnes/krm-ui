import { Paper, ThemeProvider } from '@suid/material';
import { createComputed } from 'solid-js';
import { createJSXDecorator, Preview } from 'storybook-solidjs-vite';
import "@/utils/stringutils"
import { useKingsTheme } from '@/theme';

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
      const bgMode = () => context.globals.backgrounds?.value === "dark" ? "dark" : "light" as const
      const { theme, setMode } = useKingsTheme()
      createComputed(() => setMode(bgMode()))

      return (
        <ThemeProvider theme={theme}>
          <Paper elevation={0} style={{ display: "flex", "justify-content": "center", "align-items": "center", padding: "2em", height: "100%" }}>
            <Story />
          </Paper>
        </ThemeProvider >
      )
    })
  ],
};

export default preview;
