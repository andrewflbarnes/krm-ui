import { Division } from "./config";

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

export type Race = {
  division: Division;
  stage: "stage1" | "stage2";
  group: string;
  groupRace: number;
  // The 1-indexed team indices from the minileage seeds
  teamMlIndices: [number, number];
  team1: string;
  team2: string;
  winner?: 1 | 2;
  team1Dsq?: boolean;
  team2Dsq?: boolean;
};

export type Races = {
  [division in Division]: {
    [group: string]: Race[]
  }
}
