import { ExpandLess } from "@suid/icons-material";
import { Button, Card, Typography, useTheme } from "@suid/material";
import { createEffect, createSelector, createSignal, Index, onMount, ParentProps, Show } from "solid-js";
import { Race } from "@/kings";
import styles from "@/components/RaceListV2.module.css";
import Seed from "@/ui/Seed";
import { Collapse } from "solid-collapse";
import { ButtonProps } from "@suid/material/Button";
import { useIncrementalLoader } from "@/hooks/incremental-loader";
import NumberBadge from "@/ui/NumberBadge";

type RaceListV2Props = {
  orderedRaces: Race[],
  onRaceUpdate: (race: Race) => void;
  readonly?: boolean;
  knockout?: boolean;
}

function raceInfoString(race: Race): string {
  if (race.stage === "knockout") {
    return `${race.division.capitalize()} knockout`
  }
  return `Group ${race.group}`
    + ` team ${race.teamMlIndices[0] + 1}`
    + " vs "
    + `team ${race.teamMlIndices[1] + 1}`
}

export default function RaceListV2(props: RaceListV2Props) {
  const [openRace, setOpenRace] = createSignal<number | null>(null)
  const isOpenRace = createSelector(openRace)
  const theme = useTheme()
  // use theme colors with no mui components
  const hoverColor = () => theme.palette.action.selected
  const successColor = () => theme.palette.success.main

  const [raceSlice, startLoad] = useIncrementalLoader(() => props.orderedRaces)
  onMount(startLoad)
  createEffect(startLoad)
  return (
    <div style={{
      padding: "8px",
      "padding-top": 0,
      width: "30em", // todo something more sensible/responsive/absolute
    }}>
      <table style={{ width: "100%", "border-collapse": "collapse" }}>
        <Index each={raceSlice()}>{(race, raceNum) => {
          // Use Index instead of For to prevent unnecessary unmount + mount
          // when all ordered races changes as a result of a single race
          // being updated.
          // For now updating a race results in the entire round being
          // treated as a brand new object
          const handleRaceUpdate = (updated: Partial<Race>) => {
            props.onRaceUpdate({
              ...race(),
              ...updated,
            })
          }
          return (
            <RaceTableV2Row
              raceNum={raceNum}
              raceStr={props.knockout ? race().group : null}
              race={race()}
              onRaceUpdate={handleRaceUpdate}
              readonly={props.readonly}
              open={isOpenRace(raceNum)}
              onOpen={() => setOpenRace(prev => prev == raceNum ? null : raceNum)}
              hoverColor={hoverColor()}
              successColor={successColor()}
            />
          )
        }}</Index>
      </table>
    </div>
  )
}

type RaceTableV2RowProps = {
  raceNum: number;
  raceStr?: string;
  race: Race;
  onRaceUpdate: (race: Partial<Race>) => void;
  readonly?: boolean;
  open?: boolean;
  onOpen: () => void;
  hoverColor: string;
  successColor: string;
}

