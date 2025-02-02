import { Button, Card, CardContent, FormControlLabel, Modal, Switch as InputSwitch } from "@suid/material";
import { createComputed, createEffect, createMemo, createSignal, Match, on, Show, Switch } from "solid-js";
import { Round } from "../api/krm";
import Selector from "../ui/Selector";
import RunRaceInProgressStage from "./RunRaceInProgressStage";
import { ErrorOutlineRounded } from "@suid/icons-material";
import PopoverButton from "../ui/PopoverButton";
import BasicErrorBoundary from "../ui/BasicErrorBoundary";
import { createMutation, useQueryClient } from "@tanstack/solid-query";
import krmApi from "../api/krm";
import notification from "../hooks/notification";
import RunRaceInProgressHeader, { type Stage, type View } from "./RunRaceInProgressHeader";

export default function RunRaceInProgress(props: { round: Round }) {
  return (
    <BasicErrorBoundary message="race configuration for that number of teams or stage probably doesn't exist yet">
      <RunRaceInProgressInternal round={props.round} />
    </BasicErrorBoundary>
  )
}

function isStage(s: string): "stage1" | "stage2" | null {
  return s == "stage1" || s == "stage2" ? s : null
}

function isKnockout(s: string): "knockout" | null {
  return s == "knockout" ? s : null
}

function RunRaceInProgressInternal(props: { round: Round }) {
  const [stage, setStage] = createSignal<Stage>("knockout")
  createComputed(on(() => props.round.status, () => {
    const roundStage = (function() {
      switch (props.round.status) {
        case "stage1":
        case "stage2":
        case "knockout":
          return props.round.status
        default:
          return stage()
      }
    })()
    setStage(roundStage)
  }))

  const [view, setView] = createSignal<View>("list")

  const readonly = () => props.round.status != stage()
  const [mlLive, setMlLive] = createSignal(false)
  const [mlCollapse, setMlCollapse] = createSignal(false)
  const [northern, setNorthern] = createSignal(false)
  const splits = () => 3

  return (
    <div style={{ height: "100%", display: "flex", "flex-direction": "column" }}>
      <RunRaceInProgressHeader
        round={props.round}
        northern={northern()}
        onNorthernChange={() => setNorthern(v => !v)}
        collapse={mlCollapse()}
        onCollapseChange={() => setMlCollapse(v => !v)}
        live={mlLive()}
        onLiveChange={() => setMlLive(v => !v)}
        view={view()}
        onViewChange={setView}
        stage={stage()}
        onStageChange={setStage}
      />
      {/*
      <Modal onClose={handleClose} open={actionsOpen()} sx={{ display: "grid", height: "100%", width: "100%", placeItems: "center" }}>
        <Card sx={{ width: "50%" }}>
          <CardContent>
            <div style={{ display: "flex", "flex-direction": "column", "align-items": "center" }}>
              <FormControlLabel
                control={<InputSwitch checked={northern()} onChange={() => setNorthern(v => !v)} />}
                label="Race list: northern style"
              />
              <FormControlLabel
                control={<InputSwitch checked={mlCollapse()} onChange={() => setMlCollapse(v => !v)} />}
                label="Minileague: collapse"
              />
              <FormControlLabel
                control={<InputSwitch checked={mlLive()} onChange={() => setMlLive(v => !v)} />}
                label="Minileague: live resuts"
              />
            </div>
          </CardContent>
        </Card>
      </Modal>
      <div style={{ "padding": "1em", gap: "1em", display: "flex", "align-items": "center", "justify-content": "start" }}>
        <Selector
          containerProps={{ style: { "min-width": "10em" } }}
          title="Stage"
          current={stages[stage()]}
          onClose={(v: Stage) => setStage(v ?? stage())}
          options={stageOptions()}
        />
        <Selector
          containerProps={{ style: { "min-width": "10em" } }}
          title="View"
          current={views[view()]}
          onClose={(v: View) => setView(v ?? view())}
          options={options}
        />
        <div style={{ "margin-left": "auto", display: "flex", gap: "1em" }}>
          <Show when={errors().length}>
            <PopoverButton
              title="Errors"
              messages={errors()}
              color="error"
              startIcon={<ErrorOutlineRounded />}
            />
          </Show>
          <Show when={proceed()}>
            <Button
              color="success"
              onClick={handleProgressRound}
            >
              {proceedText()}
            </Button>
          </Show>
          <Button
            onClick={[setActionsOpen, true]}
          >
            Options
          </Button>
        </div>
      </div>
      */}

      <Switch>
        <Match when={isKnockout(stage())}>
          <div>Knockouts are not yet implemented :(</div>
        </Match>
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
            live={mlLive()}
            collapse={mlCollapse()}
            northern={northern()}
            splits={splits()}
            view={view()}
          />
        }</Match>
        <Match when={true}>
          <div>Unknown stage: {stage()}</div>
        </Match>
      </Switch>
    </div>
  )
}
