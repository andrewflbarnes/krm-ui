import { ParentProps } from "solid-js"
import AppBar from "./components/AppBar"
import AppFooter from "./components/AppFooter"
import { Box, Paper } from "@suid/material"
import triangles from "./assets/triangles.png"

export default function AppLayout(props: ParentProps<{
  onModeChange: () => void;
}>) {
  return (
    <Paper elevation={0} sx={{
      height: "100%",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      backgroundImage: `url(${triangles})`,
      backgroundBlendMode: "hard-light",
    }}>
      <Box sx={{ flexGrow: 0 }}>
        <AppBar />
      </Box>
      <Box component="main" sx={{
        m: 1,
        flexGrow: 1,
        position: "relative",
        overflow: "auto",
      }}>
        {props.children}
      </Box>
      <Box sx={{ flexGrow: 0 }}>
        <AppFooter onModeChange={props.onModeChange} />
      </Box>
    </Paper>
  )
}
