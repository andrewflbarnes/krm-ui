import { Box, List, ListItem, ListItemButton, ListItemText, Modal, Paper } from "@suid/material";
import { createSignal, For, ParentProps, Show } from "solid-js";
import { LeagueData, Result } from "../kings";
import { parseResults } from "../kings/result-utils";
import ConfigEditTeam, { ToEdit } from "./ConfigEditTeam";
import DivisionResultsAll from "./DivisionResultsAll";
import ModalConfirmAction from "./ModalConfirmAction";

export default function ConfigClubs(props: ParentProps<{ data: LeagueData }>) {
  const [club, setClub] = createSignal<string>()
  const [edit, setEdit] = createSignal<ToEdit>()

  const clubs = Object.keys(props.data).sort((a, b) => a.localeCompare(b))
  const clubData = () => parseResults(club() == "all" ? props.data : { [club()]: props.data[club()] })
  const handleEdit = (division: string, row: Result) => {
    setEdit({ division, row })
  }
  // save confirmation modal
  const [confirm, setConfirm] = createSignal(false)
  const handleConfirm = () => {
    setConfirm(true)
  }
  const handleUnconfirmed = () => {
    setConfirm(false)
  }
  const handleConfirmed = () => {
    setEdit(undefined)
    setConfirm(false)
    alert("TODO save")
  }
  // discard confirmation modal
  const [discard, setDiscard] = createSignal(false)
  const [discardClickaway, setDiscardClickaway] = createSignal(false)
  const handleDiscardClickaway = () => {
    setDiscardClickaway(true)
    setDiscard(true)
  }
  const handleDiscard = () => {
    setDiscardClickaway(false)
    setDiscard(true)
  }
  const handleDiscarded = () => {
    setEdit(undefined)
    setDiscard(false)
  }
  const handleUndiscarded = () => {
    setDiscard(false)
  }
  return (
    <Box sx={{
      display: "flex",
      flexDirection: "row",
      gap: "8px",
      height: "100%",
    }}>
      <Paper sx={{ width: "10%", height: "fit-content" }} elevation={4} >
        <List>
          <ListItem disablePadding>
            <ListItemButton selected={club() == "all"} onClick={[setClub, "all"]}>
              <ListItemText primary={"All"} />
            </ListItemButton>
          </ListItem>
          <For each={clubs}>{(c) => (
            <ListItem disablePadding>
              <ListItemButton selected={club() == c} onClick={[setClub, c]}>
                <ListItemText primary={c} />
              </ListItemButton>
            </ListItem>
          )}
          </For>
        </List>
      </Paper>
      <Show when={club()}>
        <Paper sx={{ flexGrow: 1, height: "100%", padding: "8px", overflow: "scroll" }} elevation={4}>
          <DivisionResultsAll results={clubData()} editable onEdit={handleEdit} />
        </Paper>
      </Show>
      <Modal onClose={handleDiscardClickaway} open={!!edit()} sx={{ display: "grid", height: "100%", width: "100%", placeItems: "center" }}>
        <ConfigEditTeam edit={edit()} onDiscard={handleDiscard} onConfirm={handleConfirm} />
      </Modal>
      {/* TODO consolidate? */}
      <ModalConfirmAction open={confirm()} onDiscard={handleUnconfirmed} onConfirm={handleConfirmed}>
        Are you sure?
      </ModalConfirmAction>
      <ModalConfirmAction open={discard()} onDiscard={handleUndiscarded} onConfirm={handleDiscarded}>
        {discardClickaway() ? "Discard changes?" : "Are you sure?"}
      </ModalConfirmAction>
    </Box>
  )
}
