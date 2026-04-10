import { For, JSX, Show } from "solid-js";
import { Accessible, DownhillSkiing } from "@suid/icons-material";
import { Box, Link, Paper, Stack, Typography, useTheme } from "@suid/material";
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
    <Box component="footer">
      <Paper elevation={5} sx={{
        display: "flex",
        flexDirection: "row",
        px: 2,
        py: 0.5,
        m: 0,
        alignItems: "center",
        borderRadius: 0,
      }}>
        <Stack direction="row" gap={2} alignItems="center">
          <Link sx={{ display: "flex", alignItems: "center" }} target="_blank" rel="noopener" href="https://github.com/andrewflbarnes/krm-ui">
            <GitHub />
          </Link>
          <Typography variant="subtitle2">
            Version: {__KRMUI_VERSION__}
          </Typography>
        </Stack>
        <Stack direction="row" gap={2} alignItems="center" sx={{ ml: "auto" }}>
          <ClerkLoaded>
            <SignedIn>
              <Stack direction="row" alignItems="center">
                <For each={flairs}>{([test, flair]) => (
                  <Show when={test(roles())}>
                    {flair}
                  </Show>
                )}</For>
              </Stack>
            </SignedIn>
          </ClerkLoaded>
          <Link color="inherit" sx={{ display: "flex", alignItems: "center" }} target="_blank" rel="noopener" href="https://kingsski.club">
            <DownhillSkiing color="inherit" fontSize="small" />
          </Link>
          <ModeChangeButton mode={mode()} onModeChange={props.onModeChange} />
        </Stack>
      </Paper>
    </Box>
  )
}
