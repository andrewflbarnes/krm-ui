import { Box, Button } from "@suid/material";
import { useKings } from "../kings";
import tracker from "../api/tracker"
import { Delete } from "@suid/icons-material";

export default function ConfigActions() {
  const [k, { setLeagueConfig }] = useKings()
  const hasConfig = () => !!k.leagueConfig()
  const canUpsert = () => k.config().tracker

  const upsertConfig = () => {
    const url = k.config().tracker
    if (!url) {
      // todo
      return
    }
    tracker.getLeagueData(url)
      .then(data => {
        setLeagueConfig(data)
      })
      .catch(e => {
        // TODO
      })
  }

  const saveConfig = () => {

  }
  return (
    <Box sx={{ display: "flex", gap: "1em", justifyContent: "space-around", width: "100%" }}>
      <Box sx={{ flexBasis: 1 }} >
        <Button variant="outlined" disabled={!hasConfig()} onClick={saveConfig}>
          Save config
        </Button>
      </Box>
      <Box sx={{ flexBasis: 1 }} >
        <Button variant="outlined" disabled={!canUpsert()} onClick={upsertConfig}>
          {hasConfig() ? "Update" : "Load"} config
        </Button>
      </Box>
      <Box sx={{ flexBasis: 1 }} >
        <Button disabled={!hasConfig()} color="error" variant="outlined" startIcon={<Delete />}>
          Clear config
        </Button>
      </Box>
    </Box>
  )
}
