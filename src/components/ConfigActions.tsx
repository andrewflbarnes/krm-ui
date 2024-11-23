import { Box, Button, Stack, TextField } from "@suid/material";
import { useKings } from "../kings";
import tracker from "../api/tracker"
import notification from "../hooks/notification";
import ModalConfirmAction from "./ModalConfirmAction";
import { createSignal, Show } from "solid-js";

export default function ConfigActions() {
  const [k, { setLeagueConfig }] = useKings()
  const hasConfig = () => !!k.leagueConfig()
  const canUpsert = () => k.config().tracker

  const [confirmingUpsert, setConfirmingUpsert] = createSignal(false)
  const handleCancelUpsert = () => setConfirmingUpsert(false)
  const upsertConfig = () => {
    setConfirmingUpsert(false)
    const url = k.config().tracker
    if (!url) {
      notification.error("Tracing URL not set")
      return
    }
    notification.info(`Loading config for ${k.league()} league...`)
    tracker.getLeagueData(url)
      .then(data => {
        setLeagueConfig(data)
        notification.success(`Config loaded for ${k.league()} league`)
      })
      .catch(e => {
        notification.error(e.message)
      })
  }

  const [mutTracker, setMutTracker] = createSignal(k.config().tracker)
  const [updatingTracker, setUpdatingTracker] = createSignal(false)
  const [confirmingUpdateTracker, setConfirmingUpdateTracker] = createSignal(false)
  const handleCancelUpdateTracker = () => {
    setMutTracker(k.config().tracker)
    setUpdatingTracker(false)
  }
  const updateTracker = () => {
    alert("TODO update to " + mutTracker())
    notification.success("Tracker URL updated")
    setMutTracker(k.config().tracker)
    setConfirmingUpdateTracker(false)
    setUpdatingTracker(false)
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "1em",
        justifyContent: "space-around",
        width: "100%",
        "& > *": {
          width: "100%"
        }
      }}
    >
      <Button variant="outlined" disabled={!canUpsert()} onClick={[setConfirmingUpsert, true]}>
        {hasConfig() ? "Update" : "Load"} config
      </Button>
      <ModalConfirmAction open={confirmingUpsert()} onDiscard={handleCancelUpsert} onConfirm={upsertConfig}>
        This will overwrite all existing data, are you sure?
      </ModalConfirmAction>
      <Stack flexDirection="row" gap="1em" sx={{ "& > *":{ flexBasis: 0, flexGrow: 1 } }}>
        <Show when={!updatingTracker()}>
          <Button variant="outlined" onClick={[setUpdatingTracker, true]}>
            Update Tracking URL
          </Button>
        </Show>
        <Show when={updatingTracker()}>
          <Button color="success" variant="outlined" onClick={[setConfirmingUpdateTracker, true]}>
            Confirm
          </Button>
          <Button color="error" variant="outlined" onClick={handleCancelUpdateTracker}>
            Cancel
          </Button>
        </Show>
      </Stack>
      <TextField placeholder={"Tracking URL not configured"} onChange={e => setMutTracker(e.target.value)} disabled={!updatingTracker()} error={!mutTracker()} multiline label="Tracking URL" value={mutTracker()} />
      <ModalConfirmAction open={confirmingUpdateTracker()} onDiscard={() => setConfirmingUpdateTracker(false)} onConfirm={updateTracker}>
        This will overwrite the existing tracker URL, are you sure?
      </ModalConfirmAction>
    </Box>
  )
}
