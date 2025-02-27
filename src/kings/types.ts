export const divisions = ["mixed", "ladies", "board"] as const
export const leagues = ["western", "midlands", "southern", "northern", "scotland"] as const

export type Division = typeof divisions[number];

export type League = typeof leagues[number];

export type RaceStage = "stage1" | "stage2" | "knockout";

export type Race = {
  readonly division: Division;
  readonly stage: RaceStage;
  readonly group: string;
  readonly groupRace: number;
  // The 1-indexed team indices from the minileage seeds
  readonly teamMlIndices: readonly [number, number];
  readonly team1: string;
  readonly team2: string;
  winner?: 1 | 2;
  team1Dsq?: boolean;
  team2Dsq?: boolean;
};

export type Races = {
  [division in Division]: {
    [group: string]: Race[]
  }
}

export type GroupRaces = {
  teams: string[];
  races: Race[];
  complete: boolean;
  conflict: boolean;
  results?: string[][];
}

export type StageRaces = {
  [division in Division]: {
    [group: string]: GroupRaces;
  }
}

export type MiniLeagueTemplate = {
  readonly teams: number;
  readonly races: readonly (readonly [number, number])[];
}

export type MiniLeagueConfig = {
  readonly name: string;
  readonly seeds: readonly { readonly group: string, readonly position: number }[];
  readonly template: MiniLeagueTemplate;
}

/**
  * For example, the below would indicate 2nd place in group A of the 1st stage
  * came 8th overall in their division.
  * @example
  * {
  *   stage: "stage1",
  *   group: "A",
  *   position: 2,
  *   rank: 8,
  * }
  *
  */
export type ResultsConfig = {
  stage: RaceStage;
  group: string;
  position: number;
  rank: number;
}

export type RoundConfig = {
  readonly stage1: readonly MiniLeagueConfig[];
  readonly stage2?: readonly MiniLeagueConfig[];
  readonly knockout?: readonly MiniLeagueConfig[];
  readonly results: readonly ResultsConfig[];
}

export type RoundStatus = RaceStage | "complete" | "abandoned";

export type RoundResult = {
  rank: number;
  rankStr: string;
  teams: string[];
}

export type Round = {
  id: string;
  owner: string;
  league: League;
  status: RoundStatus;
  date: Date;
  description: string;
  venue: string;
  teams: RoundSeeding;
  config: {
    [division in Division]: RoundConfig;
  };
  races: {
    stage1: StageRaces;
    stage2?: StageRaces;
    knockout?: StageRaces;
  };
  results?: {
    [division in Division]: RoundResult[]
  }
}

export type Result = {
  club: string;
  name: string;
  r1?: number;
  r2?: number;
  r3?: number;
  r4?: number;
  total?: number;
}

export type DivisionResults = {
  [division: string]: Result[]
}

export type LeagueData = {
  [club: string]: {
    teams: {
      [division: string]: {
        [team: string]: {
          results: [number, number][]
          total: number,
        }
      }
    }
  }
}

export type RoundSeeding = {
  [k in Division]: string[]
}

export type ClubSeeding = {
  [club: string]: {
    [k in Division[number]]: number
  }
}
