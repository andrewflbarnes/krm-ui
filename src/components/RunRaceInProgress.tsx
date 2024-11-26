import { Round } from "../api/krm";

export default function RunRaceInProgress(props: { round: Round }) {
  return (
    <>
      {props.round.date} {props.round.league}
    </>
  )
}

