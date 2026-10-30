import { Division, GroupRaces } from "@/kings";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@suid/material";
import { createSignal, For } from "solid-js";

export default function RunRaceFixConflictModal(props: {
  open: boolean;
  division: Division;
  group: string;
  races: GroupRaces;
  onClose: () => void;
}) {
  const draws = () => props.races.results
    .filter(r => r.length > 1)

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

  const resolvedDraws = () => {
    // TODO properly
    if (confirm() === "high") {
      return draws()
    } else if (confirm() === "low") {
      return draws().map(r => r.toReversed())
    }
    return draws()
  }

  return (
    <Dialog
      open={props.open}
      maxWidth="xs"
      onClose={handleClose}
    >
      <DialogTitle>Fix conflict: {props.division} group {props.group}</DialogTitle>
      <DialogContent>
        <For each={resolvedDraws()}>{(draw) => (
          <>
            <div>{draw.length}-way draw</div>
            <ul>
              <For each={draw}>{(team) => (
                <li>{team}</li>
              )}</For>
            </ul>
          </>
        )}</For>

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
            {!!confirm() ? "Cancel" : "Low seed wins"}
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  )
}
