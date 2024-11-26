import { ParentProps, Show } from "solid-js";
import { A, useLocation } from "@solidjs/router";
import { Box, Typography } from "@suid/material";

export default function Link(props: ParentProps<{ start?: boolean, href: string, title?: string }>) {
  const location = useLocation()
  return (
    <Box>
      <A
        style={{
          color: "inherit",
          "text-decoration": "inherit",
        }}
        href={props.href + location.search}
      >
        <Show when={props.title} fallback={props.children}>
          <Typography>
            {props.title}
          </Typography>
          {props.children}
        </Show>
      </A>
    </Box>
  )
}
