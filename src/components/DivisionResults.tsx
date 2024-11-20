import { Edit } from "@suid/icons-material";
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@suid/material";
import { For, Show } from "solid-js";
import { Result }  from "../kings";

type LeagueProps = {
  results: Result[];
  editable?: boolean;
  onEdit?: (row: Result) => void;
}
export default function DivisionResults(props: LeagueProps) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table dense" size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: 200 }}>
              <Show when={props.editable}>
                <IconButton sx={{ opacity: 0, cursor: "initial" }} size="small">
                  <Edit />
                </IconButton>
              </Show>
              Team
            </TableCell>
            <TableCell align="right">Round 1</TableCell>
            <TableCell align="right">Round 2</TableCell>
            <TableCell align="right">Round 3</TableCell>
            <TableCell align="right">Round 4</TableCell>
            <TableCell align="right">Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <For each={props.results}>
            {(row) => (
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <Show when={props.editable}>
                    <IconButton onClick={[props.onEdit, row]} size="small">
                      <Edit />
                    </IconButton>
                  </Show>
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
