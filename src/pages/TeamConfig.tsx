import { Box, Card, CardContent, IconButton, Modal, Stack } from "@suid/material";
import { useKings } from "../kings";
import ConfigActions from "../components/ConfigActions";
import ConfigClubs from "../components/ConfigClubs";
import { createSignal, Show } from "solid-js";
import { Construction, Settings } from "@suid/icons-material";
import ButtonCard from "../ui/ButtonCard";

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
  const [ { loadingConfig, league }, { loadConfig }] = useKings()
  const load = () => {
    loadConfig()
  }
  return (
    <Stack
      displayRaw="flex"
      flexDirection="column"
      alignItems="center"
      gap="1em"
      sx={{
        mx: {
          xs: 0,
          sm: 5,
        },
        mt: {
          xs: 0,
          sm: 5,
        }
      }}
    >
      <ButtonCard
        label={`Load ${league()} config`}
        description="Or click the settings icon in the top right to load custom config"
        icon={<Construction fontSize="large" />}
        onClick={load}
        disabled={loadingConfig()}
      />
    </Stack>
  )
}
