import { ParentProps } from "solid-js";
import { A, useLocation } from "@solidjs/router";
import { Box, Typography } from "@suid/material";

export default function Link(props: ParentProps<{ start?: boolean, href: string }>) {
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
        <Typography>
          {props.children}
        </Typography>
      </A>
    </Box>
  )
}
