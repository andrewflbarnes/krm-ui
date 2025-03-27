import { Button } from "@suid/material";
import { batch, createSignal, Show } from "solid-js";
import { createStore } from "solid-js/store";
import CustomRoundStage, { ConfigUpdateHandler, CreateConfig, PreviousMinileagues } from "../components/CustomRoundStage";
import { RaceStage } from "../kings";

export default function CreateRoundConfig() {
  const [stage, setStage] = createSignal<RaceStage>("stage1")
  const [previous, setPrevious] = createSignal<PreviousMinileagues>()
  const [config, setConfig] = createStore<Partial<Record<RaceStage, CreateConfig>>>({})
  const handleConfigUpdate: ConfigUpdateHandler = (newConfig) => {
    batch(() => {
      setConfig(stage(), newConfig)
      if (stage() == "stage1" && config.stage2) {
        const mlkeys = Object.keys(newConfig.minileagues)
        setConfig(
          "stage2",
          "minileagues",
          Object.keys(config.stage2.minileagues),
          "seeds",
          seeds => seeds.map(s => s?.mlkey && mlkeys.includes(s.mlkey) ? s : undefined)
        )
      }
    })
  }
  const handleStageChange = () => {
    const current = stage()
    const next = current == "stage1" ? "stage2" : "stage1"
    batch(() => {
      setStage(next)
      if (next == "stage2") {
        setPrevious(Object.entries(config.stage1?.minileagues ?? {}).map(([k, { template, name }]) => ({
          mlkey: k,
          group: name,
          teams: template.teams,
        })))
      } else {
        setPrevious(undefined)
      }
    })
  }
  const handleNameUpdated = (mlkey: string, newName: string) => {
    const updateName = newName?.trim()?.length > 0 ? newName.trim() : "-"
    const s = stage()
    const oldName = config[s].minileagues[mlkey].name
    setConfig(s, "minileagues", mlkey, "name", updateName)
    if (s == "stage1" && config.stage2) {
      console.log({
        c: JSON.parse(JSON.stringify(config)),
        k: Object.keys(config.stage2.minileagues),
        oldName,
        updateName,
        s,
      })
      setConfig(
        "stage2",
        "minileagues",
        Object.keys(config.stage2.minileagues),
        "seeds",
        s => s?.mlkey == mlkey,
        "name",
        name => name.replace(/[gG]roup .*/, "group " + updateName)
      )
    }
  }
  return (
    <div style={{ display: "flex", "align-items": "center", "flex-direction": "column" }}>
      <Button onClick={handleStageChange}>
        {stage() == "stage1" ? "Stage 2 >>>" : "<<< Stage 1"}
      </Button>
      <div style={{ margin: "0 auto" }}>
        <Show when={stage()} keyed>
          <CustomRoundStage
            initialConfig={config?.[stage()]}
            onConfigUpdated={handleConfigUpdate}
            onNameUpdated={handleNameUpdated}
            previous={previous()}
          />
        </Show>
      </div>
    </div>
  )
}
