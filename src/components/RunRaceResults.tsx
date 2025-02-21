import { For } from "solid-js";
import { Round } from "../kings";

export default function RunRaceResults(props: { round: Round }) {

  return (
    <>
      <div style={{ display: "flex", "flex-direction": "row" }}>
        <For each={Object.entries(props.round.results)}>{([division, results]) => (
          <div style={{ "margin-right": "2em"}}>
            <h2>{division}</h2>
            <div>
              <For each={results}>{result => (
                <p>
                  {result.rankStr}:&nbsp;
                  <For each={result.teams}>{team => (
                    <>
                      {team}
                    </>
                  )}</For>
                </p>
              )}</For>
            </div>
          </div>
        )}</For>
      </div>
    </>
  )
}
