import { parseResults } from "./result-utils"
import { ClubSeeding, LeagueData } from "./types"

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
