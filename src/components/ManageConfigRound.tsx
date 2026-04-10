import { Box, Chip, Paper, Typography } from "@suid/material";
import { createMemo, For, Show } from "solid-js";
import { MiniLeagueConfig, MiniLeagueTemplate, Race, RoundConfig, RoundResult } from "../kings";
import { asPosition, minileagueRaces } from "../kings/utils";
import ManageConfigRoundResults from "./ManageConfigRoundResults";

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

function Content(props: Props) {
  const mockResults = createMemo((): RoundResult[] => {
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
  })

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Box sx={{
        px: 4,
        py: 2.5,
        borderBottom: "1px solid",
        borderColor: "divider",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <Typography
          variant="h4"
          sx={{
            color: "text.primary",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            whiteSpace: "nowrap",
          }}
        >
          {props.title}
        </Typography>
      </Box>

      <Box sx={{
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: 3,
        p: 4,
      }}>
        <StageCard title="Stage 1" config={props.config.stage1} seeds accent="primary" />
        <Show when={props.config.stage2}>{(stage2) => (
          <StageCard title="Stage 2" config={stage2()} accent="secondary" />
        )}</Show>
        <Show when={props.config.knockout}>{(ko) => (
          <StageCard title="Knockouts" config={ko()} knockout accent="error" />
        )}</Show>
      </Box>

      <Box sx={{ px: 4, pb: 4 }}>
        <Box sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 3,
        }}>
          <Box sx={{ flex: 1, height: "1px", bgcolor: "divider" }} />
          <Typography
            variant="overline"
            sx={{
              fontWeight: 800,
              fontSize: "0.75rem",
              letterSpacing: "0.14em",
              color: "text.secondary",
              whiteSpace: "nowrap",
            }}
          >
            Final Standings
          </Typography>
          <Box sx={{ flex: 1, height: "1px", bgcolor: "divider" }} />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <ManageConfigRoundResults results={mockResults()} />
        </Box>
      </Box>
    </Box>
  )
}

type StageCardProps = {
  title: string;
  config: readonly MiniLeagueConfig[];
  seeds?: boolean;
  knockout?: boolean;
  accent: "primary" | "secondary" | "error";
};

function StageCard(props: StageCardProps) {
  return (
    <Paper
      elevation={3}
      sx={{
        flex: "1 1 260px",
        minWidth: 220,
        maxWidth: 400,
        overflow: "hidden",
        borderRadius: 2,
      }}
    >
      <Box sx={{
        bgcolor: `${props.accent}.main`,
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
            letterSpacing: "0.1em",
            lineHeight: 1,
          }}
        >
          {props.title}
        </Typography>
        <Chip
          label={`${props.config.length} ${props.config.length === 1 ? "group" : "groups"}`}
          size="small"
          sx={{
            bgcolor: "rgba(255,255,255,0.2)",
            color: "white",
            fontWeight: 700,
            fontSize: "0.65rem",
            height: 20,
            "& .MuiChip-label": { px: 1 },
          }}
        />
      </Box>

      <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
        <For each={props.config}>{(group) => {
          const groupTeams = props.seeds
            ? group.seeds.map(s => `Seed ${s.position + 1}`)
            : group.seeds.map(s => `${asPosition(s.position + 1)} group ${s.group}`)
          const races = mockRaces(group.name, group.template, groupTeams)
          return (
            <GroupCard
              name={group.name}
              teams={groupTeams}
              races={races}
              knockout={props.knockout}
              accent={props.accent}
            />
          )
        }}</For>
      </Box>
    </Paper>
  )
}

type GroupCardProps = {
  name: string;
  teams: string[];
  races: Race[];
  knockout?: boolean;
  accent: "primary" | "secondary" | "error";
};

function GroupCard(props: GroupCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: "action.hover",
        borderRadius: 1.5,
        overflow: "hidden",
      }}
    >
      <Box sx={{
        px: 1.5,
        py: 0.75,
        borderBottom: "1px solid",
        borderColor: "divider",
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}>
        <Box sx={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          bgcolor: `${props.accent}.main`,
          flexShrink: 0,
        }} />
        <Typography
          variant="overline"
          sx={{
            fontSize: "0.6rem",
            fontWeight: 800,
            letterSpacing: "0.1em",
            color: "text.disabled",
            lineHeight: 1,
          }}
        >
          Group {props.name}
        </Typography>
      </Box>

      <Box sx={{ px: 1.5, py: 1 }}>
        <Show
          when={props.knockout}
          fallback={
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              <For each={props.teams}>{(team, i) => (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box sx={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    bgcolor: `${props.accent}.main`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <Typography sx={{
                      fontSize: "0.6rem",
                      fontWeight: 800,
                      color: "white",
                      lineHeight: 1,
                    }}>
                      {i() + 1}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontSize: "0.75rem", whiteSpace: "nowrap" }}>
                    {team}
                  </Typography>
                </Box>
              )}</For>
            </Box>
          }
        >
          <Box sx={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            gap: "2px 8px",
            alignItems: "center",
          }}>
            <For each={props.races}>{(r) => (
              <>
                <Typography
                  variant="body2"
                  sx={{ fontSize: "0.75rem", textAlign: "right", whiteSpace: "nowrap" }}
                >
                  {r.team1}
                </Typography>
                <Typography
                  variant="overline"
                  sx={{
                    fontSize: "0.6rem",
                    fontWeight: 800,
                    color: "text.disabled",
                    letterSpacing: "0.05em",
                    lineHeight: 1,
                    textAlign: "center",
                  }}
                >
                  vs
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontSize: "0.75rem", textAlign: "left", whiteSpace: "nowrap" }}
                >
                  {r.team2}
                </Typography>
              </>
            )}</For>
          </Box>
        </Show>
      </Box>
    </Paper>
  )
}
