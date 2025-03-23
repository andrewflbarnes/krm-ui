import { Delete, InfoOutlined } from "@suid/icons-material"
import { Button, IconButton, TextField, Typography } from "@suid/material"
import { batch, createEffect, createMemo, createSignal, For, Show } from "solid-js"
import { MiniLeagueTemplate, miniLeagueTemplates } from "../kings"
import { asPosition, minileagueRaces } from "../kings/round-utils"
import KingsModal from "../ui/KingsModal"
import ModalConfirmAction from "../ui/ModalConfirmAction"
import ManageConfigMiniLeague from "./ManageConfigMiniLeague"
import MiniLeague from "./MiniLeague"

export default function CustomRoundStage(props: {
  previous?: {
    group: string;
    teams: number;
  }[]
}) {
  const [key, setKey] = createSignal(0)
  const [mls, setMls] = createSignal<Record<string, MiniLeagueTemplate>>({})
  const [infoTemplate, setInfoTemplate] = createSignal<MiniLeagueTemplate>(null)
  const [selectMinileague, setSelectMinileague] = createSignal(false)
  const [allSeeds, setAllSeeds] = createSignal<string[]>([])
  const [selectedSeeds, setSelectedSeeds] = createSignal<Record<number, Record<number, string>>>({})

  const handleAddMiniLeague = (template: MiniLeagueTemplate) => {
    const k = key()
    setKey(k => k + 1)
    setMls({
      ...mls(),
      [k]: template
    })
  }

  createEffect(() => {
    if (!props.previous) {
      setAllSeeds(Array.from({ length: Object.values(mls()).reduce((acc, { teams }) => acc + teams, 0) }, (_, i) => `Seed ${i + 1}`))
    } else {
      setAllSeeds(props.previous.flatMap(
        ({ group, teams }) => Array.from({ length: teams }, (_, i) => `${asPosition(i + 1)} group ${group}`)))
    }
  })

  const handleTeamSelected = (team: string, teamIndex: number, mlKey: string) => {
    const seeds = selectedSeeds()
    const updatedSeeds = {
      ...seeds,
      [mlKey]: {
        ...seeds,
        [teamIndex]: team
      }
    }
    setSelectedSeeds(updatedSeeds)
  }

  const [removeMinileague, setRemoveMinileague] = createSignal<string>()
  const handleRemoveMiniLeague = (mlKey: string) => {
    batch(() => {
      const updatedSeeds = { ...selectedSeeds() }
      delete updatedSeeds[mlKey]
      setSelectedSeeds(updatedSeeds)
      const updatedMls = { ...mls() }
      delete updatedMls[mlKey]
      setMls(updatedMls)
      setRemoveMinileague()
    })
  }
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
        onSelect={handleAddMiniLeague}
      />
      <MinileagueDeleteModal
        open={!!removeMinileague()}
        onClose={() => setRemoveMinileague()}
        onDelete={() => handleRemoveMiniLeague(removeMinileague())}
      />
      <div style={{ display: "flex", "flex-direction": "column", gap: "1em" }}>
        <For each={Object.keys(mls())}>{k => {
          // The seeds are used synthetically to generate races purely for rendering
          // purposes - the minileague component won't actually tie the teams in the
          // races to the teams which are selected.
          const ml = mls()[k]
          const races = createMemo(() => minileagueRaces(ml, allSeeds(), 'A', "stage1", "mixed"))
          return (
            <div style={{ display: "flex", "flex-direction": "column", "gap": "1em" }}>
              <div style={{ display: "flex", "align-items": "center" }}>
                <TextField
                  label="Group"
                  size="small"
                />
                <div style={{ "margin-left": "auto" }}>
                  <IconButton onClick={[setRemoveMinileague, k]}>
                    <Delete fontSize="small" color="error" />
                  </IconButton>
                  <IconButton onClick={[setInfoTemplate, ml]}>
                    <InfoOutlined fontSize="small" />
                  </IconButton>
                </div>
              </div>
              <MiniLeague
                readonly
                noResults
                teams={allSeeds()}
                races={races()}
                selectable
                onTeamSelected={(t, ti) => handleTeamSelected(t, ti, k)}
              />
            </div>
          )
        }}</For>
      </div>
      <Button onClick={() => setSelectMinileague(true)}>Add minileague</Button>
    </div>
  )
}

function MinileagueDeleteModal(props: {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
}) {
  return (
    <ModalConfirmAction
      open={props.open}
      onDiscard={props.onClose}
      onConfirm={props.onDelete}
    >
      Are you sure you want to delete this minileague?
    </ModalConfirmAction>
  )
}

function MinileagueSelectModal(props: {
  open: boolean;
  onClose: () => void;
  onSelect: (template: MiniLeagueTemplate) => void;
}) {
  return (
    <KingsModal
      open={props.open}
      onClose={props.onClose}
    >
      <>
        <Typography variant="h2">Select minileague template</Typography>
        <For each={Object.entries(miniLeagueTemplates)}>{([name, ml]) => (
          <Button onClick={() => { props.onSelect(ml); props.onClose() }}>{name}</Button>
        )}</For>
      </>
    </KingsModal >
  )
}

function MinileagueInfoModal(props: {
  open: boolean;
  onClose: () => void;
  template?: MiniLeagueTemplate;
}) {
  return (
    <KingsModal
      open={props.open}
      onClose={props.onClose}
    >
      <Show when={props.template} fallback={"no template provided :("}>
        <ManageConfigMiniLeague name="mini4" template={props.template} />
      </Show>
    </KingsModal >
  )
}
