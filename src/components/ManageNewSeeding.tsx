import { Box } from "@suid/material"
import { createSignal, For } from "solid-js"
import { Division, RoundSeeding } from "../kings"
import StageCard from "../ui/StageCard"
import { DIVISION_ACCENT } from "../theme"
import { DragDropProvider, DragDropSensors, DragEventHandler } from "@thisbeyond/solid-dnd"
import { DndTeam } from "../ui/DragAndDropTeam"

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
                  setSeeding((prev) => {
                    const moveTeam = prev[moveFrom()]
                    return prev.toSpliced(moveFrom(), 1).toSpliced(moveTo(), 0, moveTeam)
                  })
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
                  <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                    cursor: moveFrom() !== null ? "grabbing !important" : "default",
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
                      return (
                        <Box sx={{
                          transition: "all 0.3s",
                          order: order(),
                        }}>
                          <DndTeam
                            seed={team.seed}
                            division={division as Division}
                            group={team.seed}
                            team={team.team}
                            behaviour="move"
                          />
                        </Box>
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
