import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@suid/material";
import { For, Show } from "solid-js";

type MissingTeams = {
  club: string;
  team: string;
  division: string;
}[]

export default function ManageNewUpdateTeams(props: { missingTeams: MissingTeams }) {
  return (
    <Show when={Object.keys(props.missingTeams).length}>
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
            <For each={props.missingTeams}>{({ club, team, division }) => {
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
