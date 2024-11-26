import { List, ListItem, Stack, Typography } from "@suid/material";
import { For } from "solid-js";
import { LeagueData, useKings } from "../kings";
import { parseResults } from "../kings/result-utils";
import { ClubTeamNumbers } from "./RaceStart1Select";

function getSeeding(lConfig: LeagueData, data: ClubTeamNumbers): {
  mixed: string[];
  ladies: string[];
  board: string[];
} {
  const s = Object.entries(parseResults(lConfig)).reduce((acc, [division, seeded]) => {
    acc[division] = seeded.filter(t => {
      let teamIndex = +t.name.replace(/.*?(\d*)$/, "$1") >>> 0
      if (teamIndex != 0) {
        --teamIndex
      }
      return data[t.club]?.[division] > teamIndex
    }).map(({ name }) => name)
    return acc
  }, {
    mixed: [],
    ladies: [],
    board: [],
  })

  return s
}

export default function RaceStart2Confirm(props: { data: ClubTeamNumbers }) {
  const [k] = useKings()
  const seeds = () => getSeeding(k.leagueConfig(), props.data)
  return (
    <Stack direction="row" justifyContent="space-evenly">
      <For each={Object.entries(seeds())}>{([division, teams]) => {
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
