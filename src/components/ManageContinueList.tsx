import { ArrowRight, Assignment, InfoOutlined } from "@suid/icons-material";
import { Chip, IconButton, MenuItem, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@suid/material";
import { createMemo, createSignal, For, Show } from "solid-js";
import Link from "./Link";
import ModalConfirmAction from "../ui/ModalConfirmAction";
import { RoundInfo } from "../api/krm";
import download from "downloadjs";
import krmApi from "../api/krm"
import MoreMenu from "../ui/MoreMenu";
import { useAuth } from "../hooks/auth";
import ModalRoundInfo from "../ui/ModalRoundInfo";

const statusColor = {
  "abandoned": "error",
  "complete": "success",
}

type ManageContinueListProps = {
  rounds: RoundInfo[];
  onDeleteRound: (id: string) => void;
  onUploadRound: (id: string) => void;
}

export default function ManageContinueList(props: ManageContinueListProps) {
  const [deleteRound, setDeleteRound] = createSignal<string | null>();
  const { userId, authenticated } = useAuth()
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
  const rounds = createMemo(() => props.rounds.reduce((acc, round) => {
    if (round.owner == "local") {
      acc.untracked.push(round)
    } else if (round.owner == userId()) {
      acc.tracked.push(round)
    } else {
      acc.readonly.push(round)
    }
    return acc
  }, {
    untracked: [],
    tracked: [],
    readonly: [],
  }))

  const [info, setInfo] = createSignal<RoundInfo | null>();

  return (
    <div>
      <ModalConfirmAction
        open={!!deleteRound()}
        onDiscard={() => setDeleteRound()}
        confirmLabel="Delete"
        confirmColor="error"
        discardLabel="Cancel"
        onConfirm={handleDeleteRound}
      >
        Are you sure you want to delete this round? This action cannot be undone!
      </ModalConfirmAction>
      <ModalRoundInfo
        open={!!info()}
        round={info()}
        onClose={() => setInfo()}
      />
      <Show when={rounds().tracked.length > 0}>
        <RoundInfoList
          rounds={rounds().tracked}
          handleConfirmDelete={handleConfirmDelete}
          handleConfirmExport={handleConfirmExport}
          handleUploadRound={props.onUploadRound}
          handleInfo={(roundInfo) => setInfo(roundInfo)}
          canUpload={authenticated()}
          whose={"Your tracked"}
          headings={true}
        />
      </Show>
      <Show when={rounds().untracked.length > 0}>
        <RoundInfoList
          rounds={rounds().untracked}
          handleConfirmDelete={handleConfirmDelete}
          handleConfirmExport={handleConfirmExport}
          handleUploadRound={props.onUploadRound}
          handleInfo={(roundInfo) => setInfo(roundInfo)}
          canUpload={authenticated()}
          whose={"Your untracked"}
          headings={rounds().tracked.length > 0}
        />
      </Show>
      <Show when={rounds().readonly.length > 0}>
        <RoundInfoList
          rounds={rounds().readonly}
          handleConfirmDelete={handleConfirmDelete}
          handleConfirmExport={handleConfirmExport}
          handleUploadRound={props.onUploadRound}
          handleInfo={(roundInfo) => setInfo(roundInfo)}
          headings={rounds().tracked.length > 0 || rounds().untracked.length > 0}
          whose="Others'"
        />
      </Show>
    </div>
  )
}

function RoundInfoList(props: {
  handleConfirmDelete: (id: string) => void;
  handleConfirmExport: (id: string) => void;
  handleUploadRound: (id: string) => void;
  handleInfo: (roundInfo: RoundInfo) => void;
  rounds: RoundInfo[];
  canUpload?: boolean;
  whose: string;
  headings?: boolean;
}) {
  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table dense" size="small">
          <TableHead>
            <TableRow>
              <TableCell>{props.whose} rounds</TableCell>
              {/*<TableCell />*/}
              <TableCell />
              <TableCell />
              <TableCell align="center" sx={{ color: props.headings ? "" : "transparent" }}>Mixed</TableCell>
              <TableCell align="center" sx={{ color: props.headings ? "" : "transparent" }}>Ladies</TableCell>
              <TableCell align="center" sx={{ color: props.headings ? "" : "transparent" }}>Board</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <For each={props.rounds}>{(round) => {
              const inProgress = () => round.status != "complete" && round.status != "abandoned"
              const status = () => inProgress() ? `in progress: ${round.status}` : round.status
              return (
                <TableRow>
                  <TableCell sx={{ width: "1%", minWidth: "fit-content" }}>
                    <Stack direction="row" gap="1em" alignItems="center">
                      <MoreMenu id={round.id}>{(handleClose) => {
                        const confirmDelete = () => {
                          props.handleConfirmDelete(round.id)
                          handleClose()
                        }
                        const confirmExport = () => {
                          props.handleConfirmExport(round.id)
                          handleClose()
                        }
                        const doUpload = () => {
                          props.handleUploadRound(round.id)
                          handleClose()
                        }
                        return (
                          <>
                            <MenuItem onClick={confirmExport}>Export</MenuItem>
                            <MenuItem onClick={confirmDelete}>Delete</MenuItem>
                            <Show when={props.canUpload}>
                              <MenuItem onClick={doUpload}>Upload</MenuItem>
                            </Show>
                          </>
                        )
                      }}</MoreMenu>
                      <Link href={`/${round.id}/${round.status}`}>
                        <IconButton>
                          <Show when={inProgress()}
                            fallback={<Assignment />}
                          >
                            <ArrowRight color="success" />
                          </Show>
                        </IconButton>
                      </Link>
                      {round.date.toLocaleDateString()}
                    </Stack>
                  </TableCell>
                  {/*
                  <TableCell sx={{ width: "1%", minWidth: "fit-content" }} padding="none">
                    <Chip size="small" label={round.league} color="primary" variant="outlined" />
                  </TableCell>
                  */}
                  <TableCell sx={{ width: "1%", minWidth: "fit-content", pl: "16px" }} padding="none">
                    <Chip size="small" label={status()} color={statusColor[round.status] ?? "warning"} variant="outlined" />
                  </TableCell>
                  <TableCell align="left">
                    <div style={{ display: "flex", "align-items": "center" }}>
                      <IconButton onClick={() => props.handleInfo(round)}>
                        <InfoOutlined fontSize="small" />
                      </IconButton>
                      {round.description}
                    </div>
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
