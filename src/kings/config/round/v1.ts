import { RoundConfig } from "../../types";
import { miniLeagueTemplates } from "../minileague";
import { knockoutsFromGroups, resultsForGroup, resultsFromKnockout, seeds, wrapSingleGroupResults } from "../config-utils";

const raceConfig: {
  [k: number]: RoundConfig
} = {
  0: {
    stage1: [],
    results: [],
  },
  1: {
    stage1: [
      seeds("A", [0], miniLeagueTemplates.single)
    ],
    results: wrapSingleGroupResults(1),
  },
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
      seeds("A", [0, 1, 2, 3], miniLeagueTemplates.full4)
    ],
    results: wrapSingleGroupResults(4),
  },
  5: {
    stage1: [
      seeds("A", [0, 1, 2, 3, 4], miniLeagueTemplates.mini5)
    ],
    results: wrapSingleGroupResults(5),
  },
  6: {
    stage1: [
      seeds("A", [0, 1, 2, 3, 4, 5], miniLeagueTemplates.mini6)
    ],
    results: wrapSingleGroupResults(6),
  },
  7: {
    stage1: [
      seeds("A", [0, 3, 4, 6], miniLeagueTemplates.mini4),
      seeds("B", [1, 2, 5], miniLeagueTemplates.mini3),
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
      seeds("A", [0, 3, 4, 7], miniLeagueTemplates.mini4),
      seeds("B", [1, 2, 5, 6], miniLeagueTemplates.mini4),
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
        { position: 3, rank: 8 },
      ])
    ],
  },
  9: {
    stage1: [
      seeds("A", [0, 5, 6], miniLeagueTemplates.mini3),
      seeds("B", [1, 4, 7], miniLeagueTemplates.mini3),
      seeds("C", [2, 3, 8], miniLeagueTemplates.mini3),
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
      seeds("A", [0, 5, 6, 9], miniLeagueTemplates.mini4),
      seeds("B", [1, 4, 7], miniLeagueTemplates.mini3),
      seeds("C", [2, 3, 8], miniLeagueTemplates.mini3),
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
      seeds("A", [0, 5, 6, 10], miniLeagueTemplates.mini4),
      seeds("B", [1, 4, 7, 9], miniLeagueTemplates.mini4),
      seeds("C", [2, 3, 8], miniLeagueTemplates.mini3),
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
      seeds("A", [0, 7, 8], miniLeagueTemplates.mini3),
      seeds("B", [1, 6, 9], miniLeagueTemplates.mini3),
      seeds("C", [2, 5, 10], miniLeagueTemplates.mini3),
      seeds("D", [3, 4, 11], miniLeagueTemplates.mini3),
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
      seeds("A", [0, 5, 6, 11, 12], miniLeagueTemplates.mini5),
      seeds("B", [1, 4, 7, 10], miniLeagueTemplates.mini4),
      seeds("C", [2, 3, 8, 9], miniLeagueTemplates.mini4),
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
      seeds("A", [0, 7, 8, 13], miniLeagueTemplates.mini4),
      seeds("B", [1, 6, 9, 12], miniLeagueTemplates.mini4),
      seeds("C", [2, 5, 10], miniLeagueTemplates.mini3),
      seeds("D", [3, 4, 11], miniLeagueTemplates.mini3),
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
    results: resultsFromKnockout(14),
  },
  15: {
    stage1: [
      seeds("A", [0, 7, 8], miniLeagueTemplates.mini3),
      seeds("B", [1, 6, 9, 14], miniLeagueTemplates.mini4),
      seeds("C", [2, 5, 10, 13], miniLeagueTemplates.mini4),
      seeds("D", [3, 4, 11, 12], miniLeagueTemplates.mini4),
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
      seeds("A", [0, 7, 8, 15], miniLeagueTemplates.mini4),
      seeds("B", [1, 6, 9, 14], miniLeagueTemplates.mini4),
      seeds("C", [2, 5, 10, 13], miniLeagueTemplates.mini4),
      seeds("D", [3, 4, 11, 12], miniLeagueTemplates.mini4),
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
    results: resultsFromKnockout(16),
  },
  17: {
    stage1: [
      seeds("A", [0, 9, 10], miniLeagueTemplates.mini3),
      seeds("B", [1, 8, 11], miniLeagueTemplates.mini3),
      seeds("C", [2, 7, 12, 16], miniLeagueTemplates.mini4),
      seeds("D", [3, 6, 13], miniLeagueTemplates.mini3),
      seeds("E", [4, 5, 14, 15], miniLeagueTemplates.mini4),
    ],
    stage2: [
      {
        name: "I",
        seeds: [
          { group: "A", position: 0 },
          { group: "B", position: 1 },
          { group: "C", position: 0 },
          { group: "D", position: 1 },
          { group: "E", position: 0 },
        ],
        template: miniLeagueTemplates.mini5,
      },
      {
        name: "II",
        seeds: [
          { group: "A", position: 1 },
          { group: "B", position: 0 },
          { group: "C", position: 1 },
          { group: "D", position: 0 },
          { group: "E", position: 1 },
        ],
        template: miniLeagueTemplates.mini5,
      },
      {
        name: "III",
        seeds: [
          { group: "A", position: 2 },
          { group: "C", position: 2 },
          { group: "E", position: 2 },
        ],
        template: miniLeagueTemplates.mini3,
      },
      {
        name: "IV",
        seeds: [
          { group: "B", position: 2 },
          { group: "C", position: 3 },
          { group: "D", position: 2 },
          { group: "E", position: 3 },
        ],
        template: miniLeagueTemplates.mini4,
      },
    ],
    knockout: knockoutsFromGroups([
      {
        from: 11,
        to: 16,
        group1: "III",
        group2: "IV",
      },
      {
        from: 1,
        to: 10,
        group1: "I",
        group2: "II",
      },
    ]),
    results: [
      ...resultsFromKnockout(16),
      ...resultsForGroup("stage2", "IV", [
        { position: 3, rank: 17 },
      ]),
    ]
  },
  18: {
    stage1: [
      seeds("A", [0, 11, 12], miniLeagueTemplates.mini3),
      seeds("B", [1, 10, 13], miniLeagueTemplates.mini3),
      seeds("C", [2, 9, 14], miniLeagueTemplates.mini3),
      seeds("D", [3, 8, 15], miniLeagueTemplates.mini3),
      seeds("E", [4, 7, 16], miniLeagueTemplates.mini3),
      seeds("F", [5, 6, 17], miniLeagueTemplates.mini3),
    ],
    stage2: [
      {
        name: "I",
        seeds: [
          { group: "A", position: 0 },
          { group: "C", position: 0 },
          { group: "E", position: 0 },
        ],
        template: miniLeagueTemplates.mini3,
      },
      {
        name: "II",
        seeds: [
          { group: "B", position: 0 },
          { group: "D", position: 0 },
          { group: "F", position: 0 },
        ],
        template: miniLeagueTemplates.mini3,
      },
      {
        name: "III",
        seeds: [
          { group: "A", position: 1 },
          { group: "C", position: 1 },
          { group: "E", position: 1 },
        ],
        template: miniLeagueTemplates.mini3,
      },
      {
        name: "IV",
        seeds: [
          { group: "B", position: 1 },
          { group: "D", position: 1 },
          { group: "F", position: 1 },
        ],
        template: miniLeagueTemplates.mini3,
      },
      {
        name: "V",
        seeds: [
          { group: "A", position: 2 },
          { group: "C", position: 2 },
          { group: "E", position: 2 },
        ],
        template: miniLeagueTemplates.mini3,
      },
      {
        name: "VI",
        seeds: [
          { group: "B", position: 2 },
          { group: "D", position: 2 },
          { group: "F", position: 2 },
        ],
        template: miniLeagueTemplates.mini3,
      },
    ],
    knockout: knockoutsFromGroups([
      {
        from: 13,
        to: 18,
        group1: "V",
        group2: "VI",
      },
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
    results: resultsFromKnockout(18),
  },
  19: {
    stage1: [
      seeds("A", [0, 11, 12, 18], miniLeagueTemplates.mini4),
      seeds("B", [1, 10, 13], miniLeagueTemplates.mini3),
      seeds("C", [2, 9, 14], miniLeagueTemplates.mini3),
      seeds("D", [3, 8, 15], miniLeagueTemplates.mini3),
      seeds("E", [4, 7, 16], miniLeagueTemplates.mini3),
      seeds("F", [5, 6, 17], miniLeagueTemplates.mini3),
    ],
    stage2: [
      {
        name: "I",
        seeds: [
          { group: "A", position: 0 },
          { group: "C", position: 0 },
          { group: "E", position: 0 },
        ],
        template: miniLeagueTemplates.mini3,
      },
      {
        name: "II",
        seeds: [
          { group: "B", position: 0 },
          { group: "D", position: 0 },
          { group: "F", position: 0 },
        ],
        template: miniLeagueTemplates.mini3,
      },
      {
        name: "III",
        seeds: [
          { group: "A", position: 1 },
          { group: "C", position: 1 },
          { group: "E", position: 1 },
        ],
        template: miniLeagueTemplates.mini3,
      },
      {
        name: "IV",
        seeds: [
          { group: "B", position: 1 },
          { group: "D", position: 1 },
          { group: "F", position: 1 },
        ],
        template: miniLeagueTemplates.mini3,
      },
      {
        name: "V",
        seeds: [
          { group: "A", position: 2 },
          { group: "C", position: 2 },
          { group: "E", position: 2 },
        ],
        template: miniLeagueTemplates.mini3,
      },
      {
        name: "VI",
        seeds: [
          { group: "B", position: 2 },
          { group: "D", position: 2 },
          { group: "F", position: 2 },
          { group: "A", position: 3 },
        ],
        template: miniLeagueTemplates.mini4,
      },
    ],
    knockout: knockoutsFromGroups([
      {
        from: 13,
        to: 18,
        group1: "V",
        group2: "VI",
      },
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
      ...resultsFromKnockout(18),
      ...resultsForGroup("stage2", "VI", [
        { position: 3, rank: 19 },
      ]),
    ]
  },
  20: {
    stage1: [
      seeds("A", [0, 11, 12, 19], miniLeagueTemplates.mini4),
      seeds("B", [1, 10, 13, 18], miniLeagueTemplates.mini4),
      seeds("C", [2, 9, 14], miniLeagueTemplates.mini3),
      seeds("D", [3, 8, 15], miniLeagueTemplates.mini3),
      seeds("E", [4, 7, 16], miniLeagueTemplates.mini3),
      seeds("F", [5, 6, 17], miniLeagueTemplates.mini3),
    ],
    stage2: [
      {
        name: "I",
        seeds: [
          { group: "A", position: 0 },
          { group: "C", position: 0 },
          { group: "E", position: 0 },
        ],
        template: miniLeagueTemplates.mini3,
      },
      {
        name: "II",
        seeds: [
          { group: "B", position: 0 },
          { group: "D", position: 0 },
          { group: "F", position: 0 },
        ],
        template: miniLeagueTemplates.mini3,
      },
      {
        name: "III",
        seeds: [
          { group: "A", position: 1 },
          { group: "C", position: 1 },
          { group: "E", position: 1 },
        ],
        template: miniLeagueTemplates.mini3,
      },
      {
        name: "IV",
        seeds: [
          { group: "B", position: 1 },
          { group: "D", position: 1 },
          { group: "F", position: 1 },
        ],
        template: miniLeagueTemplates.mini3,
      },
      {
        name: "V",
        seeds: [
          { group: "A", position: 2 },
          { group: "C", position: 2 },
          { group: "E", position: 2 },
          { group: "B", position: 3 },
        ],
        template: miniLeagueTemplates.mini4,
      },
      {
        name: "VI",
        seeds: [
          { group: "B", position: 2 },
          { group: "D", position: 2 },
          { group: "F", position: 2 },
          { group: "A", position: 3 },
        ],
        template: miniLeagueTemplates.mini4,
      },
    ],
    knockout: knockoutsFromGroups([
      {
        from: 13,
        to: 20,
        group1: "V",
        group2: "VI",
      },
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
    results: resultsFromKnockout(20),
  },
  21: {
    stage1: [
      seeds("A", [0, 13, 14], miniLeagueTemplates.mini3),
      seeds("B", [1, 12, 15], miniLeagueTemplates.mini3),
      seeds("C", [2, 11, 16], miniLeagueTemplates.mini3),
      seeds("D", [3, 10, 17], miniLeagueTemplates.mini3),
      seeds("E", [4, 9, 18], miniLeagueTemplates.mini3),
      seeds("F", [5, 8, 19], miniLeagueTemplates.mini3),
      seeds("G", [6, 7, 20], miniLeagueTemplates.mini3),
    ],
    stage2: [
      {
        name: "I",
        seeds: [
          { group: "A", position: 0 },
          { group: "C", position: 0 },
          { group: "E", position: 0 },
          { group: "G", position: 0 },
        ],
        template: miniLeagueTemplates.mini4,
      },
      {
        name: "II",
        seeds: [
          { group: "B", position: 0 },
          { group: "D", position: 0 },
          { group: "F", position: 0 },
        ],
        template: miniLeagueTemplates.mini3,
      },
      {
        name: "III",
        seeds: [
          { group: "A", position: 1 },
          { group: "C", position: 1 },
          { group: "E", position: 1 },
          { group: "G", position: 1 },
        ],
        template: miniLeagueTemplates.mini4,
      },
      {
        name: "IV",
        seeds: [
          { group: "B", position: 1 },
          { group: "D", position: 1 },
          { group: "F", position: 1 },
        ],
        template: miniLeagueTemplates.mini3,
      },
      {
        name: "V",
        seeds: [
          { group: "A", position: 2 },
          { group: "C", position: 2 },
          { group: "E", position: 2 },
          { group: "G", position: 2 },
        ],
        template: miniLeagueTemplates.mini4,
      },
      {
        name: "VI",
        seeds: [
          { group: "B", position: 2 },
          { group: "D", position: 2 },
          { group: "F", position: 2 },
        ],
        template: miniLeagueTemplates.mini3,
      },
    ],
    knockout: knockoutsFromGroups([
      {
        from: 15,
        to: 20,
        group1: "V",
        group2: "VI",
      },
      {
        from: 8,
        to: 13,
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
      ...resultsFromKnockout(6),
      ...resultsForGroup("stage2", "I", [
        { position: 3, rank: 7 },
      ]),
      ...resultsFromKnockout(13, 8),
      ...resultsForGroup("stage2", "III", [
        { position: 3, rank: 14 },
      ]),
      ...resultsFromKnockout(20, 15),
      ...resultsForGroup("stage2", "V", [
        { position: 3, rank: 21 },
      ]),
    ]
  },
  22: {
    stage1: [
      seeds("A", [0, 13, 14], miniLeagueTemplates.mini3),
      seeds("B", [1, 12, 15], miniLeagueTemplates.mini3),
      seeds("C", [2, 11, 16], miniLeagueTemplates.mini3),
      seeds("D", [3, 10, 17], miniLeagueTemplates.mini3),
      seeds("E", [4, 9, 18], miniLeagueTemplates.mini3),
      seeds("F", [5, 8, 19], miniLeagueTemplates.mini3),
      seeds("G", [6, 7, 20, 21], miniLeagueTemplates.mini4),
    ],
    stage2: [
      {
        name: "I",
        seeds: [
          { group: "A", position: 0 },
          { group: "C", position: 0 },
          { group: "E", position: 0 },
          { group: "G", position: 0 },
        ],
        template: miniLeagueTemplates.mini4,
      },
      {
        name: "II",
        seeds: [
          { group: "B", position: 0 },
          { group: "D", position: 0 },
          { group: "F", position: 0 },
        ],
        template: miniLeagueTemplates.mini3,
      },
      {
        name: "III",
        seeds: [
          { group: "A", position: 1 },
          { group: "C", position: 1 },
          { group: "E", position: 1 },
          { group: "G", position: 1 },
        ],
        template: miniLeagueTemplates.mini4,
      },
      {
        name: "IV",
        seeds: [
          { group: "B", position: 1 },
          { group: "D", position: 1 },
          { group: "F", position: 1 },
        ],
        template: miniLeagueTemplates.mini3,
      },
      {
        name: "V",
        seeds: [
          { group: "A", position: 2 },
          { group: "C", position: 2 },
          { group: "E", position: 2 },
          { group: "G", position: 2 },
        ],
        template: miniLeagueTemplates.mini4,
      },
      {
        name: "VI",
        seeds: [
          { group: "B", position: 2 },
          { group: "D", position: 2 },
          { group: "F", position: 2 },
          { group: "G", position: 3 },
        ],
        template: miniLeagueTemplates.mini4,
      },
    ],
    knockout: knockoutsFromGroups([
      {
        from: 15,
        to: 22,
        group1: "V",
        group2: "VI",
      },
      {
        from: 8,
        to: 13,
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
      ...resultsFromKnockout(6),
      ...resultsForGroup("stage2", "I", [
        { position: 3, rank: 7 },
      ]),
      ...resultsFromKnockout(13, 8),
      ...resultsForGroup("stage2", "III", [
        { position: 3, rank: 14 },
      ]),
      ...resultsFromKnockout(22, 15),
    ]
  },
  23: {
    stage1: [
      seeds("A", [0, 13, 14], miniLeagueTemplates.mini3),
      seeds("B", [1, 12, 15], miniLeagueTemplates.mini3),
      seeds("C", [2, 11, 16], miniLeagueTemplates.mini3),
      seeds("D", [3, 10, 17], miniLeagueTemplates.mini3),
      seeds("E", [4, 9, 18, 22], miniLeagueTemplates.mini4),
      seeds("F", [5, 8, 19], miniLeagueTemplates.mini3),
      seeds("G", [6, 7, 20, 21], miniLeagueTemplates.mini4),
    ],
    stage2: [
      {
        name: "I",
        seeds: [
          { group: "A", position: 0 },
          { group: "C", position: 0 },
          { group: "E", position: 0 },
          { group: "G", position: 0 },
        ],
        template: miniLeagueTemplates.mini4,
      },
      {
        name: "II",
        seeds: [
          { group: "B", position: 0 },
          { group: "D", position: 0 },
          { group: "F", position: 0 },
        ],
        template: miniLeagueTemplates.mini3,
      },
      {
        name: "III",
        seeds: [
          { group: "A", position: 1 },
          { group: "C", position: 1 },
          { group: "E", position: 1 },
          { group: "G", position: 1 },
        ],
        template: miniLeagueTemplates.mini4,
      },
      {
        name: "IV",
        seeds: [
          { group: "B", position: 1 },
          { group: "D", position: 1 },
          { group: "F", position: 1 },
        ],
        template: miniLeagueTemplates.mini3,
      },
      {
        name: "V",
        seeds: [
          { group: "A", position: 2 },
          { group: "C", position: 2 },
          { group: "E", position: 2 },
          { group: "G", position: 2 },
        ],
        template: miniLeagueTemplates.mini4,
      },
      {
        name: "VI",
        seeds: [
          { group: "B", position: 2 },
          { group: "D", position: 2 },
          { group: "E", position: 3 },
          { group: "F", position: 2 },
          { group: "G", position: 3 },
        ],
        template: miniLeagueTemplates.mini5,
      },
    ],
    knockout: knockoutsFromGroups([
      {
        from: 15,
        to: 22,
        group1: "V",
        group2: "VI",
      },
      {
        from: 8,
        to: 13,
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
      ...resultsFromKnockout(6),
      ...resultsForGroup("stage2", "I", [
        { position: 3, rank: 7 },
      ]),
      ...resultsFromKnockout(13, 8),
      ...resultsForGroup("stage2", "III", [
        { position: 3, rank: 14 },
      ]),
      ...resultsFromKnockout(22, 15),
      ...resultsForGroup("stage2", "VI", [
        { position: 4, rank: 23 },
      ]),
    ]
  },
  24: {
    stage1: [
      seeds("A", [0, 15, 16], miniLeagueTemplates.mini3),
      seeds("B", [1, 14, 17], miniLeagueTemplates.mini3),
      seeds("C", [2, 13, 18], miniLeagueTemplates.mini3),
      seeds("D", [3, 12, 19], miniLeagueTemplates.mini3),
      seeds("E", [4, 11, 20], miniLeagueTemplates.mini3),
      seeds("F", [5, 10, 21], miniLeagueTemplates.mini3),
      seeds("G", [6, 9, 22], miniLeagueTemplates.mini3),
      seeds("H", [7, 8, 23], miniLeagueTemplates.mini3),
    ],
    stage2: [
      {
        name: "I",
        seeds: [
          { group: "A", position: 0 },
          { group: "C", position: 0 },
          { group: "E", position: 0 },
          { group: "G", position: 0 },
        ],
        template: miniLeagueTemplates.mini4,
      },
      {
        name: "II",
        seeds: [
          { group: "B", position: 0 },
          { group: "D", position: 0 },
          { group: "F", position: 0 },
          { group: "H", position: 0 },
        ],
        template: miniLeagueTemplates.mini4,
      },
      {
        name: "III",
        seeds: [
          { group: "A", position: 1 },
          { group: "C", position: 1 },
          { group: "E", position: 1 },
          { group: "G", position: 1 },
        ],
        template: miniLeagueTemplates.mini4,
      },
      {
        name: "IV",
        seeds: [
          { group: "B", position: 1 },
          { group: "D", position: 1 },
          { group: "F", position: 1 },
          { group: "H", position: 1 },
        ],
        template: miniLeagueTemplates.mini4,
      },
      {
        name: "V",
        seeds: [
          { group: "A", position: 2 },
          { group: "C", position: 2 },
          { group: "E", position: 2 },
          { group: "G", position: 2 },
        ],
        template: miniLeagueTemplates.mini4,
      },
      {
        name: "VI",
        seeds: [
          { group: "B", position: 2 },
          { group: "D", position: 2 },
          { group: "F", position: 2 },
          { group: "H", position: 2 },
        ],
        template: miniLeagueTemplates.mini4,
      },
    ],
    knockout: knockoutsFromGroups([
      {
        from: 17,
        to: 24,
        group1: "V",
        group2: "VI",
      },
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
    results: resultsFromKnockout(24),
  },
  25: {
    stage1: [
      seeds("A", [0, 11, 12, 23], miniLeagueTemplates.mini4),
      seeds("B", [1, 10, 13, 22, 24], miniLeagueTemplates.mini5),
      seeds("C", [2, 9, 14, 21], miniLeagueTemplates.mini4),
      seeds("D", [3, 8, 15, 20], miniLeagueTemplates.mini4),
      seeds("E", [4, 7, 16, 19], miniLeagueTemplates.mini4),
      seeds("F", [5, 6, 17, 18], miniLeagueTemplates.mini4),
    ],
    stage2: [
      {
        name: "I",
        seeds: [
          { group: "A", position: 0 },
          { group: "C", position: 0 },
          { group: "E", position: 0 },
        ],
        template: miniLeagueTemplates.mini3,
      },
      {
        name: "II",
        seeds: [
          { group: "B", position: 0 },
          { group: "D", position: 0 },
          { group: "F", position: 0 },
        ],
        template: miniLeagueTemplates.mini3,
      },
      {
        name: "III",
        seeds: [
          { group: "A", position: 1 },
          { group: "C", position: 1 },
          { group: "E", position: 1 },
        ],
        template: miniLeagueTemplates.mini3,
      },
      {
        name: "IV",
        seeds: [
          { group: "B", position: 1 },
          { group: "D", position: 1 },
          { group: "F", position: 1 },
        ],
        template: miniLeagueTemplates.mini3,
      },
      {
        name: "V",
        seeds: [
          { group: "A", position: 2 },
          { group: "C", position: 2 },
          { group: "E", position: 2 },
        ],
        template: miniLeagueTemplates.mini3,
      },
      {
        name: "VI",
        seeds: [
          { group: "B", position: 2 },
          { group: "D", position: 2 },
          { group: "F", position: 2 },
        ],
        template: miniLeagueTemplates.mini3,
      },
      {
        name: "VII",
        seeds: [
          { group: "A", position: 3 },
          { group: "B", position: 4 },
          { group: "C", position: 3 },
          { group: "E", position: 3 },
        ],
        template: miniLeagueTemplates.mini4,
      },
      {
        name: "VIII",
        seeds: [
          { group: "B", position: 3 },
          { group: "D", position: 3 },
          { group: "F", position: 3 },
        ],
        template: miniLeagueTemplates.mini3,
      },
    ],
    knockout: knockoutsFromGroups([
      {
        from: 19,
        to: 24,
        group1: "VII",
        group2: "VIII",
      },
      {
        from: 13,
        to: 18,
        group1: "V",
        group2: "VI",
      },
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
      ...resultsFromKnockout(24),
      ...resultsForGroup("stage2", "VII", [
        { position: 3, rank: 25 },
      ]),
    ],
  },
  26: {
    stage1: [
      seeds("A", [0, 15, 16], miniLeagueTemplates.mini3),
      seeds("B", [1, 14, 17], miniLeagueTemplates.mini3),
      seeds("C", [2, 13, 18], miniLeagueTemplates.mini3),
      seeds("D", [3, 12, 19], miniLeagueTemplates.mini3),
      seeds("E", [4, 11, 20], miniLeagueTemplates.mini3),
      seeds("F", [5, 10, 21], miniLeagueTemplates.mini3),
      seeds("G", [6, 9, 22, 25], miniLeagueTemplates.mini4),
      seeds("H", [7, 8, 23, 24], miniLeagueTemplates.mini4),
    ],
    stage2: [
      {
        name: "I",
        seeds: [
          { group: "A", position: 0 },
          { group: "C", position: 0 },
          { group: "E", position: 0 },
          { group: "G", position: 0 },
        ],
        template: miniLeagueTemplates.mini4,
      },
      {
        name: "II",
        seeds: [
          { group: "B", position: 0 },
          { group: "D", position: 0 },
          { group: "F", position: 0 },
          { group: "H", position: 0 },
        ],
        template: miniLeagueTemplates.mini4,
      },
      {
        name: "III",
        seeds: [
          { group: "A", position: 1 },
          { group: "C", position: 1 },
          { group: "E", position: 1 },
          { group: "G", position: 1 },
        ],
        template: miniLeagueTemplates.mini4,
      },
      {
        name: "IV",
        seeds: [
          { group: "B", position: 1 },
          { group: "D", position: 1 },
          { group: "F", position: 1 },
          { group: "H", position: 1 },
        ],
        template: miniLeagueTemplates.mini4,
      },
      {
        name: "V",
        seeds: [
          { group: "A", position: 2 },
          { group: "C", position: 2 },
          { group: "E", position: 2 },
          { group: "G", position: 2 },
          { group: "H", position: 3 },
        ],
        template: miniLeagueTemplates.mini5,
      },
      {
        name: "VI",
        seeds: [
          { group: "B", position: 2 },
          { group: "D", position: 2 },
          { group: "F", position: 2 },
          { group: "G", position: 3 },
          { group: "H", position: 2 },
        ],
        template: miniLeagueTemplates.mini5,
      },
    ],
    knockout: knockoutsFromGroups([
      {
        from: 17,
        to: 26,
        group1: "V",
        group2: "VI",
      },
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
    results: resultsFromKnockout(26),
  },
  27: {
    stage1: [
      seeds("A", [0, 15, 16], miniLeagueTemplates.mini3),
      seeds("B", [1, 14, 17], miniLeagueTemplates.mini3),
      seeds("C", [2, 13, 18], miniLeagueTemplates.mini3),
      seeds("D", [3, 12, 19], miniLeagueTemplates.mini3),
      seeds("E", [4, 11, 20], miniLeagueTemplates.mini3),
      seeds("F", [5, 10, 21, 26], miniLeagueTemplates.mini4),
      seeds("G", [6, 9, 22, 25], miniLeagueTemplates.mini4),
      seeds("H", [7, 8, 23, 24], miniLeagueTemplates.mini4),
    ],
    stage2: [
      {
        name: "I",
        seeds: [
          { group: "A", position: 0 },
          { group: "C", position: 0 },
          { group: "E", position: 0 },
          { group: "G", position: 0 },
        ],
        template: miniLeagueTemplates.mini4,
      },
      {
        name: "II",
        seeds: [
          { group: "B", position: 0 },
          { group: "D", position: 0 },
          { group: "F", position: 0 },
          { group: "H", position: 0 },
        ],
        template: miniLeagueTemplates.mini4,
      },
      {
        name: "III",
        seeds: [
          { group: "A", position: 1 },
          { group: "C", position: 1 },
          { group: "E", position: 1 },
          { group: "G", position: 1 },
        ],
        template: miniLeagueTemplates.mini4,
      },
      {
        name: "IV",
        seeds: [
          { group: "B", position: 1 },
          { group: "D", position: 1 },
          { group: "F", position: 1 },
          { group: "H", position: 1 },
        ],
        template: miniLeagueTemplates.mini4,
      },
      {
        name: "V",
        seeds: [
          { group: "A", position: 2 },
          { group: "C", position: 2 },
          { group: "E", position: 2 },
          { group: "G", position: 2 },
        ],
        template: miniLeagueTemplates.mini4,
      },
      {
        name: "VI",
        seeds: [
          { group: "B", position: 2 },
          { group: "D", position: 2 },
          { group: "F", position: 2 },
          { group: "H", position: 2 },
        ],
        template: miniLeagueTemplates.mini4,
      },
      {
        name: "VII",
        seeds: [
          { group: "F", position: 3 },
          { group: "G", position: 3 },
          { group: "H", position: 3 },
        ],
        template: miniLeagueTemplates.mini3,
      },
    ],
    knockout: knockoutsFromGroups([
      {
        from: 17,
        to: 24,
        group1: "V",
        group2: "VI",
      },
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
      ...resultsFromKnockout(24),
      ...resultsForGroup("stage2", "VII", [
        { position: 0, rank: 25 },
        { position: 1, rank: 26 },
        { position: 2, rank: 27 },
      ]),
    ],
  },
  28: {
    stage1: [
      seeds("A", [0, 13, 14, 27], miniLeagueTemplates.mini4),
      seeds("B", [1, 12, 15, 26], miniLeagueTemplates.mini4),
      seeds("C", [2, 11, 16, 25], miniLeagueTemplates.mini4),
      seeds("D", [3, 10, 17, 24], miniLeagueTemplates.mini4),
      seeds("E", [4, 9, 18, 23], miniLeagueTemplates.mini4),
      seeds("F", [5, 8, 19, 22], miniLeagueTemplates.mini4),
      seeds("G", [6, 7, 20, 21], miniLeagueTemplates.mini4),
    ],
    stage2: [
      {
        name: "I",
        seeds: [
          { group: "A", position: 0 },
          { group: "C", position: 0 },
          { group: "E", position: 0 },
          { group: "G", position: 0 },
        ],
        template: miniLeagueTemplates.mini4,
      },
      {
        name: "II",
        seeds: [
          { group: "B", position: 0 },
          { group: "D", position: 0 },
          { group: "F", position: 0 },
        ],
        template: miniLeagueTemplates.mini3,
      },
      {
        name: "III",
        seeds: [
          { group: "A", position: 1 },
          { group: "C", position: 1 },
          { group: "E", position: 1 },
          { group: "G", position: 1 },
        ],
        template: miniLeagueTemplates.mini4,
      },
      {
        name: "IV",
        seeds: [
          { group: "B", position: 1 },
          { group: "D", position: 1 },
          { group: "F", position: 1 },
        ],
        template: miniLeagueTemplates.mini3,
      },
      {
        name: "V",
        seeds: [
          { group: "A", position: 2 },
          { group: "C", position: 2 },
          { group: "E", position: 2 },
          { group: "G", position: 2 },
        ],
        template: miniLeagueTemplates.mini4,
      },
      {
        name: "VI",
        seeds: [
          { group: "B", position: 2 },
          { group: "D", position: 2 },
          { group: "F", position: 2 },
        ],
        template: miniLeagueTemplates.mini3,
      },
      {
        name: "VII",
        seeds: [
          { group: "A", position: 3 },
          { group: "C", position: 3 },
          { group: "E", position: 3 },
          { group: "G", position: 3 },
        ],
        template: miniLeagueTemplates.mini4,
      },
      {
        name: "VIII",
        seeds: [
          { group: "B", position: 3 },
          { group: "D", position: 3 },
          { group: "F", position: 3 },
        ],
        template: miniLeagueTemplates.mini3,
      },
    ],
    knockout: knockoutsFromGroups([
      {
        from: 22,
        to: 27,
        group1: "VII",
        group2: "VIII",
      },
      {
        from: 15,
        to: 20,
        group1: "V",
        group2: "VI",
      },
      {
        from: 8,
        to: 13,
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
      ...resultsFromKnockout(6),
      ...resultsForGroup("stage2", "I", [
        { position: 3, rank: 7 },
      ]),
      ...resultsFromKnockout(13, 8),
      ...resultsForGroup("stage2", "III", [
        { position: 3, rank: 14 },
      ]),
      ...resultsFromKnockout(20, 15),
      ...resultsForGroup("stage2", "V", [
        { position: 3, rank: 21 },
      ]),
      ...resultsFromKnockout(27, 22),
      ...resultsForGroup("stage2", "VII", [
        { position: 3, rank: 28 },
      ]),
    ],
  },
  29: {
    stage1: [
      seeds("A", [0, 13, 14, 27, 28], miniLeagueTemplates.mini5),
      seeds("B", [1, 12, 15, 26], miniLeagueTemplates.mini4),
      seeds("C", [2, 11, 16, 25], miniLeagueTemplates.mini4),
      seeds("D", [3, 10, 17, 24], miniLeagueTemplates.mini4),
      seeds("E", [4, 9, 18, 23], miniLeagueTemplates.mini4),
      seeds("F", [5, 8, 19, 22], miniLeagueTemplates.mini4),
      seeds("G", [6, 7, 20, 21], miniLeagueTemplates.mini4),
    ],
    stage2: [
      {
        name: "I",
        seeds: [
          { group: "A", position: 0 },
          { group: "C", position: 0 },
          { group: "E", position: 0 },
          { group: "G", position: 0 },
        ],
        template: miniLeagueTemplates.mini4,
      },
      {
        name: "II",
        seeds: [
          { group: "B", position: 0 },
          { group: "D", position: 0 },
          { group: "F", position: 0 },
        ],
        template: miniLeagueTemplates.mini3,
      },
      {
        name: "III",
        seeds: [
          { group: "A", position: 1 },
          { group: "C", position: 1 },
          { group: "E", position: 1 },
          { group: "G", position: 1 },
        ],
        template: miniLeagueTemplates.mini4,
      },
      {
        name: "IV",
        seeds: [
          { group: "B", position: 1 },
          { group: "D", position: 1 },
          { group: "F", position: 1 },
        ],
        template: miniLeagueTemplates.mini3,
      },
      {
        name: "V",
        seeds: [
          { group: "A", position: 2 },
          { group: "C", position: 2 },
          { group: "E", position: 2 },
          { group: "G", position: 2 },
        ],
        template: miniLeagueTemplates.mini4,
      },
      {
        name: "VI",
        seeds: [
          { group: "B", position: 2 },
          { group: "D", position: 2 },
          { group: "F", position: 2 },
        ],
        template: miniLeagueTemplates.mini3,
      },
      {
        name: "VII",
        seeds: [
          { group: "A", position: 3 },
          { group: "C", position: 3 },
          { group: "E", position: 3 },
          { group: "G", position: 3 },
        ],
        template: miniLeagueTemplates.mini4,
      },
      {
        name: "VIII",
        seeds: [
          { group: "A", position: 4 },
          { group: "B", position: 3 },
          { group: "D", position: 3 },
          { group: "F", position: 3 },
        ],
        template: miniLeagueTemplates.mini4,
      },
    ],
    knockout: knockoutsFromGroups([
      {
        from: 22,
        to: 29,
        group1: "VII",
        group2: "VIII",
      },
      {
        from: 15,
        to: 20,
        group1: "V",
        group2: "VI",
      },
      {
        from: 8,
        to: 13,
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
      ...resultsFromKnockout(6),
      ...resultsForGroup("stage2", "I", [
        { position: 3, rank: 7 },
      ]),
      ...resultsFromKnockout(13, 8),
      ...resultsForGroup("stage2", "III", [
        { position: 3, rank: 14 },
      ]),
      ...resultsFromKnockout(20, 15),
      ...resultsForGroup("stage2", "V", [
        { position: 3, rank: 21 },
      ]),
      ...resultsFromKnockout(29, 22),
    ],
  },
  30: {
    stage1: [
      seeds("A", [0, 19, 20], miniLeagueTemplates.mini3),
      seeds("B", [1, 18, 21], miniLeagueTemplates.mini3),
      seeds("C", [2, 17, 22], miniLeagueTemplates.mini3),
      seeds("D", [3, 16, 23], miniLeagueTemplates.mini3),
      seeds("E", [4, 15, 24], miniLeagueTemplates.mini3),
      seeds("F", [5, 14, 25], miniLeagueTemplates.mini3),
      seeds("G", [6, 13, 26], miniLeagueTemplates.mini3),
      seeds("H", [7, 12, 27], miniLeagueTemplates.mini3),
      seeds("I", [8, 11, 28], miniLeagueTemplates.mini3),
      seeds("J", [9, 10, 29], miniLeagueTemplates.mini3),
    ],
    stage2: [
      {
        name: "I",
        seeds: [
          { group: "A", position: 0 },
          { group: "C", position: 0 },
          { group: "E", position: 0 },
          { group: "G", position: 0 },
          { group: "I", position: 0 },
        ],
        template: miniLeagueTemplates.mini5,
      },
      {
        name: "II",
        seeds: [
          { group: "B", position: 0 },
          { group: "D", position: 0 },
          { group: "F", position: 0 },
          { group: "H", position: 0 },
          { group: "J", position: 0 },
        ],
        template: miniLeagueTemplates.mini5,
      },
      {
        name: "III",
        seeds: [
          { group: "A", position: 1 },
          { group: "C", position: 1 },
          { group: "E", position: 1 },
          { group: "G", position: 1 },
          { group: "I", position: 1 },
        ],
        template: miniLeagueTemplates.mini5,
      },
      {
        name: "IV",
        seeds: [
          { group: "B", position: 1 },
          { group: "D", position: 1 },
          { group: "F", position: 1 },
          { group: "H", position: 1 },
          { group: "J", position: 1 },
        ],
        template: miniLeagueTemplates.mini5,
      },
      {
        name: "V",
        seeds: [
          { group: "A", position: 2 },
          { group: "C", position: 2 },
          { group: "E", position: 2 },
          { group: "G", position: 2 },
          { group: "I", position: 2 },
        ],
        template: miniLeagueTemplates.mini5,
      },
      {
        name: "VI",
        seeds: [
          { group: "B", position: 2 },
          { group: "D", position: 2 },
          { group: "F", position: 2 },
          { group: "H", position: 2 },
          { group: "J", position: 2 },
        ],
        template: miniLeagueTemplates.mini5,
      },
    ],
    knockout: knockoutsFromGroups([
      {
        from: 21,
        to: 30,
        group1: "V",
        group2: "VI",
      },
      {
        from: 11,
        to: 20,
        group1: "III",
        group2: "IV",
      },
      {
        from: 1,
        to: 10,
        group1: "I",
        group2: "II",
      },
    ]),
    results: resultsFromKnockout(30),
  },
  31: {
    stage1: [
      seeds("A", [0, 15, 16], miniLeagueTemplates.mini3),
      seeds("B", [1, 14, 17, 30], miniLeagueTemplates.mini4),
      seeds("C", [2, 13, 18, 29], miniLeagueTemplates.mini4),
      seeds("D", [3, 12, 19, 28], miniLeagueTemplates.mini4),
      seeds("E", [4, 11, 20, 27], miniLeagueTemplates.mini4),
      seeds("F", [5, 10, 21, 26], miniLeagueTemplates.mini4),
      seeds("G", [6, 9, 22, 25], miniLeagueTemplates.mini4),
      seeds("H", [7, 8, 23, 24], miniLeagueTemplates.mini4),
    ],
    stage2: [
      {
        name: "I",
        seeds: [
          { group: "A", position: 0 },
          { group: "C", position: 0 },
          { group: "E", position: 0 },
          { group: "G", position: 0 },
        ],
        template: miniLeagueTemplates.mini4,
      },
      {
        name: "II",
        seeds: [
          { group: "B", position: 0 },
          { group: "D", position: 0 },
          { group: "F", position: 0 },
          { group: "H", position: 0 },
        ],
        template: miniLeagueTemplates.mini4,
      },
      {
        name: "III",
        seeds: [
          { group: "A", position: 1 },
          { group: "C", position: 1 },
          { group: "E", position: 1 },
          { group: "G", position: 1 },
        ],
        template: miniLeagueTemplates.mini4,
      },
      {
        name: "IV",
        seeds: [
          { group: "B", position: 1 },
          { group: "D", position: 1 },
          { group: "F", position: 1 },
          { group: "H", position: 1 },
        ],
        template: miniLeagueTemplates.mini4,
      },
      {
        name: "V",
        seeds: [
          { group: "A", position: 2 },
          { group: "C", position: 2 },
          { group: "E", position: 2 },
          { group: "G", position: 2 },
        ],
        template: miniLeagueTemplates.mini4,
      },
      {
        name: "VI",
        seeds: [
          { group: "B", position: 2 },
          { group: "D", position: 2 },
          { group: "F", position: 2 },
          { group: "H", position: 2 },
        ],
        template: miniLeagueTemplates.mini4,
      },
      {
        name: "VII",
        seeds: [
          { group: "C", position: 3 },
          { group: "E", position: 3 },
          { group: "G", position: 3 },
        ],
        template: miniLeagueTemplates.mini3,
      },
      {
        name: "VIII",
        seeds: [
          { group: "B", position: 3 },
          { group: "D", position: 3 },
          { group: "F", position: 3 },
          { group: "H", position: 3 },
        ],
        template: miniLeagueTemplates.mini4,
      },
    ],
    knockout: knockoutsFromGroups([
      {
        from: 25,
        to: 30,
        group1: "VII",
        group2: "VIII",
      },
      {
        from: 17,
        to: 24,
        group1: "V",
        group2: "VI",
      },
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
      ...resultsFromKnockout(30),
      ...resultsForGroup("stage2", "VIII", [
        { position: 3, rank: 31 },
      ]),
    ],
  },
  32: {
    stage1: [
      seeds("A", [0, 15, 16, 31], miniLeagueTemplates.mini4),
      seeds("B", [1, 14, 17, 30], miniLeagueTemplates.mini4),
      seeds("C", [2, 13, 18, 29], miniLeagueTemplates.mini4),
      seeds("D", [3, 12, 19, 28], miniLeagueTemplates.mini4),
      seeds("E", [4, 11, 20, 27], miniLeagueTemplates.mini4),
      seeds("F", [5, 10, 21, 26], miniLeagueTemplates.mini4),
      seeds("G", [6, 9, 22, 25], miniLeagueTemplates.mini4),
      seeds("H", [7, 8, 23, 24], miniLeagueTemplates.mini4),
    ],
    stage2: [
      {
        name: "I",
        seeds: [
          { group: "A", position: 0 },
          { group: "C", position: 0 },
          { group: "E", position: 0 },
          { group: "G", position: 0 },
        ],
        template: miniLeagueTemplates.mini4,
      },
      {
        name: "II",
        seeds: [
          { group: "B", position: 0 },
          { group: "D", position: 0 },
          { group: "F", position: 0 },
          { group: "H", position: 0 },
        ],
        template: miniLeagueTemplates.mini4,
      },
      {
        name: "III",
        seeds: [
          { group: "A", position: 1 },
          { group: "C", position: 1 },
          { group: "E", position: 1 },
          { group: "G", position: 1 },
        ],
        template: miniLeagueTemplates.mini4,
      },
      {
        name: "IV",
        seeds: [
          { group: "B", position: 1 },
          { group: "D", position: 1 },
          { group: "F", position: 1 },
          { group: "H", position: 1 },
        ],
        template: miniLeagueTemplates.mini4,
      },
      {
        name: "V",
        seeds: [
          { group: "A", position: 2 },
          { group: "C", position: 2 },
          { group: "E", position: 2 },
          { group: "G", position: 2 },
        ],
        template: miniLeagueTemplates.mini4,
      },
      {
        name: "VI",
        seeds: [
          { group: "B", position: 2 },
          { group: "D", position: 2 },
          { group: "F", position: 2 },
          { group: "H", position: 2 },
        ],
        template: miniLeagueTemplates.mini4,
      },
      {
        name: "VII",
        seeds: [
          { group: "A", position: 3 },
          { group: "C", position: 3 },
          { group: "E", position: 3 },
          { group: "G", position: 3 },
        ],
        template: miniLeagueTemplates.mini4,
      },
      {
        name: "VIII",
        seeds: [
          { group: "B", position: 3 },
          { group: "D", position: 3 },
          { group: "F", position: 3 },
          { group: "H", position: 3 },
        ],
        template: miniLeagueTemplates.mini4,
      },
    ],
    knockout: knockoutsFromGroups([
      {
        from: 25,
        to: 32,
        group1: "VII",
        group2: "VIII",
      },
      {
        from: 17,
        to: 24,
        group1: "V",
        group2: "VI",
      },
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
    results: resultsFromKnockout(32),
  },
} as const
export default raceConfig
// Round config tests
// - stage 2 teams <= stage 1 teams
// - knokcout teams <= stage 2 teams (or stage 1 teams)
// - bug when displaying joint results from different groups shown twice at ordered of declaration
