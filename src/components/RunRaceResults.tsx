import { Card, Paper, Table, TableBody, TableContainer, Typography } from "@suid/material";
import { For } from "solid-js";
import { Round } from "../kings";
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
  round: Round;
  points?: ((division: string, rank: number) => number);
}) {

  const pointsAlgo = () => props.points || kingsPoints

  return (
    <Typography>
      <div style={{ display: "flex", "justify-content": "center" }}>
        <Card sx={{ p: 3 }} style={{ display: "flex", "flex-direction": "row" }}>
          <For each={Object.entries(props.round.results)}>{([division, results]) => (
            <div style={{ "margin-right": "2em" }}>
              <h2>{division}</h2>
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
        </Card>
      </div>
    </Typography>
  )
}
