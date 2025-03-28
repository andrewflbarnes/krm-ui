import { batch, createUniqueId } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { RaceStage } from "../kings"
import { asPosition } from "../kings/utils";

export type ConfigState = RaceStage | "results"

export type SeedInfo = {
  id: string;
  stage: RaceStage | "seed";
  name?: string;
  mlkey: string;
  position: number;
}

type ConfigMinileague = {
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

const [config, setConfig] = createStore<Createconfig>({})

const addMiniLeague = (stage: RaceStage, mlconfig: string, teams: number): string => {
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
      }
    })
  })
  return mlkey
}

const removeMiniLeague = (stage: RaceStage, mlkey: string) => {
  batch(() => {
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
        const seedCount = Object.values(mls).reduce((acc, ml) => acc + ml.teams, 0)
        Object.entries(mls).forEach(([mlk, v]) => {
          mls[mlk].seeds = v.seeds.map(seed => seed?.position < seedCount ? seed : undefined)
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
  [stage in ConfigState]: ConfigState[]
} = {
  stage1: [],
  stage2: ["stage1"],
  knockout: ["stage1", "stage2"],
  results: ["stage1", "stage2", "knockout"],
}

const allSeeds = (stage: RaceStage): SeedInfo[] => {
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
  return Object.entries(config)
    .filter(([k]) => availableSeedStages[stage].includes(k as ConfigState))
    .flatMap(([k, mls]: [RaceStage, Record<string, ConfigMinileague>]) => Object.entries(mls)
      .flatMap(([mlkey, ml]) => Array.from({ length: ml.teams }, (_, i) => ({
        id: `${k}:${mlkey}:${i}`,
        stage: k,
        position: i,
        mlkey: mlkey,
        name: `${k}: ${asPosition(i + 1)} group ${ml.name ?? ""}`,
      }))))
}

const matchSeeds = (seed: SeedInfo, other: SeedInfo) => {
  if (!other || !seed) {
    return false
  }
  return seed.stage == other.stage && seed.mlkey == other.mlkey && seed.position == other.position
}

const selectableSeeds = (stage: RaceStage, selected?: SeedInfo): SeedInfo[] => {
  const all = allSeeds(stage)
  const selectable = all.filter(seed => !Object.values(config[stage])
    .some(ml => ml.seeds
      .some(s => matchSeeds(s, seed))))

  if (selected) {
    selectable.unshift(selected)
  }
  return selectable
}

export const useCreateRoundConfig = () => {
  return {
    config,
    setConfig,
    addMiniLeague,
    removeMiniLeague,
    selectTeam,
    changeName,
    allSeeds,
    selectableSeeds,
  }
}
