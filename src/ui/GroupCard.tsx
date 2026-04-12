import { Box, Paper, Typography } from "@suid/material";
import { JSX } from "solid-js";

type GroupCardProps = {
  name: string;
  accent: "primary" | "secondary" | "error";
  children: JSX.Element;
}

export default function GroupCard(props: GroupCardProps) {
  return (
    <Paper elevation={0} sx={{ bgcolor: "action.hover", borderRadius: 1.5, overflow: "hidden" }}>
      <Box sx={{ px: 1.5, py: 0.75, borderBottom: "1px solid", borderColor: "divider", display: "flex", alignItems: "center", gap: 1 }}>
        <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: `${props.accent}.main`, flexShrink: 0 }} />
        <Typography variant="overline" sx={{ fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.1em", color: "text.disabled", lineHeight: 1 }}>
          Group {props.name}
        </Typography>
      </Box>
      <Box sx={{ px: 1.5, py: 1 }}>
        {props.children}
      </Box>
    </Paper>
  )
}
