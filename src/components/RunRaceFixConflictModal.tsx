import { asPosition, calcTeamResults, Division, GroupRaces, Race } from "@/kings";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@suid/material";
import { createComputed, createEffect, createSelector, createSignal, For, Show } from "solid-js";
import MiniLeague from "./MiniLeague";
import Seed from "@/ui/Seed";
import { DoubleArrow } from "@suid/icons-material";

const NO_OPTION_SENTINEL = ["Select an option"]

export default function RunRaceFixConflictModal(props: {
  open: boolean;
  conflicts: {
    division: Division;
    group: string;
    races: GroupRaces;
  }[];
  seeding: {
    [division in Division]: string[];
  },
  selectedGroup?: {
    division: Division;
    group: string;
  }
  onClose: () => void;
}) {
  const [confirm, setConfirm] = createSignal<"high" | "low">()

  const handleClose = () => {
    setConfirm(undefined)
    props.onClose()
  }

  const handleHighSeedWin = () => {
    if (!confirm()) {
      setConfirm("high")
      return
    }
    setConfirm(undefined)
    alert("TODO :D")
  }

  const handleLowSeedWin = () => {
    if (!confirm()) {
      setConfirm("low")
      return
    }
    setConfirm(undefined)
  }

  const [showIndex, setShowIndex] = createSignal<number>()
  createComputed(() => {
    const selected = props.selectedGroup
      ? props.conflicts
        .findIndex(c => c.division === props.selectedGroup?.division && c.group === props.selectedGroup?.group)
      : 0
    setShowIndex(selected)
  })
  const isSelected = createSelector(showIndex)

  const next = () => {
    setShowIndex(prev => {
      if (prev === undefined) return 0
      if (prev + 1 >= props.conflicts.length) return 0
      return prev + 1
    })
  }

  const [sizeRefs, setSizeRefs] = createSignal<HTMLDivElement[]>([])
  const updateRefs = (index: number, ref: HTMLDivElement) => {
    setSizeRefs(prev => {
      const newRefs = [...prev]
      newRefs[index] = ref
      return newRefs
    })
  }

  const [contentHeight, setContentHeight] = createSignal(0)
  createEffect(() => {
    const ret = sizeRefs().reduce((acc, ref) => {
      return acc > ref?.clientHeight ? acc : ref?.clientHeight
    }, 0)
    setContentHeight(ret)
  })

  return (
    <Dialog
      open={props.open}
      maxWidth="lg"
      onClose={handleClose}
    >
      <DialogTitle>Resolve Conflicts</DialogTitle>
      <DialogContent>
        <div style={{
          display: "flex",
          "flex-direction": "column",
          overflow: "hidden",
          height: contentHeight() + "px",
        }}>
          <For each={props.conflicts}>{(conflict, i) => (
            <div style={{
              height: isSelected(i()) ? undefined : 0,
              overflow: "hidden",
              "max-width": "100%",
              "margin-left": "auto",
              "margin-right": "auto",
            }}>
              <Resolve
                division={conflict.division}
                seeding={props.seeding[conflict.division]}
                group={conflict.group}
                races={conflict.races}
                confirm={confirm()}
                supplyRef={(ref) => updateRefs(i(), ref)}
              />
            </div>
          )}</For>
        </div>
        <div
          style={{
            display: "flex",
            "justify-content": "center",
            "margin-top": "1em",
          }}
        >
          <Button
            onClick={next}
          >
            Next
          </Button>
        </div>
      </DialogContent>
      <DialogActions>
        <div style={{ display: "flex", "flex-direction": "column", gap: "0.5em", width: "100%" }}>
          <Button
            variant="outlined"
            color={confirm() ? "success" : "primary"}
            onClick={handleHighSeedWin}
          >
            {confirm() ? "Confirm" : "High seed wins"}
          </Button>
          <Button
            variant="outlined"
            color={confirm() ? "warning" : "primary"}
            onClick={handleLowSeedWin}
          >
            {confirm() ? "Cancel" : "Low seed loses"}
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  )
}

