import { Cancel, CheckCircle, CheckCircleOutline, CloseOutlined } from "@suid/icons-material";
import { Chip, Paper, Table, TableBody, TableContainer, Typography } from "@suid/material";
import { For, Show } from "solid-js";
import { Race, RaceResult } from "../types";
import styles from "./RaceList.module.css";

export type ResultSetter = <T extends keyof RaceResult>(race: Race, field: T, value: RaceResult[T]) => void

type RaceListProps = {
  orderedRaces: Race[],
  results: {
    [division: string]: {
      [group: string]: {
        [groupRace: number]: RaceResult
      }
    }
  };
  onResultUpdate: ResultSetter;
}

export default function RaceList(props: RaceListProps) {
  return (
    <Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650, maxWidth: "50rem" }} aria-label="simple table dense" size="small">
          <TableBody>
            <For each={props.orderedRaces}>{(race, raceNum) =>
              <RaceTableRow
                raceNum={raceNum()}
                race={race}
                result={props.results[race.division]?.[race.group]?.[race.groupRace]}
                resultSetter={props.onResultUpdate}
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
  result?: RaceResult;
  resultSetter: ResultSetter;
}) {
  const setWinner = (winner?: 1 | 2) => {
    props.resultSetter(props.race, 'winner', winner)
  }
  const toggleDsq = (dsq: 1 | 2, e: MouseEvent) => {
    e.stopPropagation()
    const t1Dsq = props.result?.team1Dsq
    props.resultSetter(props.race, 'team1Dsq', dsq == 1 ? !t1Dsq : t1Dsq)
    const t2Dsq = props.result?.team2Dsq
    props.resultSetter(props.race, 'team2Dsq', dsq == 2 ? !t2Dsq : t2Dsq)
  }
  const team1Dsq = () => props.result?.team1Dsq
  const team2Dsq = () => props.result?.team2Dsq
  const winner = () => props.result?.winner
  // Performance degradations with solid + suid once we start to get to around
  // 20+ rows so we use native elements instead.
  return (
    <tr style={{ display: "table-row" }}>
      <td class={styles.td} style={{ width: "14em", border: 0 }}>
        <div style={{ display: "flex", "flex-direction": "row", gap: "1em", "align-items": "center" }}>
          <Show when={winner()}>
            <Chip onDelete={() => setWinner()} size="small" label="Complete" variant="filled" color="success" />
          </Show>
          <Show when={team1Dsq() || team2Dsq()}>
            <Chip size="small" label="DSQ" variant="filled" color="error" sx={{ visibility: team1Dsq() || team2Dsq() ? "visible" : "hidden" }} />
          </Show>
          &nbsp;
        </div>
      </td>
      <td class={styles.td} style={{ width: "1%" }}>
        <div style={{ display: "flex", "flex-direction": "row", gap: "1em", "justify-content": "space-between", "align-items": "center" }}>
          <div style={{ display: "inline-block" }}>
            {props.raceNum + 1}
          </div>
          <div style={{ display: "inline-block" }}>
            {props.race.division[0].toUpperCase()}
          </div>
        </div>
      </td>
      <td
        class={styles.td}
        style={{ cursor: "pointer" }}
        onClick={() => setWinner(1)}
      >
        <div style={{ display: "flex", "flex-direction": "row", "align-items": "center" }}>
          <div onClick={[toggleDsq, 1]} style={{ display: "contents" }}>
            <Show when={team1Dsq()} fallback={<CloseOutlined fontSize="small" color="inherit" />}>
              <Cancel onClick={[toggleDsq, 1]} fontSize="small" color="error" />
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
        style={{ cursor: "pointer" }}
        onClick={() => setWinner(2)}
      >
        <div style={{ display: "flex", "flex-direction": "row", "align-items": "center", "justify-content": "end" }}>
          {props.race.team2}
          &nbsp;
          <Show when={winner() == 2} fallback={<CheckCircleOutline fontSize="small" color="inherit" />}>
            <CheckCircle fontSize="small" color="success" />
          </Show>
          <div onClick={[toggleDsq, 2]} style={{ display: "contents" }}>
            <Show when={team2Dsq()} fallback={<CloseOutlined fontSize="small" color="inherit" />}>
              <Cancel fontSize="small" color="error" />
            </Show>
          </div>
        </div>
      </td>
    </tr>
  )
}
