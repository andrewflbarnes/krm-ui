import { Card, Stack } from "@suid/material";
import { createMutation, useQueryClient } from "@tanstack/solid-query";
import { Show, For, createEffect, createMemo, on } from "solid-js";
import { Round, SetRaces } from "../api/krm";
import { Division, Race } from "../kings";
import MiniLeague from "./MiniLeague";
import RaceList from "./RaceList";
import krmApi from "../api/krm";
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

export default function RunRaceInProgressStage(props: {
  round: Round;
  readonly?: boolean;
  stage: "set1" | "set2";
  live?: boolean;
  collapse?: boolean;
  northern?: boolean;
  splits: number;
  view: "mini" | "list" | "both";
}) {
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

  const orderedRaces = createMemo(() => {
    return orderRaces(props.round.races[props.stage], props.splits, props.northern)
  })

  const showList = () => props.view === "list" || props.view === "both"
  const showMiniLeagues = () => props.view === "mini" || props.view === "both"
  const showBoth = () => props.view === "both"
  return (
    <div style={{ "overflow-y": "scroll", "margin-top": "1em" }}>
      <Stack direction="row" gap="1em" style={{ "justify-content": "center" }}>
        <Show when={showList()}>
          <Card sx={{ p: 3 }} style={{ height: "100%", display: "flex", "align-items": "start", "justify-content": showBoth() ? "space-around" : "center" }}>
            <Stack>
              <RaceList orderedRaces={orderedRaces()} onRaceUpdate={handleRaceUpdate} readonly={props.readonly} />
            </Stack>
          </Card>
        </Show>
        <Show when={showMiniLeagues()}>
          <Card sx={{ p: 3 }} style={{ height: "100%", display: "flex", "align-items": "start", "justify-content": showBoth() ? "space-around" : "center" }}>
            <Stack gap="2em">
              <For each={Object.entries(props.round.races[props.stage])}>{([div, divRaces]) => (
                <For each={Object.entries(divRaces)}>{([name, { races }]) => (
                  <MiniLeague
                    live={props.live}
                    collapsed={props.collapse}
                    name={name + " " + div}
                    races={races}
                    teams={props.round.teams[div as Division].filter(t => races.some(r => r.team1 === t || r.team2 === t))}
                    onResultChange={handleRaceUpdate}
                    readonly={props.readonly}
                  />
                )}</For>
              )}</For>
            </Stack>
          </Card>
        </Show>
      </Stack>
    </div>
  )
}
