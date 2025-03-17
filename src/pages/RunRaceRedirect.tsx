import { useNavigate } from "@solidjs/router"
import { Typography } from "@suid/material"
import { createEffect, Match, Switch } from "solid-js"
import { useRaceOptions } from "../hooks/results"

export default function RunRaceRedirect() {
  const { useRound, setStage } = useRaceOptions()
  const query = useRound()
  const navigate = useNavigate()
  createEffect(() => {
    if (!query.data) {
      return
    }
    const round = query.data
    const status = round.status
    if (status === "abandoned") {
      navigate(`/${round.id}/${round.status}`, { replace: true })
      return
    }
    setStage(status)
  })
  return (
    <Typography>
      <Switch>
        <Match when={query.isPending}>
          Fetching round data...
        </Match>
        <Match when={query.isFetched && !query.data}>
          A round with this ID does not exist :(
        </Match>
        <Match when={query.isError}>
          A round with this ID does not exist :(
        </Match>
        <Match when={query.data}>
          Redirecting to current stage...
        </Match>
      </Switch>
    </Typography>
  )
}
