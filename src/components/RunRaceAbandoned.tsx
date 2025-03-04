import { Typography } from "@suid/material";
import { Round } from "../kings";

export default function RunRaceAbandoned(props: { round: Round }) {
  return (
    <>
      <Typography>
        TODO Races were abandoned for this {props.round.league} round.
      </Typography>
      <Typography>
        Date: {props.round.date.toLocaleDateString()}
      </Typography>
      <Typography>
        {props.round.description}
      </Typography>
    </>
  )
}
