import { Button, Card, CardContent, FormControlLabel, IconButton, Modal, Switch as InputSwitch } from "@suid/material";
import { createComputed, createMemo, createSignal, ErrorBoundary, on, Show } from "solid-js";
import { Round } from "../api/krm";
import Selector from "../ui/Selector";
import RunRaceInProgressStage from "./RunRaceInProgressStage";
import { Settings } from "@suid/icons-material";
import PopoverButton from "../ui/PopoverButton";

export default function RunRaceInProgress(props: { round: Round }) {
  return (
    <ErrorBoundary fallback={e => (
      <>
        <div>
          Something went wrong - race configuration for that number of teams or stage probably doesn't exist yet :(
        </div>
        <div>
          {e.message}
        </div>
      </>
    )}>
      <RunRaceInProgressInternal round={props.round} />
    </ErrorBoundary>
  )
}

function RunRaceInProgressInternal(props: { round: Round }) {
  const [actionsOpen, setActionsOpen] = createSignal(false)
  const handleClose = () => {
    setActionsOpen(false)
  }

  const stages = {
    "set1": "Stage 1",
    //"set2": "Stage 2",
    //"knockout": "Knockouts",
  } as const
  type Stage = keyof typeof stages
  const stageOptions = Object.entries(stages).map(([value, label]) => ({ value, label }))
  const [stage, setStage] = createSignal<Stage>("set1")
  createComputed(on(() => props.round.status, () => {
    const roundStage = (function() {
      switch (props.round.status) {
        case "set1":
        //case "set2":
        //case "knockout":
          return props.round.status
        default:
          return stage()
      }
    })()
    setStage(roundStage)
  }))
  const views = {
    "list": "Race List",
    "mini": "Mini Leagues",
    "both": "Both",
  } as const
  const options = Object.entries(views).map(([value, label]) => ({ value, label }))
  type View = keyof typeof views
  const [view, setView] = createSignal<View>("list")
  const errors = createMemo(() => {
    // FIXME don't hardcode set 1
    return Object.entries(props.round.races[stage()]).reduce((acc, [div, divRaces]) => {
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

  const readonly = () => props.round.status != stage()
  const [mlLive, setMlLive] = createSignal(false)
  const [mlCollapse, setMlCollapse] = createSignal(false)
  const [northern, setNorthern] = createSignal(false)
  const splits = () => 3

  const proceed = () => {
    return Object.values(props.round.races[stage()]).every(g => Object.values(g).every(r => r.complete))
  }

  return (
    <div style={{ height: "100%", display: "flex", "flex-direction": "column" }}>
      <IconButton sx={{ position: "absolute", right: 0 }} onClick={[setActionsOpen, true]}>
        <Settings fontSize="small" />
      </IconButton>
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
          options={stageOptions}
        />
        <Selector
          containerProps={{ style: { "min-width": "10em" } }}
          title="View"
          current={views[view()]}
          onClose={(v: View) => setView(v ?? view())}
          options={options}
        />
        <div style={{ "margin-left": "auto" }}>
          <Show when={errors().length}>
            <PopoverButton
              errors={errors()}
            />
          </Show>
          <Show when={proceed() && !errors().length}>
            <Button
              color="success"
              variant="outlined"
              onClick={() => alert('todo')}
            >
              Start Stage 2
            </Button>
          </Show>
        </div>
      </div>
      <RunRaceInProgressStage
        round={props.round}
        readonly={readonly()}
        stage={stage()}
        live={mlLive()}
        collapse={mlCollapse()}
        northern={northern()}
        splits={splits()}
        view={view()}
      />
    </div>
  )
}
