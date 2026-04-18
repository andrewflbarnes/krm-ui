import { For, JSX, Show } from "solid-js";
import { Box, Chip, Paper, Typography } from "@suid/material";
import { BaseColor } from "../theme";
import GroupCard from "./GroupCard";

type StageCardProps<T> = {
  title: string;
  subtitle?: string;
  groups: ReadonlyArray<T>;
  namer: (group: T) => string;
  accent: BaseColor;
  children: (group: T) => JSX.Element;
};

export default function StageCard<T>(props: StageCardProps<T>) {
  return (
    <Paper
      elevation={3}
      sx={{
        width: "100%",
        overflow: "hidden",
        borderRadius: 2,
      }}
    >
      <Box sx={{
        bgcolor: `${props.accent}.main`,
        px: 2,
        py: 1.25,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1,
      }}>
        <Typography
          variant="subtitle1"
          sx={{
            color: "white",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            lineHeight: 1,
          }}
        >
          {props.title}
        </Typography>
        <Show when={props.subtitle}>
          <Chip
            label={props.subtitle}
            size="small"
            sx={{
              bgcolor: "rgba(255,255,255,0.2)",
              color: "white",
              fontWeight: 700,
              fontSize: "0.65rem",
              height: 20,
              "& .MuiChip-label": { px: 1 },
            }}
          />
        </Show>
      </Box>

      <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
        <For each={props.groups}>{(group) => {
          return (
            <GroupCard
              name={props.namer(group)}
              accent={props.accent}
            >
              {props.children(group)}
            </GroupCard>
          )
        }}</For>
      </Box>
    </Paper>
  )
}

