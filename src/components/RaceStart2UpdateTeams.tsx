import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@suid/material";
import { For, Show } from "solid-js";
import { useKings } from "../kings";
import { ClubTeamNumbers } from "./RaceStart1Select";

export default function RaceStart2UpdateTeams(props: { data: ClubTeamNumbers }) {
  const [k] = useKings()
  const missingTeams = () => {
    const lc = k.leagueConfig()
    return Object.entries(props.data).reduce((acc, [club, teams]) => {
      Object.entries(teams).forEach(([division, num]) => {
        for (let i = 1; i <= num; i++) {
          // TODO!!! align division case globally
          const lcDivision = division[0].toUpperCase() + division.slice(1)
          if (lc[club]?.teams[lcDivision]?.[`${club} ${i}`] || (i == 1 && lc[club]?.teams[lcDivision]?.[club])) {
            continue
          }
          acc.push({ club, team: `${club} ${i}`, division: lcDivision })
        }
      })
      return acc
    }, [] as { club: string, team: string, division: string }[])
  }
  return (
    <Show when={Object.keys(missingTeams()).length}>
      <Typography align="center" variant="h3">Missing teams</Typography>
      <Typography align="center">The below teams will be added for this round</Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table dense" size="small">
          <TableHead>
            <TableRow>
              <TableCell>Team</TableCell>
              <TableCell align="center">Club</TableCell>
              <TableCell align="center">Division</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <For each={missingTeams()}>{({ club, team, division }) => {
              return <TableRow>
                <TableCell>{team}</TableCell>
                <TableCell align="center">{club}</TableCell>
                <TableCell align="center">{division}</TableCell>
              </TableRow>
            }}</For>
          </TableBody>
        </Table>
      </TableContainer>
    </Show >
  )
}
