import { useParams } from "@solidjs/router";

export default function ManageRound() {
  const p = useParams<{ round: string; }>()
  return (
    <>
      TODO! Round: {p.round} teams
    </>
  )
}

