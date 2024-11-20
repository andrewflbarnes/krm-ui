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
