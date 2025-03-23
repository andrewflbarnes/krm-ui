import { Delete, InfoOutlined } from "@suid/icons-material"
import { Button, IconButton, TextField, Typography } from "@suid/material"
import { batch, createEffect, createMemo, createSignal, For, Show } from "solid-js"
import { MiniLeagueSeed, MiniLeagueTemplate, miniLeagueTemplates } from "../kings"
import { asPosition, minileagueRaces } from "../kings/round-utils"
import KingsModal from "../ui/KingsModal"
import ModalConfirmAction from "../ui/ModalConfirmAction"
import ManageConfigMiniLeague from "./ManageConfigMiniLeague"
import MiniLeague from "./MiniLeague"

type SeedInfo = {
  name: string;
  seed: MiniLeagueSeed;
}

type ConfigUpdateHandler = (config: Record<string, {
  template: MiniLeagueTemplate;
  name: string | undefined;
  seeds: (MiniLeagueSeed | undefined)[]
}>) => void

export default function CustomRoundStage(props: {
  previous?: {
    group: string;
    teams: number;
  }[],
  onConfigUpdated: ConfigUpdateHandler;
}) {
  // Allows us to better track added and, more importantly, removed minileagues
  const [key, setKey] = createSignal(0)
  const [infoTemplate, setInfoTemplate] = createSignal<MiniLeagueTemplate>(null)
  const [selectMinileague, setSelectMinileague] = createSignal(false)
  const [allSeeds, setAllSeeds] = createSignal<SeedInfo[]>([])
  const allSeedNames = createMemo(() => allSeeds().map(s => s.name))
  // The below signals are used to hold the config state
  const [mls, setMls] = createSignal<{ [mlkey: string]: MiniLeagueTemplate }>({})
  const [mlNames, setMlNames] = createSignal<{ [mlkey: string]: string }>({})
  const [selectedSeeds, setSelectedSeeds] = createSignal<{ [mlkey: string]: SeedInfo[] }>({})
  // utility for filtering out the seeds which have been selected
  const selectableSeeds = createMemo(() => {
    const selected = Object.values(selectedSeeds()).flatMap(s => s)
    return allSeeds()
      .map(({ name }) => name)
      .filter(name => !selected.some(ss => ss?.name === name))
  })

  createEffect(() => {
    if (!props.previous) {
      const updatedSeeds = Array.from({ length: Object.values(mls()).reduce((acc, { teams }) => acc + teams, 0) }, (_, i) => ({
        name: `Seed ${i + 1}`,
        seed: {
          group: "Seeds",
          position: i,
        }
      }))
      setAllSeeds(updatedSeeds)
    } else {
      const updatedSeeds = props.previous.flatMap(({ group, teams }) => Array.from({ length: teams }, (_, i) => ({
        name: `${asPosition(i + 1)} group ${group}`,
        seed: {
          group,
          position: i,
        }
      })))
      setAllSeeds(updatedSeeds)
    }
  })

  const handleConfigUpdated = (config: Record<string, MiniLeagueTemplate>, names: Record<string, string>, seeds: Record<string, SeedInfo[]>) => {
    props.onConfigUpdated(Object.entries(config).reduce((acc, [k, template]) => {
      acc[k] = {
        template,
        seeds: seeds[k].map(s => s?.seed),
        name: names[k],
      }
      return acc
    }, {}))
  }

  const handleAddMiniLeague = (template: MiniLeagueTemplate) => {
    const k = key()
    const updatedMls = {
      ...mls(),
      [k]: template
    }
    const updatedSeeds = {
      ...selectedSeeds(),
      [k]: Array.from(Array(template.teams)),
    }
    batch(() => {
      setKey(k => k + 1)
      setMls(updatedMls)
      setSelectedSeeds(updatedSeeds)
      handleConfigUpdated(updatedMls, mlNames(), updatedSeeds)
    })
  }

  const handleTeamSelected = (team: string, teamIndex: number, mlKey: string) => {
    const seed = allSeeds().find(s => s.name === team)
    const updatedSeeds = {
      ...selectedSeeds(),
    }
    updatedSeeds[mlKey][teamIndex] = seed
    const names = mlNames()
    batch(() => {
      setSelectedSeeds(updatedSeeds)
      handleConfigUpdated(mls(), names, updatedSeeds)
    })
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
      const updatedNames = { ...mlNames() }
      delete updatedNames[mlKey]
      setMlNames(updatedNames)
      setRemoveMinileague()
      handleConfigUpdated(updatedMls, updatedNames, updatedSeeds)
    })
  }

  const handleGroupNameChange = (name: string, k: string) => {
    const updatedNames = {
      ...mlNames(),
      [k]: name
    }
    batch(() => {
      setMlNames(updatedNames)
      handleConfigUpdated(mls(), updatedNames, selectedSeeds())
    })
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
        onSelect={handleAddMiniLeague}
        container={ref}
      />
      <MinileagueDeleteModal
        open={!!removeMinileague()}
        onClose={() => setRemoveMinileague()}
        onDelete={() => handleRemoveMiniLeague(removeMinileague())}
        container={ref}
      />
      <div style={{ display: "flex", "flex-direction": "column", gap: "1em" }}>
        <For each={Object.keys(mls())}>{k => {
          // The seeds are used synthetically to generate races purely for rendering
          // purposes - the minileague component won't actually tie the teams in the
          // races to the teams which are selected.
          const ml = mls()[k]
          const races = createMemo(() => minileagueRaces(ml, allSeedNames(), 'A', "stage1", "mixed"))
          return (
            <div style={{ display: "flex", "flex-direction": "column", "gap": "1em" }}>
              <div style={{ display: "flex", "align-items": "center" }}>
                <TextField
                  label="Group"
                  size="small"
                  onChange={e => handleGroupNameChange(e.target.value, k)}
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
                teams={allSeedNames()}
                races={races()}
                selectable={selectableSeeds()}
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
  onSelect: (template: MiniLeagueTemplate) => void;
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
