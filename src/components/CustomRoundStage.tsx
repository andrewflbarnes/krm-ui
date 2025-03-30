import { Delete, InfoOutlined } from "@suid/icons-material"
import { Button, IconButton, Paper, TextField, Typography } from "@suid/material"
import { createMemo, createSignal, FlowProps, For, JSX, Show  } from "solid-js"
import { ChangeEventHandler } from '@suid/types'
import { ConfigMinileague, ConfigState, SeedInfo, useCreateRoundConfig } from "../hooks/create-config"
import { MiniLeagueTemplate, miniLeagueTemplates } from "../kings"
import KingsModal from "../ui/KingsModal"
import ModalConfirmAction from "../ui/ModalConfirmAction"
import Selector from "../ui/Selector"
import ManageConfigMiniLeague from "./ManageConfigMiniLeague"
import { Dynamic } from "solid-js/web"

export default function CustomRoundStage(props: {
  stage: ConfigState;
}) {
  const {
    removeMiniLeague,
    addMiniLeague,
    allSeeds,
  } = useCreateRoundConfig()
  const allSeedsMap = createMemo(() => allSeeds(props.stage).reduce((acc, s) => {
    acc[s.id] = s
    return acc
  }, {} as Record<string, SeedInfo>))
  const [infoTemplate, setInfoTemplate] = createSignal<MiniLeagueTemplate>(null)
  const [selectMinileague, setSelectMinileague] = createSignal(false)
  const [remove, setRemove] = createSignal<string>()

  const handleRemoveMiniLeague = () => {
    removeMiniLeague(props.stage, remove())
    setRemove()
  }

  const component = (): (props: CustomMinileagueProps) => JSX.Element => (function() {
    switch (props.stage) {
      case "stage1":
      case "stage2":
        return CustomStageMinileague
      case "knockout":
        return CustomKnockoutMinileague
      case "results":
        return CustomKnockoutMinileague
      default:
        throw new Error(`Unknown stage ${props.stage}`)
    }
  })()

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
      <BaseCustomRoundStage stage={props.stage} addMiniLeague={() => setSelectMinileague(true)}>{(mlkey, ml) => {
        return (
          <Dynamic component={component()}
            stage={props.stage}
            allSeedsMap={allSeedsMap()}
            mlkey={mlkey}
            ml={ml}
            setRemove={() => setRemove(mlkey)}
            showInfo={() => {
              setInfoTemplate(miniLeagueTemplates[ml.template])
            }}
          />
        )
      }}</BaseCustomRoundStage>
    </div>
  )
}

type CustomMinileagueProps = {
  stage: ConfigState;
  mlkey: string;
  ml: ConfigMinileague;
  allSeedsMap: Record<string, SeedInfo>;
  setRemove: () => void;
  showInfo: () => void;
}

function CustomKnockoutMinileague(props: CustomMinileagueProps) {
  return (
    <div>
      <div>
        {props.ml.name}
      </div>
      <div style={{
        display: "grid",
        "grid-template-columns": "1fr auto 1fr",
        "grid-column-gap": "1em",
        "align-items": "center",
      }}>
        <div style={{ "margin-left": "auto" }}>
          <SeedSelector
            stage={props.stage}
            mlkey={props.mlkey}
            seed={props.ml.seeds[0]}
            i={0}
            allSeedsMap={props.allSeedsMap}
          />
        </div>
        <Typography>
          vs
        </Typography>
        <div style={{ "margin-right": "auto" }}>
          <SeedSelector
            stage={props.stage}
            mlkey={props.mlkey}
            seed={props.ml.seeds[1]}
            i={1}
            allSeedsMap={props.allSeedsMap}
          />
        </div>
      </div>
    </div>
  )
}

function BaseCustomRoundStage(props: FlowProps<{
  stage: ConfigState;
  addMiniLeague: () => void;
}, (mlkey: string, ml: ConfigMinileague) => JSX.Element>) {
  const {
    config,
  } = useCreateRoundConfig()

  const mls = (): Record<string, ConfigMinileague> => config[props.stage] ?? {}

  let ref!: HTMLDivElement
  return (
    <div ref={ref}>
      <Button fullWidth onClick={props.addMiniLeague}>Add minileague</Button>
      <div style={{ display: "flex", "flex-direction": "column", gap: "1em", "margin-top": "1em" }}>
        <For each={Object.entries(mls())}>{([k, ml]) => {
          return (
            <Paper elevation={5} style={{ padding: "1em" }}>
              {props.children(k, ml)}
            </Paper>
          )
        }}</For>
      </div>
    </div>
  )
}

function CustomStageMinileague(props: CustomMinileagueProps) {
  const {
    changeName,
  } = useCreateRoundConfig()
  const handleNameChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
    changeName(props.stage, props.mlkey, e.target.value)
  }
  return (
    <div style={{ display: "flex", "flex-direction": "column", "gap": "1em" }}>
      <div style={{ display: "flex", "align-items": "center" }}>
        <TextField
          label="Group"
          size="small"
          defaultValue={props.ml.name}
          onChange={handleNameChange}
        />
        <div style={{ "margin-left": "auto" }}>
          <IconButton onClick={props.setRemove}>
            <Delete fontSize="small" color="error" />
          </IconButton>
          <IconButton onClick={props.showInfo}>
            <InfoOutlined fontSize="small" />
          </IconButton>
        </div>
      </div>
      <For each={props.ml.seeds}>{(seed, i) => (
        <SeedSelector
          stage={props.stage}
          mlkey={props.mlkey}
          seed={seed}
          i={i()}
          allSeedsMap={props.allSeedsMap}
        />
      )}</For>
    </div>
  )
}

function SeedSelector(props: {
  stage: ConfigState;
  mlkey: string;
  seed: SeedInfo;
  i: number;
  allSeedsMap: Record<string, SeedInfo>;
}) {
  const {
    selectTeam,
    selectableSeeds,
  } = useCreateRoundConfig()
  const thisSelectable = createMemo(() => {
    const ts = selectableSeeds(props.stage, props.seed).map(s => ({ label: s.name, value: s.id }))
    if (props.seed) {
      ts.splice(1, 0, { label: "-", value: null })
    } else {
      ts.unshift({ label: "-", value: null })
    }
    return ts
  })
  const handleSelected = (v: string) => {
    selectTeam(props.stage, props.mlkey, props.i, props.allSeedsMap[v])
  }
  return (
    <Selector
      type="input"
      current={props.seed?.name ?? "-"}
      options={thisSelectable()}
      containerProps={{
        style: { "min-width": "10em" },
      }}
      small
      onClose={(v) => handleSelected(v)}
    />
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
