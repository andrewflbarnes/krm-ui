import { ArrowRight, Assignment } from "@suid/icons-material";
import { Chip, IconButton, MenuItem, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@suid/material";
import { createSignal, For, Show } from "solid-js";
import Link from "./Link";
import ModalConfirmAction from "./ModalConfirmAction";
import { RoundInfo } from "../api/krm";
import download from "downloadjs";
import krmApi from "../api/krm"
import MoreMenu from "./MoreMenu";

const statusColor = {
  "Abandoned": "error",
  "In Progress": "warning",
  "Complete": "success",
}

type ManageContinueListProps = {
  rounds: RoundInfo[];
  onDeleteRound: (id: string) => void;
}

export default function ManageContinueList(props: ManageContinueListProps) {
  const [deleteRound, setDeleteRound] = createSignal<string | null>();
  const handleConfirmExport = (id: string) => {
    const round = krmApi.getRound(id);
    const blob = new Blob([JSON.stringify(round, null, 2)], { type: "application/json" })
    download(blob, `${round.id}.json`)
  }
  const handleConfirmDelete = (id: string) => {
    setDeleteRound(id)
  }
  const handleDeleteRound = () => {
    props.onDeleteRound(deleteRound())
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
            <For each={props.rounds}>{(round) => {
              return (
                <TableRow>
                  <TableCell sx={{ width: "1%", minWidth: "fit-content" }}>
                    <Stack direction="row" gap="1em" alignItems="center">
                      <MoreMenu id={round.id}>{(handleClose) => {
                        const confirmDelete = () => {
                          handleConfirmDelete(round.id)
                          handleClose()
                        }
                        const confirmExport = () => {
                          handleConfirmExport(round.id)
                          handleClose()
                        }
                        return (
                          <>
                            <MenuItem onClick={confirmExport}>Export</MenuItem>
                            <MenuItem onClick={confirmDelete}>Delete</MenuItem>
                          </>
                        )
                      }}</MoreMenu>
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
