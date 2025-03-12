import { CancelOutlined, CircleOutlined, NotInterested, TaskAlt } from "@suid/icons-material";
import { Switch, Match } from "solid-js";

export default function RaceResultIcon(props: {
  won: boolean;
  conceded?: boolean;
  dsq?: boolean
}) {
  return (
    <Switch>
      <Match when={props.won}>
        <TaskAlt color={props.dsq ? "error" : "success"} />
      </Match>
      <Match when={props.conceded}>
        <NotInterested color={"warning"} />
      </Match>
      <Match when={props.dsq}>
        <CancelOutlined color={"error"} />
      </Match>
      <Match when={true}>
        <CircleOutlined />
      </Match>
    </Switch>
  )
}
