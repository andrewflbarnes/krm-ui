import { ContentCopy } from "@suid/icons-material";
import { Box, IconButton, Paper, Stack, Table, TableBody, TableContainer, Typography } from "@suid/material";
import { createMemo, For, Show } from "solid-js";
import { RoundResult, useKings } from "../kings";
import { kingsPoints, resultsToHtml } from "../kings/utils";
import styles from "./RunRaceResults.module.css";
import notification from "../hooks/notification";

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

    if (!k.leagueConfig()) {
      return {};
    }

    return resultsToHtml(k.leagueConfig(), 1, results())
  })

  const copyToClipboard = (division: string) => {
    navigator.clipboard.writeText(html()[division])
      .then(() => notification.info(`Copied ${division} results to clipboard`))
      .catch(err => {
        notification.error(`Failed to copy ${division} results to clipboard`)
        console.error("Failed to copy results to clipboard", division, err);
      });
  }

  return (
    <Typography>
      <Show when={props.results} fallback="No results">
        <Box sx={{ flexDirection: { xs: "column", md: "row" } }} style={{ display: "flex", padding: "3", gap: "2em" }}>
          <For each={Object.entries(props.results)}>{([division, results]) => (
            <Show when={results.length > 0}>
              <div data-testid={`results-${division}`}>
                <Stack direction="row" justifyContent="center" alignItems="center">
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={[copyToClipboard, division]}
                    disabled={!html()[division]}
                  >
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
            </Show>
          )}</For>
        </Box>
      </Show>
    </Typography>
  )
}
