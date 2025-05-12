import { Box, Button, Stack, Typography } from "@suid/material";
import { useKings } from "../kings";
import krm from "../api/krm";
import { useNavigate } from "@solidjs/router";
import { Show } from "solid-js";

export default function Home() {
  const [k] = useKings()
  const hasRounds = () => krm.getRounds(k.league()).length > 0
  const nav = useNavigate()
  return (
    <div style={{
      display: "grid",
      height: "100%",
      width: "100%",
      "place-items": "center",
    }}>
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
            onClick={() => krm.clearLocalData()}
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
