import { ParentProps } from "solid-js"
import AppBar from "./components/AppBar"

export default function AppLayout(props: ParentProps<{}>) {
  return (
    <div style={{
      height: "100%",
      width: "100%",
      display: "flex",
      "flex-direction": "column",
    }}>
      <div style={{ "flex-grow": 0 }}>
        <AppBar />
      </div>
      <main style={{
        margin: "1rem",
        "flex-grow": 1,
      }}>
        {props.children}
      </main>
    </div>
  )
}
