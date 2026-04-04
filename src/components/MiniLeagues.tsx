import Stack from "@suid/material/Stack";
import { For } from "solid-js";
import { Race, StageRaces } from "../kings";
import MiniLeague from "./MiniLeague";

type MiniLeaguesProps = {
  readonly: boolean;
  collapse: boolean;
  live: boolean;
  races: StageRaces;
  onRaceUpdate: (race: Race) => void;
}

export default function MiniLeagues(props: MiniLeaguesProps) {
  return (
    <Stack gap="2em" width="100%">
      <For each={Object.entries(props.races)}>{([div, divRaces]) => (
        <For each={Object.entries(divRaces)}>{([name, { races, teams }]) => (
          <MiniLeague
            live={props.live}
            collapsed={props.collapse}
            name={div.capitalize() + " " + name}
            races={races}
            teams={teams}
            onResultChange={props.onRaceUpdate}
            readonly={props.readonly}
          />
        )}</For>
      )}</For>
    </Stack>
  )
}
