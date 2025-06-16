import { Box, Button, Card, CardContent, IconButton, Modal, Stack, Typography } from "@suid/material";
import { useKings } from "../kings";
import ConfigActions from "../components/ConfigActions";
import ConfigClubs from "../components/ConfigClubs";
import { createSignal, Show } from "solid-js";
import { Construction, Settings } from "@suid/icons-material";
import notification from "../hooks/notification";
import tracker from "../api/tracker";

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
  const [k, { setLeagueConfig }] = useKings()
  const load = () => {
    const league = k.league()
    notification.info(`Loading config for ${league} league...`)
    tracker.getLeagueData(league)
      .then(data => {
        setLeagueConfig(data)
        notification.success(`Config loaded for ${league} league`)
      })
      .catch(e => {
        notification.error(e.message)
      })
  }
  return (
    <Stack
      displayRaw="flex"
      flexDirection="column"
      alignItems="center"
      gap="1em"
    >
      <Button
        variant="outlined"
        onClick={load}
        startIcon={<Construction />}
      >
        Load Config
      </Button>
      <Typography variant="body1" textAlign="center">
        Or click the settings icon in the top right to load custom config
      </Typography>
    </Stack>
  )
}
