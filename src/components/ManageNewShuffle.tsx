import { DragIndicator } from "@suid/icons-material";
import { Box, Chip, Paper, Theme, Typography } from "@suid/material";
import NumberBadge from "../ui/NumberBadge";
import { createDraggable, createDroppable, DragDropProvider, DragDropSensors, DragEventHandler, DragOverlay, transformStyle, useDragDropContext } from "@thisbeyond/solid-dnd";
import { For, Show } from "solid-js";
import { Division, Round, RoundConfig, RoundSeeding } from "../kings";
import GroupCard from "../ui/GroupCard";

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
  const gtr = () => Object.keys(props.round.config).map(() => "1fr").join(" ")
  return (
    <Box
      style={{ "grid-template-columns": gtr(), gap: "1rem", "justify-content": "space-between", "flex-direction": "column" }}
      sx={{
        display: {
          xs: "flex",
          md: "grid",
        },
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
            <Box sx={{ px: 4, py: 2, borderBottom: "1px solid", borderColor: "divider", display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                {division.capitalize()}
              </Typography>
            </Box>
            <DragDropProvider onDragEnd={dndHandler}>
              <DragDropSensors />
              <DragOverlayTeam />
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <For each={config.stage1}>{(group) => {
                  return (
                    <GroupCard name={group.name} accent="primary">
                      <For each={group.seeds}>{(seed) => {
                        const team = seeds()[seed.position]
                        const originalPosition = props.seeding[division].indexOf(team)
                        const originalGroup = props.originalConfig[division].stage1.find(g => g.seeds.find(s => (s.position) == originalPosition)).name
                        const moved = originalGroup !== group.name ? originalGroup : null
                        const originalSeed = "" + (originalPosition + 1)
                        return (
                          <DndTeam disabled={config.stage1.length < 2 && !props.inGroupSwaps} seed={originalSeed} division={division} group={group.name} team={team} moved={moved} inGroupSwaps={props.inGroupSwaps} />
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
  )
}

function DndTeam(props: { disabled?: boolean, seed: string, division: Division, group: string, team: string, moved?: string, inGroupSwaps: boolean }) {
  const id = () => `${props.division}-${props.group}-${props.team}`
  const draggable = createDraggable(id(), props)
  const droppable = createDroppable(id(), props)
  const [dnd] = useDragDropContext()
  const defocus = () => {
    if (!dnd.active.draggable) {
      return false
    }
    if (dnd.active.draggable.data?.group != props.group) {
      return false
    }
    return (!props.inGroupSwaps || dnd.active.draggable.data?.team == props.team)
  }
  const highlight = () => {
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
  return (
    <div use:droppable={!!droppable}>
      <div ref={draggable.ref} style={{ ...transformStyle(draggable.transform), "touch-action": "none" }}>
        <Team
          disabled={props.disabled}
          defocus={defocus()}
          highlight={highlight()}
          seed={props.seed}
          team={props.team}
          moved={props.moved}
          dragActivators={draggable.dragActivators}
        />
      </div>
    </div>
  )
}

function Team(props: {
  disabled?: boolean;
  defocus?: boolean;
  highlight?: boolean;
  overlay?: boolean;
  seed: string;
  team: string;
  moved: string;
  dragActivators?: Record<string, (event: HTMLElementEventMap[keyof HTMLElementEventMap]) => void>;
}) {
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
        <Box sx={{ cursor: props.overlay ? "grabbing" : "grab", display: "flex", alignItems: "center" }}>
          <DragIndicator fontSize="small" {...props.dragActivators} sx={{ color: "text.disabled" }} />
        </Box>
      </Show>
      <NumberBadge value={props.seed} />
      <Typography variant="body2" sx={{ fontSize: "0.75rem", flex: 1, whiteSpace: "nowrap" }}>
        {props.team}
      </Typography>
      <Chip label={props.moved} color="warning" size="small" variant="outlined" sx={{ height: 18, fontSize: "0.6rem", visibility: props.moved ? "visible" : "hidden" }} />
    </Box>
  )
}

function DragOverlayTeam() {
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
