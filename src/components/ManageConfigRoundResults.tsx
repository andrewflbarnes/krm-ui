import { Box, Paper, Typography } from "@suid/material";
import { createMemo, For, Show } from "solid-js";
import { divisions, RoundResult } from "../kings";
import { kingsPoints } from "../kings/utils";
import RankBadge, { RANK_ACCENT } from "../ui/RankBadge";

const DIVISION_META: Record<string, { color: string; label: string }> = {
  mixed: { color: "primary.main", label: "M" },
  ladies: { color: "secondary.main", label: "L" },
  board: { color: "info.main", label: "B" },
};

const GRID_COLS = "56px 1fr repeat(3, 60px)";

export default function ManageConfigRoundResults(props: {
  results: RoundResult[];
  points?: ((division: string, rank: number) => number);
}) {
  const pointsAlgo = createMemo(() => props.points || kingsPoints);

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

          <For each={props.results}>{(result) => {
            const accentColor = RANK_ACCENT[result.rank] ?? "transparent";
            return (
              <For each={result.teams}>{(team, i) => (
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
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Show when={i() === 0}>
                      <RankBadge rank={result.rank} rankStr={result.rankStr} size={32} />
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
              )}</For>
            );
          }}</For>

        </Box>
      </Paper>
    </Show>
  );
}
