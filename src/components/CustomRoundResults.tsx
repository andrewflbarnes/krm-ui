import { createMemo, For, Show } from "solid-js";
import { SeedInfo, useCreateRoundConfig } from "../hooks/create-config"
import { asPosition } from "../kings/round-utils";
import Selector from "../ui/Selector";

export default function CustomRoundResults() {
  const {
    resultsConfig,
    seedCount,
    allSeeds,
  } = useCreateRoundConfig()
  const joints = () => resultsConfig.seeds
    .flatMap(s => s.seed.filter((_, i) => i > 0).map((_, i) => s.position + i))
  const positions = () => {
    return Array.from({ length: seedCount() }, (_, i) => i)
      .filter(i => !joints().includes(i))
  }
  const allSeedsMap = createMemo(() => allSeeds("results").reduce((acc, s) => {
    acc[s.id] = s
    return acc
  }, {} as Record<string, SeedInfo>))
  return (
    <div>
      <For each={positions()}>{(position) => {
        const r = createMemo(() => resultsConfig.seeds.find(s => s.position == position))
        return (
          <div>
            <div>
              {r()?.seed.length > 1 ? "Joint " : ""}
              {asPosition(position + 1)}
            </div>
            <Show when={!r()}>
              <SeedSelector
                position={position}
                seedPosition={0}
                seed={null}
                allSeedsMap={allSeedsMap()}
              />
            </Show>
            <For each={r()?.seed}>{(seed, i) => {
              return (
                <Show when={!seed || seed.stage != "knockout"} fallback={
                  <div>
                    {
                      seed.stage == "knockout"
                        ? seed.position == 0
                          ? "Winner"
                          : "Loser"
                        : asPosition(position + 1)
                    }
                    &nbsp;
                    {seed.name} knockout
                  </div>
                }>
                  <SeedSelector
                    position={position}
                    seedPosition={i()}
                    seed={seed}
                    allSeedsMap={allSeedsMap()}
                  />
                </Show>
              )
            }}</For>
          </div>
        )
      }}</For>
    </div>
  )
}

function SeedSelector(props: {
  position: number;
  seedPosition: number;
  seed: SeedInfo;
  allSeedsMap: Record<string, SeedInfo>;
}) {
  const {
    setResultsConfig,
    resultsConfig,
    selectableSeeds,
  } = useCreateRoundConfig()
  const thisSelectable = createMemo(() => {
    const ts = selectableSeeds("results", props.seed).map(s => ({ label: s.name, value: s.id }))
    if (props.seed) {
      ts.splice(1, 0, { label: "-", value: null })
    } else {
      ts.unshift({ label: "-", value: null })
    }
    return ts
  })
  const handleSelected = (v: string) => {
    const choice = props.allSeedsMap[v]
    const index = resultsConfig.seeds.findIndex(s => s.position == props.position)
    if (index > -1) {
      if (!choice && resultsConfig.seeds[index].seed.every((s, si) => !s || si == props.seedPosition)) {
        setResultsConfig("seeds", resultsConfig.seeds.filter(s => s.position != props.position))
      } else {
        setResultsConfig("seeds", index, "seed", props.seedPosition, choice)
      }
    } else {
      const seed = Array.from(Array(props.seedPosition + 1))
      seed[props.seedPosition] = choice

      setResultsConfig("seeds", resultsConfig.seeds.length, {
        position: props.position,
        seed,
      })
    }
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
