import { League, MiniLeagueConfig, MiniLeagueTemplate, RaceStage, ResultsConfig, RoundConfig } from "./types";
import { asKnockoutPosition } from "./utils";

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

// Naming convention is <type><number of teams>
// - type: mini - a normal mini league
// - type: full - a mini league which contains every team from that round
export const miniLeagueTemplates = {
  "knockout": {
    teams: 2,
    races: [
      [0, 1],
    ],
  },
  "full2": {
    teams: 2,
    races: [
      [0, 1],
      [1, 0],
      [0, 1],
    ],
  },
  "mini3": {
    teams: 3,
    races: [
      [0, 1],
      [1, 2],
      [2, 0],
    ],
  },
  "full3": {
    teams: 3,
    races: [
      [0, 1],
      [1, 2],
      [2, 0],
      [1, 0],
      [2, 1],
      [0, 2],
    ],
  },
  "mini4": {
    teams: 4,
    races: [
      [0, 1], [2, 3],
      [1, 2], [3, 0],
      [0, 2], [3, 1]
    ],
  },
  "mini5": {
    teams: 5,
    races: [
      [0, 1], [2, 3], [1, 2],
      [3, 4], [4, 0], [3, 1],
      [4, 2], [0, 3], [1, 4], [2, 0]
    ],
  },
  "mini6": {
    teams: 6,
    races: [
      [0, 5], [1, 4], [2, 3], [4, 0], [3, 5],
      [2, 1], [0, 3], [4, 2], [1, 5], [2, 0],
      [3, 1], [5, 4], [0, 1], [5, 2], [4, 3],
    ],
  }
} as const satisfies {
  [k: string]: MiniLeagueTemplate
}

function seeds(name: string, seeds: number[], template?: MiniLeagueTemplate): MiniLeagueConfig {
  const resolvedTemplate = template ?? miniLeagueTemplates[`mini${seeds.length}` as keyof typeof miniLeagueTemplates]
  return {
    name,
    seeds: seeds.map(seed => ({ group: "Seeds", position: seed })),
    template: resolvedTemplate,
  }
}

function wrapSingleGroupResults(numTeams: number): readonly ResultsConfig[] {
  return Array.from({ length: numTeams }, (_, i) => ({ stage: "stage1", group: "A", position: i, rank: i + 1 }))
}

function resultsForGroup(stage: RaceStage, group: string, positions: {
  position: number,
  rank: number,
}[]): readonly ResultsConfig[] {
  return positions.map(position => ({ stage, group, ...position }))
}

