import { Box, Card, Typography } from "@suid/material";
import { JSX } from "solid-js";
import { BaseColor } from "../theme";

type GroupCardProps = {
  name: string;
  accent: BaseColor;
  children: JSX.Element;
}

export default function GroupCard(props: GroupCardProps) {
  return (
    <Card sx={{ borderRadius: 1.5, overflow: "hidden" }}>
      <Box sx={{ px: 1.5, py: 0.75, borderBottom: "1px solid", borderColor: "divider", display: "flex", alignItems: "center", gap: 1 }}>
        <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: `${props.accent}.main`, flexShrink: 0 }} />
        <Typography variant="overline" sx={{ fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.1em", color: "text.disabled", lineHeight: 1 }}>
          Group {props.name}
        </Typography>
      </Box>
      <Box sx={{ px: 1.5, py: 1 }}>
        {props.children}
      </Box>
    </Card>
  )
}
