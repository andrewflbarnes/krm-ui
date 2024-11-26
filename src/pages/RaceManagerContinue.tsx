import { Chip, Paper, Table, TableBody, TableCell, TableContainer, TableRow } from "@suid/material";
import { For } from "solid-js";
import krmApi from "../api/krm";

const statusColor = {
  "Abandoned": "error",
  "In Progress": "warning",
  "Completed": "success",
}

export default function RaceManagerContinue() {
  const rounds = krmApi.getRounds();

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table dense" size="small">
        <TableBody>
          <For each={rounds}>{(round) => {
            return (
              <TableRow>
                <TableCell>
                  {round.date.toLocaleDateString()}
                  &nbsp;
                  <Chip size="small" label={round.league} color="primary" variant="outlined" />
                  &nbsp;
                  <Chip size="small" label={round.status} color={statusColor[round.status] ?? "warning"} variant="outlined" />
                </TableCell>
                <TableCell>
                  {round.venue}
                </TableCell>
                <TableCell>
                  {round.id}
                </TableCell>
                <TableCell>
                  {round.description}
                </TableCell>
              </TableRow>
            )
          }}</For>
        </TableBody>
      </Table>
    </TableContainer>
  )
}