function knockoutsFromGroups(config: {
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

export function resultsFromKnockout(numTeams: number): readonly ResultsConfig[] {
  if (numTeams % 2 !== 0) {
    throw new Error("Only even numbers of teams are supported")
  }
  const results: ResultsConfig[] = []
  for (let i = 1; i <= numTeams; i += 2) {
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

export const raceConfig: {
  [k: number]: RoundConfig
} = {
  2: {
    stage1: [
      seeds("A", [0, 1], miniLeagueTemplates.full2)
    ],
    results: wrapSingleGroupResults(2),
  },
  3: {
    stage1: [
      seeds("A", [0, 1, 2], miniLeagueTemplates.full3)
    ],
    results: wrapSingleGroupResults(3),
  },
  4: {
    stage1: [
      seeds("A", [0, 1, 2, 3])
    ],
    results: wrapSingleGroupResults(4),
  },
  5: {
    stage1: [
      seeds("A", [0, 1, 2, 3, 4])
    ],
    results: wrapSingleGroupResults(5),
  },
  6: {
    stage1: [
      seeds("A", [0, 1, 2, 3, 4, 5])
    ],
    results: wrapSingleGroupResults(6),
  },
  7: {
    stage1: [
      seeds("A", [0, 3, 4, 6]),
      seeds("B", [1, 2, 5]),
    ],
    stage2: [
      {
        name: "I",
        seeds: [
          { group: "A", position: 0 },
          { group: "B", position: 0 },
          { group: "A", position: 1 },
          { group: "B", position: 1 },
        ],
        template: miniLeagueTemplates.mini4,
      },
      {
        name: "II",
        seeds: [
          { group: "A", position: 2 },
          { group: "B", position: 2 },
          { group: "A", position: 3 },
        ],
        template: miniLeagueTemplates.mini3,
      },
    ],
    results: [
      ...resultsForGroup("stage2", "I", [
        { position: 0, rank: 1 },
        { position: 1, rank: 2 },
        { position: 2, rank: 3 },
        { position: 3, rank: 4 },
      ]),
      ...resultsForGroup("stage2", "II", [
        { position: 0, rank: 5 },
        { position: 1, rank: 6 },
        { position: 2, rank: 7 },
      ])
    ],
  },
  8: {
    stage1: [
      seeds("A", [0, 3, 4, 7]),
      seeds("B", [1, 2, 5, 6]),
    ],
    stage2: [
      {
        name: "I",
        seeds: [
          { group: "A", position: 0 },
          { group: "B", position: 0 },
          { group: "A", position: 1 },
          { group: "B", position: 1 },
        ],
        template: miniLeagueTemplates.mini4,
      },
      {
        name: "II",
        seeds: [
          { group: "A", position: 2 },
          { group: "B", position: 2 },
          { group: "A", position: 3 },
          { group: "B", position: 3 },
        ],
        template: miniLeagueTemplates.mini4,
      },
    ],
    // EXAMPLE ONLY!!! THESE KNOCKOUTS ARE UNNECESSARY
    knockout: [
      {
        name: "7th/8th",
        seeds: [
          { group: "II", position: 2 },
          { group: "II", position: 3 },
        ],
        template: miniLeagueTemplates.knockout,
      },
      {
        name: "5th/6th",
        seeds: [
          { group: "II", position: 0 },
          { group: "II", position: 1 },
        ],
        template: miniLeagueTemplates.knockout,
      },
      {
        name: "3rd/4th",
        seeds: [
          { group: "I", position: 2 },
          { group: "I", position: 3 },
        ],
        template: miniLeagueTemplates.knockout,
      },
      {
        name: "1st/2nd",
        seeds: [
          { group: "I", position: 0 },
          { group: "I", position: 1 },
        ],
        template: miniLeagueTemplates.knockout,
      },
    ],
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
  9: {
    stage1: [
      seeds("A", [0, 5, 6]),
      seeds("B", [1, 4, 7]),
      seeds("C", [2, 3, 8]),
    ],
    stage2: [
      {
        name: "I",
        seeds: [
          { group: "A", position: 0 },
          { group: "B", position: 1 },
          { group: "C", position: 0 },
        ],
        template: miniLeagueTemplates.mini3,
      },
      {
        name: "II",
        seeds: [
          { group: "A", position: 1 },
          { group: "B", position: 0 },
          { group: "C", position: 1 },
        ],
        template: miniLeagueTemplates.mini3,
      },
      {
        name: "III",
        seeds: [
          { group: "A", position: 2 },
          { group: "B", position: 2 },
          { group: "C", position: 2 },
        ],
        template: miniLeagueTemplates.mini3,
      },
    ],
    knockout: knockoutsFromGroups([
      {
        from: 1,
        to: 6,
        group1: "I",
        group2: "II",
      }
    ]),
    results: [
      ...resultsFromKnockout(6),
      ...resultsForGroup("stage2", "III", [
        { position: 0, rank: 7 },
        { position: 1, rank: 8 },
        { position: 2, rank: 9 },
      ]),
    ]
  },
  10: {
    stage1: [
      seeds("A", [0, 5, 6, 9]),
      seeds("B", [1, 4, 7]),
      seeds("C", [2, 3, 8]),
    ],
    stage2: [
      {
        name: "I",
        seeds: [
          { group: "A", position: 0 },
          { group: "B", position: 1 },
          { group: "C", position: 0 },
        ],
        template: miniLeagueTemplates.mini3,
      },
      {
        name: "II",
        seeds: [
          { group: "A", position: 1 },
          { group: "B", position: 0 },
          { group: "C", position: 1 },
        ],
        template: miniLeagueTemplates.mini3,
      },
      {
        name: "III",
        seeds: [
          { group: "A", position: 2 },
          { group: "B", position: 2 },
          { group: "C", position: 2 },
          { group: "A", position: 3 },
        ],
        template: miniLeagueTemplates.mini4,
      },
    ],
    knockout: knockoutsFromGroups([
      {
        from: 1,
        to: 6,
        group1: "I",
        group2: "II",
      }
    ]),
    results: [
      ...resultsFromKnockout(6),
      ...resultsForGroup("stage2", "III", [
        { position: 0, rank: 7 },
        { position: 1, rank: 8 },
        { position: 2, rank: 9 },
        { position: 3, rank: 10 },
      ]),
    ]
  },
  11: {
    stage1: [
      seeds("A", [0, 5, 6, 10]),
      seeds("B", [1, 4, 7, 9]),
      seeds("C", [2, 3, 8]),
    ],
    stage2: [
      {
        name: "I",
        seeds: [
          { group: "A", position: 0 },
          { group: "B", position: 1 },
          { group: "C", position: 0 },
          { group: "A", position: 2 },
        ],
        template: miniLeagueTemplates.mini4,
      },
      {
        name: "II",
        seeds: [
          { group: "A", position: 1 },
          { group: "B", position: 0 },
          { group: "C", position: 1 },
          { group: "B", position: 2 },
        ],
        template: miniLeagueTemplates.mini4,
      },
      {
        name: "III",
        seeds: [
          { group: "A", position: 3 },
          { group: "B", position: 3 },
          { group: "C", position: 2 },
        ],
        template: miniLeagueTemplates.mini3,
      },
    ],
    knockout: knockoutsFromGroups([
      {
        from: 1,
        to: 8,
        group1: "I",
        group2: "II",
      }
    ]),
    results: [
      ...resultsFromKnockout(8),
      ...resultsForGroup("stage2", "III", [
        { position: 0, rank: 9 },
        { position: 1, rank: 10 },
        { position: 2, rank: 11 },
      ]),
    ]
  },
  12: {
    stage1: [
      seeds("A", [0, 7, 8]),
      seeds("B", [1, 6, 9]),
      seeds("C", [2, 5, 10]),
      seeds("D", [3, 4, 11]),
    ],
    stage2: [
      {
        name: "I",
        seeds: [
          { group: "A", position: 0 },
          { group: "B", position: 1 },
          { group: "C", position: 0 },
          { group: "D", position: 1 },
        ],
        template: miniLeagueTemplates.mini4,
      },
      {
        name: "II",
        seeds: [
          { group: "A", position: 1 },
          { group: "B", position: 0 },
          { group: "C", position: 1 },
          { group: "D", position: 0 },
        ],
        template: miniLeagueTemplates.mini4,
      },
      {
        name: "III",
        seeds: [
          { group: "A", position: 2 },
          { group: "B", position: 2 },
          { group: "C", position: 2 },
          { group: "D", position: 2 },
        ],
        template: miniLeagueTemplates.mini4,
      },
    ],
    knockout: knockoutsFromGroups([
      {
        from: 1,
        to: 8,
        group1: "I",
        group2: "II",
      }
    ]),
    results: [
      ...resultsFromKnockout(8),
      ...resultsForGroup("stage2", "III", [
        { position: 0, rank: 9 },
        { position: 1, rank: 10 },
        { position: 2, rank: 11 },
        { position: 3, rank: 12 },
      ]),
    ]
  },
  13: {
    stage1: [
      seeds("A", [0, 5, 6, 11, 12]),
      seeds("B", [1, 4, 7, 10]),
      seeds("C", [2, 3, 8, 9]),
    ],
    stage2: [
      {
        name: "I",
        seeds: [
          { group: "A", position: 0 },
          { group: "B", position: 1 },
          { group: "C", position: 0 },
        ],
        template: miniLeagueTemplates.mini3,
      },
      {
        name: "II",
        seeds: [
          { group: "A", position: 1 },
          { group: "B", position: 0 },
          { group: "C", position: 1 },
        ],
        template: miniLeagueTemplates.mini3,
      },
      {
        name: "III",
        seeds: [
          { group: "A", position: 2 },
          { group: "B", position: 3 },
          { group: "C", position: 2 },
        ],
        template: miniLeagueTemplates.mini3,
      },
      {
        name: "IV",
        seeds: [
          { group: "A", position: 3 },
          { group: "B", position: 2 },
          { group: "C", position: 3 },
          { group: "A", position: 4 },
        ],
        template: miniLeagueTemplates.mini4,
      },
    ],
    knockout: knockoutsFromGroups([
      {
        from: 7,
        to: 12,
        group1: "III",
        group2: "IV",
      },
      {
        from: 1,
        to: 6,
        group1: "I",
        group2: "II",
      },
    ]),
    results: [
      ...resultsFromKnockout(12),
      ...resultsForGroup("stage2", "IV", [
        { position: 3, rank: 13 },
      ]),
    ]
  },
  14: {
    stage1: [
      seeds("A", [0, 7, 8, 13]),
      seeds("B", [1, 6, 9, 12]),
      seeds("C", [2, 5, 10]),
      seeds("D", [3, 4, 11]),
    ],
    stage2: [
      {
        name: "I",
        seeds: [
          { group: "A", position: 0 },
          { group: "B", position: 1 },
          { group: "C", position: 0 },
          { group: "D", position: 1 },
        ],
        template: miniLeagueTemplates.mini4,
      },
      {
        name: "II",
        seeds: [
          { group: "A", position: 1 },
          { group: "B", position: 0 },
          { group: "C", position: 1 },
          { group: "D", position: 0 },
        ],
        template: miniLeagueTemplates.mini4,
      },
      {
        name: "III",
        seeds: [
          { group: "A", position: 2 },
          { group: "B", position: 3 },
          { group: "C", position: 2 },
        ],
        template: miniLeagueTemplates.mini3,
      },
      {
        name: "IV",
        seeds: [
          { group: "A", position: 3 },
          { group: "B", position: 2 },
          { group: "D", position: 2 },
        ],
        template: miniLeagueTemplates.mini3,
      },
    ],
    knockout: knockoutsFromGroups([
      {
        from: 9,
        to: 14,
        group1: "III",
        group2: "IV",
      },
      {
        from: 1,
        to: 8,
        group1: "I",
        group2: "II",
      },
    ]),
    results: [
      ...resultsFromKnockout(14),
    ]
  },
  15: {
    stage1: [
      seeds("A", [0, 7, 8]),
      seeds("B", [1, 6, 9, 14]),
      seeds("C", [2, 5, 10, 13]),
      seeds("D", [3, 4, 11, 12]),
    ],
    stage2: [
      {
        name: "I",
        seeds: [
          { group: "A", position: 0 },
          { group: "B", position: 1 },
          { group: "C", position: 0 },
          { group: "D", position: 1 },
        ],
        template: miniLeagueTemplates.mini4,
      },
      {
        name: "II",
        seeds: [
          { group: "A", position: 1 },
          { group: "B", position: 0 },
          { group: "C", position: 1 },
          { group: "D", position: 0 },
        ],
        template: miniLeagueTemplates.mini4,
      },
      {
        name: "III",
        seeds: [
          { group: "A", position: 2 },
          { group: "B", position: 3 },
          { group: "C", position: 2 },
          { group: "D", position: 3 },
        ],
        template: miniLeagueTemplates.mini4,
      },
      {
        name: "IV",
        seeds: [
          { group: "B", position: 2 },
          { group: "C", position: 3 },
          { group: "D", position: 2 },
        ],
        template: miniLeagueTemplates.mini3,
      },
    ],
    knockout: knockoutsFromGroups([
      {
        from: 9,
        to: 14,
        group1: "III",
        group2: "IV",
      },
      {
        from: 1,
        to: 8,
        group1: "I",
        group2: "II",
      },
    ]),
    results: [
      ...resultsFromKnockout(14),
      ...resultsForGroup("stage2", "III", [
        { position: 3, rank: 15 },
      ]),
    ]
  },
  16: {
    stage1: [
      seeds("A", [0, 7, 8, 15]),
      seeds("B", [1, 6, 9, 14]),
      seeds("C", [2, 5, 10, 13]),
      seeds("D", [3, 4, 11, 12]),
    ],
    stage2: [
      {
        name: "I",
        seeds: [
          { group: "A", position: 0 },
          { group: "B", position: 1 },
          { group: "C", position: 0 },
          { group: "D", position: 1 },
        ],
        template: miniLeagueTemplates.mini4,
      },
      {
        name: "II",
        seeds: [
          { group: "A", position: 1 },
          { group: "B", position: 0 },
          { group: "C", position: 1 },
          { group: "D", position: 0 },
        ],
        template: miniLeagueTemplates.mini4,
      },
      {
        name: "III",
        seeds: [
          { group: "A", position: 2 },
          { group: "B", position: 3 },
          { group: "C", position: 2 },
          { group: "D", position: 3 },
        ],
        template: miniLeagueTemplates.mini4,
      },
      {
        name: "IV",
        seeds: [
          { group: "A", position: 3 },
          { group: "B", position: 2 },
          { group: "C", position: 3 },
          { group: "D", position: 2 },
        ],
        template: miniLeagueTemplates.mini4,
      },
    ],
    knockout: knockoutsFromGroups([
      {
        from: 9,
        to: 16,
        group1: "III",
        group2: "IV",
      },
      {
        from: 1,
        to: 8,
        group1: "I",
        group2: "II",
      },
    ]),
    results: [
      ...resultsFromKnockout(16),
    ]
  },
} as const
// Round config tests
// - stage 2 teams <= stage 1 teams
// - knokcout teams <= stage 2 teams (or stage 1 teams)
// - bug when displaying joint results from different groups shown twice at ordered of declaration
