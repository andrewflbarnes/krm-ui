import { Card, Typography, useTheme } from "@suid/material";
import styles from "./RaceListV2.module.css";
import { Race } from "@/kings";
import CellStatusIndicator from "./CellStatusIndicator";
import { createSignal, ParentProps, Show } from "solid-js";
import Seed from "@/ui/Seed";
import { ExpandLess } from "@suid/icons-material";

export default function RowRace(props: {
  race: Race;
  onClick: () => void;
  onSetWinner: (team: 1 | 2) => void;
  open: boolean;
  readonly?: boolean;
  raceStr?: string;
}) {
  const theme = useTheme()
  // use theme colors with no mui components
  const hoverColor = () => theme.palette.action.selected

  return (
    <Card
      class={`${styles.raceInfoBottom} ${styles.fadeIn}`}
      onClick={props.onClick}
      sx={{
        boxShadow: props.open ? "none" : undefined,
        cursor: "pointer",
      }}
    >
      <CellStatusIndicator complete={!!props.race.winner} />
      <Show when={props.readonly}>
        <td colspan={1}
          style={{
            "vertical-align": "middle",
          }}
        >
          <Seed
            team={`${props.raceStr ? props.raceStr : props.race.raceNumber}`}
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
          "padding-top": "0.25em",
          "padding-bottom": "0.25em",
        }}
      >
        <TeamName readonly={props.readonly || !!props.race.winner} onClick={() => props.onSetWinner(1)} hoverColor={hoverColor()}>
          {props.race.team1}
        </TeamName>
      </div>
      <td
        style={{
          "text-align": "center",
        }}
      >
        <Typography>
          v
        </Typography>
      </td>
      <div
        style={{
          display: "table-cell",
          "padding-top": "0.25em",
          "padding-bottom": "0.25em",
        }}
      >
        <TeamName readonly={props.readonly || !!props.race.winner} onClick={() => props.onSetWinner(2)} hoverColor={hoverColor()} align="right">
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
      <Typography noWrap>
        {props.children}
      </Typography>
    </div>
  )
}

function Indicator(props: {
  team: 1 | 2;
  winner: 1 | 2 | undefined;
  dsq: boolean | undefined;
  indicators: string | undefined;
  align?: "left" | "center" | "right";
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
      display: "flex",
      "align-items": "center",
      "justify-content": props.align === "right"
        ? "flex-end"
        : props.align === "left"
          ? "flex-start"
          : "center",
      "min-width": "20px",
    }}>
      <Typography
        variant="caption"
        color={teamColor()}
      >
        {teamIndicator()}
      </Typography>
    </div>
  )
}
