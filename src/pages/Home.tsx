import { Box, Button, Stack, Typography } from "@suid/material";
import { useKings } from "../kings";
import krm from "../api/krm";
import { useNavigate } from "@solidjs/router";
import { createSignal, Show } from "solid-js";
import ModalConfirmAction from "../ui/ModalConfirmAction";
import notification from "../hooks/notification"

export default function Home() {
  const [k] = useKings()
  const hasRounds = () => {
    try {
      return krm.getRounds(k.league())
        .filter(({  status }) => status != 'complete' && status != 'abandoned' )
        .length > 0
    } catch (e) {
      console.warn("Failed to get rounds for league", k.league(), e)
    }
    return false
  }
  const nav = useNavigate()
  const [reset, setReset] = createSignal(false)
  return (
    <div style={{
      display: "grid",
      height: "100%",
      width: "100%",
      "place-items": "center",
    }}>
      <ModalConfirmAction
        open={reset()}
        onDiscard={() => setReset(false)}
        onConfirm={() => {
          setReset(false)
          krm.clearLocalData()
          notification.info("Cleared cached data")
        }}
      >
        Are you sure? This will clear all locally cached data.
      </ModalConfirmAction>
      <Box>
        <Typography align="center" variant="h1"><strong>[ K ]</strong></Typography>
        <Typography align="center">Welcome to the Kings Race Manager</Typography>
        <Stack gap="1em" marginTop="1em">
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => nav("/manage/new")}
          >
            Create a race
          </Button>
          <Show when={hasRounds()}>
            <Button
              variant="outlined"
              color="inherit"
              style={{ visibility: `${hasRounds() ? "visible" : "hidden"}` }}
              onClick={() => nav("/manage/continue")}
            >
              Continue a race
            </Button>
          </Show>
          <Button
            variant="outlined"
            color="inherit"
            onClick={[setReset, true]}
          >
            Reset data
          </Button>
          <Show when={!hasRounds()}>
            <Button style={{ visibility: 'hidden' }}>
              INVISIBLE BALANCE
            </Button>
          </Show>
        </Stack>
      </Box>
    </div >
  )
}
