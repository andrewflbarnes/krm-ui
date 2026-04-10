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
  useTheme,
} from "@suid/material";
import { For, Show } from "solid-js";
import { Result } from "../kings";

type LeagueProps = {
  results: Result[];
  editable?: boolean;
  onEdit?: (row: Result) => void;
}
export default function DivisionResults(props: LeagueProps) {
  const theme = useTheme();
  const bgPaper = () => theme.palette.background.paper;

  return (
    <TableContainer component={Paper} sx={{ overflow: "visible" }}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table dense" size="small">
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                width: 200,
                top: "3.125rem",
                left: 0,
                zIndex: 3,
                bgcolor: "background.paper",
              }}
            >
              <Show when={props.editable}>
                <IconButton sx={{ opacity: 0, cursor: "initial" }} size="small">
                  <Edit />
                </IconButton>
              </Show>
              Team
            </TableCell>
            <TableCell align="right" sx={{ top: "3.125rem", zIndex: 1, bgcolor: "background.paper" }}>Round 1</TableCell>
            <TableCell align="right" sx={{ top: "3.125rem", zIndex: 1, bgcolor: "background.paper" }}>Round 2</TableCell>
            <TableCell align="right" sx={{ top: "3.125rem", zIndex: 1, bgcolor: "background.paper" }}>Round 3</TableCell>
            <TableCell align="right" sx={{ top: "3.125rem", zIndex: 1, bgcolor: "background.paper" }}>Round 4</TableCell>
            <TableCell align="right" sx={{ top: "3.125rem", zIndex: 1, bgcolor: "background.paper" }}>Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Performance: avoid sx on every body cell — use native tr/td instead.
              See RaceList.tsx for the same pattern and rationale. */}
          <For each={props.results}>
            {(row, index) => {
              const isLast = () => index() === props.results.length - 1;
              const borderStyle = () => isLast() ? "0" : undefined;
              return (
                <tr style={{ display: "table-row" }}>
                  <th
                    scope="row"
                    style={{
                      display: "table-cell",
                      left: "0",
                      "z-index": 1,
                      "background-color": bgPaper(),
                      padding: "6px 16px",
                      "border-bottom": isLast() ? "0" : undefined,
                      "font-weight": "inherit",
                      "font-size": "inherit",
                      "text-align": "left",
                    }}
                  >
                    <Show when={props.editable}>
                      <IconButton onClick={[props.onEdit, row]} size="small">
                        <Edit />
                      </IconButton>
                    </Show>
                    {row.name}
                  </th>
                  <td style={{ display: "table-cell", "text-align": "right", padding: "6px 16px", "border-bottom": borderStyle() }}>{row.r1}</td>
                  <td style={{ display: "table-cell", "text-align": "right", padding: "6px 16px", "border-bottom": borderStyle() }}>{row.r2}</td>
                  <td style={{ display: "table-cell", "text-align": "right", padding: "6px 16px", "border-bottom": borderStyle() }}>{row.r3}</td>
                  <td style={{ display: "table-cell", "text-align": "right", padding: "6px 16px", "border-bottom": borderStyle() }}>{row.r4}</td>
                  <td style={{ display: "table-cell", "text-align": "right", padding: "6px 16px", "border-bottom": borderStyle() }}>{row.total}</td>
                </tr>
              );
            }}
          </For>
        </TableBody>
      </Table>
    </TableContainer>
  )
}
