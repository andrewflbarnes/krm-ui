import { Button, ButtonGroup, Card, CardContent, FormControlLabel, IconButton, Modal, Stack, Switch as InputSwitch } from "@suid/material";
import { createMutation, useQueryClient } from "@tanstack/solid-query";
import { createMemo, createSelector, createSignal, ErrorBoundary, For, Show } from "solid-js";
import { Round, SetRaces } from "../api/krm";
import { Division, Race } from "../kings";
import MiniLeague from "./MiniLeague";
import RaceList from "./RaceList";
import krmApi from "../api/krm";
import { Settings } from "@suid/icons-material";

const orderRaces = (divisionRaces: SetRaces, splits: number) => {
  const or: Race[] = [];
  for (let i = 0; i < splits; i++) {
    Object.values(divisionRaces).forEach((groupRaces) => {
      // TODO we need to split when there is more than 1 group!
      Object.values(groupRaces).forEach(races => {
        const size = races.length / splits
        const start = i * size
        const end = Math.min((i + 1) * size, races.length)
        races.slice(start, end).forEach(r => or.push(r))
      })
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
  const splits = () => northern() ? 3 : 1
  const orderedRaces = createMemo(() => {
    return orderRaces(props.round.races.set1, splits())
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

  const [mlLive, setMlLive] = createSignal(false)
  const [mlCollapse, setMlCollapse] = createSignal(false)
  const [view, setView] = createSignal<"list" | "mini" | "both">("list")
  const selectedView = createSelector(view)
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
      <div style={{ display: "flex", "align-items": "center", "justify-content": "center" }}>
        <ButtonGroup sx={{ "& > *": { width: "10em" } }}>
          <Button variant="contained">Round 1</Button>
          <Button disabled>Round 2</Button>
          <Button disabled>Knockouts</Button>
        </ButtonGroup>
      </div>
      <div style={{ display: "flex", "align-items": "center", "justify-content": "center" }}>
        <ButtonGroup sx={{ "& > *": { width: "10em" } }}>
          <Button onClick={[setView, "list"]} variant={selectedView("list") ? "contained" : "outlined"}>Race List</Button>
          <Button onClick={[setView, "both"]} variant={selectedView("both") ? "contained" : "outlined"}>Both</Button>
          <Button onClick={[setView, "mini"]} variant={selectedView("mini") ? "contained" : "outlined"}>Mini Leagues</Button>
        </ButtonGroup>
      </div>
      <div style={{ "overflow-y": "scroll", "margin-top": "1em" }}>
        <Stack direction="row" gap="1em" style={{ "justify-content": "center" }}>
          <Show when={selectedView("list") || selectedView("both")}>
            <Card sx={{ p: 3 }} style={{ height: "100%", display: "flex", "align-items": "start", "justify-content": selectedView("both") ? "space-around" : "center" }}>
              <Stack>
                <RaceList orderedRaces={orderedRaces()} onRaceUpdate={handleRaceUpdate} balance={!selectedView("both")} />
              </Stack>
            </Card>
          </Show>
          <Show when={view() === "mini" || view() == "both"}>
            <Card sx={{ p: 3 }} style={{ height: "100%", display: "flex", "align-items": "start", "justify-content": selectedView("both") ? "space-around" : "center" }}>
              <Stack gap="2em">
                <For each={Object.entries(props.round.races.set1)}>{([div, divRaces]) => (
                  <For each={Object.entries(divRaces)}>{([name, races]) => (
                    <MiniLeague
                      live={mlLive()}
                      collapsed={mlCollapse()}
                      name={name + " " + div}
                      races={races}
                      teams={props.round.teams[div as Division].filter(t => races.some(r => r.team1 === t || r.team2 === t))}
                      onResultChange={handleRaceUpdate}
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
