import { Typography } from "@suid/material";
import { ParentProps } from "solid-js";
import ValidIcon from "./ValidIcon";

export default function ValidityCheck(props: ParentProps<{
  valid: boolean;
}>) {
  return (
    <div style={{
      display: "flex",
      "align-items": "flex-start",
      "justify-content": "center",
      gap: "0.5em",
    }}>
      <ValidIcon valid={props.valid} />
      <Typography>{props.children}</Typography>
    </div >
  )
}
