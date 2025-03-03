import { For, Show } from "solid-js";
import { Race } from "../kings"

type RaceListPrintableProps = {
  races: Race[];
  title: string;
  knockouts: boolean;
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
      <div id="rlp">
        <h1 style={{ "text-align": "center" }}>{props.title}</h1>
        <div class="container">
          <table>
            <tbody>
              <For each={props.races}>{(r, i) => (
                <tr>
                  <Show when={!props.knockouts}>
                    <td style={{ "width": "5em" }}>{i() + 1}</td>
                  </Show>
                  <td style={{ "width": "5em" }}>{r.division[0].toUpperCase()}</td>
                  <Show when={props.knockouts}>
                    <td style={{ "width": "5em" }}>{r.group}</td>
                  </Show>
                  <td style={{ "width": "23em" }}>{r.team1}</td>
                  <td style={{ "width": "2em" }}>v</td>
                  <td style={{ "width": "23em" }}>{r.team1}</td>
                </tr>
              )}</For>
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
