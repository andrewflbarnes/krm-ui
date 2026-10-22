import { Box, Typography } from "@suid/material";

type NumberBadgeProps = {
  value: number | string;
  bgcolor?: string;
  color?: string;
  size?: number;
}

export default function NumberBadge(props: NumberBadgeProps) {
  return (
    <Box sx={{
      width: props.size ?? 20,
      height: props.size ?? 20,
      borderRadius: "0.3em",
      borderColor: props.bgcolor ?? "primary.main",
      borderWidth: 1,
      borderStyle: "solid",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}>
      <Typography sx={{ fontSize: "0.6rem", fontWeight: 800, color: props.bgcolor ?? undefined, lineHeight: 1 }}>
        {props.value}
      </Typography>
    </Box>
  )
}
