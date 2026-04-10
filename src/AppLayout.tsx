import { ParentProps } from "solid-js"
import AppBar from "./components/AppBar"
import AppFooter from "./components/AppFooter"
import { Box, Paper, useTheme } from "@suid/material"
import triangles from "./assets/triangles.png"

export default function AppLayout(props: ParentProps<{
  onModeChange: () => void;
}>) {
  const theme = useTheme()
  const bgOpacity = () => theme.palette.mode === "dark" ? 1 : 0.5

  return (
    <Paper elevation={0} sx={{
      height: "100%",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      overflow: "hidden",
      borderRadius: 0,
    }}>
      <Box sx={{
        position: "absolute",
        inset: 0,
        backgroundImage: `url(${triangles})`,
        opacity: bgOpacity(),
        pointerEvents: "none",
      }} aria-hidden="true" />
      <Box sx={{ flexGrow: 0, zIndex: 1 }}>
        <AppBar />
      </Box>
      <Box component="main" sx={{
        m: 1,
        flexGrow: 1,
        position: "relative",
        overflow: "auto",
        zIndex: 1,
      }}>
        {props.children}
      </Box>
      <Box sx={{ flexGrow: 0, zIndex: 1 }}>
        <AppFooter onModeChange={props.onModeChange} />
      </Box>
    </Paper>
  )
}
