import { Box, List, ListItem, ListItemButton, ListItemText } from "@suid/material";
import { createSignal, For, ParentProps, Show } from "solid-js";
import { LeagueData } from "../kings";
import { parseResults } from "../kings/result-utils";
import DivisionResultsAll from "./DivisionResultsAll";

export default function ConfigClubs(props: ParentProps<{ data: LeagueData }>) {
  const [club, setClub] = createSignal<string>()

  const clubs = Object.keys(props.data).sort((a, b) => a.localeCompare(b))
console.log('clubs', clubs, props.data)
  const clubData = () => parseResults({ [club()]: props.data[club()] })
  return (
    <Box sx={{
      display: "flex",
      flexDirection: "row",
      gap: "1em",
    }}>
      <Box sx={{ width: "20%" }}>
        <List>
          <For each={clubs}>{(club) => (
            <ListItem disablePadding>
              <ListItemButton onClick={[setClub, club]}>
                <ListItemText primary={club} />
              </ListItemButton>
            </ListItem>
          )}
          </For>
        </List>
      </Box>
      <Show when={club()}>
        <DivisionResultsAll results={clubData()} />
      </Show>
    </Box>
  )
}
