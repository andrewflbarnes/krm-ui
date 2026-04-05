import { useParams } from "@solidjs/router";
import { Box, List, ListItemButton, ListItemText } from "@suid/material";
import { createSelector, For, Show } from "solid-js";
import Link from "../components/Link";
import ManageConfigRound from "../components/ManageConfigRound";
import { useCustomRounds } from "../hooks/custom-config";
import { raceConfig, RoundConfig } from "../kings";

export default function ConfigRound() {
  const p = useParams<{ round?: string; }>()
  const selected = createSelector(() => p.round)
  const customRounds = useCustomRounds()
  const config = (): RoundConfig => {
    const standardConfig = raceConfig[p.round]
    if (standardConfig) {
      return standardConfig
    }
    return customRounds()?.configs?.find(c => c.id == p.round)?.config
  }
  return (
    <Box sx={{ display: "flex", flexDirection: "row", gap: "16px", height: "100%" }}>
      <Box sx={{ flexGrow: p.round ? 0 : 1, height: "100%", padding: "8px", overflow: "scroll" }} >
        <List>
          <For each={Object.keys(raceConfig).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))}>{round =>
            <Link href={round} start>
              <ListItemButton selected={selected(round)}>
                <ListItemText>
                  {round} team{round === "1" ? "" : "s"}
                </ListItemText>
              </ListItemButton>
            </Link>
          }</For>
          <Show when={customRounds().configs?.length > 0}>
            <For each={customRounds().configs}>{({ id: round }) =>
              <Link href={round} start>
                <ListItemButton selected={selected(round)}>
                  <ListItemText>
                    Custom {round}
                  </ListItemText>
                </ListItemButton>
              </Link>
            }</For>
          </Show>
        </List>
      </Box>

      <Show when={p.round}>
        <Box sx={{ flexGrow: 1, height: "100%", padding: "8px", overflow: "scroll" }} >
          <ManageConfigRound title={`${p.round} teams`} config={config()} />
        </Box>
      </Show>
    </Box>
  )
}

