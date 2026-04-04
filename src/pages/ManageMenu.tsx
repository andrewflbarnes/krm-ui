import { useNavigate } from "@solidjs/router";
import { AddCircleOutlined, Assignment, Create, DownhillSkiing, ListAlt } from "@suid/icons-material";
import { Box, Card, CardActionArea, CardContent, Typography } from "@suid/material";
import { For, JSX, Show } from "solid-js";
import { useFeatureFlags } from "../hooks/flags";

type Option = {
  label: string;
  description: string;
  href: string;
  icon: JSX.Element;
  experimental?: boolean;
}

const options: Option[] = [
  {
    label: "New",
    description: "Start a new race",
    href: "new",
    icon: <AddCircleOutlined fontSize="large" />
  },
  {
    label: "Continue",
    description: "View/Continue an existing race",
    href: "continue",
    icon: <DownhillSkiing fontSize="large" />
  },
]

const configs: Option[] = [
  {
    label: "View Round",
    description: "Show round configurations used to determine how teams progress through each stage",
    href: "round",
    icon: <Assignment fontSize="large" />,
  },
  {
    label: "View Minileague",
    description: "Show mini league configurations used to determine how teams race in a group",
    href: "minileague",
    icon: <ListAlt fontSize="large" />,
  },
  {
    label: "Create Round",
    description: "Create a custom round configuration used to determine how teams progress through each stage",
    href: "round/create",
    icon: <Create fontSize="large" />,
    experimental: true,
  },
]

export default function ManageMenu() {
  const nav = useNavigate()

  // TODO how do we reconccile this with firebase? Should we just not use tanstack or do we use firebase to psuh updates to query client?
  const flags = useFeatureFlags()

  return (
    <>
      <Typography variant="h2" gutterBottom sx={{ width: "100%", textAlign: "center" }}>
        Racing
      </Typography>
      <Box sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(20em, 1fr))",
        gap: 3,
        mb: 3,
      }}>
        <For each={options}>{({ label, description, href, icon, experimental }) => (
          <Show when={!experimental || flags.experimental}>
            <Card variant="outlined">
              <CardActionArea sx={{ height: "100%" }} onClick={[nav, href]}>
                <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box color="primary.main">
                    {icon}
                  </Box>
                  <Box>
                    <Typography variant="h6">{label}</Typography>
                    <Typography variant="body2" color="text.secondary">{description}</Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Show>
        )}</For>
      </Box>

      <Typography variant="h2" gutterBottom sx={{ width: "100%", textAlign: "center" }}>
        Configuration
      </Typography>
      <Box sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(20em, 1fr))",
        gap: 3,
      }}>
        <For each={configs}>{({ label, description, href, icon, experimental }) => (
          <Show when={!experimental || flags.experimental}>
            <Card variant="outlined">
              <CardActionArea sx={{ height: "100%" }} onClick={[nav, href]}>
                <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box color="primary.main">
                    {icon}
                  </Box>
                  <Box>
                    <Typography variant="h6">{label}</Typography>
                    <Typography variant="body2" color="text.secondary">{description}</Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Show>
        )}</For>
      </Box>
    </>
  )
}
