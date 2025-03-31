import { batch, createMemo, createUniqueId } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { RaceStage } from "../kings"
import { asPosition, checkStage } from "../kings/utils";

export type ConfigState = RaceStage | "results"

export type SeedInfo = {
  id: string;
  stage: RaceStage | "seed";
  name?: string;
  mlkey: string;
  position: number;
}

export type ConfigMinileague = {
  template: string;
  teams: number;
  name?: string;
  seeds: (SeedInfo | undefined)[];
}

type Createconfig = Partial<{
  [stage in RaceStage]: {
    [mlkey: string]: ConfigMinileague
  }
}>

type ResultsConfig = {
  seeds: {
    position: number;
    seed: SeedInfo[];
  }[]
}

const [config, setConfig] = createStore<Createconfig>({})
const [resultsConfig, setResultsConfig] = createStore<ResultsConfig>({ seeds: [] })

const seedCount = createMemo(() => Object.values(config.stage1 ?? {}).reduce((acc, ml) => acc + ml.teams, 0))

const addMiniLeague = (stage: RaceStage, mlconfig: string, teams: number, name?: string): string => {
  const mlkey = createUniqueId()
  const seeds = Array.from(Array(teams))
  batch(() => {
    if (!config[stage]) {
      setConfig(stage, {})
    }
    setConfig(stage, {
      [mlkey]: {
        template: mlconfig,
        teams,
        seeds,
        name,
      }
    })
  })
  return mlkey
}

const removeMiniLeague = (stage: RaceStage, mlkey: string) => {
  batch(() => {
    setResultsConfig(produce((store) => {
      store.seeds.forEach(seed => {
        seed.seed = seed.seed.filter(s => s.mlkey != mlkey)
      })
      store.seeds = store.seeds.filter(s => s.seed.length > 0)
    }))
    setResultsConfig("seeds", { from: 0, to: resultsConfig.seeds.length - 1 }, produce((seed) => {
      seed.seed = seed.seed.filter(s => s.mlkey != mlkey)
    }))
    setConfig(stage, mlkey, undefined)
    setConfig(produce((store) => {
      Object.entries(config).forEach(([s, mls]) => {
        Object.entries(mls).forEach(([mlk, v]) => {
          store[s][mlk].seeds = v.seeds.map(seed => {
            if (!seed || seed.stage != stage || seed.mlkey != mlkey) {
              return seed
            }
            return undefined
          })
        })
      })
    }))
    if (stage == "stage1") {
      setConfig("stage1", produce((mls) => {
        Object.entries(mls).forEach(([mlk, v]) => {
          mls[mlk].seeds = v.seeds.map(seed => seed?.position < seedCount() ? seed : undefined)
        })
      }))
    }
  })
}

const selectTeam = (stage: RaceStage, mlkey: string, position: number, seed: SeedInfo) => {
  setConfig(stage, mlkey, "seeds", position, seed)
}

const changeName = (stage: RaceStage, mlkey: string, name: string) => {
  batch(() => {
    setConfig(stage, mlkey, "name", name)
    setConfig(produce((store) => {
      Object.entries(config).forEach(([s, mls]) => {
        Object.entries(mls).forEach(([mlk, v]) => {
          store[s][mlk].seeds = v.seeds.map(seed => {
            if (!seed || seed.stage != stage || seed.mlkey != mlkey) {
              return seed
            }
            return {
              ...seed,
              name: `${seed.stage}: ${asPosition(seed.position + 1)} group ${name ?? ""}`,
            }
          })
        })
      })
    }))
  })
}

const availableSeedStages: {
  [stage in ConfigState]: RaceStage[]
} = {
  stage1: [],
  stage2: ["stage1"],
  knockout: ["stage1", "stage2"],
  results: ["stage1", "stage2", "knockout"],
}

const allSeeds = (stage: ConfigState): SeedInfo[] => {
  if (stage === "stage1") {
    const countSeeds = Object.values(config.stage1 ?? {})
      .reduce((acc, ml) => acc + ml.teams, 0)
    return Array.from({ length: countSeeds }, (_, i) => ({
      id: `seed:seed:${i}`,
      stage: "seed",
      position: i,
      mlkey: "seed",
      name: `Seed ${i + 1}`,
    }))
  }
  const seeds = Object.entries(config)
    .filter(([k]) => availableSeedStages[stage].includes(k as RaceStage))
    .flatMap(([k, mls]: [RaceStage, Record<string, ConfigMinileague>]) => Object.entries(mls)
      .flatMap(([mlkey, ml]) => Array.from({ length: ml.teams }, (_, i) => ({
        id: `${k}:${mlkey}:${i}`,
        stage: k,
        position: i,
        mlkey: mlkey,
        name: `${k}: ${asPosition(i + 1)} group ${ml.name ?? ""}`,
      }))))

  if (stage != "knockout") {
    return seeds
  }

  // knockout can only be for the most prior stage
  const stage2Seeds = seeds.filter(seed => seed.stage == "stage2")
  return stage2Seeds.length > 0 ? stage2Seeds : seeds
}

const matchSeeds = (seed: SeedInfo, other: SeedInfo) => {
  if (!other || !seed) {
    return false
  }
  return seed.stage == other.stage && seed.mlkey == other.mlkey && seed.position == other.position
}

const selectableSeeds = (stage: ConfigState, selected?: SeedInfo): SeedInfo[] => {
  const all = allSeeds(stage)
  const selectable = checkStage(stage)
    ? all.filter(seed => !Object.values(config[stage])
      .some(ml => ml.seeds
        .some(s => matchSeeds(s, seed))))
    : all.filter(seed => !resultsConfig.seeds.some(r =>
      r.seed.some(s => matchSeeds(s, seed))))

  if (selected) {
    selectable.unshift(selected)
  }
  return selectable
}

const availableKnockouts = () => {
  const available: number[] = []
  const taken = resultsConfig.seeds.map(r => r.position)
  for (let i = 0; i < seedCount() - 1; i++) {
    if (!taken.includes(i) && !taken.includes(i + 1)) {
      available.push(i)
    }
  }
  return available
}

const addKnockout = (position: number, name: string): string => {
  let mlkey: string
  batch(() => {
    mlkey = addMiniLeague("knockout", "knockout", 2, name)
    setResultsConfig("seeds", resultsConfig.seeds.length, {
      position,
      seed: [
        {
          id: `knockout:${mlkey}:0`,
          stage: "knockout",
          position: 0,
          mlkey,
          name: name,
        },
      ]
    })
    setResultsConfig("seeds", resultsConfig.seeds.length, {
      position: position + 1,
      seed: [
        {
          id: `knockout:${mlkey}:1`,
          stage: "knockout",
          position: 1,
          mlkey,
          name: name,
        },
      ]
    })
  })
  return mlkey
}

export const useCreateRoundConfig = () => {
  return {
    config,
    setConfig,
    resultsConfig,
    setResultsConfig,
    addMiniLeague,
    removeMiniLeague,
    selectTeam,
    changeName,
    seedCount,
    allSeeds,
    selectableSeeds,
    availableKnockouts,
    addKnockout,
  }
}
