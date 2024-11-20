import { useKings } from "../kings";
import { parseResults } from "../kings/result-utils";
import { ClubTeamNumbers } from "./RaceStart1Select";

export default function RaceStart2Confirm(props: { data: ClubTeamNumbers }) {
  const [k] = useKings()
  const seeds = () => {
    const lConfig = k.leagueConfig()
    const s = Object.entries(parseResults(lConfig)).reduce((acc, [division, seeded]) => {
      acc[division.toLowerCase()] = seeded.filter(t => {
        let teamIndex = +t.name.replace(/.*?(\d*)$/, "$1") >>> 0
        if (teamIndex != 0) {
          --teamIndex
        }
        return props.data[t.club]?.[division.toLowerCase()] > teamIndex
      }).map(({ name }) => name)
      return acc
    }, {
      mixed: [],
      ladies: [],
      board: [],
    })

    // Add missing teams
    // TODO add these to leagueConfig - might even be easier to just do that

    return s
  }
  return (
    <>
      <pre>{JSON.stringify(props.data, null, 2)}</pre>
      <pre>{JSON.stringify(seeds(), null, 2)}</pre>
    </>
  )
}
