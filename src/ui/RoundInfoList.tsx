import { ArrowRight, Assignment, InfoOutlined } from "@suid/icons-material";
import { Chip, IconButton, MenuItem, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@suid/material";
import { createMemo, For, Show } from "solid-js";
import Link from "../components/Link";
import { RoundInfo } from "../api/krm";
import MoreMenu from "./MoreMenu";

const statusColor = {
  "abandoned": "error",
  "complete": "success",
}

type RoundInfoListProps = {
  handleConfirmDelete: (id: string) => void;
  handleConfirmExport: (id: string) => void;
  handleUploadRound: (id: string) => void;
  handleInfo: (roundInfo: RoundInfo) => void;
  rounds: RoundInfo[];
  canUpload?: boolean;
  userId: string;
}

export default function RoundInfoList(props: RoundInfoListProps) {
  const rounds = createMemo(() => props.rounds.reduce((acc, round) => {
    if (round.owner == "local") {
      acc[1].rounds.push(round)
    } else if (round.owner == props.userId) {
      acc[0].rounds.push(round)
    } else {
      acc[2].rounds.push(round)
    }
    return acc
  }, [
    { whose: "Your tracked", rounds: [] },
    { whose: "Your untracked", rounds: [] },
    { whose: "Others'", rounds: [] },
  ]))

  const firstAppearance = () => rounds().findIndex(({ rounds }) => rounds.length > 0)
  const firstWhose = () => rounds()[firstAppearance()]?.whose || ""
  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table dense" size="small">
          <TableHead>
            <TableRow>
              <TableCell colSpan="3">{firstWhose()} rounds</TableCell>
              {/*<TableCell />*/}
              <TableCell align="center">Mixed</TableCell>
              <TableCell align="center">Ladies</TableCell>
              <TableCell align="center">Board</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <For each={rounds()}>{({ whose, rounds: rs }, idx) => {
              return (
                <Show when={rs.length > 0}>
                  <Show when={firstAppearance() < idx()}>
                    <TableRow>
                      <TableCell colSpan="6">{whose} rounds</TableCell>
                    </TableRow>
                  </Show>
                  <For each={rs}>{(round) => {
                    return (
                      <Show when={rs.length > 0}>
                        <RoundInfoRow
                          round={round}
                          handleConfirmDelete={props.handleConfirmDelete}
                          handleConfirmExport={props.handleConfirmExport}
                          handleUploadRound={props.handleUploadRound}
                          handleInfo={props.handleInfo}
                          canUpload={props.canUpload}
                        />
                      </Show>
                    )
                  }}</For>
                </Show>
              )
            }}</For>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

function RoundInfoRow(props: {
  round: RoundInfo;
  handleConfirmDelete: (id: string) => void;
  handleConfirmExport: (id: string) => void;
  handleUploadRound: (id: string) => void;
  handleInfo: (roundInfo: RoundInfo) => void;
  canUpload?: boolean;
}) {
  const inProgress = () => props.round.status != "complete" && props.round.status != "abandoned"
  const status = () => inProgress() ? `in progress: ${props.round.status}` : props.round.status
  return (
    <TableRow>
      <TableCell sx={{ width: "1%", minWidth: "fit-content" }}>
        <Stack direction="row" gap="1em" alignItems="center">
          <MoreMenu id={props.round.id}>{(handleClose) => {
            const confirmDelete = () => {
              props.handleConfirmDelete(props.round.id)
              handleClose()
            }
            const confirmExport = () => {
              props.handleConfirmExport(props.round.id)
              handleClose()
            }
            const doUpload = () => {
              props.handleUploadRound(props.round.id)
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
          <Link href={`/${props.round.id}`}>
            <IconButton>
              <Show when={inProgress()}
                fallback={<Assignment />}
              >
                <ArrowRight color="success" />
              </Show>
            </IconButton>
          </Link>
          {props.round.date.toLocaleDateString()}
        </Stack>
      </TableCell>
      <TableCell sx={{ width: "1%", minWidth: "fit-content", pl: "16px" }} padding="none">
        <Chip size="small" label={status()} color={statusColor[props.round.status] ?? "warning"} variant="outlined" />
      </TableCell>
      <TableCell align="left">
        <div style={{ display: "flex", "align-items": "center" }}>
          <IconButton onClick={() => props.handleInfo(props.round)}>
            <InfoOutlined fontSize="small" />
          </IconButton>
          {props.round.description}
        </div>
      </TableCell>
      <TableCell align="center" sx={{ width: "1%", maxWidth: "fit-content" }}>
        {props.round.teams["mixed"].length}
      </TableCell>
      <TableCell align="center" sx={{ width: "1%", maxWidth: "fit-content" }}>
        {props.round.teams["ladies"].length}
      </TableCell>
      <TableCell align="center" sx={{ width: "1%", maxWidth: "fit-content" }}>
        {props.round.teams["board"].length}
      </TableCell>
    </TableRow>
  )
}
