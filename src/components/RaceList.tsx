import { CancelOutlined, CloseOutlined } from "@suid/icons-material";
import { MenuItem, Paper, Table, TableBody, TableContainer, Typography } from "@suid/material";
import { For, Show } from "solid-js";
import { Race } from "../kings";
import MoreMenu from "../ui/MoreMenu";
import RaceResultIcon from "../ui/RaceResultIcon";
import styles from "./RaceList.module.css";

type RaceListProps = {
  orderedRaces: Race[],
  onRaceUpdate: (race: Race) => void;
  readonly?: boolean;
  knockout?: boolean;
}

export default function RaceList(props: RaceListProps) {
  return (
    <Typography>
      <TableContainer component={Paper}>
        <Table aria-label="simple table dense" size="small">
          <TableBody>
            <For each={props.orderedRaces}>{(race, raceNum) =>
              <RaceTableRow
                raceNum={raceNum()}
                raceStr={props.knockout ? race.group : null}
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
  raceStr?: string;
  race: Race;
  onRaceUpdate: (race: Race) => void;
  readonly?: boolean;
}) {
  const setWinner = (winner: 1 | 2, e: MouseEvent) => {
    e.stopPropagation()
    if (props.readonly || props.race.winner) {
      return
    }
    const updated = {
      ...props.race,
      winner,
    }
    props.onRaceUpdate(updated)
  }
  const canDsq = () => !props.readonly && props.race.indicators != "by"
  const toggleDsq = (dsq: 1 | 2, e: MouseEvent) => {
    e.stopPropagation()
    if (!canDsq()) {
      return
    }
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
    <tr style={{
      display: "table-row",
      ...(props.race.winner && !props.readonly ? {
        "background-color": "rgba(0, 255, 0, 0.1)",
      } : {})
    }}>
      <td class={styles.td} style={{ width: "8em" }}>
        <div style={{ display: "flex", "flex-direction": "row", gap: "1em", "justify-content": "space-between", "align-items": "center" }}>
          <div style={{ visibility: props.readonly ? "hidden" : "visible" }} >
            <MoreMenu id={`${props.race.stage}-${props.race.division}-${props.race.group}-${props.race.groupRace}`}>{(handleClose) => {
              const handleConcede = (team: 1 | 2, e: MouseEvent) => {
                e.stopPropagation()
                props.onRaceUpdate({
                  ...props.race,
                  winner: team == 1 ? 2 : 1,
                  indicators: "by",
                  team1Dsq: undefined,
                  team2Dsq: undefined
                })
              }
              const handleReset = () => {
                handleClose()
                props.onRaceUpdate({
                  ...props.race,
                  winner: undefined,
                  team1Dsq: undefined,
                  team2Dsq: undefined
                })
              }
              const clearConcede = () => {
                handleClose()
                props.onRaceUpdate({
                  ...props.race,
                  indicators: undefined,
                })
              }
              return (
                <>
                  <MenuItem onClick={handleReset}>Reset</MenuItem>
                  <Show when={props.race.indicators == "by"}>
                    <MenuItem onClick={clearConcede}>clear by</MenuItem>
                  </Show>
                  <Show when={props.race.indicators != "by"}>
                    <MenuItem onClick={[handleConcede, 1]}>{props.race.team1} concede (by)</MenuItem>
                    <MenuItem onClick={[handleConcede, 2]}>{props.race.team2} concede (by)</MenuItem>
                  </Show>
                </>
              )
            }}</MoreMenu>
          </div>
          <div style={{ display: "inline-block", flex: "1 0 0", "min-width": "1em" }}>
            {props.raceStr || (props.raceNum + 1)}
          </div>
          <div style={{ display: "inline-block", "min-width": "1em" }}>
            {props.race.division[0].toUpperCase()}
          </div>
        </div>
      </td>
      <td
        class={styles.td}
        style={{ cursor: props.readonly ? "inherit" : "pointer" }}
        onClick={[setWinner, 1]}
      >
        <div style={{ display: "flex", "flex-direction": "row", "align-items": "center" }}>
          <div onClick={[toggleDsq, 1]} style={{ display: "contents" }}>
            <Show when={team1Dsq()} fallback={<CloseOutlined fontSize="small" color={canDsq() ? "inherit" : "disabled"} />}>
              <CancelOutlined fontSize="small" color="error" />
            </Show>
          </div>
          <RaceResultIcon won={winner() == 1} conceded={winner() != 1 && props.race.indicators == "by"} fontSize="small" />
          &nbsp;
          {props.race.team1}
        </div>
      </td>
      <td class={styles.td} style={{ "text-align": "center" }}>v</td>
      <td
        class={styles.td}
        style={{ cursor: props.readonly ? "inherit" : "pointer" }}
        onClick={[setWinner, 2]}
      >
        <div style={{ display: "flex", "flex-direction": "row", "align-items": "center", "justify-content": "end" }}>
          {props.race.team2}
          &nbsp;
          <RaceResultIcon won={winner() == 2} conceded={winner() != 2 && props.race.indicators == "by"} fontSize="small" />
          <div onClick={[toggleDsq, 2]} style={{ display: "contents" }}>
            <Show when={team2Dsq()} fallback={<CloseOutlined fontSize="small" color={canDsq() ? "inherit" : "disabled"} />}>
              <CancelOutlined fontSize="small" color="error" />
            </Show>
          </div>
        </div>
      </td>
      <td class={styles.td} style={{ width: "3em", border: 0 }}>
        <div style={{ display: "flex", "flex-direction": "row", gap: "1em", "align-items": "center" }}>
          <Typography
            style={{ visibility: props.race.indicators || team1Dsq() || team2Dsq() ? null : "hidden" }}
            variant="caption"
            color={props.race.indicators ? "warning.main" : "error"}
          >
            {props.race.indicators?.toUpperCase() || "DSQ"}
          </Typography>
        </div>
      </td>
    </tr>
  )
}
