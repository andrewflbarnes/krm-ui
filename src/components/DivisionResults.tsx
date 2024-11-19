import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@suid/material";
import { For } from "solid-js";

type LeagueProps = {
  results: {
    name: string;
    r1?: number;
    r2?: number;
    r3?: number;
    r4?: number;
    total?: number;
  }[]
}
export default function DivisionResults({ results }: LeagueProps) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table dense" size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: 200 }}>Team</TableCell>
            <TableCell align="right">Round 1</TableCell>
            <TableCell align="right">Round 2</TableCell>
            <TableCell align="right">Round 3</TableCell>
            <TableCell align="right">Round 4</TableCell>
            <TableCell align="right">Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <For each={results}>
            {(row) => (
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.r1}</TableCell>
                <TableCell align="right">{row.r2}</TableCell>
                <TableCell align="right">{row.r3}</TableCell>
                <TableCell align="right">{row.r4}</TableCell>
                <TableCell align="right">{row.total}</TableCell>
              </TableRow>
            )}
          </For>
        </TableBody>
      </Table>
    </TableContainer>
  )
}
