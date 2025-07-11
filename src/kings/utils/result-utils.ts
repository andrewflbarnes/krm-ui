import { divisions, DivisionResults, LeagueData, Result } from "../types"

export function orderResults(a: Result, b: Result): number {
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
  const aIdx = +a.name.replace(/.*?(\d*)$/, "$1") >>> 0
  const bIdx = +b.name.replace(/.*?(\d*)$/, "$1") >>> 0
  if (aIdx !== bIdx) {
    return aIdx - bIdx
  }
  return a.name.localeCompare(b.name)
}

export function parseResults(leagueData: LeagueData): DivisionResults {
  return divisions
    .reduce((acc, division) => {
      const divisionResult: Result[] = []
      Object.entries(leagueData || {}).forEach(([clubName, club]) => {
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
    }, {} as DivisionResults)
}

export function kingsPoints(division: string, rank: number) {
  const start = division == "mixed" ? 30 : 15
  switch (rank) {
    case 1: return start
    case 2: return start - 2
    case 3: return start - 4
    default: return Math.max(start - 1 - rank, 1)
  }
}
