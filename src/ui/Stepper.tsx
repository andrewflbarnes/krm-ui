import { Box, Stack, Typography } from "@suid/material";
import { createMemo, For, Show } from "solid-js";

export type Step = {
  key: string;
  label: string;
  enabled?: boolean;
}

export default function Stepper(props: {
  steps: Step[];
  selected?: string;
  current?: string;
  onSelect: (s: string) => void;
}) {
  const keyedSteps = createMemo(() => Object.fromEntries(props.steps.map(s => [s.key, s])));
  const isAccessible = (s: string) => keyedSteps()[s]?.enabled ?? true;
  const isCurrent = (s: string) => s === props.current;
  const isSelected = (s: string) => s === props.selected;

  return (
    <Stack
      data-step-selected={props.selected}
      direction="row"
      alignItems="center"
      sx={{ flex: 1 }}
    >
      <For each={props.steps}>
        {({ key, label }, idx) => (
          <>
            <Show when={idx() > 0}>
              <Box sx={{
                flex: 1,
                height: "2px",
                bgcolor: isAccessible(key) ? "divider" : "action.disabledBackground",
              }} />
            </Show>
            <Box
              onClick={() => { if (isAccessible(key)) props.onSelect(key) }}
              sx={{
                px: 1.5,
                py: 0.5,
                borderRadius: "16px",
                cursor: isAccessible(key) ? "pointer" : "default",
                bgcolor: isCurrent(key) ? "primary.main" : "transparent",
                color: isCurrent(key)
                  ? "primary.contrastText"
                  : isAccessible(key)
                    ? "text.primary"
                    : "text.disabled",
                border: "2px solid",
                borderColor: isSelected(key)
                  ? (isCurrent(key) ? "primary.light" : "primary.main")
                  : "transparent",
                fontWeight: isSelected(key) ? 700 : 400,
                fontSize: "0.875rem",
                lineHeight: 1.5,
                whiteSpace: "nowrap",
                userSelect: "none",
                transition: "background-color 0.15s, color 0.15s",
                "&:hover": isAccessible(key) ? {
                  bgcolor: isCurrent(key) ? "primary.dark" : "action.hover",
                } : {},
              }}
            >
              <Typography variant="body2">
                {label}
              </Typography>
            </Box>
          </>
        )}
      </For>
    </Stack>
  );
}
