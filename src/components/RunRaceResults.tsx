import { ContentCopy } from "@suid/icons-material";
import { Box, IconButton, Paper, Popover, Typography } from "@suid/material";
import { createMemo, createSignal, For, Show } from "solid-js";
import { LeagueData, RoundResult } from "../kings";
import { kingsPoints, resultsToHtml } from "../kings/utils";
import notification from "../hooks/notification";
import RankBadge, { RANK_ACCENT } from "../ui/RankBadge";

const DIVISION_ACCENT: Record<string, "primary" | "secondary" | "info"> = {
  mixed: "primary",
  ladies: "secondary",
  board: "info",
};

const GRID_COLS = "auto 1fr auto";

export default function RunRaceResults(props: {
  results: Record<string, RoundResult[]>;
  points?: ((division: string, rank: number) => number);
  leagueConfig?: LeagueData;
}) {
  const pointsAlgo = createMemo(() => props.points || kingsPoints)
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
    if (!props.leagueConfig) {
      return {};
    }
    return resultsToHtml(props.leagueConfig, 1, results())
  })

  const copyToClipboard = (division: string) => {
    navigator.clipboard.writeText(html()[division])
      .then(() => notification.info(`Copied ${division} results to clipboard`))
      .catch(err => {
        notification.error(`Failed to copy ${division} results to clipboard`)
        console.error("Failed to copy results to clipboard", division, err);
      });
  }

  const [popoverEl, setPopoverEl] = createSignal<Element | null>(null);
  const open = () => Boolean(popoverEl());
  const onMouseEnter = (division: string, event: { currentTarget: Element }) => {
    if (html()[division]) {
      return;
    }
    setPopoverEl(event.currentTarget);
  }
  const onMouseLeave = () => {
    setPopoverEl(null);
  }

  return (
    <Box sx={{ display: "flex", flexWrap: { xs: "wrap", lg: "nowrap" }, gap: 3, alignItems: "flex-start", width: "100%" }}>
      <Popover
        anchorEl={popoverEl()}
        open={open()}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        sx={{ pointerEvents: "none" }}
        onClose={onMouseLeave}
        disableRestoreFocus
      >
        No league data loaded
      </Popover>
      <Show when={props.results} fallback="No results">
        <For each={Object.entries(props.results)}>{([division, divResults]) => (
          <Show when={divResults.length > 0}>
            <Paper
              data-testid={`results-${division}`}
              elevation={2}
              sx={{
                flex: 1,
                minWidth: 300,
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <Box sx={{
                bgcolor: `${DIVISION_ACCENT[division] ?? "primary"}.main`,
                px: 2,
                py: 1.25,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1,
              }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: "white",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    lineHeight: 1,
                  }}
                >
                  {division.capitalize()}
                </Typography>
                <div
                  onMouseEnter={[onMouseEnter, division]}
                  onMouseLeave={onMouseLeave}
                >
                  <IconButton
                    size="small"
                    disabled={!html()[division]}
                    onClick={[copyToClipboard, division]}
                    sx={{
                      color: "white",
                      opacity: !html()[division] ? 0.4 : 0.85,
                      "&:hover": { opacity: 1 },
                    }}
                  >
                    <ContentCopy fontSize="small" />
                  </IconButton>
                </div>
              </Box>

              <Box sx={{
                display: "grid",
                gridTemplateColumns: GRID_COLS,
                bgcolor: "action.selected",
                borderBottom: "1px solid",
                borderColor: "divider",
                alignItems: "center",
                px: 1.5,
                py: 0.75,
                gap: 1,
              }}>
                <Box sx={{ width: 28 }} />
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
                  Team
                </Typography>
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
                  Pts
                </Typography>
              </Box>

              <For each={divResults}>{(result) => {
                const accentColor = RANK_ACCENT[result.rank] ?? "transparent";
                return (
                  <For each={result.teams}>{(team, i) => (
                    <Box sx={{
                      display: "grid",
                      gridTemplateColumns: GRID_COLS,
                      alignItems: "center",
                      borderLeft: `3px solid ${accentColor}`,
                      borderBottom: "1px solid",
                      borderColor: "divider",
                      px: 1.5,
                      py: 0.75,
                      gap: 1,
                      "&:last-child": { borderBottom: "none" },
                    }}>
                      <Box sx={{
                        width: 28,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}>
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

                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {pointsAlgo()(division, result.rank)}
                      </Typography>
                    </Box>
                  )}</For>
                );
              }}</For>
            </Paper>
          </Show>
        )}</For>
      </Show>
    </Box>
  )
}
