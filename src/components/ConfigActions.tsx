import { Box, Button, Stack, TextField } from "@suid/material";
import { useKings } from "../kings";
import tracker from "../api/tracker"
import notification from "../hooks/notification";
import ModalConfirmAction from "../ui/ModalConfirmAction";
import { createSignal, Show } from "solid-js";

export default function ConfigActions() {
  const [k, { setLeagueConfig }] = useKings()
  const hasConfig = () => !!k.leagueConfig()
  const [confirmingUpsert, setConfirmingUpsert] = createSignal(false)
  const handleCancelUpsert = () => setConfirmingUpsert(false)
  const upsertConfig = () => {
    setConfirmingUpsert(false)
    notification.info(`Loading config for ${k.league()} league...`)
    tracker.getLeagueData(k.league())
      .then(data => {
        setLeagueConfig(data)
        notification.success(`Config loaded for ${k.league()} league`)
      })
      .catch(e => {
        notification.error(e.message)
      })
  }

  const dummyTracker = "https://example.com"
  const [mutTracker, setMutTracker] = createSignal(dummyTracker)
  const [updatingTracker, setUpdatingTracker] = createSignal(false)
  const [confirmingUpdateTracker, setConfirmingUpdateTracker] = createSignal(false)
  const handleCancelUpdateTracker = () => {
    setMutTracker(dummyTracker)
    setUpdatingTracker(false)
  }
  const updateTracker = () => {
    alert("Unimplemented update to " + mutTracker())
    notification.success("Tracker URL updated")
    setMutTracker(dummyTracker)
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
      <Button variant="outlined" onClick={[setConfirmingUpsert, true]}>
        {hasConfig() ? "Update" : "Load"} config
      </Button>
      <ModalConfirmAction open={confirmingUpsert()} onDiscard={handleCancelUpsert} onConfirm={upsertConfig}>
        This will overwrite all existing data, are you sure?
      </ModalConfirmAction>
      <Stack flexDirection="row" gap="1em" sx={{ "& > *":{ flexBasis: 0, flexGrow: 1 } }}>
        <Show when={!updatingTracker()}>
          <Button variant="outlined" onClick={[setUpdatingTracker, true]}>
            Custom Tracking URL
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
