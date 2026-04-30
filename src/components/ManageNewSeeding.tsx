import { Box } from "@suid/material"
import { For } from "solid-js"
import { RoundSeeding } from "../kings"
import StageCard from "../ui/StageCard"
import { DIVISION_ACCENT } from "../theme"
import NumberedTeam from "../ui/NumberedTeam"

export default function ManageNewSeeding(props: { seeds: RoundSeeding }) {
  return (
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
      <For each={Object.entries(props.seeds)}>{([division, teams]) => {
        return (
          <Box sx={{ width: "100%" }}>
            <StageCard
              namer={() => null}
              title={division.capitalize()}
              accent={DIVISION_ACCENT[division].text}
              groups={[teams]}
            >{(group) => (
              <Box sx={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}>
                <For each={group}>{(team, i) => (
                  <NumberedTeam
                    team={team}
                    num={i() + 1}
                    accent={DIVISION_ACCENT[division].text}
                  />
                )}</For>
              </Box>
            )}</StageCard>
          </Box>
        )
      }}
      </For>
    </Box>
  )
}
