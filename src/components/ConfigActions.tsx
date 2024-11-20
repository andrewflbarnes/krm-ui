import { Alert, Box, Button, TextField } from "@suid/material";
import { useKings } from "../kings";
import tracker from "../api/tracker"
import { Delete } from "@suid/icons-material";
import toast from "solid-toast";

export default function ConfigActions() {
  const [k, { setLeagueConfig }] = useKings()
  const hasConfig = () => !!k.leagueConfig()
  const canUpsert = () => k.config().tracker

  const upsertConfig = () => {
    const url = k.config().tracker
    if (!url) {
      // todo inform user
      return
    }
    toast.custom((t) => (
      <Alert severity="info" action={(
        <Button color="inherit" size="small" onClick={[toast.dismiss, t.id]}>
          DISMISS
        </Button>
      )}>
        Loading config for {k.league()} league...
      </Alert>
    ))
    tracker.getLeagueData(url)
      .then(data => {
        setLeagueConfig(data)
        toast.custom((t) => (
          <Alert severity="success" action={(
            <Button color="inherit" size="small" onClick={[toast.dismiss, t.id]}>
              DISMISS
            </Button>
          )}>
            Config loaded for {k.league()} league
          </Alert>
        ))
      })
      .catch(e => {
        toast.error(e.message)
      })
  }

  const clearConfig = () => {
    alert("todo")
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
      <Button variant="outlined" disabled={!canUpsert()} onClick={upsertConfig}>
        {hasConfig() ? "Update" : "Load"} config
      </Button>
      <Button disabled={!hasConfig()} color="error" variant="outlined" startIcon={<Delete />} onClick={clearConfig}>
        Clear config
      </Button>
      <TextField defaultValue={"Tracking URL not configured"} disabled={true} error={!k.config().tracker} multiline label="Tracking URL" value={k.config().tracker} />
      <Button variant="outlined" onClick={() => alert("TODO")}>
        Update Tracking URL
      </Button>
    </Box>
  )
}
