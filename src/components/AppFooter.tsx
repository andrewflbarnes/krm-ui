import { LightModeOutlined } from "@suid/icons-material";
import { IconButton, Paper, Typography } from "@suid/material";
import { ClerkLoaded, SignedIn, useUser } from "clerk-solidjs";

export default function AppFooter(props: {
  onModeChange: () => void;
}) {
  const { user } = useUser()
  return (
    <footer>
      <Paper elevation={5} style={{ display: "flex", "flex-direction": "row", padding: "0 1em", margin: 0, "align-items": "center" }}>
        <div>
          <Typography variant="subtitle2">
            Version: {__KRMUI_VERSION__}
          </Typography>
        </div>
        <div style={{ "margin-left": "auto", display: "flex", gap: "1em", "align-items": "center" }}>
          <ClerkLoaded>
            <SignedIn>
              <Typography variant="subtitle2">
                {user().username}
              </Typography>
            </SignedIn>
          </ClerkLoaded>
          <IconButton aria-label="Toggle light/dark mode" onClick={props.onModeChange}>
            <LightModeOutlined fontSize="small" />
          </IconButton>
        </div>
      </Paper>
    </footer>
  )
}
