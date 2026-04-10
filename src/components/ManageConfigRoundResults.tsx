import { Box, Paper, Typography } from "@suid/material";
import { For, Show } from "solid-js";
import { divisions, RoundResult } from "../kings";
import { kingsPoints } from "../kings/utils";

const DIVISION_META: Record<string, { color: string; label: string }> = {
  mixed: { color: "primary.main", label: "M" },
  ladies: { color: "secondary.main", label: "L" },
  board: { color: "info.main", label: "B" },
};

const RANK_ACCENT: Record<number, string> = {
  1: "#f9a825",
  2: "#bdbdbd",
  3: "#a1887f",
};

const RANK_GRADIENT: Record<number, string> = {
  1: "linear-gradient(135deg, #f9a825, #f57f17)",
  2: "linear-gradient(135deg, #bdbdbd, #757575)",
  3: "linear-gradient(135deg, #a1887f, #6d4c41)",
};

const GRID_COLS = "56px 1fr repeat(3, 60px)";

function RankBadge(props: { rank: number; rankStr: string }) {
  return (
    <Show
      when={props.rank <= 3}
      fallback={
        <Box sx={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          px: 1,
          py: 0.25,
          borderRadius: "10px",
          bgcolor: "action.selected",
        }}>
          <Typography sx={{
            fontSize: "0.65rem",
            fontWeight: 700,
            color: "text.secondary",
            lineHeight: 1,
            whiteSpace: "nowrap",
          }}>
            {props.rankStr}
          </Typography>
        </Box>
      }
    >
      <Box sx={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        background: RANK_GRADIENT[props.rank],
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
      }}>
        <Typography sx={{
          fontSize: "0.6rem",
          fontWeight: 800,
          color: "white",
          lineHeight: 1,
          whiteSpace: "nowrap",
          letterSpacing: "0.02em",
        }}>
          {props.rankStr}
        </Typography>
      </Box>
    </Show>
  );
}

export default function ManageConfigRoundResults(props: {
  results: RoundResult[];
  points?: ((division: string, rank: number) => number);
}) {
  const pointsAlgo = () => props.points || kingsPoints;

  return (
    <Show when={props.results?.length} fallback={
      <Typography color="text.secondary" variant="body2">No results</Typography>
    }>
      <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Box sx={{ display: "grid", gridTemplateColumns: GRID_COLS }}>

          <Box sx={{
            gridColumn: "1 / -1",
            display: "grid",
            gridTemplateColumns: GRID_COLS,
            bgcolor: "action.selected",
            borderBottom: "1px solid",
            borderColor: "divider",
            alignItems: "center",
            px: 1.5,
            py: 0.75,
          }}>
            <Box />
            <Box />
            <For each={divisions}>{(division) => {
              const meta = DIVISION_META[division] ?? { color: "text.secondary", label: division[0].toUpperCase() };
              return (
                <Box sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 0.4,
                }}>
                  <Box sx={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    bgcolor: meta.color,
                    flexShrink: 0,
                  }} />
                  <Typography
                    variant="overline"
                    sx={{
                      fontSize: "0.6rem",
                      fontWeight: 800,
                      letterSpacing: "0.1em",
                      color: "text.secondary",
                      lineHeight: 1,
                    }}
                  >
                    {meta.label}
                  </Typography>
                </Box>
              );
            }}</For>
          </Box>

          <For each={props.results}>{(result) => (
            <For each={result.teams}>{(team, i) => {
              const accentColor = RANK_ACCENT[result.rank] ?? "transparent";
              return (
                <Box sx={{
                  gridColumn: "1 / -1",
                  display: "grid",
                  gridTemplateColumns: GRID_COLS,
                  alignItems: "center",
                  borderLeft: `3px solid ${accentColor}`,
                  borderBottom: "1px solid",
                  borderColor: "divider",
                  py: 0.75,
                  px: 1.5,
                  "&:last-child": { borderBottom: "none" },
                }}>
                  {/* badge only shown on the first row for joint-rank teams */}
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Show when={i() === 0}>
                      <RankBadge rank={result.rank} rankStr={result.rankStr} />
                    </Show>
                  </Box>

                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: result.rank <= 3 ? 600 : 400,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {team}
                  </Typography>

                  <For each={divisions}>{(division) => (
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {pointsAlgo()(division, result.rank)}
                      </Typography>
                    </Box>
                  )}</For>
                </Box>
              );
            }}</For>
          )}</For>

        </Box>
      </Paper>
    </Show>
  );
}
