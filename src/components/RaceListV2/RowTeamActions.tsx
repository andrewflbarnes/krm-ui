import { Race } from "@/kings";
import { Card } from "@suid/material";
import Button, { ButtonProps } from "@suid/material/Button";
import { createEffect, createSignal, Show } from "solid-js";
import CellStatusIndicator from "./CellStatusIndicator";
import { Collapse } from "solid-collapse";
import styles from "./RaceListV2.module.css";

export default function RowTeamActions(props: {
  race: Race;
  open: boolean;
  readonly?: boolean;
  onRaceUpdate: (race: Partial<Race>) => void;
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
        <CellStatusIndicator complete={!!props.race.winner} />
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
                padding: "0.25em",
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

const commonButtonProps: Partial<ButtonProps> = {
  size: "small",
  variant: "text",
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
        {...commonButtonProps}
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
        {...commonButtonProps}
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
        {...commonButtonProps}
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

