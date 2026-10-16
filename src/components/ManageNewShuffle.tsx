import { Replay } from "@suid/icons-material";
import { Box, IconButton, Typography } from "@suid/material";
import { DragDropProvider, DragDropSensors, DragEventHandler } from "@thisbeyond/solid-dnd";
import { createSignal, For } from "solid-js";
import { Division, Round, RoundConfig, RoundSeeding } from "../kings";
import GroupCard from "../ui/GroupCard";
import ModalConfirmAction from "../ui/ModalConfirmAction";
import { DIVISION_ACCENT } from "../theme";
import { DndTeam, DragOverlayTeam } from "../ui/DragAndDropTeam";

type ManageNewShuffleProps = {
  round: Round;
  originalConfig: {
    [d in Division]: RoundConfig;
  };
  seeding: {
    [d in Division]: string[];
  };
  onShuffle: (seeds: RoundSeeding) => void;
  inGroupSwaps?: boolean;
}

export default function ManageNewShuffle(props: ManageNewShuffleProps) {
  const [resetDivision, setResetDivision] = createSignal<Division | null>(null)

  const divisionHasChanges = (division: Division) => {
    const current = props.round.teams[division]
    const original = props.seeding[division]
    return current.some((team, i) => team !== original[i])
  }

  const handleReset = () => {
    const division = resetDivision()
    if (!division) return
    props.onShuffle({ ...props.round.teams, [division]: props.seeding[division] } as RoundSeeding)
    setResetDivision(null)
  }

  const gtr = () => Object.keys(props.round.config).map(() => "1fr").join(" ")
  return (
    <>
      <ModalConfirmAction
        open={!!resetDivision()}
        onConfirm={handleReset}
        onDiscard={() => setResetDivision(null)}
        confirmLabel="Reset"
        confirmColor="error"
        discardLabel="Cancel"
      >
        Reset {resetDivision()} seedings to their original positions?
      </ModalConfirmAction>
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
          gridTemplateColumns: gtr(),
          gap: "1rem",
          justifyContent: "space-between",
          flexDirection: "column",
        }}
      >
        <For each={Object.entries(props.round.config)}>{([division, config]: [Division, RoundConfig]) => {
          const seeds = () => props.round.teams[division]
          const dndHandler: DragEventHandler = ({ draggable, droppable }) => {
            if (!droppable) {
              return
            }
            const { group, team } = draggable.data
            const { group: toGroup, team: toTeam } = droppable.data
            if (!props.inGroupSwaps && group === toGroup) {
              return
            }
            const newSeeds = [...seeds()]
            const teamIdx = newSeeds.indexOf(team)
            const toTeamIdx = newSeeds.indexOf(toTeam)
            newSeeds[teamIdx] = toTeam
            newSeeds[toTeamIdx] = team
            props.onShuffle({
              ...props.round.teams,
              [division]: newSeeds
            })
          }
          return (
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Box sx={{
                px: 4,
                py: 2,
                borderBottom: "1px solid",
                borderColor: "divider",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
                position: "relative"
              }}>
                <Typography variant="h4" sx={{ fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  {division.capitalize()}
                </Typography>
                <IconButton
                  size="small"
                  color="error"
                  disabled={!divisionHasChanges(division)}
                  onClick={() => setResetDivision(division)}
                  sx={{ position: "absolute", right: 8 }}
                >
                  <Replay fontSize="small" />
                </IconButton>
              </Box>
              <DragDropProvider onDragEnd={dndHandler}>
                <DragDropSensors />
                <DragOverlayTeam />
                <Box sx={{
                  display: "grid",
                  flexDirection: "column",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1fr 1fr",
                    md: "1fr",
                    xl: "1fr 1fr",
                  },
                  gap: 1.5
                }}>
                  <For each={config.stage1}>{(group) => {
                    return (
                      <GroupCard name={"Group " + group.name} accent={DIVISION_ACCENT[division].text ?? "primary"}>
                        <For each={group.seeds}>{(seed) => {
                          const team = seeds()[seed.position]
                          const originalPosition = props.seeding[division].indexOf(team)
                          const originalGroup = props.originalConfig[division].stage1.find(g => g.seeds.find(s => (s.position) == originalPosition)).name
                          const moved = originalGroup !== group.name ? originalGroup : null
                          const originalSeed = "" + (originalPosition + 1)
                          return (
                            <DndTeam
                              disabled={config.stage1.length < 2 && !props.inGroupSwaps}
                              seed={originalSeed}
                              division={division}
                              group={group.name}
                              team={team}
                              moved={moved}
                              inGroupSwaps={props.inGroupSwaps}
                            />
                          )
                        }}</For>
                      </GroupCard>
                    )
                  }}</For>
                </Box>
              </DragDropProvider>
            </Box>
          )
        }}</For>
      </Box>
    </>
  )
}
