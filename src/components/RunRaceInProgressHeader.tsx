import { Button, Card, CardContent, FormControlLabel, IconButton, Modal, Switch as InputSwitch } from "@suid/material";
import { createMutation, useQueryClient } from "@tanstack/solid-query";
import { createEffect, createMemo, createSignal, on, Show } from "solid-js";
import { Round } from "../kings";
import PopoverButton from "../ui/PopoverButton";
import Selector from "../ui/Selector";
import krmApi from "../api/krm";
import notification from "../hooks/notification";
import { ErrorOutlineRounded, Upload } from "@suid/icons-material";
import ModalConfirmAction from "../ui/ModalConfirmAction";
import { useAuth } from "../hooks/auth";

const stages = {
  "stage1": "Stage 1",
  "stage2": "Stage 2",
  "knockout": "Knockouts",
  "complete": "Results",
} as const
export type Stage = keyof typeof stages

const views = {
  "list": "Race List",
  "mini": "Mini Leagues",
  "both": "Both",
} as const
export type View = keyof typeof views
const options = Object.entries(views).map(([value, label]) => ({ value, label }))

export default function RunRaceInProgressHeader(props: {
  round: Round;
  northern: boolean;
  onNorthernChange: () => void;
  collapse: boolean;
  onCollapseChange: () => void;
  live: boolean;
  onLiveChange: () => void;
  view: View;
  onViewChange: (v: View) => void;
  stage: Stage;
  onStageChange: (s: Stage) => void;

}) {
  const [actionsOpen, setActionsOpen] = createSignal(false)
  const handleClose = () => {
    setActionsOpen(false)
  }
  const stageFilter = () => {
    const idx = Object.keys(stages).indexOf(props.round.status)
    return (idx > -1 ? idx : Object.keys(stages).length) + 1
  }
  const stageOptions = () => Object.entries(stages).slice(0, stageFilter()).map(([value, label]) => ({ value, label }))

  const errors = createMemo(() => {
    return Object.entries(props.round.races[props.stage] || {}).reduce((acc, [div, divRaces]) => {
      Object.entries(divRaces).forEach(([group, dr]) => {
        if (dr.conflict) {
          const draws = dr.results?.filter(r => r.length > 1) || []
          if (draws.length) {
            draws.forEach(draw => acc.push(`Draw in ${div} group ${group}: ${draw.join(", ")}`))
          }
        }
      })
      return acc
    }, [])
  })

  const { userId, authenticated } = useAuth()
  const owned = () => props.round.owner == "local" || props.round.owner == userId()

  const proceed = () => {
    if (!owned()) {
      return false
    }

    if (errors().length) {
      return false
    }

    const races = props.round.races[props.round.status]
    if (!races) {
      return false
    }

    return Object.values(races).every(g => Object.values(g).every(r => r.complete))
  }

  const proceedText = () => {
    switch (props.round.status) {
      case "stage1":
        return "Start Stage 2"
      case "stage2":
        return "Start Knockouts"
      case "knockout":
        return "Finish"
      default:
        return `This shouldn't be showing (${props.round.status})!`
    }
  }

  const queryClient = useQueryClient()

  const progressRound = createMutation(() => ({
    mutationKey: ["progressRound"],
    mutationFn: async (data: { id: string }) => new Promise((res) => {
      krmApi.progressRound(data.id);
      res({});
    }),
    onSuccess: () => {
      notification.success("Round progressed")
      queryClient.invalidateQueries({
        queryKey: [props.round.id],
      })
    }
  }))

  createEffect(on(() => progressRound.isPending, (pend) => {
    if (!pend && progressRound.error) {
      notification.error(`Failed to progress round: ${progressRound.error.message}`)
    }
  }))

  const [progressConfirmation, setProgressConfirmation] = createSignal(false)
  const handleConfirmProgress = () => {
    setProgressConfirmation(true)
  }
  const handleProgress = () => {
    progressRound.mutate({
      id: props.round.id,
    })
    setProgressConfirmation(false)
  }

  return (
    <>
      <Modal onClose={handleClose} open={actionsOpen()} sx={{ display: "grid", height: "100%", width: "100%", placeItems: "center" }}>
        <Card sx={{ width: "50%" }}>
          <CardContent>
            <div style={{ display: "flex", "flex-direction": "column", "align-items": "center" }}>
              <FormControlLabel
                control={<InputSwitch checked={props.northern} onChange={props.onNorthernChange} />}
                label="Race list: northern style"
              />
              <FormControlLabel
                control={<InputSwitch checked={props.collapse} onChange={props.onCollapseChange} />}
                label="Minileague: collapse"
              />
              <FormControlLabel
                control={<InputSwitch checked={props.live} onChange={props.onLiveChange} />}
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
          current={stages[props.stage]}
          onClose={(v: Stage) => props.onStageChange(v ?? props.stage)}
          options={stageOptions()}
        />
        <Selector
          containerProps={{ style: { "min-width": "10em" } }}
          title="View"
          disabled={props.stage == "complete"}
          current={props.stage == "complete" ? "-" : views[props.view]}
          onClose={(v: View) => props.onViewChange(v ?? props.view)}
          options={options}
        />
        <div style={{ "margin-left": "auto", display: "flex", gap: "1em" }}>
          <Show when={owned()}>
            <IconButton disabled={!authenticated()}>
              <Upload />
            </IconButton>
          </Show>
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
              onClick={handleConfirmProgress}
            >
              {proceedText()}
            </Button>
            <ModalConfirmAction
              open={progressConfirmation()}
              confirmLabel="Yes"
              onConfirm={handleProgress}
              discardLabel="No"
              onDiscard={() => setProgressConfirmation(false)}
            >
              Are you sure? This will lock in the current results.
            </ModalConfirmAction>
          </Show>
          <Button
            onClick={[setActionsOpen, true]}
          >
            Options
          </Button>
        </div>
      </div>
    </>
  )
}
