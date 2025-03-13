import { CancelOutlined, TaskAlt } from "@suid/icons-material";
import { Show } from "solid-js";

export default function ValidIcon(props: {
  valid: boolean;
  fontSize?: "small" | "medium" | "large"| "inherit";
}) {
  return (
    <Show when={props.valid} fallback={<CancelOutlined color="error" fontSize={props.fontSize} />}>
      <TaskAlt color="success" fontSize={props.fontSize} />
    </Show>
  )
}
