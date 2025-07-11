import { ContentCopy } from "@suid/icons-material";
import { Box, IconButton, Paper, Stack, Table, TableBody, TableContainer, Typography } from "@suid/material";
import { createMemo, For, Show } from "solid-js";
import { RoundResult, useKings } from "../kings";
import { kingsPoints, resultsToHtml } from "../kings/utils";
import styles from "./RunRaceResults.module.css";

export default function RunRaceResults(props: {
  results: Record<string, RoundResult[]>;
  points?: ((division: string, rank: number) => number);
}) {
  const [k] = useKings()
  const pointsAlgo = () => props.points || kingsPoints
  const results = createMemo(() => {
    if (!props.results) {
      return {}
    }
    return Object.fromEntries(
      Object.entries(props.results).map(([division, results]) => [
        division,
        results.map(result => ({
          ...result,
          points: pointsAlgo()(division, result.rank),
        }))
      ])
    )
  })

  const html = createMemo(() => {
    return resultsToHtml(k.leagueConfig(), 1, results())
  })

  return (
    <Typography>
      <Show when={props.results} fallback="No results">
        <Box sx={{ flexDirection: { xs: "column", md: "row" } }} style={{ display: "flex", padding: "3", gap: "2em" }}>
          <For each={Object.entries(props.results)}>{([division, results]) => (
            <div data-testid={`results-${division}`}>
              <Stack direction="row" justifyContent="center" alignItems="center">
                <IconButton size="small" color="primary" onClick={() => navigator.clipboard.writeText(html()[division])}>
                  <ContentCopy />
                </IconButton>
                <h2 style={{ "text-align": "center" }}>{division.capitalize()}</h2>
              </Stack>
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
