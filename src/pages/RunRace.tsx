import { useParams } from "@solidjs/router"
import { createQuery } from "@tanstack/solid-query"
import { ErrorBoundary, Match, onCleanup, onMount, Suspense, Switch } from "solid-js"
import krmApi from "../api/krm"
import { Round } from "../kings"
import RunRaceInProgress from "../components/RunRaceInProgress"
import RunRaceComplete from "../components/RunRaceComplete"
import { useKings } from "../kings"

export default function RunRace() {
  const [, { lock, unlock }] = useKings()
  // We lock as an indicator to the user that the it doesn't make sense to be
  // able to change league while they are running races, even though changing
  // it has no impact.
  onMount(() => lock())
  onCleanup(() => unlock())
  const params = useParams()
  const query = createQuery<Round>(() => ({
    queryKey: [params.raceid],
    queryFn: async () => new Promise((res) => {
      res(krmApi.getRound(params.raceid))
    }),
    staleTime: 1000 * 60 * 5,
  }))

  const inProgress = () => query.data.status != "abandoned"
  return (
    <ErrorBoundary fallback={e => e}>
      <Suspense fallback="Loading...">
        <Switch>
          <Match when={query.isLoading}>Loading...</Match>
          <Match when={!query.isSuccess || !query.data}>Races not found :(</Match>
          <Match when={!inProgress()}>
            <RunRaceComplete round={query.data} />
          </Match>
          <Match when={inProgress()}>
            <RunRaceInProgress round={query.data} />
          </Match>
        </Switch>
      </Suspense>
    </ErrorBoundary>
  )
}
