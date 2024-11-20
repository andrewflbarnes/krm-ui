import { ParentProps } from "solid-js"
import AppBar from "./components/AppBar"
import { Toaster } from "solid-toast"
import { Paper } from "@suid/material"

export default function AppLayout(props: ParentProps<{}>) {
  return (
    <Paper style={{
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
    </Paper>
  )
}
