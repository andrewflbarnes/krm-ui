import { Replay } from "@suid/icons-material";
import { Box, Chip, IconButton, Paper, Typography } from "@suid/material";
import { createDraggable, createDroppable, DragDropProvider, DragDropSensors, DragEventHandler, DragOverlay, useDragDropContext } from "@thisbeyond/solid-dnd";
import { createSignal, For, Show } from "solid-js";
import { Division, Round, RoundConfig, RoundSeeding } from "../kings";
import GroupCard from "../ui/GroupCard";
import ModalConfirmAction from "../ui/ModalConfirmAction";
import { DIVISION_ACCENT } from "../theme";
import SeedInteractive from "../ui/SeedInteractive";
import DragAnchor from "../ui/DragAnchor";

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
          const [over, setOver] = createSignal<string | null>(null)
          const [fromGroup, setFromGroup] = createSignal<string | null>(null)
          const [from, setFrom] = createSignal<string | null>(null)
          const handleDragStart: DragEventHandler = ({ draggable }) => {
            setFromGroup(draggable.data.group)
            setFrom(draggable.data.team)
          }
          const handleDragOver: DragEventHandler = ({ draggable, droppable }) => {
            if (!droppable) {
              setOver(null)
              return
            }
            const { team } = draggable.data
            const { team: overTeam } = droppable.data
            if (team !== overTeam) {
              setOver(overTeam)
            }
          }
          const handleDragEnd: DragEventHandler = ({ draggable, droppable }) => {
            const finish = () => {
              setOver(null)
              setFromGroup(null)
              setFrom(null)
            }
            if (!droppable) {
              finish()
              return
            }
            const { group, team } = draggable.data
            const { group: toGroup, team: toTeam } = droppable.data
            if (!props.inGroupSwaps && group === toGroup) {
              finish()
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
            finish()
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
                  <DragDropProvider
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                  >
                    <DragDropSensors />
                    <TeamDragOverlay />
                    <For each={config.stage1}>{(group) => {
                      return (
                        <GroupCard
                          name={"Group " + group.name}
                          accent={DIVISION_ACCENT[division].text ?? "primary"}
                        >
                          <For each={group.seeds}>{(seed) => {
                            const team = () => seeds()[seed.position]
                            const teamDetails = {
                              team: team(),
                              seed: seed.position + 1,
                              group: group.name,
                              division,
                            }
                            const droppable = createDroppable(team(), teamDetails)
                            const draggable = createDraggable(team(), teamDetails)
                            const originalPosition = props.seeding[division].indexOf(team())
                            const originalGroup = props.originalConfig[division].stage1.find(g => g.seeds.find(s => (s.position) == originalPosition)).name
                            const moved = originalGroup !== group.name ? originalGroup : null
                            const originalSeed = "" + (originalPosition + 1)
                            const highlight = () => {
                              if (!over()) {
                                return false
                              }
                              if (over() !== team()) {
                                return false
                              }
                              return props.inGroupSwaps || fromGroup() !== group.name
                            }
                            const defocus = () => {
                              if (team() == from()) {
                                return true
                              }
                              return !props.inGroupSwaps && fromGroup() == group.name
                            }
                            return (
                              <div use:droppable={!!droppable}>
                                <div ref={draggable.ref}>
                                  <SeedInteractive
                                    disabled={config.stage1.length < 2 && !props.inGroupSwaps}
                                    seed={originalSeed}
                                    division={division}
                                    highlight={highlight()}
                                    defocus={defocus()}
                                    team={team()}
                                    startAdornment={
                                      <Show when={props.inGroupSwaps || config.stage1.length > 1}>
                                        <DragAnchor
                                          dragActivators={draggable.dragActivators}
                                        />
                                      </Show>
                                    }
                                    endAdornmnet={
                                      <Chip
                                        label={moved}
                                        size="small"
                                        variant="outlined"
                                        color="warning"
                                        sx={{
                                          marginLeft: "auto",
                                          visibility: moved ? "visible" : "hidden",
                                          fontSize: "0.5rem",
                                          height: "1rem",
                                        }}
                                      />
                                    }
                                  />
                                </div>
                              </div>
                            )
                          }}</For>
                        </GroupCard>
                      )
                    }}</For>
                  </DragDropProvider>
                </Box>
            </Box>
          )
        }}</For>
      </Box>
    </>
  )
}

function TeamDragOverlay() {
  const [dnd] = useDragDropContext()
  return (
    <Show when={dnd.active.draggable}>{draggable =>
      <DragOverlay>
        <div style={{ "z-index": 100, cursor: "grabbing" }}>
          <Paper sx={{ px: 1, py: 0.5 }}>
            {/* @ts-expect-error draggable data untyped */}
            <Team
              startAdornment={
                <DragAnchor
                  dragging
                />
              }
              {...draggable().data}
            />
          </Paper>
        </div>
      </DragOverlay>
    }</Show>
  )
}
