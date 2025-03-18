import { LeagueData } from "../kings"

export default {
  getLeagueData,
}

async function getLeagueData(league: string, customUrl?: string): Promise<LeagueData> {
  const customUrlQp = customUrl?.length
    ? `url=${encodeURIComponent(customUrl)}`
    : null
  const qps = customUrlQp ?? `league=${league}`
  const response = await fetch(`/api/ksc-results?${qps}`)
  return await response.json()
}
