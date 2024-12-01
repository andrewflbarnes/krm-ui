import { ArrowRight, Assignment, MoreVert } from "@suid/icons-material";
import { Chip, IconButton, Menu, MenuItem, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@suid/material";
import { createEffect, createSignal, For, Show } from "solid-js";
import krmApi from "../api/krm";
import Link from "../components/Link";
import ModalConfirmAction from "../components/ModalConfirmAction";
import { useKings } from "../kings";

const statusColor = {
  "Abandoned": "error",
  "In Progress": "warning",
  "Complete": "success",
}

function getSortedRounds(league: string) {
  console.log("getSortedRounds", league)
  const unsortedRounds = krmApi.getRounds(league);
  return unsortedRounds.sort((a, b) => b.date.getTime() - a.date.getTime())
}

export default function ManageContinue() {
  const [k] = useKings()
  const [rounds, setRounds] = createSignal(getSortedRounds(k.league()))
  createEffect(() => setRounds(getSortedRounds(k.league())))

  const handleMore = (id: number, e: MouseEvent & { currentTarget: HTMLButtonElement }) => {
    e.stopPropagation()
    setAnchorEl(e.currentTarget);
    setMenuId(id);
  }
  const handleClose = () => {
    setAnchorEl(null);
    setMenuId(-1);
  }

  const [anchorEl, setAnchorEl] = createSignal<null | HTMLElement>(null);
  const [menuId, setMenuId] = createSignal(-1);
  const todo = (msg: string) => {
    setAnchorEl(null);
    setMenuId(-1);
    alert(msg)
  }

  const [deleteRound, setDeleteRound] = createSignal<string | null>();
  const handleConfirmDelete = (id: string) => {
    setDeleteRound(id)
    setMenuId(-1)
  }
  const handleDeleteRound = () => {
    krmApi.deleteRound(deleteRound())
    setRounds(getSortedRounds(k.league()))
    setDeleteRound()
  }
  return (
    <>
    <ModalConfirmAction
      open={!!deleteRound()}
      onDiscard={() => setDeleteRound()}
      confirmLabel="Delete"
      discardLabel="Cancel"
      onConfirm={() => handleDeleteRound()}
    >
      Are you sure you want to delete this round? This action cannot be undone!
    </ModalConfirmAction>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table dense" size="small">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell />
              <TableCell />
              <TableCell />
              <TableCell align="center">Mixed</TableCell>
              <TableCell align="center">Ladies</TableCell>
              <TableCell align="center">Board</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <For each={rounds()}>{(round, id) => {
              const ariaId = () => `round-selector-menu-${id()}`
              return (
                <TableRow>
                  <TableCell sx={{ width: "1%", minWidth: "fit-content" }}>
                    <Stack direction="row" gap="1em" alignItems="center">
                      <IconButton
                        id={`round-selector-button-${id()}`}
                        size="small"
                        onClick={[handleMore, id()]}
                        aria-controls={ariaId()}
                        aria-haspopup="true"
                        aria-expanded={menuId() == id() || undefined}
                      >
                        <MoreVert />
                      </IconButton>
                      <Show when={round.status != "In Progress"}>
                        <Link href={`/${round.id}`}>
                          <IconButton>
                            <Assignment />
                          </IconButton>
                        </Link>
                      </Show>
                      <Show when={round.status == "In Progress"}>
                        <Link href={`/${round.id}`}>
                          <IconButton>
                            <ArrowRight color="success" />
                          </IconButton>
                        </Link>
                      </Show>
                      <Menu
                        id={ariaId()}
                        anchorEl={anchorEl()}
                        open={menuId() == id()}
                        onClose={handleClose}
                        MenuListProps={{ "aria-labelledby": "league-selector-button" }}
                      >
                        <MenuItem onClick={() => todo('todo')}>Export</MenuItem>
                        <MenuItem onClick={() => handleConfirmDelete(round.id)}>Delete</MenuItem>
                      </Menu>
                      {round.date.toLocaleDateString()}
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ width: "1%", minWidth: "fit-content" }} padding="none">
                    <Chip size="small" label={round.league} color="primary" variant="outlined" />
                  </TableCell>
                  <TableCell sx={{ width: "1%", minWidth: "fit-content", pl: "16px" }} padding="none">
                    <Chip size="small" label={round.status} color={statusColor[round.status] ?? "warning"} variant="outlined" />
                  </TableCell>
                  <TableCell align="left">
                    {round.description}
                  </TableCell>
                  <TableCell align="center" sx={{ width: "1%", maxWidth: "fit-content" }}>
                    {round.teams["mixed"].length}
                  </TableCell>
                  <TableCell align="center" sx={{ width: "1%", maxWidth: "fit-content" }}>
                    {round.teams["ladies"].length}
                  </TableCell>
                  <TableCell align="center" sx={{ width: "1%", maxWidth: "fit-content" }}>
                    {round.teams["board"].length}
                  </TableCell>
                </TableRow>
              )
            }}</For>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}
