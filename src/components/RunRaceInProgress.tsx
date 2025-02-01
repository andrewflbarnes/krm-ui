import { Button, Card, CardContent, FormControlLabel, IconButton, Modal, Stack, Switch as InputSwitch } from "@suid/material";
import { createMutation, useQueryClient } from "@tanstack/solid-query";
import { createEffect, createMemo, createSelector, createSignal, ErrorBoundary, For, on, Show } from "solid-js";
import { Round, SetRaces } from "../api/krm";
import { Division, Race } from "../kings";
import Selector from "../ui/Selector";
import MiniLeague from "./MiniLeague";
import RaceList from "./RaceList";
import krmApi from "../api/krm";
import { Settings } from "@suid/icons-material";
import PopoverButton from "../ui/PopoverButton";
import notification from "../hooks/notification";

// TODO move to a utility file
const orderRaces = (divisionRaces: SetRaces, splits: number, northern: boolean) => {
  const topSplits = northern ? splits : 1;
  const inSplits = northern ? 1 : splits;
  const or: Race[] = [];
  for (let i = 0; i < topSplits; i++) {
    Object.values(divisionRaces).forEach((groupRaces) => {
      for (let j = 0; j < inSplits; j++) {
        const split = i + j
        Object.values(groupRaces).forEach(({ races }) => {
          const size = races.length / splits
          const start = split * size
          const end = Math.min((split + 1) * size, races.length)
          races.slice(start, end).forEach(r => or.push(r))
        })
      }
    })
  }
  return or
}

export default function RunRaceInProgress(props: { round: Round }) {
  return (
    <ErrorBoundary fallback={e => (
      <>
        <div>
          Something went wrong - race configuration for that number of teams probably doesn't exist yet :(
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
  const [northern, setNorthern] = createSignal(false)
  const splits = () => 3
  const orderedRaces = createMemo(() => {
    return orderRaces(props.round.races.set1, splits(), northern())
  })
  const queryClient = useQueryClient()

  const mut = createMutation(() => ({
    mutationKey: [props.round.id],
    mutationFn: async (data: { id: string, race: Race }) => new Promise((res) => {
      krmApi.updateRace(data.id, data.race);
      res({});
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [props.round.id],
      })
    }
  }))
  createEffect(on(() => mut.isPending, (pend) => {
    if (!pend && mut.error) {
      notification.error(`Failed to update race: ${mut.error.message}`)
    }
  }))

  const handleRaceUpdate = (race: Race) => {
    mut.mutate({
      id: props.round.id,
      race,
    })
  }

  const [actionsOpen, setActionsOpen] = createSignal(false)
  const handleClose = () => {
    setActionsOpen(false)
  }

  const readonly = () => false
  const [mlLive, setMlLive] = createSignal(false)
  const [mlCollapse, setMlCollapse] = createSignal(false)
  const views = {
    "list": "Race List",
    "mini": "Mini Leagues",
    "both": "Both",
  } as const
  const options = Object.entries(views).map(([value, label]) => ({ value, label }))
  type View = keyof typeof views
  const [view, setView] = createSignal<View>("list")
  const selectedView = createSelector(view)
  const errors = createMemo(() => {
    // FIXME don't hardcode set 1
    return Object.entries(props.round.races.set1).reduce((acc, [div, divRaces]) => {
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
    return Object.values(props.round.races.set1).every(g => Object.values(g).every(r => r.complete))
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
          current="Stage 1"
          options={[
            { label: "Stage 1", value: "Stage 1" },
            //{ label: Stage 2", value: "Stage 2" },
            //{ label: "Knockouts", value: "Knockouts" },
          ]}
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
      <div style={{ "overflow-y": "scroll", "margin-top": "1em" }}>
        <Stack direction="row" gap="1em" style={{ "justify-content": "center" }}>
          <Show when={selectedView("list") || selectedView("both")}>
            <Card sx={{ p: 3 }} style={{ height: "100%", display: "flex", "align-items": "start", "justify-content": selectedView("both") ? "space-around" : "center" }}>
              <Stack>
                <RaceList orderedRaces={orderedRaces()} onRaceUpdate={handleRaceUpdate} readonly={readonly()} />
              </Stack>
            </Card>
          </Show>
          <Show when={view() === "mini" || view() == "both"}>
            <Card sx={{ p: 3 }} style={{ height: "100%", display: "flex", "align-items": "start", "justify-content": selectedView("both") ? "space-around" : "center" }}>
              <Stack gap="2em">
                <For each={Object.entries(props.round.races.set1)}>{([div, divRaces]) => (
                  <For each={Object.entries(divRaces)}>{([name, { races }]) => (
                    <MiniLeague
                      live={mlLive()}
                      collapsed={mlCollapse()}
                      name={name + " " + div}
                      races={races}
                      teams={props.round.teams[div as Division].filter(t => races.some(r => r.team1 === t || r.team2 === t))}
                      onResultChange={handleRaceUpdate}
                      readonly={readonly()}
                    />
                  )}</For>
                )}</For>
              </Stack>
            </Card>
          </Show>
        </Stack>
      </div>
    </div>
  )
}
