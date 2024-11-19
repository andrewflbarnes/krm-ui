import { LeagueData } from "../kings"

export default {
  getLeagueData,
}

async function getLeagueData(url: string): Promise<LeagueData> {
  const response = await fetch(url)
  const text = await response.text()
  const data = text.split('\n').map(row => row.split(','))
  return data.reduce((acc, row) => {
    const [division, team, ...results] = row
    if (division?.length < 1 || team?.length < 1) {
      return acc
    }
    const numericResults = results.map(r => r?.length ? parseInt(r) >>> 0 : null)
    const club = team.replace(/ *\d*$/, "")
    if (!acc[club]) {
      acc[club] = { teams: {} }
    }
    const teams = acc[club].teams
    if (!teams[division]) {
      teams[division] = {}
    }

    teams[division][team] = {
      results: [
        [numericResults[0], numericResults[1]],
        [numericResults[2], numericResults[3]],
        [numericResults[4], numericResults[5]],
        [numericResults[6], numericResults[7]],
      ],
      total: numericResults[8]
    }
    return acc
  }, {} as LeagueData)
}
