import { Button, Typography } from "@suid/material";
import { createSignal, Show } from "solid-js";
import CustomRoundResults from "../components/CustomRoundResults";
import CustomRoundStage from "../components/CustomRoundStage";
import { ConfigState } from "../hooks/create-config";
import { isStage } from "../kings/utils";

const conf: {
  [state in ConfigState]: {
    prev?: ConfigState;
    next?: ConfigState;
    title: string;
  }
} = {
  stage1: {
    title: "Stage 1",
    next: "stage2",
  },
  stage2: {
    title: "Stage 2",
    prev: "stage1",
    next: "knockout",
  },
  knockout: {
    title: "Knockout",
    prev: "stage2",
    next: "results",
  },
  results: {
    title: "Results",
    prev: "knockout",
  }
}

export default function CreateRoundConfig() {
  const [stage, setStage] = createSignal<ConfigState>("stage1")
  const handleStageChange = (next: ConfigState) => {
    setStage(next)
  }
  const prev = () => conf[stage()].prev
  const next = () => conf[stage()].next
  return (
    <div style={{
      display: "flex",
      "align-items": "center",
      "flex-direction": "column",
      "gap": "1em",
    }}>
      <div style={{
        display: "grid",
        "align-items": "center",
        "grid-template-columns": "1fr 1fr 1fr",
        width: "100%",
      }}>
        <Button
          disabled={!prev()}
          onClick={() => handleStageChange(prev())}
        >
          &lt;&lt;&lt;&nbsp;{prev()}
        </Button>
        <Typography textAlign="center">
          {conf[stage()].title}
        </Typography>
        <Button
          disabled={!next()}
          onClick={() => handleStageChange(next())}
        >
          {next()}&nbsp;&gt;&gt;&gt;
        </Button>
      </div>
      <div style={{ margin: "0 auto" }}>
        <Show when={isStage(stage())} keyed fallback={(
          <CustomRoundResults />
        )}>{(s) => (
          <CustomRoundStage
            stage={s}
          />
        )}</Show>
      </div>
    </div>
  )
}
