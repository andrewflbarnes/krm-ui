import type { MiniLeagueConfig, MiniLeagueTemplate, RaceStage, ResultsConfig } from "@/kings/types";
import { asKnockoutPosition } from "@/kings/core-utils";
import { miniLeagueTemplates } from "@/kings/config/minileague";

export function seeds(name: string, seeds: number[], template: MiniLeagueTemplate): MiniLeagueConfig {
  return {
    name,
    seeds: seeds.map(seed => ({ group: "Seeds", position: seed })),
    template,
  }
}

export function wrapSingleGroupResults(numTeams: number): readonly ResultsConfig[] {
  return Array.from({ length: numTeams }, (_, i) => ({ stage: "stage1", group: "A", position: i, rank: i + 1 }))
}

export function resultsForGroup(stage: RaceStage, group: string, positions: {
  position: number,
  rank: number,
}[]): readonly ResultsConfig[] {
  return positions.map(position => ({ stage, group, ...position }))
}

type Result = {
  group: string;
  position: number;
}

export function knockoutsFromResults(results: {
  rank: number;
  team1: Result;
  team2: Result;
}[]): MiniLeagueConfig[] {
  return results.map(r => ({
    name: asKnockoutPosition(r.rank),
    seeds: [
      {
        group: r.team1.group,
        position: r.team1.position,
      },
      {
        group: r.team2.group,
        position: r.team2.position,
      },
    ],
    template: miniLeagueTemplates.knockout,
  }))
}

export function knockoutsFromGroups(config: {
  from: number;
  to: number;
  group1: string;
  group2: string;
}[]): MiniLeagueConfig[] {
  return config.flatMap(c => {
    let seedPosition = 0;
    const races: MiniLeagueConfig[] = []
    for (let place = c.from; place < c.to; place += 2) {
      races.unshift({
        name: asKnockoutPosition(place),
        seeds: [
          {
            group: c.group1,
            position: seedPosition,
          },
          {
            group: c.group2,
            position: seedPosition,
          },
        ],
        template: miniLeagueTemplates.knockout,
      })
      seedPosition += 1
    }
    return races

  })
}

export function resultsFromKnockout(numTeams: number, start: number = 1): readonly ResultsConfig[] {
  if ((numTeams + start) % 2 !== 1) {
    throw new Error("Only even numbers of results are supported")
  }
  const results: ResultsConfig[] = []
  for (let i = start; i <= numTeams; i += 2) {
    const group = asKnockoutPosition(i)
    results.push({
      stage: "knockout",
      group,
      position: 0,
      rank: i,
    })
    results.push({
      stage: "knockout",
      group,
      position: 1,
      rank: i + 1,
    })
  }
  return results
}
