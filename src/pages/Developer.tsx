import { Button, ButtonGroup } from "@suid/material";
import { createSelector, createSignal, For, Match, Switch, Show } from "solid-js";

export default function Developer() {
  const [view, setView] = createSignal("c")
  const selected = createSelector(view)
  return (
    <>
      <div style={{ display: "flex", "justify-content": "center" }}>
        <ButtonGroup>
          <Button
            onClick={[setView, "conf"]}
            variant={selected("conf") ? "contained" : "outlined"}
          >
            Config
          </Button>
          <Button
            onClick={[setView, "data"]}
            variant={selected("data") ? "contained" : "outlined"}
          >
            Data
          </Button>
          <Button
            onClick={[setView, "ui"]}
            variant={selected("ui") ? "contained" : "outlined"}
          >
            UI Components
          </Button>
        </ButtonGroup>
      </div>
      <Switch>
        <Match when={selected("conf")}>
          <div>Config</div>
        </Match>
        <Match when={selected("data")}>
          <DeveloperData />
        </Match>
        <Match when={selected("ui")}>
          <div>ui</div>
        </Match>
      </Switch>
    </>
  )
}

function DeveloperData() {
  const league = localStorage.getItem("kings-selected-league")
  const [show, setShow] = createSignal("")
  const selected = createSelector(show)
  return (
    <div style={{ display: "flex", "flex-direction": "column", "align-items": "start" }}>
      <Button onClick={[setShow, selected("league") ? "" : "league"]}>
        kings-selected-league
      </Button>
      <Show when={selected("league")}>
        <pre>
          {league}
        </pre>
      </Show>
      <Button onClick={[setShow, selected("conf") ? "" : "conf"]}>
        kings-{league}-config
      </Button>
      <Show when={selected("conf")}>
        <pre>
          {JSON.stringify(JSON.parse(localStorage.getItem(`kings-${league}-config`)), null, 2)}
        </pre>
      </Show>
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
