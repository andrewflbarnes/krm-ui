import { asPosition, Division, GroupRaces } from "@/kings";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@suid/material";
import { createComputed, createEffect, createSelector, createSignal, For, onMount } from "solid-js";
import MiniLeague from "./MiniLeague";

export default function RunRaceFixConflictModal(props: {
  open: boolean;
  conflicts: {
    division: Division;
    group: string;
    races: GroupRaces;
  }[];
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
    alert("confirmed")
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

  const initialRefs = props.conflicts.map(() => null)
  const [sizeRefs, setSizeRefs] = createSignal<HTMLDivElement[]>(initialRefs)
  onMount(() => {
    const ret = sizeRefs().reduce((acc, ref) => {
      return acc > ref?.clientHeight ? acc : ref?.clientHeight
    }, 0)
    setContentHeight(ret)
  })
  const updateRefs = (index: number, ref: HTMLDivElement) => {
    setSizeRefs(prev => {
      if (!prev?.length) {
        return prev
      }
      const newRefs = [...prev]
      newRefs[index] = ref
      return newRefs
    })
  }

  const [contentHeight, setContentHeight] = createSignal(0)
  createEffect(() => {
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
                group={conflict.group}
                races={conflict.races}
                confirm={confirm()}
                supplyRef={(ref) => updateRefs(i(), ref)}
              />
            </div>
          )}</For>
        </div>
          <Button
            color="primary"
            onClick={next}
          >
            Next
          </Button>
      </DialogContent>
      <DialogActions>
        <div style={{ display: "flex", "flex-direction": "column", gap: "0.5em", width: "100%" }}>
          <Button
            color={!!confirm() ? "success" : "primary"}
            onClick={handleHighSeedWin}
          >
            {!!confirm() ? "Confirm" : "High seed wins"}
          </Button>
          <Button
            color={!!confirm() ? "warning" : "primary"}
            onClick={handleLowSeedWin}
          >
            {!!confirm() ? "Cancel" : "Low seed loses"}
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
    // TODO properly
    if (props.confirm === "high") {
      return draws()
    } else if (props.confirm === "low") {
      return draws().map(r => ({
        ...r,
        teams: r.teams.reverse(),
      }))
    }
    return draws()
  }

  return (
    <div ref={r => props.supplyRef(r)} style={{
      display: "flex",
      "flex-direction": "column",
      gap: "1em",
      "max-width": "fit-content",
    }}>
      <MiniLeague
        races={props.races.races}
        teams={props.races.teams}
        readonly
        name={props.division.capitalize() + " " + props.group}
      />
      <For each={resolvedDraws()}>{(draw) => (
        <>
          <div>{draw.teams.length}-way draw for {asPosition(draw.position)}</div>
          <ul>
            <For each={draw.teams}>{(team) => (
              <li>{team}</li>
            )}</For>
          </ul>
        </>
      )}</For>
    </div>
  )
}
