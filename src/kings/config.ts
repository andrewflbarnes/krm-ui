import { League, MiniLeagueTemplate, RaceStage, ResultsConfig, RoundConfig } from "./types";

export type LeagueConfig = {
  name: string;
}

const config = {
  western: {
    name: "Western",
  },
  midlands: {
    name: "Midlands",
  },
  northern: {
    name: "Northern",
  },
  southern: {
    name: "Southern",
  },
  scotland: {
    name: "Scotland",
  },
} as const

const typedConfig: Record<League, LeagueConfig> = config
export default typedConfig

// TODO testing to validate the below i.e.
// - the count of teams matches the count of unique teams in races
// - each unique team races each other
// Naming convention is <type><number of teams>
// - type: mini - a normal mini league
// - type: full - a mini league which contains every team from that round
export const miniLeagueTemplates = {
  "knockout": {
    teams: 2,
    races: [
      [1, 2],
    ],
  },
  "mini3": {
    teams: 3,
    races: [
      [1, 2],
      [2, 3],
      [3, 1],
    ],
  },
  "full3": {
    teams: 3,
    races: [
      [1, 2],
      [2, 3],
      [3, 1],
      [2, 1],
      [3, 2],
      [1, 3],
    ],
  },
  "mini4": {
    teams: 4,
    races: [
      [1, 2], [3, 4],
      [2, 3], [4, 1],
      [1, 3], [4, 2]
    ],
  },
  "mini5": {
    teams: 5,
    races: [
      [1, 2], [3, 4], [2, 3],
      [4, 5], [5, 1], [4, 2],
      [5, 3], [1, 4], [2, 5], [3, 1]
    ],
  },
  "mini6": {
    teams: 6,
    races: [
      [1, 6], [2, 5], [3, 4], [5, 1], [4, 6],
      [3, 2], [1, 4], [5, 3], [2, 6], [3, 1],
      [4, 2], [6, 5], [1, 2], [6, 3], [5, 4],
    ],
  }
} as const satisfies {
  [k: string]: MiniLeagueTemplate
}

function wrapStage1Seeds(seeds: number[]): { group: string, position: number }[] {
  return seeds.map(seed => ({ group: "Seeds", position: seed }))
}

function wrapSingleGroupResults(numTeams: number): readonly ResultsConfig[] {
  return Array.from({ length: numTeams }, (_, i) => ({ stage: "stage1", group: "A", position: i + 1, rank: i + 1 }))
}

function resultsForGroup(stage: RaceStage, group: string, positions: {
  position: number,
  rank: number,
}[]): readonly ResultsConfig[] {
  return positions.map(position => ({ stage, group, ...position }))
}

export function asKnockoutId(num: number) {
  const mod = num % 10
  if ([11, 12, 13].includes(num) || mod > 3 || mod === 0) {
    return `${num}th`
  }
  switch (num % 10) {
    case 1:
      return `${num}st`
    case 2:
      return `${num}nd`
    case 3:
      return `${num}rd`
  }
}

export function resultsFromKnockout(numTeams: number): readonly ResultsConfig[] {
  if (numTeams % 2 !== 0) {
    throw new Error("Only even numbers of teams are supported")
  }
  const results: ResultsConfig[] = []
  for (let i = 1; i <= numTeams; i += 2) {
    const group = `${asKnockoutId(i)}/${asKnockoutId(i + 1)}`
    results.push({
      stage: "knockout",
      group,
      position: 1,
      rank: i,
    })
    results.push({
      stage: "knockout",
      group,
      position: 2,
      rank: i + 1,
    })
  }
  return results
}

