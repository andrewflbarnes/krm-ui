import { Box, Typography } from "@suid/material";
import { For } from "solid-js";
import { DIVISION_ACCENT } from "../theme";
import StageCard from "../ui/StageCard";

type MissingTeam = {
  club: string;
  team: string;
  division: string;
}

export default function ManageNewUpdateTeams(props: { missingTeams: MissingTeam[] }) {
  const byDivisionAndClub = () => props.missingTeams.reduce((acc, team) => {
    if (!acc[team.division]) {
      acc[team.division] = {}
    }
    const divClubs = acc[team.division]
    if (!divClubs[team.club]) {
      divClubs[team.club] = []
    }
    divClubs[team.club].push(team.team)
    return acc
  }, {} as {
    [division: string]: {
      [club: string]: string[];
    }
  })

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: 1 }}>
      <Typography align="center" variant="h3">New Teams Added!</Typography>
      <Box
        sx={{
          display: {
            xs: "flex",
            md: "grid",
          },
          width: "100%",
          mx: {
            xs: undefined,
            sm: "auto",
          },
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "1rem",
          justifyContent: "space-between",
          flexDirection: "column",
        }}
      >
        <For each={Object.entries(byDivisionAndClub())}>{([division, clubs]) => (
          <Box sx={{ width: "100%" }}>
            <StageCard
              title={division}
              accent={DIVISION_ACCENT[division].text}
              groups={Object.entries(clubs)}
              namer={([club]) => club}
            >{([_, teams]) => (
              <Box sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr 1fr",
                  md: "1fr",
                  lg: "1fr 1fr",
                },
                gap: 0.5,
              }}>
                <For each={teams}>{(team) => (
                  <Typography variant="body2" color="text.secondary">
                    {team}
                  </Typography>
                )}</For>
              </Box>
            )}</StageCard>
          </Box>
        )}</For>
      </Box>
    </Box>
  )
}
