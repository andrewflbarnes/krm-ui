import { Box, Card, CardContent, IconButton, Modal, Typography } from "@suid/material";
import { useKings } from "../kings";
import ConfigActions from "../components/ConfigActions";
import ConfigClubs from "../components/ConfigClubs";
import { createSignal, Show } from "solid-js";
import { Construction, Settings } from "@suid/icons-material";

export default function TeamConfig() {
  const [k] = useKings()
  const [actionsOpen, setActionsOpen] = createSignal(false)
  const handleClose = () => {
    setActionsOpen(false)
  }

  const data = () => k.leagueConfig()
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "1em", height: "100%" }}>
      <IconButton sx={{ position: "absolute", right: 0 }} onClick={[setActionsOpen, true]}>
        <Settings fontSize="small" />
      </IconButton>
      <Modal onClose={handleClose} open={actionsOpen()} sx={{ display: "grid", height: "100%", width: "100%", placeItems: "center" }}>
        <Card sx={{ width: "50%" }}>
          <CardContent>
            <ConfigActions onClose={handleClose} />
          </CardContent>
        </Card>
      </Modal>
      <Show when={data()} fallback={<NoData />}>
        <ConfigClubs data={data()} />
      </Show>
    </Box>
  )
}

function NoData() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Typography variant="h2" textAlign="center">
        No config loaded
      </Typography>
      <Construction sx={{ fontSize: "20em" }} />
      <Typography variant="body1" textAlign="center">
        Click the settings icon in the top right to load config
      </Typography>
    </Box>
  )
}
