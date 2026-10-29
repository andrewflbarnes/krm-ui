import { Race } from "@/kings";
import { Card, Typography } from "@suid/material";
import { createEffect, createSignal, Show } from "solid-js";
import CellStatusIndicator from "./CellStatusIndicator";
import { Collapse } from "solid-collapse";
import styles from "./RaceListV2.module.css";

export default function RowTeamInfo(props: {
  race: Race;
  open: boolean;
  onClick: () => void;
  detailStr: string;
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
          <CellStatusIndicator complete={!!props.race.winner} />
          <td colspan={2} />
          <td colspan="100%" style={{
            "padding-left": "0.75em",
            "padding-right": "0.75em",
          }}>
            <Collapse value={expand()} class={styles.openTransition}>
              <div>
                <Typography align="left" variant="caption">
                  {props.detailStr}
                </Typography>
              </div>
            </Collapse>
          </td>
        </Card>
      </Show>
    </Show>
  )
}
