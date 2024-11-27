import { Cancel, CheckCircle, CheckCircleOutline, CloseOutlined } from "@suid/icons-material";
import { Box, Checkbox, Chip, FormControlLabel, Paper, Stack, Switch, Table, TableBody, TableCell, TableContainer, TableRow } from "@suid/material";
import { createSignal, For } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { Round } from "../api/krm";
import { raceConfig, miniLeagueConfig, RoundMiniLeagueConfig, MiniLeagueConfig, Division } from "../kings";

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
  const [splits, setSplits] = createSignal(1)
  const divRaces = () => divisionRaces(props.round)
  const orderedRaces = () => orderRaces(divRaces(), splits())
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
  return (
    <>
      {props.round.date} {props.round.league}
      <Stack>
        Race List
        <FormControlLabel
          control={<Switch checked={splits() > 1} onChange={() => setSplits(s => s > 1 ? 1 : 3)} />}
          label="grimify"
        />
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650, maxWidth: "50rem" }} aria-label="simple table dense" size="small">
            <TableBody>
              <For each={orderedRaces()}>{(race, raceNum) => {
                const setWinner = (winner?: 1 | 2) => {
                  easySetResults(race, 'winner', winner)
                }
                const toggleDsq = (dsq: 1 | 2, e: MouseEvent) => {
                  e.stopPropagation()
                  const t1Dsq = results[race.division]?.[race.group]?.[race.groupRace]?.team1Dsq
                  easySetResults(race, 'team1Dsq', dsq == 1 ? !t1Dsq : t1Dsq)
                  const t2Dsq = results[race.division]?.[race.group]?.[race.groupRace]?.team2Dsq
                  easySetResults(race, 'team2Dsq', dsq == 2 ? !t2Dsq : t2Dsq)
                }
                const team1Dsq = () => results[race.division]?.[race.group]?.[race.groupRace]?.team1Dsq
                const team2Dsq = () => results[race.division]?.[race.group]?.[race.groupRace]?.team2Dsq
                const winner = () => results[race.division]?.[race.group]?.[race.groupRace]?.winner
                return (
                  <TableRow sx={{ "& td": { py: "0 !important" } }}>
                    <TableCell sx={{ width: "1%", maxWidth: "fit-content", borderBottom: 0 }}>
                      <Stack direction="row" gap="1em" alignItems="center">
                        <Chip onDelete={() => setWinner()} size="small" label="Complete" variant="filled" color="success" sx={{ visibility: winner() > 0 ? "visible" : "hidden" }} />
                        <Chip size="small" label="DSQ" variant="filled" color="error" sx={{ visibility: team1Dsq() || team2Dsq() ? "visible" : "hidden" }} />
                        &nbsp;
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ width: "1%" }}>
                      <Stack direction="row" gap="1em" justifyContent="space-between" alignItems="center">
                        <Box>
                          {raceNum() + 1}
                        </Box>
                        <Box>
                          {race.division[0].toUpperCase()}
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell
                      sx={{ cursor: "pointer" }}
                      onClick={() => setWinner(1)}
                      align="left"
                    >
                      <Stack direction="row" alignItems="center">
                        <Checkbox
                          icon={<CloseOutlined fontSize="small" color="inherit" />}
                          checkedIcon={<Cancel fontSize="small" color="error" />}
                          checked={team1Dsq()}
                          onClick={[toggleDsq, 1]}
                          size="small"
                        />
                        <Checkbox
                          sx={{ p: 0 }}
                          icon={<CheckCircleOutline fontSize="small" color="inherit" />}
                          checkedIcon={<CheckCircle fontSize="small" color="success" />}
                          checked={winner() == 1}
                          size="small"
                        />
                        &nbsp;
                        {race.team1}
                      </Stack>
                    </TableCell>
                    <TableCell align="center">v</TableCell>
                    <TableCell
                      sx={{ cursor: "pointer" }}
                      onClick={() => setWinner(2)}
                      align="right"
                    >
                      <Stack direction="row" alignItems="center" justifyContent="end">
                        {race.team2}
                        &nbsp;
                        <Checkbox
                          sx={{ p: 0 }}
                          icon={<CheckCircleOutline fontSize="small" color="inherit" />}
                          checkedIcon={<CheckCircle fontSize="small" color="success" />}
                          checked={winner() == 2}
                          size="small"
                        />
                        <Checkbox
                          icon={<CloseOutlined fontSize="small" color="inherit" />}
                          checkedIcon={<Cancel fontSize="small" color="error" />}
                          checked={team2Dsq()}
                          onClick={[toggleDsq, 2]}
                          size="small"
                        />
                      </Stack>
                    </TableCell>
                  </TableRow>
                )
              }}</For>
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </>
  )
}

