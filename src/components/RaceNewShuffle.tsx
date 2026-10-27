import { InfoOutlined, Replay } from "@suid/icons-material";
import { Box, Chip, IconButton, Paper } from "@suid/material";
import { createDraggable, createDroppable, DragDropProvider, DragDropSensors, DragEventHandler, DragOverlay, useDragDropContext } from "@thisbeyond/solid-dnd";
import { createMemo, createSignal, For, Show } from "solid-js";
import { Division, Round, RoundConfig, RoundSeeding } from "@/kings";
import ModalConfirmAction from "@/ui/ModalConfirmAction";
import SeedInteractive from "@/ui/SeedInteractive";
import DragAnchor from "@/ui/DragAnchor";
import StageCard from "@/ui/StageCard";
import PopoverButton from "@/ui/PopoverButton";

type RaceNewShuffleProps = {
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

export default function RaceNewShuffle(props: RaceNewShuffleProps) {
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
          gridTemplateColumns: "1fr 1fr 1fr",
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
          const dragging = createMemo(() => ({
            over: over(),
            fromGroup: fromGroup(),
            fromTeam: from(),
          }))
          const title = () => {
            const s1Races = (config.stage1?.reduce((acc, group) => acc + group.template.races.length, 0) ?? 0)
            const s2Races = (config.stage2?.reduce((acc, group) => acc + group.template.races.length, 0) ?? 0)
            const koRaces = (config.knockout?.reduce((acc, group) => acc + group.template.races.length, 0) ?? 0)
            const raceCountInfo = []
            if (s1Races > 0) {
              raceCountInfo.push(`${s1Races} Stage 1 races`)
            }
            if (s2Races > 0) {
              raceCountInfo.push(`${s2Races} Stage 2 races`)
            }
            if (koRaces > 0) {
              raceCountInfo.push(`${koRaces} Knockouts`)
            }
            const totalRaces = s1Races + s2Races + koRaces
            const groups = config.stage1.length > 1 ? "groups" : "group"
            return (
              <div style={{
                display: "flex",
                "flex-wrap": "wrap",
                "align-items": "center",
                "column-gap": "1rem",
                "row-gap": "0.25rem",
                width: "100%",
              }}>
                <div>{division.capitalize()}</div>
                <div>{config.stage1.length} {groups}</div>
                <div style={{ display: "flex", "align-items": "center" }}>
                  {totalRaces} races&nbsp;
                  <PopoverButton
                    title="Race count"
                    messages={raceCountInfo}
                    variant="icon"
                    noPadding
                    icon={(
                      <InfoOutlined
                        fontSize="small"
                        color="action"
                      />
                    )}
                  />
                </div>
              </div>
            )
          }
          return (
            <Box sx={{ width: "100%" }}>
              <DragDropProvider
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
              >
                <DragDropSensors />
                <TeamDragOverlay />
                <StageCard
                  title={title()}
                  responsive
                  titleEndAdornment={
                    <IconButton
                      size="small"
                      disabled={!divisionHasChanges(division)}
                      onClick={() => setResetDivision(division)}
                      sx={{
                        background: "white",
                        transition: "opacity 0.2s",
                        "&:hover": { background: "white", opacity: 0.9 }
                      }}
                    >
                      <Replay fontSize="small" color="action" />
                    </IconButton>
                  }
                  type={division}
                  groups={config.stage1}
                  namer={(group) => "Group " + group.name}
                >{(group) => {
                  return (
                    <For each={group.seeds}>{(seed) => {
                      const team = () => seeds()[seed.position]
                      const original = () => {
                        const position = props.seeding[division].indexOf(team())
                        const group = props.originalConfig[division].stage1.find(g => g.seeds.find(s => (s.position) == position)).name
                        return {
                          position,
                          group,
                        }
                      }
                      return (
                        <DraggableSeed
                          group={group.name}
                          division={division}
                          team={team()}
                          position={seed.position}
                          seeding={seeds()}
                          config={config}
                          inGroupSwaps={props.inGroupSwaps}
                          dragging={dragging()}
                          original={original()}
                        />
                      )
                    }}</For>
                  )
                }}</StageCard>
              </DragDropProvider>
            </Box>
          )
        }}</For>
      </Box>
    </>
  )
}

function DraggableSeed(props: {
  group: string;
  division: Division;
  team: string;
  position: number;
  seeding: string[];
  config: RoundConfig;
  inGroupSwaps?: boolean;
  dragging: {
    over?: string;
    fromGroup?: string;
    fromTeam?: string;
  }
  original: {
    group: string;
    position: number;
  }
}) {
  const teamDetails = () => ({
    team: props.team,
    seed: props.position + 1,
    group: props.group,
    division: props.division,
  })
  const droppable = createDroppable(props.team, teamDetails()) // eslint-disable-line solid/reactivity
  const draggable = createDraggable(props.team, teamDetails()) // eslint-disable-line solid/reactivity
  const moved = () => props.original.group !== props.group ? props.original.group : null
  const originalSeed = () => "" + (props.original.position + 1)
  const highlight = () => {
    const over = props.dragging.over
    if (!over) {
      return false
    }
    if (over !== props.team) {
      return false
    }
    return props.inGroupSwaps || props.dragging.fromGroup !== props.group
  }
  const defocus = () => {
    if (props.team == props.dragging.fromTeam) {
      return true
    }
    return !props.inGroupSwaps && props.dragging.fromGroup == props.group
  }
  return (
    <div use:droppable={!!droppable}>
      <div ref={draggable.ref}>
        <SeedInteractive
          disabled={props.config.stage1.length < 2 && !props.inGroupSwaps}
          seed={originalSeed()}
          division={props.division}
          highlight={highlight()}
          defocus={defocus()}
          team={props.team}
          startAdornment={
            <Show when={props.inGroupSwaps || props.config.stage1.length > 1}>
              <DragAnchor
                dragActivators={draggable.dragActivators}
              />
            </Show>
          }
          endAdornment={
            <Chip
              label={moved()}
              size="small"
              variant="outlined"
              color="warning"
              sx={{
                marginLeft: "auto",
                visibility: moved() ? "visible" : "hidden",
                fontSize: "0.5rem",
                height: "1rem",
              }}
            />
          }
        />
      </div>
    </div>
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
            <SeedInteractive
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