// TODO testing to validate the below i.e.
// - r1: the total count of teams matches the count key
// - r1: the mini league exists
// - r1: each mini league has a unique team name
// - r1: the mini league is for the same number of teams as appear in the seeds
// - r1: there are no duplicate seeds across round 1
// - r2: the total count of teams matches the count key
// - r2: each mini league exists
// - r2: each mini league has a unique team name
// - r2: the mini league is for the same number of teams as appear in the seeds
// - r2: there are no duplicate r1 references across round 2
// - ko: there are no diplicate r2 references across knockouts
export const raceConfig: {
  [k: number]: RoundConfig
} = {
  3: {
    stage1: [
      {
        name: "A",
        seeds: wrapStage1Seeds([1, 2, 3]),
        template: miniLeagueTemplates.full3,
      },
    ],
    // TODO unnecessary knockouts?
    results: wrapSingleGroupResults(3),
  },
  4: {
    stage1: [
      {
        name: "A",
        seeds: wrapStage1Seeds([1, 2, 3, 4]),
        template: miniLeagueTemplates.mini4,
      },
    ],
    // TODO unnecessary knockouts?
    results: wrapSingleGroupResults(4),
  },
  5: {
    stage1: [
      {
        name: "A",
        seeds: wrapStage1Seeds([1, 2, 3, 4, 5]),
        template: miniLeagueTemplates.mini5,
      },
    ],
    // TODO unnecessary knockouts?
    results: wrapSingleGroupResults(5),
  },
  6: {
    stage1: [
      {
        name: "A",
        seeds: wrapStage1Seeds([1, 2, 3, 4, 5, 6]),
        template: miniLeagueTemplates.mini6,
      },
    ],
    // TODO unnecessary knockouts?
    results: wrapSingleGroupResults(6),
  },
  7: {
    stage1: [
      {
        name: "A",
        seeds: wrapStage1Seeds([1, 4, 5, 7]),
        template: miniLeagueTemplates.mini4,
      },
      {
        name: "B",
        seeds: wrapStage1Seeds([2, 3, 6]),
        template: miniLeagueTemplates.mini3,
      },
    ],
    stage2: [
      {
        name: "I",
        seeds: [
          { group: "A", position: 1 },
          { group: "B", position: 1 },
          { group: "A", position: 2 },
          { group: "B", position: 2 },
        ],
        template: miniLeagueTemplates.mini4,
      },
      {
        name: "II",
        seeds: [
          { group: "A", position: 3 },
          { group: "B", position: 3 },
          { group: "A", position: 4 },
        ],
        template: miniLeagueTemplates.mini3,
      },
    ],
    // TODO unnecessary knockouts?
    results: [
      ...resultsForGroup("stage2", "I", [
        { position: 1, rank: 1 },
        { position: 2, rank: 2 },
        { position: 3, rank: 3 },
        { position: 4, rank: 4 },
      ]),
      ...resultsForGroup("stage2", "II", [
        { position: 1, rank: 5 },
        { position: 2, rank: 6 },
        { position: 3, rank: 7 },
      ])
    ],
  },
  8: {
    stage1: [
      {
        name: "A",
        seeds: wrapStage1Seeds([1, 4, 5, 8]),
        template: miniLeagueTemplates.mini4,
      },
      {
        name: "B",
        seeds: wrapStage1Seeds([2, 3, 6, 7]),
        template: miniLeagueTemplates.mini4,
      },
    ],
    stage2: [
      {
        name: "I",
        seeds: [
          { group: "A", position: 1 },
          { group: "B", position: 1 },
          { group: "A", position: 2 },
          { group: "B", position: 2 },
        ],
        template: miniLeagueTemplates.mini4,
      },
      {
        name: "II",
        seeds: [
          { group: "A", position: 3 },
          { group: "B", position: 3 },
          { group: "A", position: 4 },
          { group: "B", position: 4 },
        ],
        template: miniLeagueTemplates.mini4,
      },
    ],
    // FIXME EXAMPLE ONLY!!! THESE KNOCKOUTS ARE UNNECESSARY
    knockout: [
      {
        name: "7th/8th",
        seeds: [
          { group: "II", position: 3 },
          { group: "II", position: 4 },
        ],
        template: miniLeagueTemplates.knockout,
      },
      {
        name: "5th/6th",
        seeds: [
          { group: "II", position: 1 },
          { group: "II", position: 2 },
        ],
        template: miniLeagueTemplates.knockout,
      },
      {
        name: "3rd/4th",
        seeds: [
          { group: "I", position: 3 },
          { group: "I", position: 4 },
        ],
        template: miniLeagueTemplates.knockout,
      },
      {
        name: "1st/2nd",
        seeds: [
          { group: "I", position: 1 },
          { group: "I", position: 2 },
        ],
        template: miniLeagueTemplates.knockout,
      },
    ],
    // TODO unnecessary knockouts?
    results: resultsFromKnockout(8),
    //results: [
    //  ...resultsForGroup("stage2", "I", [
    //    { position: 1, rank: 1 },
    //    { position: 2, rank: 2 },
    //    { position: 3, rank: 3 },
    //    { position: 4, rank: 4 },
    //  ]),
    //  ...resultsForGroup("stage2", "II", [
    //    { position: 1, rank: 5 },
    //    { position: 2, rank: 6 },
    //    { position: 3, rank: 7 },
    //    { position: 4, rank: 8 },
    //  ])
    //],
  },
} as const
