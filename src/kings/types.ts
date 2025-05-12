export const divisions = ["mixed", "ladies", "board"] as const
export const leagues = ["western", "midlands", "southern", "northern", "scotland"] as const

export type Division = typeof divisions[number];

export type League = typeof leagues[number];

export type RaceStage = "stage1" | "stage2" | "knockout";
export type Stage = RaceStage | "complete";

export type Race = {
  /** The division this race is in */
  readonly division: Division;
  /** The stage this races is in */
  readonly stage: RaceStage;
  /** The minileague group this race is in */
  readonly group: string;
  /** The number of the race in the minileague group */
  readonly groupRace: number;
  /** The team indices from the minileage config - this is redundant
    * information since team1 and team2 preserve this order
    */
  readonly teamMlIndices: readonly [number, number];
  /** The first team in the race e.g. left/red course */
  readonly team1: string;
  /** The second team in the race e.g. right/blue course */
  readonly team2: string;
  winner?: 1 | 2;
  team1Dsq?: boolean;
  team2Dsq?: boolean;
  indicators?: "by" | "skip"
};

export type GroupRaces = {
  /** The teams in this group */
  teams: string[];
  /** The races in this group */
  races: Race[];
  /** Whether all races are finished */
  complete: boolean;
  /** Whether there is a draw or other conflict if all races are complete */
  conflict: boolean;
  /** The rankings if races are complete - draws have multiple teams in one array */
  results?: string[][];
}

/** All races for a given stage -> division -> group */
export type StageRaces = {
  [division in Division]: {
    [group: string]: GroupRaces;
  }
}

/** A template of races for a minileague with a specific number of teams */
export type MiniLeagueTemplate = {
  /** The number of teams in the minileague */
  readonly teams: number;
  /** The races in this minileague by team index. Order determines course side */
  readonly races: readonly (readonly [number, number])[];
}

/** A seed from the previous round (or initial seeding) */
export type MiniLeagueSeed = {
  /** The group from the previous round to seed from */
  readonly group: string,
  /** The position in the group to seed from */
  readonly position: number,
}

/** A concrete minileague configuration for a specific group and seeds */
export type MiniLeagueConfig = {
  /** The name of the minileague */
  readonly name: string;
  /** The seeds from the previous round (or initial seeding) */
  readonly seeds: readonly MiniLeagueSeed[];
  /** The template of races for this minileague */
  readonly template: MiniLeagueTemplate;
}

/**
  * For example, the below would indicate 2nd place in group A of the 1st stage
  * came 8th overall in their division.
  * @example
  * {
  *   stage: "stage1",
  *   group: "A",
  *   position: 1,
  *   rank: 8,
  * }
  *
  */
export type ResultsConfig = {
  /** The stage to get the team from */
  stage: RaceStage;
  /** The group to get the team from */
  group: string;
  /** The position in the group results to get the team from */
  position: number;
  /** The 1 indexed rank of the team e.g. 1 => 1st */
  rank: number;
}

/** Concrete configuration for a round of races */
export type RoundConfig = {
  /** Config for stage 1 races */
  readonly stage1: readonly MiniLeagueConfig[];
  /** Config for stage 2 races */
  readonly stage2?: readonly MiniLeagueConfig[];
  /** Config for knockout races */
  readonly knockout?: readonly MiniLeagueConfig[];
  /** Config for results */
  readonly results: readonly ResultsConfig[];
}

export type RoundStatus = RaceStage | "complete" | "abandoned";

/** A result for a completed round */
export type RoundResult = {
  /** The rank of the team(s) e.g. 1 => 1st */
  rank: number;
  /** The rank of the team(s) as a string e.g. 1st */
  rankStr: string;
  /** The team(s) at this rank */
  teams: string[];
}

/** Full configuration for a round including races and metadata */
export type Round = {
  /** The unique ID of the round */
  id: string;
  /** The user this round is owned by i.e. usually the creator */
  owner: string;
  /** The league this round is part of */
  league: League;
  /** Metadata for the round */
  details: {
    /** The round number/type e.g. 1, 2, 3, 4, finals */
    round: string;
    /** Short description of the round */
    description: string;
    /** The location of the round */
    venue: string;
    /** The date the round took place */
    date: Date;
  };
  /** The current status of the round */
  status: RoundStatus;
  /** The teams in the round, ordered by seeding */
  teams: RoundSeeding;
  /** The teams in the round, ordered by distribution into minileagues
   *  which may differ if there are inter group swaps
   */
  distributionOrder: RoundSeeding;
  /** Config for each division in the round */
  config: {
    [division in Division]: RoundConfig;
  };
  /** Races, and their results, for each stage in the round */
  races: {
    stage1: StageRaces;
    stage2?: StageRaces;
    knockout?: StageRaces;
  };
  /** Overall results for each division in the round */
  results?: {
    [division in Division]: RoundResult[]
  }
}

/** Results for a given team in a season */
export type Result = {
  /** The club the team is part of */
  club: string;
  /** The name of the team */
  name: string;
  /** The points scored in round 1 */
  r1?: number;
  /** The points scored in round 2 */
  r2?: number;
  /** The points scored in round 3 */
  r3?: number;
  /** The points scored in round 4 */
  r4?: number;
  /** The total points scored in the season */
  total?: number;
}

/** All results for divisions in a season */
export type DivisionResults = {
  [division: string]: Result[]
}

/** All results in a season by club, then division, then team */
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

/** The competing teams for a round by division, then seed order */
export type RoundSeeding = {
  [k in Division]: string[]
}

/** The number of seeded teams clubs have by division */
export type ClubSeeding = {
  [club: string]: {
    [k in Division]: number
  }
}
