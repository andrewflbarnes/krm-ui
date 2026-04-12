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
      borderRadius: "50%",
      bgcolor: props.bgcolor ?? "primary.main",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}>
      <Typography sx={{ fontSize: "0.6rem", fontWeight: 800, color: props.color ?? "white", lineHeight: 1 }}>
        {props.value}
      </Typography>
    </Box>
  )
}
