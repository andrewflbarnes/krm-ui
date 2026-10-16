import { Button, Card, CardContent, Modal } from "@suid/material";
import { For, createSignal, createEffect } from "solid-js";
import { useKings } from "../hooks/kings";
import '@alenaksu/json-viewer';
import cacher from "../kings/engine/cacher";
import { leagues } from "../kings";

export default function DeveloperData() {
  const [data, setData] = createSignal<string | undefined>()
  const [{ league }] = useKings()
  createEffect(() => {
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setData(undefined);
      }
    }
    window.addEventListener("keydown", close);
    return () => {
      window.removeEventListener("keydown", close);
    }
  })
  return (
    <>
      <Modal
        open={!!data()}
        sx={{ display: "grid", height: "100%", width: "100%", placeItems: "center" }}
        onClose={() => setData(undefined)}
      >
        <Card sx={{
          height: "80%",
          width: "80%",
          maxWidth: "1024px",
          overflow: "scroll",
        }}>
          <CardContent sx={{ display: "grid", placeItems: "center" }}>
            <Button onClick={() => navigator.clipboard.writeText(JSON.stringify(data(), null, 2))}>
              Copy to clipboard
            </Button>
            <json-viewer style={{ width: "100%" }}>
              {JSON.stringify(data(), null, 2)}
            </json-viewer>
          </CardContent>
        </Card>
      </Modal>
      <div style={{ display: "flex", "flex-direction": "column", "align-items": "start" }}>
        kings-selected-league: {league()}
        <For each={leagues}>{league =>
          <Button onClick={[setData, cacher.getLeagueConfig(league) || "N/A"]}>
            kings-{league}-config
          </Button>
        }</For>
        <Button onClick={[setData, cacher.getRoundsIds()]}>
          kings-round-ids
        </Button>
        <For each={cacher.getRoundsIds()}>
          {(id: string) => (
            <Button onClick={[setData, cacher.getRound(id)]}>
              {id}
            </Button>
          )}
        </For>
      </div>
    </>
  )
}
