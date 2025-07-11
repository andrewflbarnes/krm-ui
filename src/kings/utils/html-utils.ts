import { orderResults } from "./result-utils";
import { LeagueData, Result, RoundResultPoints } from "../types"

const [
  tableStart,
  tableStartAlt,
  tableEnd,
] = (function() {
  function tableStartHtml(altStyling: boolean = false) {
    const clazz = altStyling ? "ResultsAlt" : "ResultsDefault"
    return `
<div class="league-table-wrapper">
  <table class="${clazz}">
    <thead>
      <tr class="tableizer-firstrow">
        <th>Position</th>
        <th>Team</th>
        <th>Place</th>
        <th>Points</th>
        <th>Place</th>
        <th>Points</th>
        <th>Place</th>
        <th>Points</th>
        <th>Place</th>
        <th>Points</th>
        <th>Total Points</th>
        <th>Comments</th>
      </tr>
    </thead>
    <tbody>`;
  }

  const tableEnd = `
    </tbody>
  </table>
</div>`;

  return [tableStartHtml(), tableStartHtml(true), tableEnd];
})()

export type Results = Record<string, RoundResultPoints[]>

/**
  * Note, this requires that leagueData is already configured with all teams appearing in
  * results.
  */
export function resultsToHtml(leagueData: LeagueData, round: number, results: Results) {
  const combined = combineResults(leagueData, round, results)
  return Object.entries(combined).reduce((acc, [division, divisionResults], position) => {
    const htmlRows = divisionResults
      .map(result => asHtml_(position + 1, result))
      .join("\n")
    acc[division] = `${"ladies" == division.toLocaleLowerCase() ? tableStartAlt : tableStart}\n${htmlRows}\n${tableEnd}`
    return acc
  }, {} as Record<string, string>)
}

export type AccResult = Result & {
  r1place: number;
  r2place: number;
  r3place: number;
  r4place: number;
  comment?: string;
}

type AccResults = {
  [club: string]: {
    [division: string]: {
      [team: string]: AccResult;
    }
  }
}

export function combineResults(leagueData: LeagueData, round: number, results: Results) {
  const flatResults = Object.entries(results).reduce((resultsAcc, [div, divResults]) => {
    resultsAcc[div] = {}
    divResults.forEach(res => {
      res.teams.forEach(team => {
        resultsAcc[div][team] = res
      })
    })
    return resultsAcc
  }, {} as {
    [division: string]: {
      [team: string]: RoundResultPoints;
    }
  })

  // create mutable copy...
  const combined = Object.entries(leagueData).reduce((acc: AccResults, [club, clubData]) => {
    acc[club] = Object.entries(clubData.teams).reduce((clubAcc: AccResults[string], [div, divTeams]) => {
      clubAcc[div] = Object.entries(divTeams).reduce((teamAcc: AccResults[string][string], [team, teamData]) => {
        const [r1place = 0, r1 = 0] = teamData.results?.[0] ?? [0, 0]
        const [r2place = 0, r2 = 0] = teamData.results?.[1] ?? [0, 0]
        const [r3place = 0, r3 = 0] = teamData.results?.[2] ?? [0, 0]
        const [r4place = 0, r4 = 0] = teamData.results?.[3] ?? [0, 0]
        teamAcc[team] = {
          club,
          name: team,
          r1place,
          r1,
          r2place,
          r2,
          r3place,
          r3,
          r4place,
          r4,
          total: teamData.total,
        }
        const teamResult = flatResults[div]?.[team]
        if (teamResult) {
          const result = teamAcc[team]
          const { points, rank } = teamResult
          const placeKey = `r${round}place`
          const pointKey = `r${round}`
          switch (round) {
            case 1:
            case 2:
            case 3:
            case 4:
              result[placeKey] = rank
              result[pointKey] = points
              break
            default:
            // TODO
          }
          result.total = result.r1 + result.r2 + result.r3 + result.r4
        }
        return teamAcc
      }, {})
      return clubAcc
    }, {})
    return acc
  }, {})

  const pivoted: {
    [division: string]: AccResult[]
  } = {}

  Object.values(combined).forEach(club => {
    Object.entries(club).forEach(([div, divResults]) => {
      if (!pivoted[div]) {
        pivoted[div] = []
      }
      Object.values(divResults).forEach(res => pivoted[div].push(res))
    })
  })

  Object.entries(pivoted).forEach(([div, results]) => {
    pivoted[div] = results.sort(orderResults)
  })

  return pivoted
}

function asHtml_(position: number, {
  name,
  r1place = 0,
  r1,
  r2place = 0,
  r2,
  r3place = 0,
  r3,
  r4place = 0,
  r4,
  total = 0,
  comment = "",
}: AccResult): string {
  return `
      <tr>
        <td>${position}</td>
        <td>${name}</td>
        <td>${r1place ? r1place : ''}</td>
        <td>${r1place ? r1 : ''}</td>
        <td>${r2place ? r2place : ''}</td>
        <td>${r2place ? r2 : ''}</td>
        <td>${r3place ? r3place : ''}</td>
        <td>${r3place ? r3 : ''}</td>
        <td>${r4place ? r4place : ''}</td>
        <td>${r4place ? r4 : ''}</td>
        <td>${total}</td>
        <td>${comment}</td>
      </tr>`;
}
