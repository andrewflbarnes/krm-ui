import { Box, Typography } from "@suid/material"
import { createSignal, For, Show } from "solid-js"
import { Division, RoundSeeding } from "../kings"
import StageCard from "../ui/StageCard"
import { DIVISION_ACCENT } from "../theme"
import { createDraggable, createDroppable, DragDropProvider, DragDropSensors, DragEventHandler, DragOverlay } from "@thisbeyond/solid-dnd"
import SeedInteractive from "../ui/SeedInteractive"
import { North, South } from "@suid/icons-material"
import DragAnchor from "../ui/DragAnchor"

export default function ManageNewSeeding(props: {
  seeds: RoundSeeding;
  editable?: boolean;
  onEdit?: (newSeeding: RoundSeeding) => void;
}) {
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
              title={`${division.capitalize()} - ${teams.length} teams`}
              accent={DIVISION_ACCENT[division].text}
              groups={[teams]}
            >{(group) => {
              const [moveFrom, setMoveFrom] = createSignal<number | null>(null)
              const [moveTo, setMoveTo] = createSignal<number | null>(null)

              const handleDragStart: DragEventHandler = ({ draggable }) => {
                const movingTeam = draggable.data.team
                const overPosition = seeding().findIndex((t) => t.team === movingTeam)
                setMoveTo(overPosition)
                setMoveFrom(overPosition)
              }
              
              const handleDragOver: DragEventHandler = ({ droppable }) => {
                const overTeam = droppable?.data.team
                if(!overTeam) {
                  return
                }
                const overPosition = seeding().findIndex((t) => t.team === overTeam)
                setMoveTo(overPosition)
              }

              const handleDragEnd: DragEventHandler = ({ droppable }) => {
                if (droppable) {
                  const moveTeam = seeding()[moveFrom()]
                  const next = seeding()
                    .toSpliced(moveFrom(), 1)
                    .toSpliced(moveTo(), 0, moveTeam)
                  setSeeding(next)

                  if (props.editable && props.onEdit) {
                    const nextRoundSeeding = {
                      ...props.seeds,
                      [division]: next.map((t) => t.team),
                    }
                    props.onEdit?.(nextRoundSeeding)
                  }
                }
                setMoveFrom(null)
                setMoveTo(null)
              }

              const [seeding, setSeeding] = createSignal(group.map((team, i) => ({
                team,
                seed: i + 1,
              })))
              return (
                <DragDropProvider onDragOver={handleDragOver} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                  <DragDropSensors />
                  <Show when={moveFrom() != null}>
                    <DragOverlay>
                      <div style={{
                        cursor: "row-resize",
                        "z-index": 100,
                        height: "30px",
                        width: "30px",
                      }} />
                    </DragOverlay>
                  </Show>
                  <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}>
                    <For each={seeding()}>{(team, i) => {
                      const order = () => {
                        const pos = i()
                        const from = moveFrom()
                        const to = moveTo()
                        if (from === null || to === null) {
                          return pos
                        }
                        if (pos === from) {
                          return to
                        }
                        if (pos < to && pos < from) {
                          return pos
                        }
                        if (pos > to && pos > from) {
                          return pos
                        }
                        if (to > from) {
                          return pos - 1
                        }
                        if (from > to) {
                          return pos + 1
                        }
                        return pos
                      }
                      const draggable = createDraggable(team.team, team)
                      const droppable = createDroppable(team.team, team)
                      const moved = () => {
                        const seedIndex = seeding().findIndex(t => t.team == team.team)
                        const currentIndex = teams.indexOf(team.team)

                        if (seedIndex == currentIndex) {
                          return undefined
                        }
                        return currentIndex - seedIndex
                      }
                      return (
                        <div
                          use:droppable={!!droppable}
                          style={{
                            order: order(),
                            transition: "all 0.15s",
                          }}
                        >
                          <div ref={draggable.ref}>
                            <SeedInteractive
                              highlight={moveFrom() === i()}
                              seed={team.seed}
                              division={division as Division}
                              team={team.team}
                              startAdornment={
                                <Show when={props.editable}>
                                  <DragAnchor
                                    dragActivators={draggable.dragActivators}
                                  />
                                </Show>
                              }
                              endAdornmnet={moved() != null ? <MovementIndicator moved={moved()} /> : undefined}
                            />
                          </div>
                        </div>
                      )
                    }}</For>
                  </Box>
                </DragDropProvider>
              )
            }}</StageCard>
          </Box>
        )
      }}
      </For>
    </Box>
  )
}

function MovementIndicator(props: { moved: number }) {
  const text = () => {
    return props.moved > 0
      ? props.moved
      : Math.abs(props.moved)
  }

  return (
    <Typography
      color={props.moved > 0 ? "success.main" : "error.main"}
      sx={{
        marginLeft: "auto",
        fontSize: "0.75em",
      }}
    >
      <Show
        when={props.moved > 0}
        fallback={
          <South sx={{ fontSize: "0.75em" }} />
        }
      >
        <North sx={{ fontSize: "0.75em" }} />
      </Show>
      {text()}
    </Typography>
  )
}
