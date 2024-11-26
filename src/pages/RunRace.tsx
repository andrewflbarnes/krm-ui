import { useParams } from "@solidjs/router"
import { createQuery } from "@tanstack/solid-query"
import { Match, Switch } from "solid-js"
import krmApi from "../api/krm"

export default function RunRace() {
  const params = useParams()
  const query = createQuery(() => ({
    queryKey: [`round-${params.raceid}`],
    queryFn: () => {
      console.log(`Starting query for ${params.raceid}`)
      const r = krmApi.getRound(params.raceid)
      console.log(`Completed query for ${params.raceid}`, r)
      return r
    },
  }))

  return (
    <Switch>
      <Match when={query.isLoading}>Loading...</Match>
      <Match when={!query.isSuccess || !query.data}>Races not found :(</Match>
      <Match when={query.data.status != "In Progress"}>
        TODO Races are complete
      </Match>
      <Match when={query.data.status == "In Progress"}>
        <>
          {query.data.date} {query.data.league}
        </>
      </Match>
    </Switch>
  )
}
