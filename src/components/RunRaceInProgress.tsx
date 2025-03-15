import { createComputed, createSignal, Match, on, Switch } from "solid-js";
import { Round } from "../kings";
import RunRaceInProgressStage from "./RunRaceInProgressStage";
import BasicErrorBoundary from "../ui/BasicErrorBoundary";
import RunRaceInProgressHeader, { type Stage, type View } from "./RunRaceInProgressHeader";
import RunRaceResults from "./RunRaceResults";
import { Card } from "@suid/material";

export default function RunRaceInProgress(props: { round: Round }) {
  return (
    <BasicErrorBoundary message="race configuration for that number of teams or stage probably doesn't exist yet">
      <RunRaceInProgressInternal round={props.round} />
    </BasicErrorBoundary>
  )
}

function isStage(s: string): "knockout" | "stage1" | "stage2" | null {
  return s == "stage1" || s == "stage2" || s == "knockout" ? s : null
}

function RunRaceInProgressInternal(props: { round: Round }) {
  const [stage, setStage] = createSignal<Stage>("knockout")
  createComputed(on(() => props.round.status, () => {
    const roundStage = props.round.status !== "abandoned" ? props.round.status : stage()
    setStage(roundStage)
  }))

  const [view, setView] = createSignal<View>("list")

  const readonly = () => props.round.status != stage()
  const [live, setLive] = createSignal(false)
  const [collapse, setCollapse] = createSignal(false)
  const [northern, setNorthern] = createSignal(false)
  const splits = () => 3

  return (
    <div style={{ height: "100%", display: "flex", "flex-direction": "column" }}>
      <RunRaceInProgressHeader
        round={props.round}
        northern={northern()}
        onNorthernChange={() => setNorthern(v => !v)}
        collapse={collapse()}
        onCollapseChange={() => setCollapse(v => !v)}
        live={live()}
        onLiveChange={() => setLive(v => !v)}
        view={view()}
        onViewChange={setView}
        stage={stage()}
        onStageChange={setStage}
      />

      <Switch>
        {
          /* keyed match as the child contains an error boundary and we want to
           * force a re-render when the stage changes as in this case it can
           * take multiple values
           */
        }
        <Match when={isStage(stage())} keyed>{s =>
          <RunRaceInProgressStage
            round={props.round}
            readonly={readonly()}
            stage={s}
            live={live()}
            collapse={collapse()}
            northern={northern()}
            splits={splits()}
            view={view()}
          />
        }</Match>
        <Match when={stage() == "complete"}>
          <Card style={{ display: "flex", "justify-content": "center", padding: "0 2em 2em 2em", width: "fit-content", margin: "0 auto" }}>
            <RunRaceResults results={props.round.results} />
          </Card>
        </Match>
        <Match when={true}>
          <div>Unknown stage: {stage()}</div>
        </Match>
      </Switch>
    </div>
  )
}
