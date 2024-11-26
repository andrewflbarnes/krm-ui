import { List, ListItem, Stack, Typography } from "@suid/material";
import { For } from "solid-js";
import { RoundSeeding } from "../kings";

export default function RaceStart2Confirm(props: { seeds: RoundSeeding }) {
  return (
    <Stack direction="row" justifyContent="space-evenly">
      <For each={Object.entries(props.seeds)}>{([division, teams]) => {
        return (
          <div>
            <Typography variant="h6">
              {division}&nbsp;
              <Typography variant="caption" color="textSecondary" marginLeft="auto">
                ({teams.length} teams)
              </Typography>
            </Typography>
            <List dense>
              <For each={teams}>{(team) => {
                return (
                  <ListItem dense sx={{ width: "100%", display: "flex" }}>
                    <Typography>
                      {team}
                    </Typography>
                  </ListItem>
                )
              }}
              </For>
            </List>
          </div>
        )
      }}
      </For>
    </Stack>
  )
}