function RaceTableV2Row(props: RaceTableV2RowProps) {
  const handleSetWinner = (winner: 1 | 2) => {
    if (props.readonly) {
      props.onOpen()
      return
    }
    if (props.race.winner) {
      props.onOpen()
      return
    }
    props.onRaceUpdate({ winner })
  }

  const handleOpen = () => {
    props.onOpen()
  }

  return (
    <>
      <Show when={props.readonly}>
        <ExpandableGap open={!!props.open} />
      </Show>
      <Show when={!props.readonly}>
        <Card
          data-testid={`race-${props.race.stage}-${props.race.division}-${props.race.group}-${props.race.groupRace}`}
          onClick={handleOpen}
          class={`${styles.raceInfoTop} ${styles.fadeIn}`}
          sx={{
            cursor: props.readonly ? "inherit" : "pointer",
            boxShadow: "none",
          }}
        >
          <StatusIndicator complete={!!props.race.winner} color={props.successColor} />
          <td colspan="100%">
            <div style={{ display: "flex", "flex-direction": "row", "align-items": "center", "justify-content": "space-between", gap: "1em" }}>
              <div style={{ display: "flex", "flex-direction": "row", "align-items": "center", gap: "0.5em" }}>
                <NumberBadge value={props.race.division[0].toUpperCase()} bgcolor={props.race.division} />
                <Typography align="left" variant="caption" color="text.secondary">
                  Race {props.raceNum + 1}{props.raceStr ? ` - ${props.raceStr}` : ""}
                </Typography>
              </div>
              <div style={{ display: "flex", "flex-direction": "row", "align-items": "center", gap: "0.5em" }}>
                <Typography align="left" variant="caption" color="text.secondary">
                  {raceInfoString(props.race)}
                </Typography>
                <ExpandLess fontSize="small" sx={{
                  transform: props.open ? "rotate(0deg)" : "rotate(180deg)",
                  transition: "transform 0.2s ease",
                  display: props.readonly ? "none" : "inherit",
                }} />
              </div>
            </div>
          </td>
        </Card>
      </Show>
      <Card
        class={`${styles.raceInfoBottom} ${styles.fadeIn}`}
        onClick={handleOpen}
        sx={{
          boxShadow: props.open ? "none" : undefined,
          cursor: "pointer",
        }}
      >
        <StatusIndicator complete={!!props.race.winner} color={props.successColor} />
        <Show when={props.readonly}>
          <td colspan={1}
            style={{
              "vertical-align": "middle",
            }}
          >
            <Seed
              team={`${props.raceStr ? props.raceStr : (props.raceNum + 1)}`}
              num={props.race.division[0].toUpperCase()}
              accent={props.race.division}
            />
          </td>
        </Show>
        <td>
          <Indicator
            team={1}
            winner={props.race.winner}
            dsq={props.race.team1Dsq}
            indicators={props.race.indicators}
          />
        </td>
        <div
          style={{
            display: "table-cell",
            padding: "0.25em",
          }}
        >
          <TeamName readonly={props.readonly || !!props.race.winner} onClick={() => handleSetWinner(1)} hoverColor={props.hoverColor}>
            {props.race.team1}
          </TeamName>
        </div>
        <td
          style={{
            "text-align": "center",
          }}
        >
          vs
        </td>
        <div
          style={{
            display: "table-cell",
            padding: "0.25em",
          }}
        >
          <TeamName readonly={props.readonly || !!props.race.winner} onClick={() => handleSetWinner(2)} align="right" hoverColor={props.hoverColor}>
            {props.race.team2}
          </TeamName>
        </div>
        <td>
          <Indicator
            team={2}
            winner={props.race.winner}
            dsq={props.race.team2Dsq}
            indicators={props.race.indicators}
          />
        </td>
        <Show when={props.readonly}>
          <td style={{ "vertical-align": "middle", "text-align": "center" }}>
            <ExpandLess fontSize="small" sx={{
              transform: props.open ? "rotate(0deg)" : "rotate(180deg)",
              transition: "transform 0.2s ease",
            }} />
          </td>
        </Show>
      </Card>
      <Show when={props.readonly}>
        <TeamInfoRow
          race={props.race}
          open={!!props.open}
          onClick={handleOpen}
          successColor={props.successColor}
        />
      </Show>
      <Show when={!props.readonly}>
        <TeamActionRow
          race={props.race}
          open={!!props.open}
          readonly={props.readonly}
          onRaceUpdate={props.onRaceUpdate}
          successColor={props.successColor}
        />
      </Show>
      <ExpandableGap open={!props.readonly || !!props.open} />
    </>
  )
}

function ExpandableGap(props: { open: boolean }) {
  return (
    <tr class={styles.raceInfoExpand}>
      <td colspan="100%">
        <div style={{
          transition: "height 0.2s ease",
          transform: props.open ? "scaleY(1)" : "scaleY(0)",
          height: props.open ? "8px" : "0px",
        }} />
      </td>
    </tr>
  )
}

function StatusIndicator(props: { complete: boolean, color: string }) {
  return (
    <div
      style={{
        display: "table-cell",
        width: "0.2em",
        padding: 0,
        height: "100%",
        "background-color": props.complete ? props.color : undefined
      }}
    />
  )
}

