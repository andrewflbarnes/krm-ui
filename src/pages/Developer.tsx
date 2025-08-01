import { useNavigate, useParams } from "@solidjs/router";
import { OpenInNew } from "@suid/icons-material";
import { Button, ButtonGroup, Link } from "@suid/material";
import { createSelector, For, lazy, Show } from "solid-js";
import { Dynamic } from "solid-js/web";
const DeveloperData = lazy(() => import("../components/DeveloperData"));

const devViews = [
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
          <Button endIcon={<OpenInNew fontSize="small" />}>
            <Link
              href="/krm-ui-storybook"
              target="_blank"
              rel="noopener noreferrer"
              variant="inherit"
            >
              Storybook
            </Link>
          </Button>
        </ButtonGroup>
      </div>
      <Show when={p.devview}>
        <Dynamic component={devViews.find(v => v.href === p.devview)?.component} />
      </Show>
    </>
  )
}
