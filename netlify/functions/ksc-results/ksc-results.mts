import { Context } from '@netlify/functions'
import * as cheerio from 'cheerio'
import axios from 'axios'

export default async (request: Request, context: Context) => {
  const url = new URL(request.url)
  const league = url.searchParams.get('league')

  if (!league) {
    return new Response('Missing league', {
      status: 400,
    })
  }

  try {
    const leagueData = await getLeagueData(league)
    return new Response(JSON.stringify(leagueData), {
      headers: {
        'content-type': 'application/json',
        'Cache-Control': 'public, durable, max-age=15, stale-while-revalidate=60'
      },
    })
  } catch (error) {
    return new Response(`Failed to fetch ${league} league data: ${error.message}`, {
      status: error.response?.status || 500,
    })
  }
}

async function getLeagueData(league: string) {
  const { data } = await axios.get(`https://www.kingsski.club/${league}`)
  const $ = cheerio.load(data)
  const leagueData = {}
  $("table").each((d, table) => {
    // TODO get nearest table to headings
    const division = d == 0
      ? "mixed"
      : d == 1
        ? "ladies"
        : "board"
    const headers = [];
    $(table).find('th').each((i, header) => {
      headers.push($(header).text())
    })

    $(table).find('tbody tr').each((i, row) => {
      const data = []
      $(row).find('td').each((j, cell) => {
        data.push($(cell).text());
      });
      const { club, team, results, total } = getTeamInfo(headers, data)
      if (!leagueData[club]) {
        leagueData[club] = { teams: {} }
      }
      const { teams } = leagueData[club]
      if (!teams[division]) {
        teams[division] = {}
      }
      teams[division][team] = {
        results,
        total,
      }
    })
  })
  return leagueData
}

function getTeamInfo(rawHeaders: string[], data: string[]): {
  team: string;
  club: string;
  results: [number, number][];
  total: number;
} {
  const headers = rawHeaders.map(h => h.toLowerCase())
  const teamIndex = headers.indexOf('team')
  const team = data[teamIndex]
  const club = team.replace(/ *\d*$/, "")
  const numericData = data.map(r => r?.length ? parseInt(r) >>> 0 : null)
  const totalIndex = headers.indexOf('total points')
  const points1Index = headers.indexOf('points')
  const points2Index = headers.indexOf('points', points1Index + 1)
  const points3Index = headers.indexOf('points', points2Index + 1)
  const points4Index = headers.indexOf('points', points3Index + 1)
  const place1Index = headers.indexOf('place')
  const place2Index = headers.indexOf('place', place1Index + 1)
  const place3Index = headers.indexOf('place', place2Index + 1)
  const place4Index = headers.indexOf('place', place3Index + 1)

  return {
    club,
    team,
    results: [
      [numericData[place1Index], numericData[points1Index]],
      [numericData[place2Index], numericData[points2Index]],
      [numericData[place3Index], numericData[points3Index]],
      [numericData[place4Index], numericData[points4Index]],
    ],
    total: numericData[totalIndex],
  }
}
