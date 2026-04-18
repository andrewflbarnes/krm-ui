import { Box, Typography } from "@suid/material";
import { createMemo, For, Show } from "solid-js";
import { MiniLeagueConfig, MiniLeagueSeed, MiniLeagueTemplate, RoundConfig, RoundResult } from "../kings";
import { asPosition, minileagueRaces } from "../kings/utils";
import ManageConfigRoundResults from "./ManageConfigRoundResults";
import { BaseColor, baseColors } from "../theme";
import NumberedTeam from "../ui/NumberedTeam";
import StageCard from "../ui/StageCard";

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
        <ConfigStageCard
          title="Stage 1"
          groups={props.config.stage1}
          accent={baseColors.primary.text}
          seeding
        />
        <Show when={props.config.stage2}>{(stage2) => (
          <ConfigStageCard
            title="Stage 2"
            groups={stage2()}
            accent={baseColors.secondary.text}
          />
        )}</Show>
        <Show when={props.config.knockout}>{(ko) => (
          <ConfigStageCard
            title="Knockouts"
            groups={ko()}
            accent={baseColors.teriary.text}
            knockout
          />
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

type ConfigStageCardProps = {
  title: string;
  groups: ReadonlyArray<MiniLeagueConfig>;
  accent: BaseColor;
  knockout?: boolean;
  seeding?: boolean;
}

function ConfigStageCard(props: ConfigStageCardProps) {
  return (
    <Box sx={{
      flexGrow: "1",
      minWidth: 220,
      maxWidth: 400,
    }}>
      <StageCard
        title={props.title}
        groups={props.groups}
        namer={g => "Group " + g.name}
        accent={props.accent}
      >{(group) => (
        <GroupCardDetails
          group={group}
          name={group.name}
          accent={props.accent}
          template={group.template}
          teams={group.seeds}
          knockout={props.knockout}
          seeding={props.seeding}
        />
      )}</StageCard>
    </Box>
  )
}

type GroupCardDetailsProps = {
  group: MiniLeagueConfig;
  name: string;
  teams: ReadonlyArray<MiniLeagueSeed>;
  template: MiniLeagueTemplate;
  knockout?: boolean;
  seeding?: boolean;
  accent: BaseColor;
};

function GroupCardDetails(props: GroupCardDetailsProps) {
  const groupTeams = () => props.seeding
    ? props.teams.map(s => `Seed ${s.position + 1}`)
    : props.teams.map(s => `${asPosition(s.position + 1)} group ${s.group}`)
  const races = () => {
    return mockRaces(props.name, props.template, groupTeams())
  }
  return (
    <Show
      when={props.knockout}
      fallback={
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          <For each={groupTeams()}>{(team, i) => (
            <NumberedTeam team={team} num={i() + 1} accent={props.accent} />
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
        <For each={races()}>{(r) => (
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
  )
}
