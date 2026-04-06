import { DarkMode, LightMode } from "@suid/icons-material";
import { IconButton } from "@suid/material";
import { Show } from "solid-js";

export default function ModeChangeButton(props: {
  mode: "dark" | "light";
  onModeChange: () => void;
}) {
  return (
    <IconButton aria-label="Toggle light/dark mode" onClick={props.onModeChange}>
      <Show when={props.mode === "dark"} fallback={<LightMode fontSize="small" />}>
        <DarkMode fontSize="small" />
      </Show>
    </IconButton>
  )
}
