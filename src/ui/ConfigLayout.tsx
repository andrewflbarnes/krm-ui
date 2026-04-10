import { Box, Paper, Typography } from "@suid/material";
import { JSX, ParentProps, Show } from "solid-js";

type ConfigLayoutProps = ParentProps<{
  /**
   * When falsy the right panel shows the empty state; when truthy the children
   * are wrapped in a scrollable Paper and rendered.
   */
  selectedId: string | undefined;
  /** Large icon shown in the empty state (e.g. <Tune sx={{ fontSize: 64 }} />). */
  emptyIcon: JSX.Element;
  /** Primary heading in the empty state. */
  emptyHeading: string;
  /** Secondary description line in the empty state. */
  emptyDescription: string;
  /** The sidebar component (already constructed). */
  sidebar: JSX.Element;
}>;

/**
 * Two-panel layout shared by config browser pages.
 *
 * Left panel: `sidebar` prop (caller constructs ConfigSidebar or equivalent).
 * Right panel: children wrapped in a scrollable Paper, or an empty state when
 * nothing is selected.
 */
export default function ConfigLayout(props: ConfigLayoutProps) {
  return (
    <Box sx={{ display: "flex", gap: 2, height: "100%", overflow: "hidden" }}>
      {props.sidebar}

      <Show
        when={props.selectedId}
        fallback={
          <Box sx={{
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 2,
            opacity: 0.4,
          }}>
            {props.emptyIcon}
            <Typography variant="h6" color="text.disabled">
              {props.emptyHeading}
            </Typography>
            <Typography variant="body2" color="text.disabled">
              {props.emptyDescription}
            </Typography>
          </Box>
        }
      >
        <Paper sx={{ flexGrow: 1, overflow: "auto" }}>
          {props.children}
        </Paper>
      </Show>
    </Box>
  );
}
