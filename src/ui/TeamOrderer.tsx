import { Box, Typography } from "@suid/material"
import { createDraggable, createDroppable, DragDropProvider, DragDropSensors, DragEventHandler } from "@thisbeyond/solid-dnd"
import { DragOverlay } from "@/lib/@thisbeyond/solid-dnd/drag-overlay"
import { createEffect, createMemo, createSignal, For, Show } from "solid-js"
import SeedInteractive from "./SeedInteractive"
import DragAnchor from "./DragAnchor"
import { North, South } from "@suid/icons-material"
import { Division } from "@/kings"

export default function TeamOrderer(props: {
  initialTeams?: string[];
  teams?: string[];
  originalSeeds: string[];
  newSeeds?: string[];
  division: Division;
  editable?: boolean;
  seeding?: boolean;
  overlayMount?: HTMLElement;
  onEdit?: (newSeeds: string[]) => void;
}) {
  const [order, setOrder] = createSignal<{
    team: string;
    seed: number;
  }[]>((props.initialTeams ?? []).map((team, i) => ({
    team,
    seed: i + 1,
  })))

  const seeding = createMemo(() => {
    return order().map(team => ({
      ...team,
      originalSeed: props.originalSeeds.indexOf(team.team) + 1,
    }))
  })

  createEffect(() => {
    if (!props.teams?.length) {
      return
    }

    if (props.initialTeams?.length) {
      console.warn("Changed from uncontrolled to controlled component, provide either teams or initial teams, not both")
    }

    const updatedTeams = props.teams.map((team, i) => ({
      team,
      seed: i + 1,
    }))
    setOrder(updatedTeams)
  })

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
    if (!overTeam) {
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
        .map(({ team }, i) => ({
          team,
          seed: i + 1,
        }))
      setOrder(next)

      if (props.editable) {
        const newSeeds = next.map(({ team }) => team)
        props.onEdit?.(newSeeds)
      }
    }
    setMoveFrom(null)
    setMoveTo(null)
  }
  return (
    <DragDropProvider onDragOver={handleDragOver} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <DragDropSensors />
      <Show when={moveFrom() != null}>
        <DragOverlay mount={props.overlayMount}>
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
          const isNew = () => props.newSeeds?.includes(teamName)
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
                  seed={props.seeding ? seed : originalSeed}
                  division={props.division}
                  team={team.team}
                  startAdornment={
                    <div style={{ visibility: props.editable ? "visible" : "hidden" }}>
                      <DragAnchor
                        data-testid={`${props.division}-${teamName}-drag-anchor`}
                        dragActivators={draggable.dragActivators}
                      />
                    </div>
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
                      <Show when={props.seeding ? moved() : false}>{(moveIndicator) => (
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
