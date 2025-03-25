import { Button } from "@suid/material";
import { createSignal, Show } from "solid-js";
import CustomRoundStage from "../components/CustomRoundStage";
import { MiniLeagueSeed, MiniLeagueTemplate, RaceStage, RoundConfig } from "../kings";

export default function CreateRoundConfig() {
  const [stage, setStage] = createSignal<RaceStage>("stage1")
  const [previous, setPrevious] = createSignal<{ group: string, teams: number }[]>()
  const [config, setConfig] = createSignal<RoundConfig>()
  const handleConfigUpdate = (config: Record<string, {
    template: MiniLeagueTemplate;
    name: string;
    seeds: MiniLeagueSeed[];
  }>) => {
    setConfig(c => ({
      ...c,
      [stage()]: Object.values(config),
    }))
  }
  const handleStageChange = () => {
    const current = stage()
    const next = current == "stage1" ? "stage2" : "stage1"
    setStage(next)
    if (next == "stage2") {
      setPrevious(config()?.stage1.map(({ template, name }) => ({
        group: name,
        teams: template.teams,
      })))
    } else {
      setPrevious(undefined)
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
            onConfigUpdated={handleConfigUpdate}
            previous={previous()}
          />
        </Show>
      </div>
    </div>
  )
}
