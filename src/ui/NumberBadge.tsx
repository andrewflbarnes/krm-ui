import { Box, Typography } from "@suid/material";

type NumberBadgeProps = {
  value: number | string;
  bgcolor?: string;
  color?: string;
  border?: number;
  size?: number;
}

export default function NumberBadge(props: NumberBadgeProps) {
  const color = () => {
    if (props.color) {
      return `${props.color}.main`;
    } else {
      return "white"
    }
  }
  return (
    <Box sx={{
      width: props.size ?? 20,
      height: props.size ?? 20,
      borderRadius: "0.3em",
      color: color(),
      backgroundColor: props.bgcolor ? `${props.bgcolor}.light` : "transparent",
      borderWidth: props.border ?? 0,
      borderStyle: "solid",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}>
      <Typography sx={{ fontSize: "0.6rem", fontWeight: 800, lineHeight: 1 }}>
        {props.value}
      </Typography>
    </Box>
  )
}
