import { For } from "solid-js";
import { Round } from "../api/krm";
import { raceConfig } from "../kings";

export default function RunRaceInProgress(props: { round: Round }) {
  const mixed = () => props.round.teams['mixed']
  return (
    <>
      {props.round.date} {props.round.league}
      <For each={mixed()}>{(team) => {
        return <div>{team}</div>
      }}</For>
      <pre>{JSON.stringify(raceConfig[mixed().length], null, 2)}</pre>
    </>
  )
}

