import { Box, Button, Divider, Stack, Typography } from "@suid/material";
import { useKings } from "../kings";
import krm from "../api/krm";
import { useNavigate } from "@solidjs/router";
import { createEffect, createSignal, on, Show } from "solid-js";
import ModalConfirmAction from "../ui/ModalConfirmAction";
import notification from "../hooks/notification"

function getRounds(league: string) {
  try {
    return krm.getRounds(league)
  } catch (e) {
    console.warn("Failed to get rounds for league", league, e)
  }
  return []
}

export default function Home() {
  const [k, { clearLocalData }] = useKings()
  const [rounds, setRounds] = createSignal(getRounds(k.league()))
  createEffect(on(k.league, () => {
    setRounds(getRounds(k.league()))
  }, { defer: true }))
  const hasRounds = () => {
    try {
      return rounds()
        .filter(({ status }) =>  status != 'abandoned')
        .length > 0
    } catch (e) {
      console.warn("Failed to get rounds for league", k.league(), e)
    }
    return false
  }
  const resetRounds = () => {
    setReset(false)
    clearLocalData()
    setRounds(getRounds(k.league()))
    notification.info("Cleared cached data")
  }
  const nav = useNavigate()
  const [reset, setReset] = createSignal(false)
  return (
    <Box sx={{
      display: "grid",
      height: "100%",
      width: "100%",
      placeItems: "center",
    }}>
      <ModalConfirmAction
        open={reset()}
        onDiscard={() => setReset(false)}
        onConfirm={resetRounds}
      >
        Are you sure? This will clear all locally cached data.
      </ModalConfirmAction>
      <Box>
        <Typography align="center" variant="h1"><strong>[ K ]</strong></Typography>
        <Typography align="center" color="text.secondary">Welcome to the Kings Race Manager</Typography>
        <Divider sx={{ my: 2 }} />
        <Stack gap={1.5}>
          <Button
            variant="contained"
            onClick={() => nav("/races/new")}
          >
            Start a new race
          </Button>
          <Show when={hasRounds()}>
            <Button
              variant="outlined"
              style={{ visibility: `${hasRounds() ? "visible" : "hidden"}` }}
              onClick={() => nav("/races")}
            >
              View/Continue a race
            </Button>
          </Show>
          <Button
            variant="outlined"
            color="error"
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
    </Box>
  )
}
