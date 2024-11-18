import { Box, Typography } from "@suid/material";

export default function Status404() {
  return (
    <Box sx={{
      display: "grid",
      placeItems: "center",
      height: "100%",
      width: "100%",
    }}>
      <Typography variant="h2">You need more ski wax!</Typography>
    </Box>
  )
}
