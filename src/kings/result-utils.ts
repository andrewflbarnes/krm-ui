import { divisions, DivisionResults, LeagueData, Result } from "./types"

function orderResults(a: Result, b: Result): number {
  const tot = b.total - a.total
  if (tot !== 0) {
    return tot
  }

  const aOrd = [a.r1, a.r2, a.r3, a.r4].sort((aa, bb) => bb - aa)
  const bOrd = [b.r1, b.r2, b.r3, b.r4].sort((aa, bb) => bb - aa)
  for (let i = 0; i < aOrd.length; i++) {
    if (aOrd[i] !== bOrd[i]) {
      return bOrd[i] - aOrd[i]
    }
  }
  const aLast = [a.r4, a.r3, a.r2, a.r1]
  const bLast = [b.r4, b.r3, b.r2, b.r1]
  for (let i = 0; i < aLast.length; i++) {
    if (aLast[i] !== bLast[i]) {
      return bLast[i] - aLast[i]
    }
  }
  // TODO previous year seeding
  return -1
}

export function parseResults(leagueData: LeagueData): DivisionResults {
  return divisions
    .reduce((acc, division) => {
      const divisionResult = []
      Object.entries(leagueData).forEach(([clubName, club]) => {
        Object.entries(club.teams[division] ?? {}).forEach(([name, { results }]) => {
          const tr: Result = {
            club: clubName,
            name,
            r1: results[0]?.[1],
            r2: results[1]?.[1],
            r3: results[2]?.[1],
            r4: results[3]?.[1],
          }
          tr.total = (tr.r1 >>> 0) + (tr.r2 >>> 0) + (tr.r3 >>> 0) + (tr.r4 >>> 0);
          divisionResult.push(tr)
        })
      })
      divisionResult.sort(orderResults)
      acc[division] = divisionResult
      return acc
    }, {})
}
