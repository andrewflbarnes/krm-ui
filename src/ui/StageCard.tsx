import { For, JSX, ParentProps, Show } from "solid-js";
import { Box, Chip, Paper, Typography } from "@suid/material";
import GroupCard from "@/ui/GroupCard";
import { Division, RaceStage } from "@/kings/types";

type StageCardProps<T> = {
  title: JSX.Element;
  titleEndAdornment?: JSX.Element;
  subtitle?: string;
  groups: ReadonlyArray<T>;
  namer: (group: T) => string;
  type: Division | RaceStage;
  responsive?: boolean;
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
        bgcolor: `${props.type}.main`,
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
            display: "flex",
            alignItems: "center",
            width: 1,
          }}
        >
          {props.title}
        </Typography>
        {props.titleEndAdornment}
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

      <StageCardData responsive={props.responsive}>
        <For each={props.groups}>{(group) => {
          return (
            <GroupCard
              name={props.namer(group)}
              type={props.type}
            >
              {props.children(group)}
            </GroupCard>
          )
        }}</For>
      </StageCardData>
    </Paper>
  )
}

function StageCardData(props: ParentProps<{ responsive?: boolean }>) {
  return (
    <Show
      fallback={
        <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
          {props.children}
        </Box>
      }
      when={props.responsive}
    >
      <Box sx={{
        display: "grid",
        p: 2,
        flexDirection: "column",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "1fr 1fr",
          md: "1fr",
          xl: "1fr 1fr",
        },
        gap: 1.5
      }}>
        {props.children}
      </Box>
    </Show>
  )
}
