import { Box, Button, Card, CardActions, CardContent } from "@suid/material";
import { useKings } from "../kings";
import ConfigActions from "../components/ConfigActions";
import ConfigClubs from "../components/ConfigClubs";
import { Show } from "solid-js";

export default function LeagueManager() {
  const [k] = useKings()

  const data = () => k.leagueConfig()
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "1em", height: "100%" }}>
      <Card sx={{ flexGrow: 1 }}>
        <CardContent>
          <Show when={data()}>
            <ConfigClubs data={data()} />
          </Show>
        </CardContent>
      </Card>
      <Card>
        <CardActions>
          <ConfigActions />
        </CardActions>
      </Card>
    </Box>
  )
}

