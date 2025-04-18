import { Box, Paper, Table, TableBody, TableContainer, Typography } from "@suid/material";
import { For, Show } from "solid-js";
import { RoundResult } from "../kings";
import styles from "./RunRaceResults.module.css";

function kingsPoints(division: string, rank: number) {
  const start = division == "mixed" ? 30 : 15
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
      <Show when={props.results} fallback="No results">
        <Box sx={{ flexDirection: { xs: "column", md: "row" } }} style={{ display: "flex", padding: "3", gap: "2em" }}>
          <For each={Object.entries(props.results)}>{([division, results]) => (
            <div data-testid={`results-${division}`}>
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
      </Show>
    </Typography>
  )
}
