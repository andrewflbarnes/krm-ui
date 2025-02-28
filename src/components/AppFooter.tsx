import { For, JSX, Show } from "solid-js";
import { Accessible, LightModeOutlined } from "@suid/icons-material";
import { IconButton, Paper, Typography } from "@suid/material";
import { ClerkLoaded, SignedIn } from "clerk-solidjs";
import { useAuth } from "../hooks/auth";

const flairs: [(roles: string[]) => boolean, JSX.Element][] = [
  [(roles) => roles.includes("life_member"), <Accessible fontSize="small" />],
]

export default function AppFooter(props: {
  onModeChange: () => void;
}) {
  const { username, roles } = useAuth()
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
              <div style={{ "text-align": "center", display: "flex" }}>
                <Typography variant="subtitle2">
                  {username()}
                </Typography>
                &nbsp;
                <For each={flairs}>{([test, flair]) => (
                  <Show when={test(roles())}>
                    {flair}
                  </Show>
                )}</For>
              </div>
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
