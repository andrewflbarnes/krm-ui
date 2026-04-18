import { Box, Card, Stack } from "@suid/material";
import { useMutation, useQueryClient } from "@tanstack/solid-query";
import { Show, createEffect, createMemo, on } from "solid-js";
import { divisions, Race, Round, StageRaces } from "../kings";
import RaceList from "./RaceList";
import krmApi from "../api/krm";
import notification from "../hooks/notification";
import BasicErrorBoundary from "../ui/BasicErrorBoundary";
import RaceListPrintable from "./RaceListPrintable";
import { usePrint } from "../hooks/print";
import { useRaceOptions } from "../hooks/results";
import MiniLeagues from "./MiniLeagues";

const orderRaces = (divisionRaces: StageRaces, northern: boolean) => {
  const splits = 3
  const topSplits = northern ? splits : 1;
  const inSplits = northern ? 1 : splits;
  const or: Race[] = [];
  let splitInsertion = or.length
  let lastSplit = 0
  for (let i = 0; i < topSplits; i++) {
    Object.entries(divisionRaces)
      .sort((a, b) => b.toLocaleString().localeCompare(a.toLocaleString()))
      .map(([, races]) => races)
      .forEach((groupRaces) => {
        for (let j = 0; j < inSplits; j++) {
          const split = i + j
          // Use the splitInsertion location when breaking up larger (5+ teams) group races
          if (lastSplit != split) {
            splitInsertion = or.length
            lastSplit = split
          }
          Object.values(groupRaces).forEach(({ races }) => {
            if (races.length == 15) {
              // 6 teams (probably!) - need a better check for this...
              if (split == 0) {
                or.splice(splitInsertion, 0, ...races.slice(0, 3))
                splitInsertion += 3
                races.slice(3, 6).forEach(r => or.push(r))
              } else if (split == 1) {
                or.splice(splitInsertion, 0, ...races.slice(6, 9))
                splitInsertion += 3
                races.slice(9, 12).forEach(r => or.push(r))
              } else {
                races.slice(12, 15).forEach(r => or.push(r))
              }
            } else if (races.length == 10) {
              // 5 teams (probably!) - need a better check for this...
              if (split == 0) {
                or.splice(splitInsertion, 0, ...races.slice(0, 2))
                splitInsertion += 2
                races.slice(2, 4).forEach(r => or.push(r))
              } else if (split == 1) {
                or.splice(splitInsertion, 0, races[4])
                splitInsertion += 1
                races.slice(5, 7).forEach(r => or.push(r))
              } else {
                or.splice(splitInsertion, 0, races[7])
                splitInsertion += 1
                races.slice(8, 10).forEach(r => or.push(r))
              }
            } else {
              const size = races.length / splits
              const start = split * size
              const end = Math.min((split + 1) * size, races.length)
              races.slice(start, end).forEach(r => or.push(r))
            }
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
  const {
    collapse,
    live,
    northern,
    view,
  } = useRaceOptions()

  const mut = useMutation(() => ({
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
    return orderRaces(props.round.races[props.stage], northern())
  })

  // Ensure mini leagues are ordered by division, then group
  const orderedMiniLeagueRaces = createMemo(() =>
    divisions.map(division => {
      const races = props.round.races[props.stage][division] ?? {}
      const ordered = Object.entries(races)
        .sort(([groupA], [groupB]) => groupA.localeCompare(groupB))
        .map(([group, races]) => ({
          group,
          races,
        }))
      return {
        division,
        groups: ordered,
      }
    })
  )

  const [print, setPrint] = usePrint()
  let ref!: HTMLDivElement; // oxlint-disable-line no-unassigned-vars
  createEffect(() => {
    if (print()) {
      const printwindow = window.open('', 'PRINT', 'height=800,width=1000');
      printwindow.document.writeln('<html><head>')
      printwindow.document.writeln(`<title>Kings Results Manager</title>`)
      printwindow.document.writeln('</head><body>')
      printwindow.document.writeln(ref.innerHTML)
      printwindow.document.writeln('</body></html>')
      printwindow.document.close(); // necessary for IE >= 10
      printwindow.focus(); // necessary for IE >= 10*/
      printwindow.print();
      printwindow.close();
      setPrint(false)
    }
  })

  const showList = () => view() === "list" || view() === "side-by-side"
  const showMiniLeagues = () => view() === "mini" || view() === "side-by-side"
  const showSideBySide = () => view() === "side-by-side"

  return (
    <Box sx={{ overflowY: "auto", mt: 1, height: 1 }}>
      <Stack direction="row" gap={1} sx={{ justifyContent: "center" }}>
        <Show when={showList()}>
          <Card sx={{ p: 3, overflowX: "auto", height: "100%", display: "flex", alignItems: "start", justifyContent: showSideBySide() ? "space-around" : "center" }}>
            <Stack width="100%">
              <RaceList
                knockout={props.stage == "knockout"}
                orderedRaces={orderedRaces()}
                onRaceUpdate={handleRaceUpdate}
                readonly={props.readonly}
              />
            </Stack>
          </Card>
        </Show>
        <Show when={showMiniLeagues()}>
          <Card sx={{ p: 3, overflowX: "auto", height: "100%", display: "flex", alignItems: "start", justifyContent: showSideBySide() ? "space-around" : "center" }}>
            <MiniLeagues
              live={live()}
              collapse={collapse()}
              races={orderedMiniLeagueRaces()}
              onRaceUpdate={handleRaceUpdate}
              readonly={props.readonly}
            />
          </Card>
        </Show>
      </Stack>
      <Box sx={{ display: view() === "printable" ? "inherit" : "none" }}>
        <Card ref={ref} sx={{ display: "flex", flexDirection: "column", p: 3, alignItems: "center", width: "fit-content", mx: "auto" }}>
          <RaceListPrintable
            knockouts={props.stage === "knockout"}
            races={orderedRaces()}
            subtitle={`${props.round.league} ${props.stage}`}
          />
        </Card>
      </Box>
    </Box>
  )
}
