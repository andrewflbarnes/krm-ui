import { Box, Typography } from "@suid/material";

export default function Home() {
  return (
    <div style={{
      display: "grid",
      height: "100%",
      width: "100%",
      "place-items": "center",
    }}>
      <Box>
        <Typography align="center" variant="h1"><strong>[ K ]</strong></Typography>
        <Typography align="center">Welcome to the Kings Race Manager</Typography>
      </Box>
    </div >
  )
}
