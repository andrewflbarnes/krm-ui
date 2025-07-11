import { Box, Divider, Typography } from "@suid/material";
import { createSignal, For, Show } from "solid-js";
import { MiniLeagueConfig, MiniLeagueTemplate, RoundConfig, RoundResult } from "../kings"
import { asPosition, minileagueRaces } from "../kings/utils";
import ManageConfigRoundResults from "./ManageConfigRoundResults";
import MiniLeague from "./MiniLeague";

const mockRaces = (name: string, template: MiniLeagueTemplate, teams: string[]) => minileagueRaces(template, teams, name, "stage1", "mixed")

type Props = {
  title: string;
  config: RoundConfig;
}

export default function ManageConfigRound(props: Props) {
  return (
    <Show when={props.config} fallback={`no such round configuration: ${props.title}`}>
      <Content {...props} />
    </Show>
  )
}

const [basic] = createSignal(true)

function Content(props: Props) {
  const mockResults = (): RoundResult[] => {
    return props.config.results.map(r => ({
      rank: r.rank,
      rankStr: asPosition(r.rank),
      teams: [r.group.includes('/')
        ? `${r.group} ${r.position == 0 ? "winner" : "loser"}`
        : `${asPosition(r.position + 1)} group ${r.group}`]

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
  }

  return (
    <div style={{ display: "flex", "flex-direction": "column", "align-content": "center", gap: "2em", padding: "2em" }}>
      <Typography variant="h2" textAlign="center" whiteSpace="nowrap">
        {props.title}
      </Typography>
      <Divider variant="fullWidth" />
      <Box
        style={{ display: "flex", "justify-content": "center", "flex-flow": "row wrap" }}
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
        <Typography variant="h3" textAlign="center" marginBottom="1rem">
          Results
        </Typography>
        <div style={{ margin: "0 auto" }}>
          <ManageConfigRoundResults results={mockResults()} />
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
    <div style={{ margin: "0 auto", flex: 1, padding: "1em" }}>
      <Typography variant="h3" textAlign="center" marginBottom="1rem" whiteSpace="nowrap">
        {props.title}
      </Typography>
      <div style={{ display: "flex", "flex-direction": "column", "align-items": "center" }}>
        <div style={{ display: "flex", "flex-direction": "column", gap: "1em" }}>
          <For each={props.config}>{(group) => {
            const groupTeams = props.seeds
              ? group.seeds.map(s => `Seed ${s.position + 1}`)
              : group.seeds.map(s => `${asPosition(s.position + 1)} group ${s.group}`)
            const races = mockRaces(group.name, group.template, groupTeams)
            return (
              <div>
                <Show when={props.knockout} fallback={
                  <Show when={basic()} fallback={
                    <MiniLeague name={"Group " + group.name} races={races} teams={groupTeams} noResults />
                  }>
                    <div style={{ display: "flex", "flex-direction": "column", "justify-content": "center" }}>
                      <Typography variant="h4" textAlign="center">
                        Group {group.name}
                      </Typography>
                      <For each={groupTeams}>{(team) => (
                        <Typography textAlign="center">
                          {team}
                        </Typography>
                      )}</For>
                    </div>
                  </Show>
                }>
                  <Typography>
                    <div style={{ display: "grid", "grid-template-columns": "1fr 1fr auto 1fr", "white-space": "nowrap" }}>
                      <For each={races}>{(r) => (
                        <>
                          <div style={{ "text-align": "left" }}>
                            {r.group}&nbsp;
                          </div>
                          <div style={{ "text-align": "left" }}>
                            {r.team1}&nbsp;
                          </div>
                          <div style={{ "text-align": "center" }}>
                            vs&nbsp;
                          </div>
                          <div style={{ "text-align": "right" }}>
                            {r.team2}
                          </div>
                        </>
                      )}</For>
                    </div>
                  </Typography>
                </Show>
              </div>
            )
          }}</For>
        </div>
      </div>
    </div>
  )
}
