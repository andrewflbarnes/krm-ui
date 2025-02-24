import { LeagueData } from "../kings"

export default {
  getLeagueData,
}

async function getLeagueData(league: string): Promise<LeagueData> {
  const response = await fetch(`/.netlify/functions/tracker?league=${league}`)
  return await response.json()
}
