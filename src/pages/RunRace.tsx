import { ErrorBoundary, JSXElement, Match, onCleanup, onMount, ParentProps, Show, Suspense, Switch } from "solid-js"
import { useKings } from "../kings"
import { useRaceOptions } from "../hooks/results"
import { Box, Card, CardContent, CircularProgress, Typography } from "@suid/material"
import { SearchOff } from "@suid/icons-material"

function StateCard(props: { icon: JSXElement, title: string, body: string }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 8 }}>
      <Card sx={{ maxWidth: 420, width: "100%", textAlign: "center" }} elevation={3}>
        <CardContent sx={{ py: 5, px: 4 }}>
          {props.icon}
          <Typography variant="h5" gutterBottom>{props.title}</Typography>
          <Typography variant="body1" color="text.secondary">{props.body}</Typography>
        </CardContent>
      </Card>
    </Box>
  )
}

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
            <StateCard
              icon={<CircularProgress size={56} sx={{ mb: 2 }} />}
              title="Loading races"
              body="Please wait while race data is being fetched..."
            />
          </Match>
          <Match when={!query.isSuccess || !query.data}>
            <StateCard
              icon={<SearchOff sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />}
              title="Races not found"
              body="No race data could be loaded. Please verify the race ID in the URL is correct and try again."
            />
          </Match>
        </Switch>
      </Suspense>
    </ErrorBoundary>
  )
}
