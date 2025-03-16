import { raceConfig } from "./config"
import { parseResults } from "./result-utils"
import { ClubSeeding, divisions,  Division, League, LeagueData, Round, RoundConfig, RoundSeeding, StageRaces } from "./types"
import { Race } from "./types"

export function orderSeeds(leagueConfig: LeagueData, numTeams: ClubSeeding): RoundSeeding {
  return Object.entries(parseResults(leagueConfig)).reduce((acc, [division, seeded]) => {
    acc[division] = seeded.filter(t => {
      let teamIndex = +t.name.replace(/.*?(\d*)$/, "$1") >>> 0
      if (teamIndex != 0) {
        --teamIndex
      }
      return numTeams[t.club]?.[division] > teamIndex
    }).map(({ name }) => name)
    return acc
  }, {
    mixed: [],
    ladies: [],
    board: [],
  })
}

// linearly collapse a list of races into a list of list of races where each
// child list contains adjacent races without a shared team.
// e.g. given
// [1v2, 3v4, 1v3, 2v3]
// this would collapse to
// [[1v2, 3v4], [1v3], [2v3]]
// This has uses during rendering where we may display multiple races in a single
// column. In the above case, rather than having 4 columns, 1 per race, we have
// 3 columns with the first column containing 2 races
export function collapseRaces(races: Race[], collapsed: boolean): Race[][] {
  if (!collapsed) {
    return races.map(r => [r])
  }

  const ret: Race[][] = []
  races.forEach((race) => {
    const addNew = ret.length == 0
    if (addNew) {
      ret[0] = []
    }

    const last = ret[ret.length - 1]
    const currTeams = [race.team1, race.team2]
    const conflict = last.some(l => [l.team1, l.team2].some(t => currTeams.includes(t)))

    if (conflict) {
      ret.push([race])
    } else {
      last.push(race)
    }
  })
  return ret
}

type TeamResults = {
  pos: string[][];
  data: {
    [team: string]: {
      wins: number;
      finished: boolean;
    }
  }
}

// note teams is a subset of those in races and results are only calculated
// based on races where both teams are in the subset
// For the fiven give teams returs both
// - wins: a map of team names to number of wins
// - pos: the relative positions of each team
// For the latter draws are indicated by multiple teams in an array e.g.
// [[team1, team2], [team3]]
// indicates team1 and team2 are joint first and team3 is third
export function calcTeamResults(teams: string[], races: Race[], maxDepth: number = 2): TeamResults {
  // prepos is the positions when looking at wins across the whole minileague
  // In this case we ay have drawn teams whenever two or more teams share the
  // same number of wins
  const prepos = calcTeamResultsIter(teams, races)
  // Also perform a one of to check if each team has finsihed all their
  // races.
  const unfinished = teams.filter(team => races.some(({ team1, team2, winner }) =>
    ((team1 == team || team2 == team) && winner > 0)))
  Object.entries(prepos.data).forEach(([team, data]) => {
    data.finished = !unfinished.includes(team)
  })
  // We don't worry about recursing deeper than 2 levels since it's not
  // possible to have more than 2 layer of determinate draws. I realise
  // it's somewhat lazy not explaining why here but on a basic level we
  // don't support large enough mini leagues for this.
  // More generally we only need to support 1 layer of recursing for a complete
  // mini league, having 2 unless us to display "accurate" positions in
  // partial completion states. We may remove this as it might be considered
  // irrelevant
  for (let depth = 0; depth < maxDepth; depth++) {
    // pos are the positions when looking at wins within drawn teams - i.e.
    // taking into account only races between the other drawn teams we can,
    // usually, work out the relative positions
    const pos: string[][] = []
    prepos.pos.forEach((drawnTeams) => {
      if (drawnTeams.length == 1) {
        pos.push(drawnTeams)
        return
      }
      const drawnResults = calcTeamResultsIter(drawnTeams, races)
      Array.prototype.push.apply(pos, drawnResults.pos)
    })
    // update based on the current iteration
    prepos.pos = pos
  }
  return prepos
}

function calcTeamResultsIter(teams: string[], allRaces: Race[]): TeamResults {
  const tws: {
    [team: string]: {
      wins: number;
      winWeight: number;
    }
  } = {}
  const races = allRaces.filter(({ team1, team2 }) => teams.includes(team1) && teams.includes(team2))
  teams.forEach((team) => {
    const wonRaces = races.filter(({ team1, team2, winner }) =>
      (team1 == team && winner == 1) ||
      (team2 == team && winner == 2))

    tws[team] = {
      wins: wonRaces.length,
      winWeight: races.reduce((acc, r) => {
        const { team1, team1Dsq, team2, team2Dsq } = r
        if (wonRaces.includes(r)) {
          acc += 10
        }
        if ((team1 == team && team1Dsq) || (team2 == team && team2Dsq)) {
          acc -= 1
        }
        return acc
      }, 0),
    }
  })
  const check = Object.entries(tws).map(([team, wins]) => ({
    team,
    ...wins,
  }))
  check.sort((a, b) => b.winWeight - a.winWeight)

  const pos: string[][] = []
  let lastWinWeight = 999
  check.forEach(teamPos => {
    if (teamPos.winWeight < lastWinWeight) {
      pos.push([])
      lastWinWeight = teamPos.winWeight
    }
    pos[pos.length - 1].push(teamPos.team)
  })
  const wins = check.reduce((acc, { team, wins }) => {
    acc[team] = {
      wins,
    }
    return acc
  }, {})

  return {
    pos,
    data: wins,
  }
}

export function createRound(id: string, league: League, teams: RoundSeeding, distributionOrder?: RoundSeeding): Round {
  const teamOrder = distributionOrder || teams
  const config = Object.entries(teams).reduce((acc, [division, seeds]) => {
    acc[division] = raceConfig[seeds.length]
    return acc
  }, {} as {
    [division in Division]: RoundConfig;
  })

  const races = divisions.reduce((acc, division) => {
    const divisionConf = config[division]
    acc[division] = divisionConf.stage1.reduce((accd, { template, name: groupName, seeds }) => {
      const races: Race[] = template.races.map((race, i) => ({
        stage: "stage1",
        group: groupName,
        groupRace: i,
        teamMlIndices: race,
        team1: teamOrder[division][seeds[race[0]].position],
        team2: teamOrder[division][seeds[race[1]].position],
        division: division as Division,
      }))
      accd[groupName] = {
        races,
        teams: teamOrder[division].filter(t => races.some(r => r.team1 === t || r.team2 === t)),
        complete: false,
        conflict: false,
      }
      return accd
    }, {} as StageRaces[Division])
    return acc
  }, {
    mixed: {},
    ladies: {},
    board: {},
  } as StageRaces)
  return {
    id,
    league,
    date: new Date(),
    description: "Round 2",
    venue: "Gloucester",
    status: "stage1",
    config,
    races: {
      stage1: races,
    },
    teams,
    distributionOrder: distributionOrder || teams,
  }
}