function TeamName(props: ParentProps<{
  readonly?: boolean;
  onClick: () => void;
  align?: "left" | "center" | "right";
  hoverColor: string;
}>) {
  const [hover, setHover] = createSignal(false)
  const handleEnter = () => {
    if (!props.readonly) {
      setHover(true)
    }
  }
  const handleClick = (e: MouseEvent) => {
    e.stopPropagation()
    props.onClick()
  }
  return (
    <div
      onPointerEnter={handleEnter}
      onPointerLeave={[setHover, false]}
      style={{
        padding: "0.5em",
        "text-align": props.align ?? "left",
        cursor: props.readonly ? "inherit" : "pointer",
        transition: "background-color 0.15s ease, transform 0.12s ease",
        "box-shadow": "none",
        "border-radius": "8px",
        "background-color": hover() ? props.hoverColor : "transparent",
        transform: hover() ? "scale(1.015)" : "scale(1)",
      }}
      onClick={handleClick}
    >
      {props.children}
    </div>
  )
}

function TeamInfoRow(props: {
  race: Race;
  open: boolean;
  onClick: () => void;
  successColor: string;
}) {
  const [open, setOpen] = createSignal(false)
  const [expand, setExpand] = createSignal(false)
  createEffect(() => {
    if (props.open) {
      setOpen(true)
      setTimeout(() => setExpand(true), 10) // ensure mount completes before transition
    } else {
      setTimeout(() => setOpen(false), 200) // ensure stays mounted for transition
      setExpand(false)
    }
  })

  return (
    <Show when={open()}>
      <Show when={props.race.stage !== "knockout"}>
        <Card
          style={{
            display: "table-row",
            cursor: "pointer",
          }}
          onClick={props.onClick}
        >
          <StatusIndicator complete={!!props.race.winner} color={props.successColor} />
          <td colspan={2} />
          <td colspan="100%" style={{
            "padding-left": "0.75em",
            "padding-right": "0.75em",
          }}>
            <Collapse value={expand()} class={styles.openTransition}>
              <div>
                <Typography align="left" variant="caption">
                  {raceInfoString(props.race)}
                </Typography>
              </div>
            </Collapse>
          </td>
        </Card>
      </Show>
    </Show>
  )
}

function TeamActionRow(props: {
  race: Race;
  open: boolean;
  readonly?: boolean;
  onRaceUpdate: (race: Partial<Race>) => void;
  successColor: string;
}) {
  const [options, setOptions] = createSignal(false)
  const [expand, setExpand] = createSignal(false)
  createEffect(() => {
    if (props.open) {
      setOptions(true)
      setTimeout(() => setExpand(true), 10) // ensure mount completes before transition
    } else {
      setTimeout(() => setOptions(false), 200) // ensure stays mounted for transition
      setExpand(false)
    }
  })

  const handleForceWinner = (winner: 1 | 2, e: MouseEvent) => {
    e.stopPropagation()
    if (props.readonly) {
      return
    }
    props.onRaceUpdate({ winner })
  }

  const handleDsqToggle = (dsq: 1 | 2, e: MouseEvent) => {
    e.stopPropagation()
    if (props.readonly) {
      return
    }
    const t1Dsq = props.race.team1Dsq
    const t2Dsq = props.race.team2Dsq
    props.onRaceUpdate({
      team1Dsq: dsq == 1 ? !t1Dsq : t1Dsq,
      team2Dsq: dsq == 2 ? !t2Dsq : t2Dsq,
    })
  }

  const handleConcede = (team: 1 | 2, e: MouseEvent) => {
    e.stopPropagation()
    if (props.readonly) {
      return
    }
    props.onRaceUpdate({
      winner: team == 1 ? 2 : 1,
      indicators: "by",
      team1Dsq: undefined,
      team2Dsq: undefined
    })
  }
  return (
    <Show when={options()}>
      <Card
        class={styles.raceInfoExpand}
      >
        <StatusIndicator complete={!!props.race.winner} color={props.successColor} />
        <td />
        <td
          colspan={3}
        >
          <Collapse value={expand()} class={styles.openTransition}>
            <div
              style={{
                display: "grid",
                "grid-template-columns": "1fr auto 1fr",
                "align-items": "center",
                padding: "0.5em",
              }}
            >
              <TeamActions
                winner={props.race.winner}
                team={1}
                onSetWinner={[handleForceWinner, 1]}
                onDsqToggle={[handleDsqToggle, 1]}
                onConcede={[handleConcede, 1]}
                dsq={props.race.team1Dsq}
                indicators={props.race.indicators}
              />
              <Button
                color="error"
                size="small"
                variant="outlined"
                onClick={(e) => {
                  e.stopPropagation()
                  props.onRaceUpdate({
                    winner: undefined,
                    indicators: undefined,
                    team1Dsq: undefined,
                    team2Dsq: undefined
                  })
                }}
                disabled={props.readonly || (!props.race.winner && !props.race.indicators && !props.race.team1Dsq && !props.race.team2Dsq)}
              >
                Reset
              </Button>
              <TeamActions
                winner={props.race.winner}
                team={2}
                onSetWinner={[handleForceWinner, 2]}
                onDsqToggle={[handleDsqToggle, 2]}
                onConcede={[handleConcede, 2]}
                dsq={props.race.team2Dsq}
                indicators={props.race.indicators}
                alignEnd
              />
            </div>
          </Collapse>
        </td>
        <td />
      </Card>
    </Show>
  )
}

