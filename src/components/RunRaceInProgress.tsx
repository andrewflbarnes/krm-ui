import { Cancel, CheckCircle, CheckCircleOutline, CloseOutlined } from "@suid/icons-material";
import { Chip, FormControlLabel, Paper, Stack, Switch, Table, TableBody, TableContainer, Typography } from "@suid/material";
import { createEffect, createMemo, createSignal, ErrorBoundary, For, Show } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { Round } from "../api/krm";
import { raceConfig, miniLeagueConfig, RoundMiniLeagueConfig, MiniLeagueConfig, Division } from "../kings";
import styles from "./RunRaceInProgress.module.css";

type AccumulatedConfig = {
  [division in Division]: (MiniLeagueConfig[number] & RoundMiniLeagueConfig)[];
}

type Race = {
  division: Division;
  group: string;
  groupRace: number;
  team1: string;
  team2: string;
};

type Result = {
  winner?: 1 | 2;
  team1Dsq?: boolean;
  team2Dsq?: boolean;
}

type Results = {
  [division in Division]?: {
    [group: string]: {
      [groupRace: number]: Result
    }
  }
}

type DivisionRaces = {
  [divsion in Division]: Race[];
}

const divisionRaces = (round: Round): DivisionRaces => {
  const r1conf = Object.entries(round.teams).reduce((acc, [division, divisionTeams]) => {
    const rconf = raceConfig[divisionTeams.length].round1
    acc[division] = rconf.map(ml => ({
      ...miniLeagueConfig[ml.miniLeague],
      ...ml,
    }))
    return acc
  }, {} as AccumulatedConfig)

  return Object.entries(r1conf).reduce((acc, [division, divisionConf]) => {
    acc[division] = divisionConf.flatMap(ml => {
      return ml.races.map((race, i) => ({
        group: ml.name,
        groupRace: i,
        team1: round.teams[division][ml.seeds[race[0] - 1] - 1],
        team2: round.teams[division][ml.seeds[race[1] - 1] - 1],
        division,
      }))
    })
    return acc
  }, {} as {
    [division in Division]: Race[]
  })
}

const orderRaces = (divisionRaces: DivisionRaces, splits: number) => {
  const or: Race[] = [];
  for (let i = 0; i < splits; i++) {
    Object.values(divisionRaces).forEach((races) => {
      const size = races.length / splits
      const start = i * size
      const end = Math.min((i + 1) * size, races.length)
      races.slice(start, end).forEach(r => or.push(r))
    })
  }
  return or
}

export default function RunRaceInProgress(props: { round: Round }) {
  createEffect(() => console.log('rendering RunRaceInProgress', JSON.stringify(props.round)))
  return (
    <ErrorBoundary fallback={e => (
      <>
        <div>
          Something went wrong - race configuration for that number of teams probably doesn't exist yet :(
        </div>
        <div>
          {e.message}
        </div>
      </>
    )}>
      <RunRaceInProgressInternal round={props.round} />
    </ErrorBoundary>
  )
}

function RunRaceInProgressInternal(props: { round: Round }) {
  const [splits, setSplits] = createSignal(1)
  const orderedRaces = createMemo(() => {
    const divRaces = divisionRaces(props.round)
    return orderRaces(divRaces, splits())
  })
  // TODO incremental save
  const [results, setResults] = createStore<Results>({})
  function easySetResults<T extends keyof Result>(race: Race, field: T, value: Result[T]) {
    setResults(produce(rd => {
      if (!rd[race.division]) {
        rd[race.division] = {}
      }
      if (!rd[race.division][race.group]) {
        rd[race.division][race.group] = {}
      }
      if (!rd[race.division][race.group][race.groupRace]) {
        rd[race.division][race.group][race.groupRace] = {}
      }
      rd[race.division][race.group][race.groupRace][field] = value
    }))
  }
  createEffect(() => console.log("RENDER", orderedRaces().length, results.board))
  return (
    <>
      {props.round.date} {props.round.league}
      <Stack>
        Race List
        <FormControlLabel
          control={<Switch checked={splits() > 1} onChange={() => setSplits(s => s > 1 ? 1 : 3)} />}
          label="grimify"
        />
        <Typography>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650, maxWidth: "50rem" }} aria-label="simple table dense" size="small">
              <TableBody>
                <For each={orderedRaces()}>{(race, raceNum) =>
                  <RaceTableRow
                    raceNum={raceNum()}
                    race={race}
                    result={results[race.division]?.[race.group]?.[race.groupRace]}
                    resultSetter={easySetResults}
                  />
                }</For>
              </TableBody>
            </Table>
          </TableContainer>
        </Typography>
      </Stack>
    </>
  )
}

type ResultSetter = <T extends keyof Result>(race: Race, field: T, value: Result[T]) => void

function RaceTableRow(props: {
  raceNum: number;
  race: Race;
  result?: Result;
  resultSetter: ResultSetter;
}) {
  createEffect(() => console.log('rendering race', props.race.division, props.race.group, props.race.groupRace))
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
