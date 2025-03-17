import { A } from "@solidjs/router";
import { Typography } from "@suid/material";
import { Show } from "solid-js";
import { useRaceOptions } from "../hooks/results";
import { Round } from "../kings";

export default function RunRaceAbandoned() {
  const { useRound } = useRaceOptions()
  const query = useRound()
  const round = () => query.data
  return (
    <Show when={round().status == "abandoned"} fallback={
      <GoToRace round={round()} />
    }>
      <Typography>
        Races were abandoned for this {round().league} round.
      </Typography>
      <Typography>
        Date: {round().date.toLocaleDateString()}
      </Typography>
      <Typography>
        {round().description}
      </Typography>
    </Show>
  )
}

function GoToRace(props: {
  round: Round;
}) {
  return (
    <div>
      This round hasn't been abandoned,
      &nbsp;
      <A href={`/${props.round.id}/${props.round.status}`} style={{ "text-decoration": "none" }}>
        <Typography color="primary" style={{ display: "inline" }}>
          view the latest stage here
        </Typography>
      </A>
    </div>
  )
}
