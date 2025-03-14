import { Card, Stack } from "@suid/material";
import { createMutation, useQueryClient } from "@tanstack/solid-query";
import { Show, For, createEffect, createMemo, on } from "solid-js";
import { Division, Race, Round, StageRaces } from "../kings";
import MiniLeague from "./MiniLeague";
import RaceList from "./RaceList";
import krmApi from "../api/krm";
import notification from "../hooks/notification";
import BasicErrorBoundary from "../ui/BasicErrorBoundary";
import RaceListPrintable from "./RaceListPrintable";
import { usePrint } from "../hooks/print";

// TODO move to a utility file
const orderRaces = (divisionRaces: StageRaces, splits: number, northern: boolean) => {
  const topSplits = northern ? splits : 1;
  const inSplits = northern ? 1 : splits;
  const or: Race[] = [];
  for (let i = 0; i < topSplits; i++) {
    Object.entries(divisionRaces)
      .sort((a, b) => b.toLocaleString().localeCompare(a.toLocaleString()))
      .map(([, races]) => races)
      .forEach((groupRaces) => {
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

type RunRaceInProgressStageProps = {
  round: Round;
  readonly?: boolean;
  stage: "stage1" | "stage2" | "knockout";
  live?: boolean;
  collapse?: boolean;
  northern?: boolean;
  splits: number;
  view: "mini" | "list" | "side-by-side" | "printable";
}

export default function RunRaceInProgressStage(props: RunRaceInProgressStageProps) {
  return (
    <BasicErrorBoundary message="failed to render this stage">
      <RunRaceInProgressStageInternal {...props} />
    </BasicErrorBoundary>
  )
}

function RunRaceInProgressStageInternal(props: RunRaceInProgressStageProps) {
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

  const [print, setPrint] = usePrint()
  let ref!: HTMLDivElement;
  createEffect(() => {
    if (print()) {
      const printwindow = window.open('', 'PRINT', 'height=800,width=1000');
      printwindow.document.write('<html><head>')
      printwindow.document.write(`<title>Kings Results Manager</title>`)
      printwindow.document.write('</head><body>')
      printwindow.document.write(ref.innerHTML)
      printwindow.document.write('</body></html>')
      printwindow.document.close(); // necessary for IE >= 10
      printwindow.focus(); // necessary for IE >= 10*/
      printwindow.print();
      printwindow.close();
      setPrint(false)
    }
  })

  const showList = () => props.view === "list" || props.view === "side-by-side"
  const showMiniLeagues = () => props.view === "mini" || props.view === "side-by-side"
  const showSideBySide = () => props.view === "side-by-side"
  return (
    <div style={{ "overflow-y": "scroll", "margin-top": "1em" }}>
      <Stack direction="row" gap="1em" style={{ "justify-content": "center" }}>
        <Show when={showList()}>
          <Card sx={{ p: 3 }} style={{ height: "100%", display: "flex", "align-items": "start", "justify-content": showSideBySide() ? "space-around" : "center" }}>
            <Stack>
              <RaceList knockout={props.stage == "knockout"} orderedRaces={orderedRaces()} onRaceUpdate={handleRaceUpdate} readonly={props.readonly} />
            </Stack>
          </Card>
        </Show>
        <Show when={showMiniLeagues()}>
          <Card sx={{ p: 3 }} style={{ height: "100%", display: "flex", "align-items": "start", "justify-content": showSideBySide() ? "space-around" : "center" }}>
            <Stack gap="2em">
              <For each={Object.entries(props.round.races[props.stage])}>{([div, divRaces]) => (
                <For each={Object.entries(divRaces)}>{([name, { races, teams }]) => (
                  <MiniLeague
                    live={props.live}
                    collapsed={props.collapse}
                    name={name + " " + div}
                    races={races}
                    teams={teams}
                    onResultChange={handleRaceUpdate}
                    readonly={props.readonly}
                  />
                )}</For>
              )}</For>
            </Stack>
          </Card>
        </Show>
      </Stack>
      <div style={{ display: props.view === "printable" ? "inherit" : "none" }}>
        <div ref={ref}>
          <RaceListPrintable
            knockouts={props.round.status === "knockout"}
            races={orderedRaces()}
            subtitle={`${props.round.league} ${props.stage}`}
          />
        </div>
      </div>
    </div>
  )
}
