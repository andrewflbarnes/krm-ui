import { List, ListItem, Typography } from "@suid/material";
import { For } from "solid-js";
import { Division, Round, RoundConfig, RoundSeeding } from "../kings";

type ManageNewShuffleProps = {
  round: Round;
  onShuffle: (seeds: RoundSeeding) => void;
}

export default function ManageNewShuffle(props: ManageNewShuffleProps) {
  return (
    <div style={{ display: "flex", "flex-direction": "row", gap: "1rem" }}>
      <For each={Object.entries(props.round.config)}>{([division, config]: [Division, RoundConfig]) => {
        const seeds = () => props.round.teams[division]
        return (
          <Typography>
            <Typography variant="h2">
              {division}
            </Typography>
            <For each={config.stage1}>{(group) => {
              return (
                <div>
                  {group.name}
                  <List>
                    <For each={group.seeds}>{(seed) => {
                      return (
                        <ListItem>
                          {seeds()[seed.position - 1]}
                        </ListItem>
                      )
                    }}</For>
                  </List>
                </div>
              )
            }}</For>
          </Typography>
        )
      }}</For>
    </div>
  )
}
