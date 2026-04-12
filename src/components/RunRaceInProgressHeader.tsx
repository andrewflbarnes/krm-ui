import { Box, Button, Card, CardContent, FormControlLabel, Modal, Stack, Switch as InputSwitch } from "@suid/material";
import { useMutation, useQueryClient } from "@tanstack/solid-query";
import { createEffect, createMemo, createSignal, on, Show } from "solid-js";
import { GroupRaces, RaceStage, Round } from "../kings";
import PopoverButton from "../ui/PopoverButton";
import Selector from "../ui/Selector";
import krmApi, { ProgressionStage } from "../api/krm";
import notification from "../hooks/notification";
import { ErrorOutlineRounded } from "@suid/icons-material";
import ModalConfirmAction from "../ui/ModalConfirmAction";
import { usePrint } from "../hooks/print";
import { stages, useRaceOptions, View, views } from "../hooks/results";
import { checkStage, isStage } from "../kings/utils";
import { useAuth } from "../hooks/auth";
import Stepper from "../ui/Stepper";

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

  const { userId } = useAuth()
  const owned = () => props.round.owner == "local" || props.round.owner == userId()

  const proceed = () => {
    if (!owned()) {
      return false
    }

    if (errors().length) {
      return false
    }

    if (props.round.status != stage()) {
      return false
    }

    const races = checkStage(props.round.status) ? props.round.races[props.round.status] : null
    if (!races) {
      return true
    }

    return Object.values(races).every(g => Object.values(g).every(r => r.complete))
  }

  const canReopen = () => stage() != props.round.status && owned()

  const [print, setPrint] = usePrint()

  const roundStages = createMemo(() => {
    const roundConfigs = Object.values(props.round.config)
    const roundKeys = Object.keys(stages)
    const currentIdx = roundKeys.indexOf(props.round.status)
    return Object.entries(stages)
      .filter(([s]) => s === "complete" || roundConfigs.some(c => c[s]))
      .map(([key, label]) => {
        const idx = roundKeys.indexOf(key);
        const enabled = idx <= currentIdx
        return {
          key,
          label,
          enabled,
        }
      })
  })

  return (
    <>
      <Modal onClose={handleClose} open={actionsOpen()} sx={{ display: "grid", height: "100%", width: "100%", placeItems: "center" }}>
        <Card sx={{ width: "50%" }}>
          <CardContent>
            <Stack alignItems="center">
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
            </Stack>
          </CardContent>
        </Card>
      </Modal>
      <Card sx={{ p: 1, pb: 3, display: "flex", flexDirection: "column", gap: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Stepper
            steps={roundStages()}
            selected={stage()}
            onSelect={setStage}
            current={props.round.status}
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, pt: 1 }}>
          <Show when={stage() != "complete"}>
            <Selector
              containerProps={{ style: { "min-width": "10em" } }}
              title="View"
              current={view()}
              onClose={(v: View) => setView(current => v ?? current)}
              options={options}
              defaultBackground
            />
          </Show>
          <Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
            <Show when={isStage(stage())} keyed>{s => (
              <>
                <Show when={errors().length}>
                  <PopoverButton
                    title="Errors"
                    messages={errors()}
                    color="error"
                    startIcon={<ErrorOutlineRounded />}
                  />
                </Show>
                <Show when={canReopen()}>
                  <ReopenButton id={props.round.id} stage={s} />
                </Show>
                <Show when={proceed()}>
                  <ProgressButton round={props.round} />
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
              </>
            )}</Show>
          </Box>
        </Box>
      </Card>
    </>
  )
}

function ProgressButton(props: {
  round: Round;
}) {
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
  const { setStage } = useRaceOptions()

  const progressRound = useMutation(() => ({
    mutationKey: ["progressRound"],
    mutationFn: async (data: { id: string }) => new Promise<ProgressionStage>((res) => {
      const nextStatus = krmApi.progressRound(data.id);
      res(nextStatus);
    }),
    onSuccess: (nextStatus) => {
      notification.success("Round progressed")
      queryClient.invalidateQueries({
        queryKey: [props.round.id],
      })
      setStage(nextStatus)
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
    </>
  )
}

function ReopenButton(props: {
  id: string;
  stage: RaceStage;
}) {
  const queryClient = useQueryClient()

  const reopenStage = useMutation(() => ({
    mutationKey: ["reopenStage"],
    mutationFn: async (data: { id: string, stage: RaceStage }) => new Promise((res) => {
      krmApi.reopenStage(data.id, data.stage);
      res({});
    }),
    onSuccess: () => {
      notification.success("Reopened stage at " + stages[props.stage])
      queryClient.invalidateQueries({
        queryKey: [props.id],
      })
    }
  }))

  const [reopenConfirmation, setReopenConfirmation] = createSignal(false)
  const handleConfirmReopen = () => {
    setReopenConfirmation(true)
  }
  const handleReopen = () => {
    reopenStage.mutate({
      id: props.id,
      stage: props.stage,
    })
    setReopenConfirmation(false)
  }

  createEffect(on(() => reopenStage.isPending, (pend) => {
    if (!pend && reopenStage.error) {
      notification.error(`Failed to reopen stage: ${reopenStage.error.message}`)
    }
  }))
  return (
    <>
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
    </>
  )
}
