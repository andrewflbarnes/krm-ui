import { Box, Paper, Table, TableBody, TableContainer, Typography } from "@suid/material";
import { For } from "solid-js";
import { RoundResult } from "../kings";
import styles from "./RunRaceResults.module.css";

// TODO move somewhere else
function kingsPoints(division: string, rank: number) {
  const start = division == "mixed" ? 30 : division == "ladies" ? 15 : 10
  switch (rank) {
    case 1: return start
    case 2: return start - 2
    case 3: return start - 4
    default: return Math.max(start - 1 - rank, 1)
  }
}

export default function RunRaceResults(props: {
  results: Record<string, RoundResult[]>;
  points?: ((division: string, rank: number) => number);
}) {

  const pointsAlgo = () => props.points || kingsPoints

  return (
    <Typography>
      <Box sx={{ flexDirection: { xs: "column", lg: "row" } }} style={{ display: "flex", padding: "3" }}>
        <For each={Object.entries(props.results)}>{([division, results]) => (
          <div style={{ "margin-right": "2em" }}>
            <h2 style={{ "text-align": "center" }}>{division.capitalize()}</h2>
            <TableContainer component={Paper}>
              <Table aria-label="simple table dense" size="small">
                <TableBody>
                  <For each={results}>{result => (
                    <For each={result.teams}>{(team, i) => (
                      <tr>
                        <td class={styles.td}>{i() == 0 ? result.rankStr : ""}</td>
                        <td class={styles.td}>{pointsAlgo()(division, result.rank)}</td>
                        <td class={styles.td}>{team}</td>
                      </tr>
                    )}</For>
                  )}</For>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}</For>
      </Box>
    </Typography>
  )
}
