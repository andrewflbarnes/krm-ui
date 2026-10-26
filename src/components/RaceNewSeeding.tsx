import { Box, IconButton, Typography } from "@suid/material"
import { createEffect, createMemo, createSignal, For, Show, untrack } from "solid-js"
import { Division, RoundSeeding } from "@/kings"
import StageCard from "@/ui/StageCard"
import { createDraggable, createDroppable, DragDropProvider, DragDropSensors, DragEventHandler, DragOverlay } from "@thisbeyond/solid-dnd"
import SeedInteractive from "@/ui/SeedInteractive"
import { North, Replay, South } from "@suid/icons-material"
import DragAnchor from "@/ui/DragAnchor"

/**
  * Shows the seeding per division. Original seeds will default to seeds if not]
  * provided. Any teams not present in original seeds that are in seeds are
  * considered new and will be displayed at the bottom of the list if reset.
  *
  * @param originalSeeds the {RoundSeeding} prior to any shifts
  * @param seeds the {RoundSeeding} to display and adjust
  */
export default function RaceNewSeeding(props: {
  originalSeeds?: RoundSeeding;
  newSeeds?: RoundSeeding;
  seeds: RoundSeeding;
  editable?: boolean;
  onEdit?: (newSeeding: RoundSeeding) => void;
}) {
  const originalSeeds = createMemo<RoundSeeding>(() => {
    const seeds = untrack(() => props.seeds)
    // Add any seeds not in the originalSeeds to the end of the list for each division
    return props.originalSeeds
      ? Object.entries(props.seeds)
        .reduce((acc, [division, teams]: [Division, string[]]) => {
          teams.forEach((team) => {
            if (!acc[division].includes(team)) {
              acc[division].push(team)
            }
          })
          return acc
        }, {
          mixed: [...(props.originalSeeds?.mixed ?? [])],
          ladies: [...(props.originalSeeds?.ladies ?? [])],
          board: [...(props.originalSeeds?.board ?? [])],
        })
      : seeds
  })

  const initialSeeds = props.seeds // eslint-disable-line solid/reactivity
  const [seeds, setSeeds] = createSignal(initialSeeds)
  createEffect(() => {
    setSeeds(props.seeds)
  })
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
      <For each={Object.entries(seeds())}>{([division, teams]: [Division, string[]]) => {
        const modified = () => {
          if (!props.editable) {
            return false
          }
          return !teams.every((team, i) => team === originalSeeds()[division][i])
        }

        const handleReset = () => {
          const currentSeeds = seeds()
          const nextSeeds = {
            ...currentSeeds,
            [division]: [...originalSeeds()[division]],
          }
          props.seeds[division]
            .filter(seed => !nextSeeds[division].includes(seed))
            .forEach((team) => {
              nextSeeds[division].push(team)
            })
          props.onEdit?.(nextSeeds)
          setSeeds(nextSeeds)
        }

        return (
          <Box sx={{ width: "100%" }}>
            <StageCard
              namer={() =>"Seeds"}
              title={`${division.capitalize()} - ${teams.length} teams`}
              titleEndAdornment={
                <Show when={props.editable}>
                  <IconButton
                    size="small"
                    color="error"
                    disabled={!modified()}
                    onClick={handleReset}
                    sx={{
                      background: "white"
                    }}
                  >
                    <Replay fontSize="small" />
                  </IconButton>
                </Show>
              }
              type={division}
              groups={[teams]}
            >{(group) => {
              const [seeding, setSeeding] = createSignal(group.map((team, i) => ({
                team,
                seed: i + 1,
                originalSeed: originalSeeds()[division].indexOf(team) + 1,
              })))

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
                    .map((t, i) => ({
                      ...t,
                      seed: i + 1,
                    }))
                  setSeeding(next)

                  if (props.editable) {
                    const nextRoundSeeding = {
                      ...seeds(),
                      [division]: next.map((t) => t.team),
                    }
                    props.onEdit?.(nextRoundSeeding)
                    setSeeds(nextRoundSeeding)
                  }
                }
                setMoveFrom(null)
                setMoveTo(null)
              }
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
                    <For each={seeding()}>{(team) => {
                      const { team: teamName, seed, originalSeed } = team
                      const pos = seed - 1
                      const order = () => {
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
                      const draggable = createDraggable(teamName, team)
                      const droppable = createDroppable(teamName, team)
                      const isNew = () => props.newSeeds?.[division]?.includes(teamName)
                      const moved = () => {
                        const change = originalSeed - seed
                        return change !== 0 ? change : undefined
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
                              highlight={moveFrom() === pos}
                              seed={seed}
                              division={division as Division}
                              team={team.team}
                              startAdornment={
                                <Show when={props.editable}>
                                  <DragAnchor
                                    data-testid={`${division}-${teamName}-drag-anchor`}
                                    dragActivators={draggable.dragActivators}
                                  />
                                </Show>
                              }
                              endAdornment={
                                <Box sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.5,
                                  marginLeft: "auto"
                                }}>
                                  <Show when={isNew()}>
                                    <MovementIndicator moved={"New"} />
                                  </Show>
                                  <Show when={moved()}>{(moveIndicator) => (
                                    <MovementIndicator moved={moveIndicator()} />
                                  )}</Show>
                                </Box>
                              }
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

function asMovement(value: number | string): number | null {
  return typeof value === "number" ? value : null
}

function MovementIndicator(props: { moved: number | string }) {
  const color = () => {
    if (typeof props.moved === "string") {
      return undefined
    }
    return props.moved > 0
      ? "success.main"
      : "error.main"
  }

  return (
    <Typography
      color={color()}
      sx={{
        fontSize: "0.75em",
      }}
    >
      <Show
        when={asMovement(props.moved)}
        fallback={
          <Box sx={{
            fontSize: "0.75em",
            color: "text.secondary",
          }}>
          {props.moved}
          </Box>
        }
      >{(movement) => {
        const text = () => {
          if (typeof props.moved === "string") {
            return props.moved
          }
          return props.moved > 0
            ? props.moved
            : Math.abs(props.moved)
        }
        return <>
          <Show
            when={movement() > 0}
            fallback={
              <South sx={{ fontSize: "0.75em" }} />
            }
          >
            <North sx={{ fontSize: "0.75em" }} />
          </Show>
          {text()}
        </>
      }}</Show>
    </Typography>
  )
}
