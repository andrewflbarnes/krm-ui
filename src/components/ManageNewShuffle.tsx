import { Typography } from "@suid/material";
import { For } from "solid-js";
import { Division, Round, RoundConfig, RoundSeeding } from "../kings";

type ManageNewShuffleProps = {
  round: Round;
  onShuffle: (seeds: RoundSeeding) => void;
}

export default function ManageNewShuffle(props: ManageNewShuffleProps) {
  return (
    <div style={{ display: "flex", "flex-direction": "row" }}>
      <For each={Object.entries(props.round.config)}>{([division, config]: [Division, RoundConfig]) => {
        const seeds = () => props.round.teams[division]
        return (
          <div>
            <Typography variant="h2">
              {division}
            </Typography>
            <For each={config.stage1}>{(group) => {
              return (
                <div>
                  {group.name}
                  <For each={group.seeds}>{(seed) => {
                    return (
                      <div>
                        {seeds()[seed.position - 1]}
                      </div>
                    )
                  }}</For>
                </div>
              )
            }}</For>
          </div>
        )
      }}</For>
    </div>
  )
}