function Resolve(props: {
  division: Division;
  group: string;
  races: GroupRaces;
  seeding: string[];
  confirm: "high" | "low" | undefined;
  supplyRef: (ref: HTMLDivElement) => void;
}) {
  const draws = () => props.races.results
    .map((teams, position) => ({
      position: position + 1,
      teams,
    }))
    .filter(r => r.teams.length > 1)

  const resolvedDraws = () => {
    switch (props.confirm) {
      case "high":
        break;
      case "low":
        break;
      default:
        return draws().map(r => ({
          ...r,
          teams: NO_OPTION_SENTINEL,
        }))
    }

    return draws().map(r => {
      const orderedTeams = getAdjustedResults(
        r.teams,
        props.races.races,
        props.seeding,
        props.confirm
      )

      return {
        ...r,
        teams: orderedTeams,
      }
    })
  }

  const seeded = () => props.seeding
    .map((team, index) => ({ team, index }))
    .filter(({ team }) => {
      return props.races.teams.includes(team)
    })
    .reduce((acc, { team, index }) => {
      acc[team] = index
      return acc
    }, {} as Record<string, number>)

  return (
    <div
      ref={r => props.supplyRef(r)}
      style={{
        display: "flex",
        "flex-direction": "column",
        gap: "1em",
        "max-width": "fit-content",
      }}
    >
      <MiniLeague
        races={props.races.races}
        teams={props.races.teams}
        readonly
        name={props.division.capitalize() + " " + props.group}
      />
      <For each={draws()}>{(draw, i) => (
        <div
          style={{
            display: "flex",
            "flex-direction": "column",
            gap: "0.5em",
            "align-items": "center",
          }}
        >
          <div>{draw.teams.length}-way draw for {asPosition(draw.position)}</div>
          <div
            style={{
              "display": "grid",
              "grid-template-columns": "1fr minmax(auto, 7em) 1fr",
              "align-items": "center",
            }}
          >
            <TeamList
              division={props.division}
              teams={draw.teams}
              seeded={seeded()}
            />
            <div style={{ margin: "0 auto" }} >
              <DoubleArrow />
            </div>
            <TeamList
              division={props.division}
              teams={resolvedDraws()[i()].teams}
              seeded={seeded()}
            />
          </div>
        </div>
      )}</For>
    </div >
  )
}

function TeamList(props: {
  division: Division;
  teams: string[];
  seeded: Record<string, number>;
}) {
  return (
    <ul style={{
      "list-style": "none",
      "margin": 0,
      "padding": 0,
      display: "flex",
      "flex-direction": "column",
      gap: "0.25em",
    }} >
      <Show
        when={props.teams !== NO_OPTION_SENTINEL}
        fallback={
          <Typography variant="body2" color="textSecondary">
            Select an option
          </Typography>
        }
      >
        <For each={props.teams}>{(team) => {
          let num: string | number = props.seeded[team]
          if (num !== undefined) {
            num += 1
          } else {
            num = "?"
          }
          return (
            <Seed
              team={team}
              num={num}
              accent={props.division}
            />
          )
        }}</For>
      </Show>
    </ul>
  )
}

function getAdjustedResults(
  teams: string[],
  races: Race[],
  seeding: string[],
  confirm: "high" | "low"
): string[] {
  // use reverse seeding if looking for the lowest seed
  const seedOrder = confirm === "high"
    ? seeding
    : seeding.toReversed()

  // find the highest or lowest seed in the draw
  const targetSeed = teams.reduce((seedAcc, team) => {
    const seedIndex = seedOrder.indexOf(team)
    return seedIndex < seedAcc ? seedIndex : seedAcc
  }, Infinity)

  // identify the team
  const targetSeedTeam = seedOrder[targetSeed]

  // determine the order of the remaining teams
  // NOTE: because Kings caps out at 6 teams to a minileague this will
  // always correctly resolved to a well ordered list of teams - the proof/maths
  // for this belongs somewhere else...
  // i.e. the return from calcTeamResults will always be an array of single team
  // arrays
  const others = teams.filter(team => team !== targetSeedTeam)
  const calculatedResults = calcTeamResults(others, races).pos
  if (calculatedResults.some(r => r.length > 1)) {
    // log error but don't crash out - allow the round to contine to run
    console.error(
      "Unexpected draw in calculated results",
      {
        teams,
        races,
        seeding,
        confirm,
        seedOrder,
        targetSeed,
        targetSeedTeam,
        calculatedResults,
      }
    )
  }
  const otherResults = calculatedResults.flat()

  // if high then promote the target seed to the top
  // if low then demote the target seed to the bottom
  return confirm === "high"
    ? [targetSeedTeam, ...otherResults]
    : [...otherResults, targetSeedTeam]
}
