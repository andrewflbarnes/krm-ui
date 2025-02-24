import { Button, Card, CardContent, Modal } from "@suid/material";
import { For, createSignal } from "solid-js";

export default function DeveloperData() {
  const [data, setData] = createSignal<string | undefined>()
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
            <json-viewer style={{ width: "100%" }}>
              {JSON.stringify(data(), null, 2)}
            </json-viewer>
          </CardContent>
        </Card>
      </Modal>
      <div style={{ display: "flex", "flex-direction": "column", "align-items": "start" }}>
        kings-selected-league: {localStorage.getItem("kings-selected-league")}
        <For each={["western", "northern", "southern", "midlands"]}>{league =>
          <Button onClick={[setData, JSON.parse(localStorage.getItem(`kings-${league}-config`)) || "N/A"]}>
            kings-{league}-config
          </Button>
        }</For>
        <Button onClick={[setData, JSON.parse(localStorage.getItem("kings-round-ids"))]}>
          kings-round-ids
        </Button>
        <For each={JSON.parse(localStorage.getItem("kings-round-ids"))}>
          {(id: string) => (
            <Button onClick={[setData, JSON.parse(localStorage.getItem(id))]}>
              {id}
            </Button>
          )}
        </For>
      </div>
    </>
  )
}
