import { Button, ButtonGroup, FormControlLabel, Stack, Switch } from "@suid/material";
import { createMutation, useQueryClient } from "@tanstack/solid-query";
import { createMemo, createSelector, createSignal, Switch as SSwitch, ErrorBoundary, Match, For } from "solid-js";
import { Round, SetRaces } from "../api/krm";
import { Race } from "../kings";
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
  // TODO consolidate to using the above, move minileaguelist to component
  const easySetMlResults = (race: Race, winner: undefined | 1 | 2) => {
    const updated = {
      ...race,
      winner,
    }
    mut.mutate({
      id: props.round.id,
      race: updated,
    })
  }

  const [view, setView] = createSignal<"list" | "mini">("list")
  const selectedView = createSelector(view)
  return (
    <>
      <div style={{ display: "flex", "align-items": "center", "justify-content": "center" }}>
        <ButtonGroup>
          <Button variant="contained">Round 1</Button>
          <Button disabled>Round 2</Button>
          <Button disabled>Knockouts</Button>
        </ButtonGroup>
      </div>
      <div style={{ display: "flex", "align-items": "center", "justify-content": "center" }}>
        <ButtonGroup>
          <Button onClick={[setView, "list"]} variant={selectedView("list") ? "contained" : "outlined"}>Race List</Button>
          <Button onClick={[setView, "mini"]} variant={selectedView("mini") ? "contained" : "outlined"}>Mini Leagues</Button>
        </ButtonGroup>
      </div>
      {props.round.date} {props.round.league}
      <SSwitch>
        <Match when={view() === "mini"}>
          <Stack>
            <For each={Object.entries(props.round.races.set1)}>{([div, divRaces]) => (
              <For each={Object.entries(divRaces)}>{([name, races]) => (
                <MiniLeague
                  name={name + " " + div}
                  races={races.map(({ teamMlIndices }) => teamMlIndices)}
                  teams={props.round.teams[div].filter((_, i) => races.some(({ teamMlIndices }) => teamMlIndices.includes(i + 1)))}
                  results={races}
                  onResultChange={(e) => {
                    easySetMlResults(races[e.raceIndex], e.winnerOrd)
                  }}
                />
              )}</For>
            )}</For>
          </Stack>
        </Match>
        <Match when={view() === "list"}>
          <Stack>
            Race List
            <FormControlLabel
              sx={{ width: "fit-content" }}
              control={<Switch checked={splits() > 1} onChange={() => setSplits(s => s > 1 ? 1 : 3)} />}
              label="grimify"
            />
            <RaceList orderedRaces={orderedRaces()} onRaceUpdate={handleRaceUpdate} />
          </Stack>
        </Match>
      </SSwitch>
    </>
  )
}
