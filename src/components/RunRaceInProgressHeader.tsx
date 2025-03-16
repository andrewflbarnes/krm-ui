import { Button, Card, CardContent, FormControlLabel, Modal, Switch as InputSwitch } from "@suid/material";
import { createMutation, useQueryClient } from "@tanstack/solid-query";
import { createEffect, createMemo, createSignal, on, Show } from "solid-js";
import { GroupRaces, RaceStage, Round } from "../kings";
import PopoverButton from "../ui/PopoverButton";
import Selector from "../ui/Selector";
import krmApi from "../api/krm";
import notification from "../hooks/notification";
import { ErrorOutlineRounded } from "@suid/icons-material";
import ModalConfirmAction from "../ui/ModalConfirmAction";
import { usePrint } from "../hooks/print";
import { Stage, stages, useRaceOptions, View, views } from "../hooks/results";

const options = Object.entries(views).map(([value, label]) => ({ value, label }))

const keepValidStages = (s: string, round: Round) => s == round.status || Object.values(round.config).some(c => c[s])

export default function RunRaceInProgressHeader(props: {
  round: Round;
}) {
  const {
    live,
    switchLive,
    collapse,
    switchCollapse,
    northern,
    switchNorthern,
    view,
    setView,
    stage,
    setStage,
  } = useRaceOptions()
  const [actionsOpen, setActionsOpen] = createSignal(false)
  const handleClose = () => {
    setActionsOpen(false)
  }
  const stageFilter = () => {
    const idx = Object.keys(stages).indexOf(props.round.status)
    return (idx > -1 ? idx : Object.keys(stages).length) + 1
  }
  const stageOptions = () => Object.entries(stages).slice(0, stageFilter())
    .filter(([s]) => keepValidStages(s, props.round))
    .map(([value, label]) => ({ value, label }))

  const errors = createMemo(() => {
    return Object.entries(props.round.races[stage()] || {}).reduce((acc, [div, divRaces]: [string, GroupRaces[]]) => {
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

  const proceed = () => {
    if (errors().length) {
      return false
    }

    const races = props.round.races[props.round.status]
    if (!races) {
      return false
    }

    return Object.values(races).every(g => Object.values(g).every(r => r.complete))
  }

  const canReopen = () => stage() != props.round.status

  const proceedText = () => {
    const possibleStages = Object.entries(stages).filter(([s]) => keepValidStages(s, props.round))
    const currentStageIndex = possibleStages.findIndex(([s]) => s == props.round.status)
    if (currentStageIndex == possibleStages.length - 1) {
      return "Finish"
    }
    if (currentStageIndex == -1) {
      return `This shouldn't be showing (${props.round.status})!`
    }
    return `Start ${possibleStages[currentStageIndex + 1][1]}`
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

  const reopenStage = createMutation(() => ({
    mutationKey: ["reopenStage"],
    mutationFn: async (data: { id: string, stage: RaceStage }) => new Promise((res) => {
      krmApi.reopenStage(data.id, data.stage);
      res({});
    }),
    onSuccess: () => {
      notification.success("Reopend stage at " + stages[stage()])
      queryClient.invalidateQueries({
        queryKey: [props.round.id],
      })
    }
  }))

  const [reopenConfirmation, setReopenConfirmation] = createSignal(false)
  const handleConfirmReopen = () => {
    setReopenConfirmation(true)
  }
  const handleReopen = () => {
    const s = stage()
    if (s == "complete") {
      notification.error("Cannot reopen round at completion - YOU SHOULD NEVER SEE THIS!")
      return
    }
    reopenStage.mutate({
      id: props.round.id,
      stage: s,
    })
    setReopenConfirmation(false)
  }

  createEffect(on(() => reopenStage.isPending, (pend) => {
    if (!pend && reopenStage.error) {
      notification.error(`Failed to reopen stage: ${progressRound.error.message}`)
    }
  }))

  const [print, setPrint] = usePrint()

  return (
    <>
      <Modal onClose={handleClose} open={actionsOpen()} sx={{ display: "grid", height: "100%", width: "100%", placeItems: "center" }}>
        <Card sx={{ width: "50%" }}>
          <CardContent>
            <div style={{ display: "flex", "flex-direction": "column", "align-items": "center" }}>
              <FormControlLabel
                control={<InputSwitch checked={northern()} onChange={switchNorthern} />}
                label="Race list: northern style"
              />
              <FormControlLabel
                control={<InputSwitch checked={collapse()} onChange={switchCollapse} />}
                label="Minileague: collapse"
              />
              <FormControlLabel
                control={<InputSwitch checked={live()} onChange={switchLive} />}
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
          onClose={(v: Stage) => setStage(current => v ?? current)}
          options={stageOptions()}
        />
        <Show when={stage() != "complete"}>
          <Selector
            containerProps={{ style: { "min-width": "10em" } }}
            title="View"
            current={views[view()]}
            onClose={(v: View) => setView(current => v ?? current)}
            options={options}
          />
        </Show>
        <div style={{ "margin-left": "auto", display: "flex", gap: "1em" }}>
          <Show when={stage() != "complete"}>
            <Show when={errors().length}>
              <PopoverButton
                title="Errors"
                messages={errors()}
                color="error"
                startIcon={<ErrorOutlineRounded />}
              />
            </Show>
            <Show when={canReopen()}>
              <Button
                onClick={handleConfirmReopen}
              >
                Reopen
              </Button>
              <ModalConfirmAction
                open={reopenConfirmation()}
                confirmLabel="Yes"
                onConfirm={handleReopen}
                discardLabel="No"
                onDiscard={() => setReopenConfirmation(false)}
                confirmText="reopen"
              >
                Are you sure? This will clear all results after this stage.
              </ModalConfirmAction>
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
              disabled={print()}
              onClick={() => setPrint(true)}
            >
              Print
            </Button>
            <Button
              onClick={[setActionsOpen, true]}
            >
              Options
            </Button>
          </Show>
        </div>
      </div>
    </>
  )
}
