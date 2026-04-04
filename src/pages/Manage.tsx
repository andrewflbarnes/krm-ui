import { Box, Paper } from "@suid/material";
import { ParentProps } from "solid-js";

export default function Manage(props: ParentProps) {
  return (
    <Box sx={{
      display: "flex",
      flexDirection: "row",
      gap: "8px",
      height: "100%",
    }}>
      <Paper sx={{ flexGrow: 1, height: "100%", padding: "8px", overflow: "scroll" }} elevation={4} >
        {props.children}
      </Paper>
    </Box>
  )
}
