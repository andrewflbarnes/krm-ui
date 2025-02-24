import { ParentProps } from "solid-js"
import AppBar from "./components/AppBar"
import AppFooter from "./components/AppFooter"
import { Toaster } from "solid-toast"
import { Paper } from "@suid/material"

export default function AppLayout(props: ParentProps<{
  onModeChange: () => void;
}>) {
  return (
    <Paper elevation={0} style={{
      height: "100%",
      width: "100%",
      display: "flex",
      "flex-direction": "column",
    }}>
      <Toaster />
      <div style={{ "flex-grow": 0 }}>
        <AppBar />
      </div>
      <main style={{
        margin: "1rem",
        "flex-grow": 1,
        position: "relative",
        overflow: "scroll",
      }}>
        {props.children}
      </main>
      <div style={{ "flex-grow": 0 }}>
        <AppFooter onModeChange={props.onModeChange} />
      </div>
    </Paper>
  )
}
