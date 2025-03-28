import { Delete, InfoOutlined } from "@suid/icons-material"
import { Button, IconButton, Paper, TextField, Typography } from "@suid/material"
import { createMemo, createSignal, For, Show } from "solid-js"
import { SeedInfo, useCreateRoundConfig } from "../hooks/create-config"
import { MiniLeagueTemplate, miniLeagueTemplates, RaceStage } from "../kings"
import KingsModal from "../ui/KingsModal"
import ModalConfirmAction from "../ui/ModalConfirmAction"
import Selector from "../ui/Selector"
import ManageConfigMiniLeague from "./ManageConfigMiniLeague"

export default function CustomRoundStage(props: {
  stage: RaceStage;
}) {
  // Allows us to better track added and, more importantly, removed minileagues
  const [infoTemplate, setInfoTemplate] = createSignal<MiniLeagueTemplate>(null)
  const [selectMinileague, setSelectMinileague] = createSignal(false)
  const [remove, setRemove] = createSignal<string>()
  const {
    config,
    selectTeam,
    removeMiniLeague,
    addMiniLeague,
    changeName,
    allSeeds,
    selectableSeeds,
  } = useCreateRoundConfig()

  const mls = () => config[props.stage] ?? {}
  const allSeedsMap = createMemo(() => allSeeds(props.stage).reduce((acc, s) => {
    acc[s.id] = s
    return acc
  }, {} as Record<string, SeedInfo>))

  const handleRemoveMiniLeague = () => {
    removeMiniLeague(props.stage, remove())
    setRemove()
  }

  let ref!: HTMLDivElement
  return (
    <div ref={ref}>
      <MinileagueInfoModal
        open={!!infoTemplate()}
        onClose={() => setInfoTemplate(null)}
        template={infoTemplate()}
        container={ref}
      />
      <MinileagueSelectModal
        open={selectMinileague()}
        onClose={() => setSelectMinileague(false)}
        onSelect={(ml, teams) => addMiniLeague(props.stage, ml, teams)}
        container={ref}
      />
      <MinileagueDeleteModal
        open={!!remove()}
        onClose={() => setRemove()}
        onDelete={handleRemoveMiniLeague}
        container={ref}
      />
      <Button fullWidth onClick={() => setSelectMinileague(true)}>Add minileague</Button>
      <div style={{ display: "flex", "flex-direction": "column", gap: "1em", "margin-top": "1em" }}>
        <For each={Object.entries(mls())}>{([k, ml]) => {
          const defaultName = ml.name
          return (
            <Paper elevation={5} style={{ padding: "1em" }}>
              <div style={{ display: "flex", "flex-direction": "column", "gap": "1em" }}>
                <div style={{ display: "flex", "align-items": "center" }}>
                  <TextField
                    label="Group"
                    size="small"
                    defaultValue={defaultName}
                    onChange={e => changeName(props.stage, k, e.target.value)}
                  />
                  <div style={{ "margin-left": "auto" }}>
                    <IconButton onClick={[setRemove, k]}>
                      <Delete fontSize="small" color="error" />
                    </IconButton>
                    <IconButton onClick={[setInfoTemplate, miniLeagueTemplates[ml.template]]}>
                      <InfoOutlined fontSize="small" />
                    </IconButton>
                  </div>
                </div>
                <For each={ml.seeds}>{(seed, i) => {
                  const thisSelectable = createMemo(() => {
                    const ts = selectableSeeds(props.stage, seed).map(s => ({ label: s.name, value: s.id }))
                    if (seed) {
                      ts.splice(1, 0, { label: "-", value: null })
                    } else {
                      ts.unshift({ label: "-", value: null })
                    }
                    return ts
                  })
                  const handleSelected = (v: string) => {
                    selectTeam(props.stage, k, i(), allSeedsMap()[v])
                  }
                  return (
                    <Selector
                      type="input"
                      current={seed?.name ?? "-"}
                      options={thisSelectable()}
                      containerProps={{
                        style: { "min-width": "10em" },
                      }}
                      small
                      onClose={(v) => handleSelected(v)}
                    />
                  )
                }}</For>
              </div>
            </Paper>
          )
        }}</For>
      </div>
    </div>
  )
}

function MinileagueDeleteModal(props: {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  container?: Element;
}) {
  return (
    <ModalConfirmAction
      open={props.open}
      onDiscard={props.onClose}
      onConfirm={props.onDelete}
      container={props.container}
    >
      Are you sure you want to delete this minileague?
    </ModalConfirmAction>
  )
}

function MinileagueSelectModal(props: {
  open: boolean;
  onClose: () => void;
  onSelect: (name: string, teams: number) => void;
  container?: Element;
}) {
  return (
    <KingsModal
      open={props.open}
      onClose={props.onClose}
      container={props.container}
    >
      <>
        <Typography variant="h2">Select minileague template</Typography>
        <For each={Object.entries(miniLeagueTemplates)}>{([name, template]) => (
          <Button onClick={() => {
            props.onSelect(name, template.teams);
            props.onClose();
          }}>
            {name}
          </Button>
        )}</For>
      </>
    </KingsModal >
  )
}

function MinileagueInfoModal(props: {
  open: boolean;
  onClose: () => void;
  template?: MiniLeagueTemplate;
  container?: Element;
}) {
  return (
    <KingsModal
      open={props.open}
      onClose={props.onClose}
      container={props.container}
    >
      <Show when={props.template} fallback={"no template provided :("}>
        <ManageConfigMiniLeague name="mini4" template={props.template} />
      </Show>
    </KingsModal >
  )
}
