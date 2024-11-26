import { useParams } from "@solidjs/router"
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
        TODO Races are complete
      </Match>
      <Match when={query.data.status == "In Progress"}>
        <RunRaceInProgress round={query.data} />
      </Match>
    </Switch>
  )
}
