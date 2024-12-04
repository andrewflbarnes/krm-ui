import { parseResults } from "./result-utils"
import { ClubSeeding, LeagueData } from "./types"
import { Race } from "./types"

export function orderSeeds(leagueConfig: LeagueData, numTeams: ClubSeeding) {
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
  wins: {
    [team: string]: number;
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
export function calcTeamResults(teams: string[], allRaces: Race[]): TeamResults {
  const tws: {
    [team: string]: number;
  } = {}
  const races = allRaces.filter(({ team1, team2 }) => teams.includes(team1) && teams.includes(team2))
  teams.forEach((team) => {
    const wins = races.filter(({ team1, team2, winner }) =>
      (team1 == team && winner == 1) ||
      (team2 == team && winner == 2))
      .length
    tws[team] = wins
  })
  const check = Object.entries(tws).map(([team, wins]) => ({
    team,
    wins,
  }))
  check.sort((a, b) => b.wins - a.wins)

  const pos: string[][] = []
  let lastWins = 999
  check.forEach(teamPos => {
    if (teamPos.wins < lastWins) {
      pos.push([])
      lastWins = teamPos.wins
    }
    pos[pos.length - 1].push(teamPos.team)
  })
  const wins = check.reduce((acc, { team, wins }) => {
    acc[team] = wins
    return acc
  }, {})

  return {
    pos,
    wins,
  }
}
