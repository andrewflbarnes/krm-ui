import { Box, ToggleButton, ToggleButtonGroup } from "@suid/material";
import { createSignal, For, lazy, Match, Switch } from "solid-js";
import { Division, Round, RoundConfig, RoundSeeding } from "../kings";
const ManageNewSeeding = lazy(() => import("./ManageNewSeeding"));
const ManageNewShuffle = lazy(() => import("./ManageNewShuffle"));

type ManageNewConfirmProps = {
  seeds: RoundSeeding;
  round: Round;
  originalConfig: {
    [d in Division]: RoundConfig;
  };
  onShuffle: (seeds: RoundSeeding) => void;
  inGroupSwaps?: boolean;
}

export default function ManageNewConfirm(props: ManageNewConfirmProps) {
  const [view, setView] = createSignal<"seeding" | "groups">("groups")
  return (
    <Box sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 2,
      width: 1,
      height: 1
    }}>
      <ToggleButtonGroup
        value={view()}
        exclusive
        color="primary"
        onChange={(_, value) => value && setView(value)}
        sx={{ mt: 0.5 }}
      >
        <For each={["groups", "seeding"]}>
          {(r) => (
            <ToggleButton
              value={r}
              sx={{ width: "10em" }}
            >
              {r.capitalize()}
            </ToggleButton>
          )}
        </For>
      </ToggleButtonGroup>
      <Switch fallback={<div>Invalid view {view()}</div>}>
        <Match when={view() === "groups"}>
          <ManageNewShuffle
            round={props.round}
            originalConfig={props.originalConfig}
            seeding={props.seeds}
            onShuffle={props.onShuffle}
            inGroupSwaps={props.inGroupSwaps}
          />
        </Match>
        <Match when={view() === "seeding"}>
          <ManageNewSeeding seeds={props.seeds} />
        </Match>
      </Switch>
    </Box>
  )
}
