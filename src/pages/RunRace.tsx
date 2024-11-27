import { useParams } from "@solidjs/router"
import { Typography } from "@suid/material"
import { createQuery } from "@tanstack/solid-query"
import { Match, Switch } from "solid-js"
import krmApi from "../api/krm"
import RunRaceInProgress from "../components/RunRaceInProgress"

export default function RunRace() {
  const params = useParams()
  const query = createQuery(() => ({
    queryKey: [`round-${params.raceid}`],
    queryFn: () => krmApi.getRound(params.raceid)
  }))

  return (
    <Switch>
      <Match when={query.isLoading}>Loading...</Match>
      <Match when={!query.isSuccess || !query.data}>Races not found :(</Match>
      <Match when={query.data.status != "In Progress"}>
        <Typography>
          TODO Races are complete for this {query.data.league} round.
        </Typography>
        <Typography>
          Date: {query.data.date.toLocaleDateString()}
        </Typography>
        <Typography>
          {query.data.description}
        </Typography>
      </Match>
      <Match when={query.data.status == "In Progress"}>
        <RunRaceInProgress round={query.data} />
      </Match>
    </Switch>
  )
}