function TeamActions(props: {
  winner: 1 | 2 | undefined;
  team: 1 | 2;
  dsq?: boolean;
  indicators?: string;
  onDsqToggle: ButtonProps["onClick"];
  onSetWinner: ButtonProps["onClick"];
  onConcede: ButtonProps["onClick"];
  alignEnd?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        "flex-direction": "column",
        "justify-content": "flex-start",
        gap: "0.25em",
      }}
    >
      <Button
        size="small"
        color="success"
        onClick={props.onSetWinner}
        disabled={props.winner === props.team || !!props.indicators}
        sx={{
          marginLeft: props.alignEnd ? "auto" : undefined,
          marginRight: props.alignEnd ? undefined : "auto",
          justifyContent: props.alignEnd ? "flex-end" : "flex-start",
        }}
      >
        Winner
      </Button>
      <Button
        size="small"
        color={props.dsq ? "info" : "error"}
        onClick={props.onDsqToggle}
        disabled={!!props.indicators}
        sx={{
          marginLeft: props.alignEnd ? "auto" : undefined,
          marginRight: props.alignEnd ? undefined : "auto",
          justifyContent: props.alignEnd ? "flex-end" : "flex-start",
        }}
      >
        {props.dsq && "Clear "}DSQ
      </Button>
      <Button
        size="small"
        color="warning"
        onClick={props.onConcede}
        disabled={!!props.indicators}
        sx={{
          marginLeft: props.alignEnd ? "auto" : undefined,
          marginRight: props.alignEnd ? undefined : "auto",
          justifyContent: props.alignEnd ? "flex-end" : "flex-start",
        }}
      >
        By
      </Button>
    </div>
  )
}

function Indicator(props: {
  team: 1 | 2;
  winner: 1 | 2 | undefined;
  dsq: boolean | undefined;
  indicators: string | undefined;
}) {
  const teamIndicator = () => {
    if (!props.winner) {
      return "\u00A0"
    }

    if (props.winner == props.team) {
      return "W"
    }

    if (props.dsq) {
      return "D"
    }

    if (props.indicators) {
      return props.indicators[0].toUpperCase()
    }

    return "—"
  }

  const teamColor = () => {
    if (props.dsq) {
      return "error"
    }

    switch (teamIndicator()) {
      case "W":
        return "success.main"
      case "D":
        return "error"
      case "—":
        return "text.disabled"
      default:
        return "warning.main"
    }
  }
  return (
    <div style={{
      color: teamColor(),
      display: "flex",
      "justify-content": "center",
      "align-items": "center",
      "min-width": "1.5em",
    }}>
      <Typography
        color={teamColor()}
      >
        {teamIndicator()}
      </Typography>
    </div>
  )
}
