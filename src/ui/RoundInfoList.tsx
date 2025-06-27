import { Assignment, InfoOutlined, PlayCircleOutline, Visibility } from "@suid/icons-material";
import { Button, Chip, MenuItem, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@suid/material";
import { createMemo, For, Match, Show, Switch } from "solid-js";
import { RoundInfo } from "../api/krm";
import MoreMenu from "./MoreMenu";
import { useNavigate } from "@solidjs/router";

const statusColor = {
  "abandoned": "error",
  "complete": "success",
}

type RoundInfoListProps = {
  handleConfirmDelete: (id: string) => void;
  handleConfirmExport: (id: string) => void;
  handleUploadRound: (id: string) => void;
  onCopyToClipboard: (id: string) => void;
  handleInfo: (roundInfo: RoundInfo) => void;
  rounds: RoundInfo[];
  canUpload?: boolean;
  userId: string;
}

export default function RoundInfoList(props: RoundInfoListProps) {
  const rounds = createMemo(() => {
    const userId = props.userId
    return props.rounds.reduce((acc, round) => {
      if (round.owner == "local") {
        acc[0].rounds.push(round)
      } else if (round.owner == userId) {
        acc[1].rounds.push(round)
      } else {
        acc[2].rounds.push(round)
      }
      return acc
    }, [
      { whose: "Your untracked", rounds: [], owned: true },
      { whose: "Your tracked", rounds: [], owned: true },
      { whose: "Others'", rounds: [], owned: false },
    ])
  })

  const firstAppearance = () => rounds().findIndex(({ rounds }) => rounds.length > 0)
  const firstWhose = () => rounds()[firstAppearance()]?.whose || ""
  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table dense" size="small">
          <TableHead>
            <TableRow>
              <TableCell colSpan="2">{firstWhose()} rounds</TableCell>
              {/*<TableCell />*/}
              <TableCell align="center">Mixed</TableCell>
              <TableCell align="center">Ladies</TableCell>
              <TableCell align="center">Board</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <For each={rounds()}>{({ whose, rounds: rs, owned }, idx) => {
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
                          onCopyToClipboard={props.onCopyToClipboard}
                          canUpload={props.canUpload}
                          owned={owned}
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
  onCopyToClipboard: (id: string) => void;
  handleInfo: (roundInfo: RoundInfo) => void;
  canUpload?: boolean;
  owned?: boolean;
}) {
  const inProgress = () => props.round.status != "complete" && props.round.status != "abandoned"
  const roundDesc = () => {
    const { round, description } = props.round.details
    const desc = `Round ${round}`
    if (description?.length < 1) {
      return desc
    }
    return `${desc} - ${description}`
  }
  const nav = useNavigate()
  const navToRace = () => {
    nav(`/races/${props.round.id}/${props.round.status}`)
  }
  return (
    <TableRow>
      <TableCell sx={{ width: "1%", minWidth: "fit-content", padding: 0 }}>
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
            const copyToClipboard = () => {
              props.onCopyToClipboard(props.round.id)
              handleClose()
            }
            return (
              <>
                <MenuItem onClick={confirmExport}>Export</MenuItem>
                <MenuItem onClick={confirmDelete}>Delete</MenuItem>
                <Show when={props.canUpload && props.owned}>
                  <MenuItem onClick={doUpload}>Upload</MenuItem>
                </Show>
                <MenuItem onClick={copyToClipboard}>Copy to clipboard</MenuItem>
              </>
            )
          }}</MoreMenu>
          <Button onClick={navToRace} color="inherit" size="large" fullWidth sx={{ justifyContent: "start" }} startIcon={
            <Switch
              fallback={<Assignment />}
            >
              <Match when={inProgress() && props.owned}>
                <PlayCircleOutline color="primary" />
              </Match>
              <Match when={inProgress()}>
                <Visibility color="primary" />
              </Match>
            </Switch>
          }>
            <Stack direction="row" gap="1em" alignItems="center" width="100%">
              <span style={{"flex-grow": 1, "text-align": "left"}}>
                {props.round.details.date.toLocaleDateString()}
              </span>
              <span style={{ width: "6em", "text-align": "left" }}>
                <Chip sx={{ cursor: "inherit", textTransform: "capitalize" }} size="small" label={props.round.status} color={statusColor[props.round.status] ?? "primary"} variant="outlined" />
              </span>
            </Stack>
          </Button>
        </Stack>
      </TableCell>
      <TableCell align="left">
        <Button
          fullWidth
          sx={{ justifyContent: "start", textTransform: "none", color: "inherit", width: "100%" }}
          startIcon={<InfoOutlined />}
          size="large"
          onClick={() => props.handleInfo(props.round)}
        >
          {roundDesc()}
        </Button>
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
