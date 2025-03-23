import { InfoOutlined } from "@suid/icons-material"
import { Button, Card, IconButton, Modal, TextField, Typography } from "@suid/material"
import { createSignal, For, Show } from "solid-js"
import { MiniLeagueTemplate, miniLeagueTemplates } from "../kings"
import { minileagueRaces } from "../kings/round-utils"
import { initTeams } from "../test"
import ManageConfigMiniLeague from "./ManageConfigMiniLeague"
import MiniLeague from "./MiniLeague"

export default function CustomRoundStage() {
  const [mls, setMls] = createSignal<MiniLeagueTemplate[]>([])
  const [infoTemplate, setInfoTemplate] = createSignal<MiniLeagueTemplate>(null)
  const [selectMinileague, setSelectMinileague] = createSignal(false)

  return (
    <div>
      <MinileagueInfoModal
        open={!!infoTemplate()}
        onClose={() => setInfoTemplate(null)}
        template={infoTemplate()}
      />
      <MinileagueSelectModal
        open={selectMinileague()}
        onClose={() => setSelectMinileague(false)}
        onSelect={(ml) => setMls([...mls(), ml])}
      />
      <For each={mls()}>{ml => {
        const teams = initTeams(ml)
        const races = minileagueRaces(ml, teams, 'A', "stage1", "mixed")
        return (
          <div style={{ display: "flex", "flex-direction": "column", "gap": "1em" }}>
            <div style={{ display: "flex", "align-items": "center" }}>
              <TextField
                label="Group"
                size="small"
              />
              <Typography style={{ "margin-left": "auto" }}>
                <IconButton onClick={[setInfoTemplate, ml]}>
                  <InfoOutlined fontSize="small" />
                </IconButton>
                mini4
              </Typography>
            </div>
            <MiniLeague
              readonly
              noResults
              teams={teams}
              races={races}
              onResultChange={() => { }}
            />
          </div>
        )
      }}</For>
      <Button onClick={() => setSelectMinileague(true)}>Add minileague</Button>
    </div>
  )
}

function MinileagueSelectModal(props: {
  open: boolean;
  onClose: () => void;
  onSelect: (template: MiniLeagueTemplate) => void;
}) {
  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
    >
      <Card sx={{ width: "80vw", "margin": "auto" }}>
        <Typography variant="h2">Select minileague template</Typography>
        <For each={Object.entries(miniLeagueTemplates)}>{([name, ml]) => (
          <Button onClick={() => { props.onSelect(ml); props.onClose() }}>{name}</Button>
        )}</For>
      </Card>
    </Modal >
  )
}

function MinileagueInfoModal(props: {
  open: boolean;
  onClose: () => void;
  template?: MiniLeagueTemplate;
}) {
  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
    >
      <Card sx={{ width: "80vw", "margin": "auto" }}>
        <Show when={props.template} fallback={"no template provided :("}>
          <ManageConfigMiniLeague name="mini4" template={props.template} />
        </Show>
      </Card>
    </Modal >
  )
}
