import { Button } from "@suid/material";
import { createSignal, Show } from "solid-js";
import CustomRoundStage from "../components/CustomRoundStage";
import { RaceStage } from "../kings";

export default function CreateRoundConfig() {
  const [stage, setStage] = createSignal<RaceStage>("stage1")
  const handleStageChange = () => {
    const current = stage()
    const next = current == "stage1" ? "stage2" : "stage1"
    setStage(next)
  }
  return (
    <div style={{ display: "flex", "align-items": "center", "flex-direction": "column" }}>
      <Button onClick={handleStageChange}>
        {stage() == "stage1" ? "Stage 2 >>>" : "<<< Stage 1"}
      </Button>
      <div style={{ margin: "0 auto" }}>
        <Show when={stage()} keyed>
          <CustomRoundStage
            stage={stage()}
          />
        </Show>
      </div>
    </div>
  )
}
