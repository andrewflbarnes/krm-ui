import { Box, Paper, Table, TableBody, TableContainer, TableHead, Typography } from "@suid/material";
import { For, Show } from "solid-js";
import { divisions, RoundResult } from "../kings";
import { kingsPoints } from "../kings/utils";
import styles from "./ManageConfigRoundResults.module.css";

export default function ManageConfigRoundResults(props: {
  results: RoundResult[];
  points?: ((division: string, rank: number) => number);
}) {
  const pointsAlgo = () => props.points || kingsPoints

  return (
    <Typography>
      <Show when={props.results} fallback="No results">
        <Box sx={{ flexDirection: { xs: "column", md: "row" } }} style={{ display: "flex", padding: "3", gap: "2em" }}>
          <TableContainer component={Paper}>
            <Table aria-label="simple table dense" size="small">
              <TableHead>
                <td />
                <td />
                <For each={divisions}>{division => (
                  <td class={styles["td-points"]}>
                    <Box sx={{
                      display: {
                        xs: "block",
                        md: "none",
                      }
                    }}>
                      {division.capitalize()[0]}
                    </Box>
                    <Box sx={{
                      display: {
                        xs: "none",
                        md: "block",
                      }
                    }}>
                      {division.capitalize()}
                    </Box>
                  </td>
                )}</For>
              </TableHead>
              <TableBody>
                <For each={props.results}>{result => (
                  <For each={result.teams}>{(team, i) => (
                    <tr>
                      <td class={styles.td}>{i() == 0 ? result.rankStr : ""}</td>
                      <td class={styles.td}>{team}</td>
                      <For each={divisions}>{division => (
                        <td class={styles["td-points"]}>{pointsAlgo()(division, result.rank)}</td>
                      )}</For>
                    </tr>
                  )}</For>
                )}</For>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Show>
    </Typography>
  )
}
