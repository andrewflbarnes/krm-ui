import { Division } from "./kings";

export type Race = {
  division: Division;
  group: string;
  groupRace: number;
  team1: string;
  team2: string;
};

export type RaceResult = {
  winner?: 1 | 2;
  team1Dsq?: boolean;
  team2Dsq?: boolean;
}
