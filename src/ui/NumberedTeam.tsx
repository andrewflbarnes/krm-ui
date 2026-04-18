import { Box, Typography } from "@suid/material";
import NumberBadge from "./NumberBadge";

type Props = {
  team: string;
  accent?: string;
  num: string | number;
}

export default function NumberedTeam(props: Props) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <NumberBadge value={props.num} bgcolor={`${props.accent ?? "primary"}.main`} />
      <Typography variant="body2" sx={{ fontSize: "0.75rem", whiteSpace: "nowrap" }}>
        {props.team}
      </Typography>
    </Box>
  )
}
