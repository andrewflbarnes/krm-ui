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

export type MiniLeagueConfig = {
  [k: number | string]: {
    teams: number;
    races: [number, number][];
  }
}

// TODO testing to validate the below i.e.
// - the count of teams matches the count of unique teams in races
// - each unique team races each other
export const miniLeagueConfig: MiniLeagueConfig = {
  4: {
    teams: 4,
    races: [
      [1, 2], [3, 4],
      [2, 3], [4, 1],
      [1, 3], [4, 2]
    ],
  },
  5: {
    teams: 5,
    races: [
      [1, 2], [3, 4], [2, 3],
      [4, 5], [5, 1], [4, 2],
      [5, 3], [1, 4], [2, 5], [3, 1]
    ],
  },
  6: {
    teams: 6,
    races: [
      [1, 6], [2, 5], [3, 4], [5, 1], [4, 6],
      [3, 2], [1, 4], [5, 3], [2, 6], [3, 1],
      [4, 2], [6, 5], [1, 2], [6, 3], [5, 4],
    ],
  }
}

export type RoundConfig = {
  [teamCount: number]: {
    round1: RoundMiniLeagueConfig[];
    round2?: RoundMiniLeagueConfig[];
    knockout?: string[];
  }
}

export type RoundMiniLeagueConfig = {
  name: string;
  seeds: number[];
  // TODO get exact types for the below using derived types and consts etc.
  miniLeague: keyof MiniLeagueConfig;
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
export const raceConfig: RoundConfig = {
  4: {
    round1: [
      {
        name: "A",
        seeds: [1, 2, 3, 4],
        miniLeague: 4,
      },
    ]
  },
  5: {
    round1: [
      {
        name: "A",
        seeds: [1, 2, 3, 4, 5],
        miniLeague: 5,
      },
    ]
  },
  6: {
    round1: [
      {
        name: "A",
        seeds: [1, 2, 3, 4, 5, 6],
        miniLeague: 6,
      },
    ]
  }
}
