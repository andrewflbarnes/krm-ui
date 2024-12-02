import { Button } from "@suid/material";
import { Show, For, createSignal, createSelector } from "solid-js";
export default function DeveloperData() {
  const [show, setShow] = createSignal("")
  const selected = createSelector(show)
  return (
    <div style={{ display: "flex", "flex-direction": "column", "align-items": "start" }}>
      <Button onClick={[setShow, selected("league") ? "" : "league"]}>
        kings-selected-league
      </Button>
      <Show when={selected("league")}>
        <pre>
          {localStorage.getItem("kings-selected-league")}
        </pre>
      </Show>
      <For each={["western", "northern", "southern", "midlands"]}>{league =>
        <>
          <Button onClick={[setShow, selected(league) ? "" : league]}>
            kings-{league}-config
          </Button>
          <Show when={selected(league)}>
            <pre>
              {JSON.stringify(JSON.parse(localStorage.getItem(`kings-${league}-config`)), null, 2)}
            </pre>
          </Show>
        </>
      }</For>
      <Button onClick={[setShow, selected("ids") ? "" : "ids"]}>
        kings-round-ids
      </Button>
      <Show when={selected("ids")}>
        <pre>
          {JSON.stringify(JSON.parse(localStorage.getItem("kings-round-ids")), null, 2)}
        </pre>
      </Show>
      <For each={JSON.parse(localStorage.getItem("kings-round-ids"))}>
        {(id: string) => (
          <>
            <Button onClick={[setShow, selected(id) ? "" : id]}>
              {id}
            </Button>
            <Show when={selected(id)}>
              <pre>
                {JSON.stringify(JSON.parse(localStorage.getItem(id)), null, 2)}
              </pre>
            </Show>
          </>
        )}
      </For>
    </div>
  )
}
