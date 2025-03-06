import { SwapCalls } from "@suid/icons-material";
import { Chip, Divider, List, ListItem, ListItemText, ListSubheader, Paper, Typography } from "@suid/material";
import { createDraggable, createDroppable, DragDropProvider, DragDropSensors, DragEventHandler, DragOverlay, transformStyle, useDragDropContext } from "@thisbeyond/solid-dnd";
import { For, mergeProps, Show } from "solid-js";
import { Division, Round, RoundConfig, RoundSeeding } from "../kings";

type ManageNewShuffleProps = {
  round: Round;
  originalConfig: {
    [d in Division]: RoundConfig;
  };
  originalTeams: {
    [d in Division]: string[];
  };
  onShuffle: (seeds: RoundSeeding) => void;
  inGroupSwaps?: boolean;
}

export default function ManageNewShuffle(inprops: ManageNewShuffleProps) {
  const props = mergeProps({ inGroupSwaps: true }, inprops)
  return (
    <div style={{ display: "flex", "flex-direction": "row", gap: "1rem", "justify-content": "space-between" }}>
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
          <div style={{ "min-width": "16em" }}>
            <Typography variant="h2">
              {division}
            </Typography>
            <DragDropProvider onDragEnd={dndHandler}>
              <DragDropSensors />
              <DragOverlayTeam />
              <For each={config.stage1}>{(group) => {
                return (
                  <List
                    dense
                    aria-labelledby={`${division}-${group.name}`}
                    subheader={<ListSubheader id={`${division}-${group.name}`} sx={{ zIndex: 0 }}>Group {group.name}</ListSubheader>}
                  >
                    <For each={group.seeds}>{(seed) => {
                      const team = seeds()[seed.position - 1]
                      const originalPosition = props.originalTeams[division].indexOf(team)
                      const originalGroup = props.originalConfig[division].stage1.find(g => g.seeds.find(s => (s.position - 1) == originalPosition)).name
                      const moved = originalGroup !== group.name ? originalGroup : null
                      const originalSeed = "" + (originalPosition + 1)
                      return (
                        <DndTeam seed={originalSeed} division={division} group={group.name} team={team} moved={moved} />
                      )
                    }}</For>
                  </List>
                )
              }}</For>
            </DragDropProvider>
          </div>
        )
      }}</For>
    </div>
  )
}

function DndTeam(props: { seed: string, division: Division, group: string, team: string, moved?: string }) {
  const id = () => `${props.division}-${props.group}-${props.team}`
  const draggable = createDraggable(id(), props)
  const droppable = createDroppable(id(), props)
  const [dnd] = useDragDropContext()
  return (
    <div use:droppable={!!droppable}>
      <div ref={draggable.ref} style={{ ...transformStyle(draggable.transform), "touch-action": "none" }}>
        <Team dragging={dnd.active.draggable?.data?.group == props.group} seed={props.seed} team={props.team} moved={props.moved} dragActivators={draggable.dragActivators} />
      </div>
    </div>
  )
}

function Team(props: {
  dragging?: boolean;
  overlay?: boolean;
  seed: string;
  team: string;
  moved: string;
  dragActivators?: Record<string, (event: HTMLElementEventMap[keyof HTMLElementEventMap]) => void>; // solid-dnd Listeners
}) {
  return (
    <ListItem sx={{ display: "flex", gap: "1em", opacity: props.dragging ? 0.5 : 1 }}>
      <div style={{ cursor: props.overlay ? "grabbing" : "grab", display: "flex", "align-items": "center" }}>
        <SwapCalls fontSize="small" {...props.dragActivators} color="secondary" />
      </div>
      <Divider orientation="vertical" flexItem />
      <Typography sx={{ "max-width": "1em", textAlign: "center" }}>
        {props.seed}
      </Typography>
      <Divider orientation="vertical" flexItem />
      <ListItemText primary={props.team} />
      <Show when={props.moved}>
        <Chip label={props.moved} color="warning" size="small" variant="outlined" />
      </Show>
    </ListItem>
  )
}

function DragOverlayTeam() {
  const [dnd] = useDragDropContext()

  return (
    <Show when={dnd.active.draggable}>{draggable =>
      <DragOverlay>
        <div style={{ "z-index": 100 }}>
          <Paper>
            {/* @ts-expect-error draggable data untyped */}
            <Team overlay {...draggable().data} />
          </Paper>
        </div>
      </DragOverlay>
    }</Show>
  )
}
