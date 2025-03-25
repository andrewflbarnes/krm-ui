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
  const handleNameUpdated = (mlkey: string, newName: string) => {
    const s = stage()
    setConfig(c => ({
      ...c,
      ...(s == "stage1" && c.stage2 ? {
        stage2: {
          ...c.stage2,
          minileagues: {
            ...c.stage2.minileagues,
            [mlkey]: {
              ...c.stage2.minileagues[mlkey],
              seeds: c.stage2.minileagues[mlkey].seeds.map(seedInfo => {
                if (!seedInfo?.seed?.group || seedInfo.seed.group != c.stage1.minileagues[mlkey].name) {
                  return seedInfo
                }
                const { name, seed } = seedInfo
                return {
                  seed: {
                    ...seed,
                    group: newName,
                  },
                  name: name.replace(/[gG]roup .*/, "group " + (newName ?? "N/A")),
                }
              })
            }
          }
        }
      } : {}),
      [s]: {
        ...c[s],
        minileagues: {
          ...c[s].minileagues,
          [mlkey]: {
            ...c[s].minileagues[mlkey],
            name: newName,
          }
        }
      }
    }))
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
            onNameUpdated={handleNameUpdated}
            previous={previous()}
          />
        </Show>
      </div>
    </div>
  )
}
