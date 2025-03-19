import { Box, Button, TextField } from "@suid/material";
import { useKings } from "../kings";
import tracker from "../api/tracker"
import notification from "../hooks/notification";
import ModalConfirmAction from "../ui/ModalConfirmAction";
import { createSignal } from "solid-js";

export default function ConfigActions(props: {
  onClose(): void;
}) {
  const [k, { setLeagueConfig }] = useKings()
  const hasConfig = () => !!k.leagueConfig()
  const [confirmingUpsert, setConfirmingUpsert] = createSignal(false)
  const handleCancelUpsert = () => setConfirmingUpsert(false)
  const setConfirmUpsert = (v: boolean) => {
    setIsCustom(v)
    setConfirmingUpsert(true)
  }

  const [mutTracker, setMutTracker] = createSignal("")
  const [isCustom, setIsCustom] = createSignal(false)
  const validMutTracker = () => {
    try {
      new URL(mutTracker())
      return true
    } catch {
      return false
    }
  }

  const upsertConfig = () => {
    setConfirmingUpsert(false)
    props.onClose()
    notification.info(`Loading config for ${k.league()} league...`)
    tracker.getLeagueData(k.league(), isCustom() ? mutTracker() : null)
      .then(data => {
        setLeagueConfig(data)
        notification.success(`Config loaded for ${k.league()} league`)
      })
      .catch(e => {
        notification.error(e.message)
      })
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
      <ModalConfirmAction open={confirmingUpsert()} onDiscard={handleCancelUpsert} onConfirm={upsertConfig}>
        This will overwrite all existing data, are you sure?
      </ModalConfirmAction>
      <Button variant="outlined" onClick={[setConfirmUpsert, false]}>
        {hasConfig() ? "Update" : "Load"} config
      </Button>
      <Button variant="outlined" onClick={[setConfirmUpsert, true]} disabled={!validMutTracker()}>
        {hasConfig() ? "Update" : "Load"} config from custom URL
      </Button>
      <TextField
        placeholder={"https://kingsski.club/western"}
        onChange={e => setMutTracker(e.target.value)}
        error={!validMutTracker() && mutTracker().length > 0}
        multiline
        label="Tracking URL"
      />
    </Box>
  )
}
