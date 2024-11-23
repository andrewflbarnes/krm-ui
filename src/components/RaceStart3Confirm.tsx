import { LeagueData, useKings } from "../kings";
import { parseResults } from "../kings/result-utils";
import { ClubTeamNumbers } from "./RaceStart1Select";

function getSeeding(lConfig: LeagueData, data: ClubTeamNumbers): {
  mixed: string[];
  ladies: string[];
  board: string[];
} {
  const s = Object.entries(parseResults(lConfig)).reduce((acc, [division, seeded]) => {
    acc[division.toLowerCase()] = seeded.filter(t => {
      let teamIndex = +t.name.replace(/.*?(\d*)$/, "$1") >>> 0
      if (teamIndex != 0) {
        --teamIndex
      }
      return data[t.club]?.[division.toLowerCase()] > teamIndex
    }).map(({ name }) => name)
    return acc
  }, {
    mixed: [],
    ladies: [],
    board: [],
  })

  return s
}

export default function RaceStart2Confirm(props: { data: ClubTeamNumbers }) {
  const [k] = useKings()
  const seeds = () => getSeeding(k.leagueConfig(), props.data)
  return (
    <>
      <pre>{JSON.stringify(props.data, null, 2)}</pre>
      <pre>{JSON.stringify(seeds(), null, 2)}</pre>
    </>
  )
}
