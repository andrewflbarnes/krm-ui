import { Context } from '@netlify/functions'

export default async (request: Request, context: Context) => {
  try {
    const url = new URL(request.url)
    const league = url.searchParams.get('league')

    if (!league) {
      return new Response('Missing league', {
        status: 400,
      })
    }
    const trackerUrl = getTrackerUrl(league)
    if (!trackerUrl) {
      return new Response(`No tracker configured for ${league} league`, {
        status: 404,
      })
    }
    const leagueData = await getLeagueData(trackerUrl)
    return new Response(JSON.stringify(leagueData), {
      headers: {
        'content-type': 'application/json',
        'Cache-Control': 'public, durable, max-age=15, stale-while-revalidate=60'
      },
    })
  } catch (error) {
    return new Response(error.toString(), {
      status: 500,
    })
  }
}

function getTrackerUrl(league: string) {
  return process.env[`TRACKER_${league.toUpperCase()}`]
}

// TODO types: Promise<LeagueData> and {} as LeagueData
async function getLeagueData(url: string) {
  const response = await fetch(url)
  const text = await response.text()
  const data = text.split('\n').map(row => row.split(','))
  return data.reduce((acc, row) => {
    const [div, team, ...results] = row
    if (div?.length < 1 || team?.length < 1) {
      return acc
    }
    const division = div.toLowerCase()
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
  }, {})
}
