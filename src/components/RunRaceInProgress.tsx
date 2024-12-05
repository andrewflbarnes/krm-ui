import { Button, ButtonGroup, Stack } from "@suid/material";
import { createMutation, useQueryClient } from "@tanstack/solid-query";
import { createMemo, createSelector, createSignal, ErrorBoundary, For, Show } from "solid-js";
import { Round, SetRaces } from "../api/krm";
import { Division, Race } from "../kings";
import MiniLeague from "./MiniLeague";
import RaceList from "./RaceList";
import krmApi from "../api/krm";

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
  const [splits, setSplits] = createSignal(1)
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

  const [view, setView] = createSignal<"list" | "mini" | "both">("list")
  const selectedView = createSelector(view)
  return (
    <>
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
      <div style={{ display: "flex", "align-items": "start", "justify-content": selectedView("both") ? "space-between" : "center" }}>
        <Show when={selectedView("list") || selectedView("both")}>
          <Stack>
            <RaceList orderedRaces={orderedRaces()} onRaceUpdate={handleRaceUpdate} balance={!selectedView("both")} />
          </Stack>
        </Show>
        <Show when={view() === "mini" || view()  == "both"}>
          <Stack gap="2em">
            <For each={Object.entries(props.round.races.set1)}>{([div, divRaces]) => (
              <For each={Object.entries(divRaces)}>{([name, races]) => (
                <MiniLeague
                  name={name + " " + div}
                  races={races}
                  teams={props.round.teams[div as Division].filter(t => races.some(r => r.team1 === t || r.team2 === t))}
                  onResultChange={handleRaceUpdate}
                />
              )}</For>
            )}</For>
          </Stack>
        </Show>
      </div>
    </>
  )
}
