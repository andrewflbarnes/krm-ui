import { CancelOutlined, CircleOutlined, NotInterested, TaskAlt } from "@suid/icons-material";
import { Switch, Match } from "solid-js";

export default function RaceResultIcon(props: {
  won: boolean;
  conceded?: boolean;
  dsq?: boolean
  fontSize?: "inherit" | "small" | "medium" | "large";
}) {
  return (
    <Switch>
      <Match when={props.won}>
        <TaskAlt color={props.dsq ? "error" : "success"} fontSize={props.fontSize} />
      </Match>
      <Match when={props.conceded}>
        <NotInterested color={"warning"} fontSize={props.fontSize} />
      </Match>
      <Match when={props.dsq}>
        <CancelOutlined color={"error"} fontSize={props.fontSize} />
      </Match>
      <Match when={true}>
        <CircleOutlined fontSize={props.fontSize} />
      </Match>
    </Switch>
  )
}
