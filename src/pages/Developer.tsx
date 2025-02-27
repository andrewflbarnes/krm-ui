import { useNavigate, useParams } from "@solidjs/router";
import { Button, ButtonGroup } from "@suid/material";
import { createSelector, For, lazy, Show } from "solid-js";
import { Dynamic } from "solid-js/web";
const DeveloperConfig = lazy(() => import("../components/DeveloperConfig"));
const DeveloperData = lazy(() => import("../components/DeveloperData"));

const devViews = [
  {
    href: "config",
    title: "Config",
    component: DeveloperConfig,
  },
  {
    href: "data",
    title: "Data",
    component: DeveloperData,
  },
]

export default function Developer() {
  const p = useParams<{ devview?: string }>()
  const selected = createSelector(() => p.devview)
  const nav = useNavigate()
  return (
    <>
      <div style={{ display: "flex", "justify-content": "center" }}>
        <ButtonGroup>
          <For each={devViews}>{view =>
            <Button
              variant={selected(view.href) ? "contained" : "outlined"}
              onClick={() => nav(view.href)}
            >
            {view.title}
            </Button>
          }</For>
        </ButtonGroup>
      </div>
      <Show when={p.devview}>
        <Dynamic component={devViews.find(v => v.href === p.devview)?.component} />
      </Show>
    </>
  )
}
