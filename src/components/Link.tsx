import { ParentProps } from "solid-js";
import { A } from "@solidjs/router";
import { Box, Typography } from "@suid/material";

export default function Link(props: ParentProps<{ start?: boolean, href: string }>) {
  return (
    <Box>
      <A
        style={{
          color: "inherit",
          "text-decoration": "inherit",
        }}
        href={props.href}
      >
        <Typography>
          {props.children}
        </Typography>
      </A>
    </Box>
  )
}
