import { Typography } from "@suid/material";
import { useRaceOptions } from "../hooks/results";

export default function RunRaceAbandoned() {
  const { useRound } = useRaceOptions()
  const query = useRound()
  const round = () => query.data
  return (
    <>
      <Typography>
        Races were abandoned for this {round().league} round.
      </Typography>
      <Typography>
        Date: {round().date.toLocaleDateString()}
      </Typography>
      <Typography>
        {round().description}
      </Typography>
    </>
  )
}
