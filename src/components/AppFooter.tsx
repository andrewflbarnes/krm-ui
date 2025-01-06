import { Typography } from "@suid/material";

export default function AppFooter() {
  return (
    <footer>
      <Typography variant="subtitle2">
        Version: {__KRMUI_VERSION__}
      </Typography>
    </footer>
  )
}
