import { Box, Card, Typography } from "@suid/material";
import { JSX, Show } from "solid-js";
import { Division, RaceStage } from "@/kings/types";

type GroupCardProps = {
  name: string;
  type: Division | RaceStage;
  endAdornment?: JSX.Element;
  children: JSX.Element;
}

export default function GroupCard(props: GroupCardProps) {
  return (
    <Card
      sx={{ borderRadius: 1.5, overflow: "hidden" }}
    >
      <Box sx={{ px: 1.5, py: 0.75, borderBottom: "1px solid", borderColor: "divider", display: "flex", alignItems: "center", gap: 1 }}>
        <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: `${props.type}.main`, flexShrink: 0 }} />
        <Typography variant="overline" sx={{ fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.1em", lineHeight: 1 }}>
          {props.name}
        </Typography>
        <Show when={props.endAdornment}>
          <Box sx={{ flex: 1 }} />
          {props.endAdornment}
        </Show>
      </Box>
      <Box sx={{ px: 1.5, py: 1 }}>
        {props.children}
      </Box>
    </Card>
  )
}
