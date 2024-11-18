import { Typography } from "@suid/material";
import { ParentProps } from "solid-js";

export default function RaceManager(props: ParentProps<{}>) {
  return (
    <div>
      <Typography variant="h2">Race Manager</Typography>
      {props.children}
    </div>
  )
}

