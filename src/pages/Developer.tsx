import { useNavigate, useParams } from "@solidjs/router";
import { OpenInNew } from "@suid/icons-material";
import { Link, Paper, ToggleButton, ToggleButtonGroup } from "@suid/material";
import { createMemo, For, lazy, Show } from "solid-js";
import { Dynamic } from "solid-js/web";
const DeveloperData = lazy(() => import("../components/DeveloperData"));

const devViews = [
  {
    href: "data",
    title: "Data",
    component: DeveloperData,
  },
  {
    href: "playwright",
    title: "Playwright",
    external: true,
    component: () => (
      <ViewPortal
        href={`${window.location.origin}/krm-ui-playwright`}
        title={"KRM UI Playwright"}
      />
    ),
  },
  {
    href: "storybook",
    title: "Storybook",
    external: true,
    component: () => (
      <ViewPortal
        href={`${window.location.origin}/krm-ui-storybook`}
        title={"KRM UI Storybook"}
      />
    ),
  },
]

function ViewPortal(props: { href: string, title: string }) {
  return (
    <iframe
      style={{
        height: "100%",
        width: "100%",
        background: "white",
        border: 0,
      }}
      src={props.href}
      title={props.title}
    />
  )
}

export default function Developer() {
  const p = useParams<{ devview?: string }>()
  const nav = useNavigate()

  const view = createMemo(() => devViews.find(v => v.href === p.devview))

  return (
    <Paper sx={{
      display: "flex",
      flexDirection: "column",
      gap: 2,
      height: 1,
      width: 1,
      padding: 2,
      overflow: "hidden"
    }}>
      <div style={{
        display: "grid",
        "grid-template-columns": "1fr 1fr 1fr",
        "justify-content": "center",
        "align-items": "center",
      }}>
        <div />
        <ToggleButtonGroup
          exclusive
          value={p.devview}
          onChange={(_, value) => nav('/dev/' + value)}
          color="primary"
          fullWidth
        >
          <For each={devViews}>{view =>
            <ToggleButton value={view.href}>
              {view.title}
            </ToggleButton>
          }</For>
        </ToggleButtonGroup>
        <Show when={view()?.external}>
          <Link
            href={`/krm-ui-${view().href}`}
            target="_blank"
            rel="noopener noreferrer"
            variant="inherit"
            sx={{
              ml: "auto",
              flexDirection: "row",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Open in new tab
            &nbsp;
            <OpenInNew fontSize="small" />
          </Link>
        </Show>
      </div>
      <Show when={view()} fallback={(
        <div
          style={{
            display: "grid",
            height: "100%",
            width: "100%",
            "place-items": "center",
          }}>
          {p.devview === "null" &&
            <h2>/dev/null has consumed your hopes and dreams</h2>}
        </div>
      )}>
        <div
          style={{
            display: "flex",
            height: "100%",
            width: "100%",
            overflow: "hidden",
          }}>
          <Dynamic component={view().component} />
        </div>
      </Show>
    </Paper>
  )
}
