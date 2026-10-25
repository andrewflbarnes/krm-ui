import { MiniLeagueTemplate } from "@/kings/types";

// Naming convention is <type><number of teams>
// - type: mini - a normal mini league
// - type: full - a mini league which contains every team from that round
export const miniLeagueTemplates = {
  "single": {
    teams: 1,
    races: [],
  },
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
  "full4": {
    teams: 4,
    races: [
      [0, 1], [2, 3],
      [1, 2], [3, 0],
      [0, 2], [3, 1],
      [1, 0], [3, 2],
      [2, 1], [0, 3],
      [2, 0], [1, 3]
    ],
  },
  "mini5": {
    teams: 5,
    races: [
      [0, 1], [2, 3],
      [1, 2], [3, 4],
      [4, 0], [3, 1],
      [4, 2], [0, 3],
      [1, 4], [2, 0],
    ],
  },
  "mini6": {
    teams: 6,
    races: [
      [0, 5], [1, 4], [2, 3],
      [4, 0], [3, 5], [2, 1],
      [0, 3], [4, 2], [1, 5],
      [2, 0], [3, 1], [5, 4],
      [0, 1], [5, 2], [4, 3],
    ],
  }
} as const satisfies {
  [k: string]: MiniLeagueTemplate
}
