import { Match, Switch, Show } from "solid-js";
import RunRaceInProgressStage from "../components/RunRaceInProgressStage";
import BasicErrorBoundary from "../ui/BasicErrorBoundary";
import RunRaceInProgressHeader from "../components/RunRaceInProgressHeader";
import RunRaceResults from "../components/RunRaceResults";
import { Alert, Box, Button, Typography } from "@suid/material";
import { stages, useRaceOptions } from "../hooks/results";
import { isStage } from "../kings/utils";
import { useAuth } from "../hooks/auth";
import { useBreadcrumberUpdate } from "../hooks/breadcrumb";
import { useKings } from "../kings";

export default function RaceInProgress() {
  return (
    <BasicErrorBoundary message="race configuration for that number of teams or stage probably doesn't exist yet">
      <RaceInProgressInternal />
    </BasicErrorBoundary>
  )
}

function RaceInProgressInternal() {
  const {
    stage,
    useRound,
  } = useRaceOptions()
  const query = useRound()
  const round = () => query.data
  const [k, { loadConfig }] = useKings();

  useBreadcrumberUpdate(() => stages[stage()], 'Stage')

  const { userId } = useAuth()

  const readonly = () => round().status != stage() || (round().owner != userId() && round().owner != "local")

  return (
    <Box sx={{ height: 1, display: "flex", flexDirection: "column" }}>
      <RunRaceInProgressHeader round={round()} />

      <Switch>
        {
          /*
           * keyed match as the child contains an error boundary and we want to
           * force a re-render when the stage changes as in this case it can
           * take multiple values
           */
        }
        <Match when={isStage(stage())} keyed>{s =>
          <Show when={round().races[stage()]} fallback={<NoStageInRound stage={stage()} />}>
            <RunRaceInProgressStage
              round={round()}
              stage={s}
              readonly={readonly()}
            />
          </Show>
        }</Match>
        <Match when={stage() == "complete"}>
          <Box style={{ display: "flex", "justify-content": "center", padding: "2em", "overflow-y": "auto", height: "100%", width: "100%" }}>
            <RunRaceResults results={round().results} round={round().details.round} leagueConfig={k.leagueConfig()} />
          </Box>
          <Show when={!k.leagueConfig()}>
            <Alert
              severity="warning"
              sx={{ marginTop: "auto" }}
              action={
                <Button
                  color="inherit"
                  size="small"
                  onClick={[loadConfig, null]}
                >
                  Load league data
                </Button>
              }
            >
              No league data loaded, cannot generate HTML results
            </Alert>
          </Show>
        </Match>
        <Match when={true}>
          <Typography>Unknown stage: {stage()}</Typography>
        </Match>
      </Switch>
    </Box>
  )
}

function NoStageInRound(props: { stage: string }) {
  return (
    <Typography>
      This round does not have any races for {stages[props.stage] ?? props.stage}
    </Typography>
  )
}
