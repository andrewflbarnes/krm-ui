import { Box, Paper, Typography } from "@suid/material";
import { createMemo, For, Show } from "solid-js";
import { MiniLeagueTemplate } from "../kings";
import { minileagueRaces } from "../kings/utils";
import ValidIcon from "../ui/ValidIcon";
import MiniLeague from "./MiniLeague";

type Props = {
  name: string;
  template: MiniLeagueTemplate;
}

export default function ManageConfigMiniLeague(props: Props) {
  return (
    <Show when={props.template} fallback={`No such minileague configuration: ${props.name}`}>
      <Content {...props} />
    </Show>
  )
}

function CardHeader(props: { label: string }) {
  return (
    <Box sx={{
      px: 2,
      py: 1,
      display: "flex",
      alignItems: "center",
      gap: 1,
      bgcolor: "action.selected",
      borderBottom: "1px solid",
      borderColor: "divider",
    }}>
      <Typography
        variant="overline"
        sx={{
          fontWeight: 800,
          fontSize: "0.65rem",
          letterSpacing: "0.14em",
          color: "text.secondary",
          lineHeight: 1,
          whiteSpace: "nowrap",
        }}
      >
        {props.label}
      </Typography>
      <Box sx={{ flex: 1, height: "1px", bgcolor: "divider" }} />
    </Box>
  );
}

function StatBlock(props: { value: number; label: string; align?: "center" | "flex-start" }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: props.align ?? "flex-start" }}>
      <Typography variant="h4" sx={{ fontWeight: 900, color: "primary.main", lineHeight: 1 }}>
        {props.value}
      </Typography>
      <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>
        {props.label}
      </Typography>
    </Box>
  );
}

function Content(props: Props) {
  const validRaceCount = createMemo(() => {
    const expected = props.template.teams * (props.template.teams - 1) / 2
    return props.template.races.length - expected == 0 || props.template.races.length % expected == 0
  })
  const allRaceAll = createMemo(() => {
    for (let i = 0; i < props.template.teams; i++) {
      for (let j = i + 1; j < props.template.teams; j++) {
        if (!props.template.races.find(r => r[0] == i && r[1] == j || r[0] == j && r[1] == i)) {
          return false
        }
      }
    }
    return true
  })
  const evenSides = createMemo(() => {
    const sideCounts = Array.from({ length: props.template.teams }, () => 0)
    props.template.races.forEach(r => {
      ++sideCounts[r[0]]
      --sideCounts[r[1]]
    })
    return sideCounts.every(c => c < 2 && c > -2)
  })
  const validTeams = createMemo(() => props.template.races.every(r => r[0] < props.template.teams && r[1] < props.template.teams))
  const noSelfRaces = createMemo(() => props.template.races.every(r => r[0] != r[1]))

  const teams = createMemo(() => Array.from({ length: props.template.teams }, (_, i) => `Team ${i + 1}`))
  const races = () => minileagueRaces(props.template, teams(), "A", "stage1", "mixed")

  const checks = createMemo(() => [
    { label: "Correct number of races", valid: validRaceCount() },
    { label: "All teams race each other", valid: allRaceAll() },
    { label: "Teams alternate sides", valid: evenSides() },
    { label: `Racing teams are valid (1 - ${props.template.teams})`, valid: validTeams() },
    { label: "Teams don't race themselves", valid: noSelfRaces() },
  ])

  return (
    <Box sx={{
      display: "grid",
      gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
      gap: 3,
      p: 3,
      alignItems: "start",
    }}>

      <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
        <CardHeader label="Overview" />

        <Box sx={{ p: 2.5, display: "flex", gap: 2.5 }}>

          <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: "text.primary",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                lineHeight: 1.1,
              }}
            >
              {props.name}
            </Typography>

            {/* xs only — sits between title and checks to preserve logical reading order */}
            <Box sx={{ display: { xs: "flex", md: "none" }, gap: 2.5 }}>
              <StatBlock value={props.template.teams} label="teams" />
              <StatBlock value={props.template.races.length} label="races" />
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <For each={checks()}>{(check) => (
                <Box sx={{ py: 0.375, display: "flex", alignItems: "center", gap: 0.75 }}>
                  <ValidIcon valid={check.valid} fontSize="small" />
                  <Typography
                    variant="body2"
                    sx={{
                      color: check.valid ? "text.primary" : "error.main",
                      fontWeight: check.valid ? 400 : 600,
                    }}
                  >
                    {check.label}
                  </Typography>
                </Box>
              )}</For>
            </Box>
          </Box>

          <Box sx={{
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            gap: 1.5,
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            borderLeft: "1px solid",
            borderColor: "divider",
            pl: 2.5,
          }}>
            <StatBlock value={props.template.teams} label="teams" align="center" />
            <StatBlock value={props.template.races.length} label="races" align="center" />
          </Box>

        </Box>
      </Paper>

      <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
        <CardHeader label="Race Schedule" />

        <Box sx={{ p: 2.5, display: "flex", flexDirection: "column", gap: 2.5 }}>

          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <MiniLeague
              races={races()}
              teams={teams()}
              name={""}
              readonly
              noResults
            />
          </Box>

          <Box sx={{ height: "1px", bgcolor: "divider" }} />

          <Box sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            columnGap: 2,
            rowGap: 0.25,
          }}>
            <For each={props.template.races}>{(r, i) => (
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.75, py: 0.4 }}>
                <Box sx={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  bgcolor: "action.selected",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <Typography sx={{ fontSize: "0.6rem", fontWeight: 700, color: "text.secondary", lineHeight: 1 }}>
                    {i() + 1}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ fontSize: "0.75rem", whiteSpace: "nowrap" }}>
                  Team {r[0] + 1}
                </Typography>
                <Typography variant="overline" sx={{ fontSize: "0.6rem", fontWeight: 800, color: "text.disabled", letterSpacing: "0.05em", lineHeight: 1 }}>
                  vs
                </Typography>
                <Typography variant="body2" sx={{ fontSize: "0.75rem", whiteSpace: "nowrap" }}>
                  Team {r[1] + 1}
                </Typography>
              </Box>
            )}</For>
          </Box>

        </Box>
      </Paper>

    </Box>
  )
}
