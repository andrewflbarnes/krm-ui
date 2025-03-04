import { For, Show } from "solid-js";
import { Race } from "../kings"
import logo from "../ksc-logo.jpg"

type RaceListPrintableProps = {
  races: Race[];
  title?: string;
  subtitle?: string;
  knockouts?: boolean;
}
export default function RaceListPrintable(props: RaceListPrintableProps) {
  return (
    <>
      <style>{`
#rlp * {
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  font-weight: bold;
}
#rlp table {
  border-collapse: collapse;
}
#rlp td {
  text-align: center;
  display: table-cell;
  border: 3px solid #404040;
  white-space: nowrap;
  font-size: 0.65em;
}
#rlp .container {
  display: flex;
  align-items: center;
  justify-content: center;
}`
      }</style>
      <div style={{ width: "38rem", margin: "auto" }} id="rlp">
        <div style={{ width: "100%", display: "flex", "justify-content": "space-between", "align-items": "center" }}>
          <div style={{ display: "flex", "flex-direction": "column", "text-align": "left" }}>
            <h1 style={{ margin: "0" }}>{props.title || "Race Order"}</h1>
            <Show when={props.subtitle}>
              <h2 style={{ margin: 0 }}>{props.subtitle}</h2>
            </Show>
          </div>
          <div style={{ width: "15rem" }}>
            <img style={{ "max-width": "100%", height: "auto" }} src={logo} />
          </div>
        </div>
        <div class="container">
          <table>
            <tbody>
              <For each={props.races}>{(r, i) => (
                <tr>
                  <Show when={!props.knockouts}>
                    <td style={{ "width": "3rem" }}>{i() + 1}</td>
                  </Show>
                  <td style={{ "width": "3rem" }}>{r.division[0].toUpperCase()}</td>
                  <Show when={props.knockouts}>
                    <td style={{ "width": "3rem" }}>{r.group}</td>
                  </Show>
                  <td style={{ "width": "15rem" }}>{r.team1}</td>
                  <td style={{ "width": "2rem" }}>v</td>
                  <td style={{ "width": "15rem" }}>{r.team1}</td>
                </tr>
              )}</For>
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
