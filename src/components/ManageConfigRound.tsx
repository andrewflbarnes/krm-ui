import { Box, Divider, Typography } from "@suid/material";
import { For, Show } from "solid-js";
import { asKnockoutId, divisions, MiniLeagueConfig, MiniLeagueTemplate, RoundConfig, RoundResult } from "../kings"
import MiniLeague from "./MiniLeague";
import RunRaceResults from "./RunRaceResults";

const mockRaces = (name: string, template: MiniLeagueTemplate, teams: string[]) => {
  return template.races.map((r, i) => ({
    team1: teams[r[0]],
    team2: teams[r[1]],
    division: "mixed" as const,
    stage: "stage1" as const,
    group: name,
    groupRace: i,
    teamMlIndices: r,
  }))
}

export default function ManageConfigRound(props: {
  title: string;
  config: RoundConfig;
}) {
  const mockResults = (): Record<string, RoundResult[]> => {
    const results = props.config.results.map(r => ({
      rank: r.rank,
      rankStr: asKnockoutId(r.rank),
      teams: [r.group.includes('/')
        ? `${r.group} ${r.position == 0 ? "winner" : "loser"}`
        : `${asKnockoutId(r.position + 1)} group ${r.group}`]

    })).reduce((acc, r) => {
      // We need to combine any like ranks
      const exist = acc.find(a => a.rank == r.rank)
      if (!exist) {
        acc.push(r)
      } else {
        exist.teams.push(...r.teams)
      }
      return acc
    }, [])

    return divisions.reduce((acc, d) => {
      acc[d] = results
      return acc
    }, {})
  }

  return (
    <div style={{ display: "flex", "flex-direction": "column", "align-content": "center", gap: "2em", padding: "2em" }}>
      <Typography variant="h2" textAlign="center">
        {props.title}
      </Typography>
      <Divider variant="fullWidth" />
      <Box
        sx={{
          flexDirection: { xs: "column", lg: "row" },
          alignItems: { xs: "center", lg: "flex-start" },
          gap: { xs: "2em", lg: "0" },
        }}
        style={{ display: "flex", "justify-content": "center" }}
      >
        <PreviewStage title="Stage 1" config={props.config.stage1} seeds />
        <Show when={props.config.stage2}>{(stage2) => {
          return (
            <PreviewStage title="Stage 2" config={stage2()} />
          )
        }}</Show>
        <Show when={props.config.knockout}>{(ko) => {
          return (
            <PreviewStage title="Knockouts" config={ko()} knockout />
          )
        }}</Show>
      </Box>
      <Divider variant="fullWidth" />
      <div style={{ display: "flex", "flex-direction": "column", "align-content": "center" }}>
        <Typography variant="h3" textAlign="center">
          Results
        </Typography>
        <div style={{ margin: "0 auto" }}>
          <RunRaceResults results={mockResults()} />
        </div>
      </div>
    </div>
  )
}

function PreviewStage(props: {
  title: string;
  config: readonly MiniLeagueConfig[];
  seeds?: boolean;
  knockout?: boolean;
}) {
  return (
    <div>
      <Typography variant="h3" style={{ "text-align": "center" }}>
        {props.title}
      </Typography>
      <div>
        <For each={props.config}>{(group) => {
          const groupTeams = props.seeds
            ? group.seeds.map(s => `Seed ${s.position + 1}`)
            : group.seeds.map(s => `${asKnockoutId(s.position + 1)} group ${s.group}`)
          const races = mockRaces(group.name, group.template, groupTeams)
          return (
            <div>
              <Show when={props.knockout} fallback={
                <MiniLeague name={group.name} races={races} teams={groupTeams} onResultChange={() => { }} />
              }>
                <For each={races}>{(r) => (
                  <Typography>
                    <div style={{ display: "grid", "grid-template-columns": "1fr 2em 1fr" }}>
                      <div style={{ "text-align": "left" }}>
                        {r.team1}
                      </div>
                      <div style={{ "text-align": "center" }}>
                        vs
                      </div>
                      <div style={{ "text-align": "right" }}>
                        {r.team2}
                      </div>
                    </div>
                  </Typography>
                )}</For>
              </Show>
            </div>
          )
        }}</For>
      </div>
    </div>
  )
}
