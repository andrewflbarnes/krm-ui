import { Button, ButtonGroup, FormControlLabel, Stack, Switch } from "@suid/material";
import { createMemo, createSignal, ErrorBoundary } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { Round } from "../api/krm";
import { raceConfig, miniLeagueConfig, RoundMiniLeagueConfig, MiniLeagueConfig, Division } from "../kings";
import { Race, RaceResult } from "../types";
import RaceList, { ResultSetter } from "./RaceList";

type AccumulatedConfig = {
  [division in Division]: (MiniLeagueConfig[number] & RoundMiniLeagueConfig)[];
}

type Results = {
  [division in Division]?: {
    [group: string]: {
      [groupRace: number]: RaceResult
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
  const easySetResults: ResultSetter = function(race, field, value) {
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
      <div style={{ display: "flex", "align-items": "center", "justify-content": "center" }}>
        <ButtonGroup>
          <Button variant="contained">Round 1</Button>
          <Button disabled>Round 2</Button>
          <Button disabled>Knockouts</Button>
        </ButtonGroup>
      </div>
      <div style={{ display: "flex", "align-items": "center", "justify-content": "center" }}>
        <ButtonGroup>
          <Button variant="contained">Race List</Button>
          <Button disabled>Mini leagues</Button>
        </ButtonGroup>
      </div>
      {props.round.date} {props.round.league}
      <Stack>
        Race List
        <FormControlLabel
          control={<Switch checked={splits() > 1} onChange={() => setSplits(s => s > 1 ? 1 : 3)} />}
          label="grimify"
        />
        <RaceList results={results} orderedRaces={orderedRaces()} onResultUpdate={easySetResults} /> 
      </Stack>
    </>
  )
}
