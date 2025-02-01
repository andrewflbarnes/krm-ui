import { Cancel, CheckCircle, CheckCircleOutline, CloseOutlined } from "@suid/icons-material";
import { MenuItem, Paper, Table, TableBody, TableContainer, Typography } from "@suid/material";
import { For, Show } from "solid-js";
import { Race } from "../kings";
import MoreMenu from "./MoreMenu";
import styles from "./RaceList.module.css";

type RaceListProps = {
  orderedRaces: Race[],
  onRaceUpdate: (race: Race) => void;
  readonly?: boolean;
}

export default function RaceList(props: RaceListProps) {
  return (
    <Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table dense" size="small">
          <TableBody>
            <For each={props.orderedRaces}>{(race, raceNum) =>
              <RaceTableRow
                raceNum={raceNum()}
                race={race}
                onRaceUpdate={props.onRaceUpdate}
                readonly={props.readonly}
              />
            }</For>
          </TableBody>
        </Table>
      </TableContainer>
    </Typography>
  )
}

function RaceTableRow(props: {
  raceNum: number;
  race: Race;
  onRaceUpdate: (race: Race) => void;
  readonly?: boolean;
}) {
  const setWinner = (winner?: 1 | 2) => {
    const updated = {
      ...props.race,
      winner,
    }
    props.onRaceUpdate(updated)
  }
  const toggleDsq = (dsq: 1 | 2, e: MouseEvent) => {
    e.stopPropagation()
    const t1Dsq = props.race.team1Dsq
    const t2Dsq = props.race.team2Dsq
    const updated = {
      ...props.race,
      team1Dsq: dsq == 1 ? !t1Dsq : t1Dsq,
      team2Dsq: dsq == 2 ? !t2Dsq : t2Dsq,
    }
    props.onRaceUpdate(updated)
  }
  const team1Dsq = () => props.race.team1Dsq
  const team2Dsq = () => props.race.team2Dsq
  const winner = () => props.race.winner
  // Performance degradations with solid + suid once we start to get to around
  // 20+ rows so we use native elements instead.
  return (
    <tr style={{ display: "table-row" }}>
      <td class={styles.td} style={{ width: "8em" }}>
        <div style={{ display: "flex", "flex-direction": "row", gap: "1em", "justify-content": "space-between", "align-items": "center" }}>
          <div style={{ visibility: props.readonly ? "hidden" : "visible" }} >
            <MoreMenu id={`${props.race.set}-${props.race.division}-${props.race.group}-${props.race.groupRace}`}>{(handleClose) => {
              const handleReset = () => {
                handleClose()
                props.onRaceUpdate({
                  ...props.race,
                  winner: undefined,
                  team1Dsq: undefined,
                  team2Dsq: undefined
                })
              }
              return (
                <MenuItem onClick={handleReset}>Reset</MenuItem>
              )
            }}</MoreMenu>
          </div>
          <div style={{ display: "inline-block", flex: "1 0 0" }}>
            {props.raceNum + 1}
          </div>
          <div style={{ display: "inline-block" }}>
            {props.race.division[0].toUpperCase()}
          </div>
        </div>
      </td>
      <td
        class={styles.td}
        style={{ cursor: props.readonly ? "inherit" : "pointer" }}
        onClick={() => !props.readonly && setWinner(1)}
      >
        <div style={{ display: "flex", "flex-direction": "row", "align-items": "center" }}>
          <div onClick={[toggleDsq, 1]} style={{ display: "contents" }}>
            <Show when={team1Dsq()} fallback={<CloseOutlined fontSize="small" color="inherit" />}>
              <Cancel onClick={props.readonly ? null : [toggleDsq, 1]} fontSize="small" color="error" />
            </Show>
          </div>
          <Show when={winner() == 1} fallback={<CheckCircleOutline fontSize="small" color="inherit" />}>
            <CheckCircle fontSize="small" color="success" />
          </Show>
          &nbsp;
          {props.race.team1}
        </div>
      </td>
      <td class={styles.td} style={{ "text-align": "center" }}>v</td>
      <td
        class={styles.td}
        style={{ cursor: props.readonly ? "inherit" : "pointer" }}
        onClick={() => !props.readonly && setWinner(2)}
      >
        <div style={{ display: "flex", "flex-direction": "row", "align-items": "center", "justify-content": "end" }}>
          {props.race.team2}
          &nbsp;
          <Show when={winner() == 2} fallback={<CheckCircleOutline fontSize="small" color="inherit" />}>
            <CheckCircle fontSize="small" color="success" />
          </Show>
          <div onClick={props.readonly ? null : [toggleDsq, 2]} style={{ display: "contents" }}>
            <Show when={team2Dsq()} fallback={<CloseOutlined fontSize="small" color="inherit" />}>
              <Cancel fontSize="small" color="error" />
            </Show>
          </div>
        </div>
      </td>
      <td class={styles.td} style={{ width: "10em", border: 0 }}>
        <div style={{ display: "flex", "flex-direction": "row", gap: "1em", "align-items": "center" }}>
          <Show when={winner()}>
            <Typography variant="caption" color="success.main">Complete</Typography>
          </Show>
          <Show when={team1Dsq() || team2Dsq()}>
            <Typography variant="caption" color="error">DSQ</Typography>
          </Show>
          &nbsp;
        </div>
      </td>
    </tr>
  )
}
