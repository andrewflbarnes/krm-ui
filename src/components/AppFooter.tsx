import { For, JSX, Show } from "solid-js";
import { Accessible, DownhillSkiing } from "@suid/icons-material";
import { Link, Paper, Typography, useTheme } from "@suid/material";
import { ClerkLoaded, SignedIn } from "clerk-solidjs";
import { useAuth } from "../hooks/auth";
import GitHub from "../ui/GitHubIcon";
import ModeChangeButton from "../ui/ModeChangeButton";

const flairs: [(roles: string[]) => boolean, JSX.Element][] = [
  [(roles) => roles.includes("life_member"), <Accessible fontSize="small" />],
]

export default function AppFooter(props: {
  onModeChange: () => void;
}) {
  const { roles } = useAuth()
  const mode = () => useTheme().palette.mode
  return (
    <footer>
      <Paper elevation={5} style={{ display: "flex", "flex-direction": "row", padding: "0 1em", margin: 0, "align-items": "center" }}>
        <div style={{ display: "flex", gap: "1em", "align-items": "center" }}>
          <Link style={{ display: "flex", "align-items": "center" }} target="_blank" rel="noopener" href="https://github.com/andrewflbarnes/krm-ui">
            <GitHub />
          </Link>
          <Typography variant="subtitle2">
            Version: {__KRMUI_VERSION__}
          </Typography>
        </div>
        <div style={{ "margin-left": "auto", display: "flex", gap: "1em", "align-items": "center" }}>
          <ClerkLoaded>
            <SignedIn>
              <div style={{ "text-align": "center", display: "flex" }}>
                <For each={flairs}>{([test, flair]) => (
                  <Show when={test(roles())}>
                    {flair}
                  </Show>
                )}</For>
              </div>
            </SignedIn>
          </ClerkLoaded>
          <Link color="inherit" style={{ display: "flex", "align-items": "center" }} target="_blank" rel="noopener" href="https://kingsski.club">
            <DownhillSkiing color="inherit" fontSize="small" />
          </Link>
          <ModeChangeButton mode={mode()} onModeChange={props.onModeChange} />
        </div>
      </Paper>
    </footer>
  )
}
