import { Button } from "@suid/material";
import { batch, createSignal, Show } from "solid-js";
import CustomRoundStage, { ConfigUpdateHandler, CreateConfig } from "../components/CustomRoundStage";
import { RaceStage } from "../kings";

export default function CreateRoundConfig() {
  const [stage, setStage] = createSignal<RaceStage>("stage1")
  const [previous, setPrevious] = createSignal<{ group: string, teams: number }[]>()
  const [config, setConfig] = createSignal<Partial<Record<RaceStage, CreateConfig>>>({})
  const handleConfigUpdate: ConfigUpdateHandler = (config) => {
    setConfig(c => ({
      ...c,
      [stage()]: config,
    }))
  }
  const handleStageChange = () => {
    const current = stage()
    const next = current == "stage1" ? "stage2" : "stage1"
    batch(() => {
      setStage(next)
      if (next == "stage2") {
        const mls = Object.values(config().stage1?.minileagues ?? {})
        setPrevious(mls.map(({ template, name }) => ({
          group: name,
          teams: template.teams,
        })))
      } else {
        setPrevious(undefined)
      }
    })
  }
  return (
    <div style={{ display: "flex", "align-items": "center", "flex-direction": "column" }}>
      <Button onClick={handleStageChange}>
        {stage() == "stage1" ? "Stage 2 >>>" : "<<< Stage 1"}
      </Button>
      <div style={{ margin: "0 auto" }}>
        <Show when={stage()} keyed>
          <CustomRoundStage
            initialConfig={config()?.[stage()]}
            onConfigUpdated={handleConfigUpdate}
            previous={previous()}
          />
        </Show>
      </div>
    </div>
  )
}
