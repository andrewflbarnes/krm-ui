import { DragIndicator } from "@suid/icons-material";
import { Box, Chip, Paper, Theme } from "@suid/material";
import { createDraggable, createDroppable, DragOverlay, transformStyle, useDragDropContext } from "@thisbeyond/solid-dnd";
import { Show } from "solid-js";
import { Division } from "../kings";
import { DIVISION_ACCENT } from "../theme";
import NumberedTeam from "../ui/NumberedTeam";

type Behaviour = "move" | "swap"

export function DndTeam(props: {
  disabled?: boolean;
  seed: string | number;
  division: Division;
  group: string | number;
  team: string;
  moved?: string | number;
  inGroupSwaps?: boolean;
  behaviour?: Behaviour;
}) {
  const id = () => `${props.division}-${props.group}-${props.team}`
  const behaviour = () => props.behaviour || "swap"
  const draggable = createDraggable(id(), props)
  const droppable = createDroppable(id(), props)
  const [dnd] = useDragDropContext()
  const defocus = () => {
    if (behaviour() == "move") {
      return false
    }
    if (!dnd.active.draggable) {
      return false
    }
    if (dnd.active.draggable.data?.group != props.group) {
      return false
    }
    return (!props.inGroupSwaps || dnd.active.draggable.data?.team == props.team)
  }
  const highlight = () => {
    if (!dnd.active.draggable) {
      return false
    }

    if (behaviour() == "move") {
      return dnd.active.draggable?.data?.group == props.group && dnd.active.draggable?.data?.team == props.team
    }
    if (!dnd.active.droppable) {
      return false
    }
    if (dnd.active.droppable.data?.team != props.team) {
      return false
    }
    if (dnd.active.draggable.data?.team == props.team) {
      return false
    }
    return props.inGroupSwaps || dnd.active.draggable.data?.group != props.group
  }

  const styles = () => behaviour() == "move" ? {} : transformStyle(draggable.transform)

  return (
    <div use:droppable={!!droppable}>
      <div ref={draggable.ref} style={{ ...styles() }}>
        <Team
          disabled={props.disabled}
          defocus={defocus()}
          highlight={highlight()}
          division={props.division}
          seed={props.seed}
          team={props.team}
          moved={props.moved}
          dragActivators={draggable.dragActivators}
        />
      </div>
    </div>
  )
}

export function Team(props: {
  disabled?: boolean;
  defocus?: boolean;
  highlight?: boolean;
  overlay?: boolean;
  division: Division;
  seed: string | number;
  team: string;
  moved: string | number;
  dragActivators?: Record<string, (event: HTMLElementEventMap[keyof HTMLElementEventMap]) => void>;
}) {
  const badgeColor = () => DIVISION_ACCENT[props.division].text
  return (
    <Box sx={{
      display: "flex",
      alignItems: "center",
      gap: 1,
      px: 0.5,
      py: 0.5,
      opacity: props.defocus ? 0.5 : 1,
      borderRadius: 1,
      transition: "box-shadow 0.15s ease, background-color 0.15s ease, transform 0.12s ease",
      boxShadow: props.highlight
        ? (theme: Theme) => `0 0 0 2px ${theme.palette.primary.main}, 0 4px 16px ${theme.palette.primary.main}40`
        : "none",
      bgcolor: props.highlight ? "action.selected" : "transparent",
      transform: props.highlight ? "scale(1.015)" : "scale(1)",
    }}>
      <Show when={!props.disabled}>
        <Box sx={{ cursor: props.overlay ? "grabbing" : "grab", display: "flex", alignItems: "center", touchAction: "none" }}>
          <DragIndicator fontSize="small" {...props.dragActivators} sx={{ color: "text.disabled" }} />
        </Box>
      </Show>
      <NumberedTeam team={props.team} accent={badgeColor()} num={props.seed} />
      <Chip label={props.moved} color="warning" size="small" variant="outlined" sx={{ height: 18, fontSize: "0.6rem", visibility: props.moved ? "visible" : "hidden" }} />
    </Box>
  )
}

export function DragOverlayTeam() {
  const [dnd] = useDragDropContext()

  return (
    <Show when={dnd.active.draggable}>{draggable =>
      <DragOverlay>
        <div style={{ "z-index": 100 }}>
          <Paper sx={{ px: 1, py: 0.5 }}>
            {/* @ts-expect-error draggable data untyped */}
            <Team overlay {...draggable().data} />
          </Paper>
        </div>
      </DragOverlay>
    }</Show>
  )
}
