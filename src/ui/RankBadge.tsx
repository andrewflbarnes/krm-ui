import { Box, Typography } from "@suid/material";
import { Show } from "solid-js";

export const RANK_ACCENT: Record<number, string> = {
  1: "#f9a825",
  2: "#bdbdbd",
  3: "#a1887f",
};

export const RANK_GRADIENT: Record<number, string> = {
  1: "linear-gradient(135deg, #f9a825, #f57f17)",
  2: "linear-gradient(135deg, #bdbdbd, #757575)",
  3: "linear-gradient(135deg, #a1887f, #6d4c41)",
};

export default function RankBadge(props: { rank: number; rankStr: string; size?: number }) {
  const size = () => props.size ?? 28;
  return (
    <Show
      when={props.rank <= 3}
      fallback={
        <Box sx={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          px: 1,
          py: 0.25,
          borderRadius: "10px",
          bgcolor: "action.selected",
        }}>
          <Typography sx={{
            fontSize: "0.65rem",
            fontWeight: 700,
            color: "text.secondary",
            lineHeight: 1,
            whiteSpace: "nowrap",
          }}>
            {props.rankStr}
          </Typography>
        </Box>
      }
    >
      <Box sx={{
        width: size(),
        height: size(),
        borderRadius: "50%",
        background: RANK_GRADIENT[props.rank],
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
      }}>
        <Typography sx={{
          fontSize: "0.6rem",
          fontWeight: 800,
          color: "white",
          lineHeight: 1,
          whiteSpace: "nowrap",
          letterSpacing: "0.02em",
        }}>
          {props.rankStr}
        </Typography>
      </Box>
    </Show>
  );
}
