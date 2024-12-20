export type LeagueConfig = {
  name: string;
  tracker?: string;
}

const config = {
  western: {
    name: "Western",
    tracker: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRVRr4PgIw99JJ5ez9fFmfmLHwUTm5c-BYHpEsztFg2k3P2PCPe5yj0q2dzDUvx0qoUmkZl5B8gkfC4/pub?gid=0&single=true&output=csv&range=A6:K100',
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
} as const

export type League = keyof typeof config

export const divisions = ["mixed", "ladies", "board"] as const

export type Division = typeof divisions[number]

const typedConfig: Record<League, LeagueConfig> = config
export default typedConfig

export const leagues: League[] = Object.keys(config) as League[]

export type MiniLeagueTemplate = {
  readonly teams: number;
  readonly races: readonly [number, number][];
}

// TODO testing to validate the below i.e.
// - the count of teams matches the count of unique teams in races
// - each unique team races each other
// Naming convention is <type><number of teams>
// - type: mini - a normal mini league
// - type: full - a mini league which contains every team from that round
export const miniLeagueTemplates = {
  "mini3": {
    teams: 3,
    races: [
      [1, 2],
      [2, 3],
      [3, 1],
    ]satisfies readonly [number, number][],
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
    ]satisfies readonly [number, number][],
  },
  "mini4": {
    teams: 4,
    races: [
      [1, 2], [3, 4],
      [2, 3], [4, 1],
      [1, 3], [4, 2]
    ]satisfies readonly [number, number][],
  },
  "mini5": {
    teams: 5,
    races: [
      [1, 2], [3, 4], [2, 3],
      [4, 5], [5, 1], [4, 2],
      [5, 3], [1, 4], [2, 5], [3, 1]
    ]satisfies readonly [number, number][],
  },
  "mini6": {
    teams: 6,
    races: [
      [1, 6], [2, 5], [3, 4], [5, 1], [4, 6],
      [3, 2], [1, 4], [5, 3], [2, 6], [3, 1],
      [4, 2], [6, 5], [1, 2], [6, 3], [5, 4],
    ]satisfies readonly [number, number][],
  }
} as const satisfies {
  [k: string]: MiniLeagueTemplate
}

export type MiniLeagueConfig = {
  readonly name: string;
  readonly seeds: number[];
  readonly template: MiniLeagueTemplate;
}

export type RoundConfig = {
  readonly set1: MiniLeagueConfig[];
  readonly set2?: MiniLeagueConfig[];
  readonly knockout?: string[];
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
    set1: [
      {
        name: "A",
        seeds: [1, 2, 3],
        template: miniLeagueTemplates.full3,
      },
    ] satisfies readonly MiniLeagueConfig[],
  },
  4: {
    set1: [
      {
        name: "A",
        seeds: [1, 2, 3, 4],
        template: miniLeagueTemplates.mini4,
      },
    ] satisfies readonly MiniLeagueConfig[],
  },
  5: {
    set1: [
      {
        name: "A",
        seeds: [1, 2, 3, 4, 5],
        template: miniLeagueTemplates.mini5,
      },
    ] satisfies readonly MiniLeagueConfig[],
  },
  6: {
    set1: [
      {
        name: "A",
        seeds: [1, 2, 3, 4, 5, 6],
        template: miniLeagueTemplates.mini6,
      },
    ] satisfies readonly MiniLeagueConfig[],
  },
  7: {
    set1: [
      {
        name: "A",
        seeds: [1, 4, 5, 7],
        template: miniLeagueTemplates.mini4,
      },
      {
        name: "B",
        seeds: [2, 3, 6],
        template: miniLeagueTemplates.mini3,
      },
    ] satisfies readonly MiniLeagueConfig[],
  },
  8: {
    set1: [
      {
        name: "A",
        seeds: [1, 4, 5, 8],
        template: miniLeagueTemplates.mini4,
      },
      {
        name: "B",
        seeds: [2, 3, 6, 7],
        template: miniLeagueTemplates.mini4,
      },
    ] satisfies readonly MiniLeagueConfig[],
  },
} as const
