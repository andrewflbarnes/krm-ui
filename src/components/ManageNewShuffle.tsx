import { List, ListItem, Typography } from "@suid/material";
import { createDraggable, createDroppable, DragDropProvider, DragDropSensors, DragEventHandler } from "@thisbeyond/solid-dnd";
import { For } from "solid-js";
import { Division, Round, RoundConfig, RoundSeeding } from "../kings";

type ManageNewShuffleProps = {
  round: Round;
  onShuffle: (seeds: RoundSeeding) => void;
}

export default function ManageNewShuffle(props: ManageNewShuffleProps) {
  return (
    <div style={{ display: "flex", "flex-direction": "row", gap: "1rem" }}>
      <For each={Object.entries(props.round.config)}>{([division, config]: [Division, RoundConfig]) => {
        const seeds = () => props.round.teams[division]
        const dndHandler: DragEventHandler = ({ draggable, droppable }) => {
          if (!droppable) {
            return
          }
          const { group, team } = draggable.data
          const { group: toGroup, team: toTeam } = droppable.data
          if (group === toGroup) {
            return
          }
          const newSeeds = [...seeds()]
          console.log(`Swap ${group} ${team} with ${toGroup} ${toTeam}`)
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
          <Typography>
            <Typography variant="h2">
              {division}
            </Typography>
            <DragDropProvider onDragEnd={dndHandler}>
              <DragDropSensors>
                <For each={config.stage1}>{(group) => {
                  return (
                    <div>
                      {group.name}
                      <List>
                        <For each={group.seeds}>{(seed) => {
                          return (
                            <DndTeam division={division} group={group.name} team={seeds()[seed.position - 1]} />
                          )
                        }}</For>
                      </List>
                    </div>
                  )
                }}</For>
              </DragDropSensors>
            </DragDropProvider>
          </Typography>
        )
      }}</For>
    </div>
  )
}

function DndTeam(props: { division: Division, group: string, team: string }) {
  // TODO cleanup TS errors
  const id = () => `${props.division}-${props.group}-${props.team}`
  const draggable = createDraggable(id(), props)
  const droppable = createDroppable(id(), props)
  return (
    <div use:droppable>
      <div use:draggable>
        <ListItem>
          {props.team}
        </ListItem>
      </div>
    </div>
  )
}
