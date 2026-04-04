import { useParams } from "@solidjs/router";
import { Box, List, ListItemButton, ListItemText } from "@suid/material";
import { createSelector, For, Show } from "solid-js";
import Link from "../components/Link";
import ManageConfigMiniLeague from "../components/ManageConfigMiniLeague";
import { useCustomMinileagues } from "../hooks/custom-config";
import { miniLeagueTemplates } from "../kings";

export default function ManageMiniLeague() {
  const p = useParams<{ ml?: string; }>()
  const selected = createSelector(() => p.ml)
  const customMls = useCustomMinileagues()

  return (
    <Box sx={{ display: "flex", flexDirection: "row", gap: "16px", height: "100%" }}>
      <Box sx={{ flexGrow: p.ml ? 0 : 1, height: "100%", padding: "8px", overflow: "scroll" }} >
        <List>
          <For each={Object.keys(miniLeagueTemplates).sort()}>{ml =>
            <Link href={ml} start>
              <ListItemButton selected={selected(ml)}>
                <ListItemText>
                  {ml}
                </ListItemText>
              </ListItemButton>
            </Link>
          }</For>
          <Show when={customMls().configs?.length > 0}>
            <For each={customMls().configs}>{({ id: ml }) =>
              <Link href={ml} start>
                <ListItemButton selected={selected(ml)}>
                  <ListItemText>
                    Custom {ml}
                  </ListItemText>
                </ListItemButton>
              </Link>
            }</For>
          </Show>
        </List>
      </Box>

      <Show when={p.ml}>{ml => {
        const template = miniLeagueTemplates[ml()] ?? customMls().configs?.find(c => c.id === p.ml)?.config
        return (
          <Box sx={{ flexGrow: 1, height: "100%", padding: "8px", overflow: "scroll" }} >
            <ManageConfigMiniLeague name={ml()} template={template} />
          </Box>
        )
      }}</Show>
    </Box>
  )
}
