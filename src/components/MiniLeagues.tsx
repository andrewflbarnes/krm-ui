import Stack from "@suid/material/Stack";
import { For } from "solid-js";
import { GroupRaces, Race } from "../kings";
import MiniLeague from "./MiniLeague";

type MiniLeaguesProps = {
  readonly: boolean;
  collapse: boolean;
  live: boolean;
  races: {
    division: string;
    groups: {
      group: string;
      races: GroupRaces;
    }[]
  }[];
  onRaceUpdate: (race: Race) => void;
}

export default function MiniLeagues(props: MiniLeaguesProps) {
  return (
    <Stack gap="2em" width="100%">
      <For each={props.races}>{({ division, groups }) => (
        <For each={groups}>{({ group, races }) => (
          <MiniLeague
            live={props.live}
            collapsed={props.collapse}
            name={division.capitalize() + " " + group}
            races={races.races}
            teams={races.teams}
            onResultChange={props.onRaceUpdate}
            readonly={props.readonly}
          />
        )}</For>
      )}</For>
    </Stack>
  )
}
