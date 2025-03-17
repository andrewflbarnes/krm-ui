import { ErrorBoundary, Match, onCleanup, onMount, ParentProps, Show, Suspense, Switch } from "solid-js"
import { useKings } from "../kings"
import { useRaceOptions } from "../hooks/results"

export default function RunRace(props: ParentProps) {
  const [, { lock, unlock }] = useKings()
  // We lock as an indicator to the user that the it doesn't make sense to be
  // able to change league while they are running races, even though changing
  // it has no impact.
  onMount(() => lock())
  onCleanup(() => unlock())
  const { useRound } = useRaceOptions()
  const query = useRound()

  return (
    <ErrorBoundary fallback={e => e}>
      <Suspense fallback="Loading...">
        <Switch fallback={(
          <Show when={query.data}>
            {props.children}
          </Show>
        )}>
          <Match when={query.isLoading}>
            Loading...
          </Match>
          <Match when={!query.isSuccess || !query.data}>
            Races not found :(
          </Match>
        </Switch>
      </Suspense>
    </ErrorBoundary>
  )
}
