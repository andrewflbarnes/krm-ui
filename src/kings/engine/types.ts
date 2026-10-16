import { League, LeagueData, Race, RoundConfig, RoundSeeding, Round, RaceStage, Stage, MiniLeagueTemplate } from "../types"

export type CustomConfig<T> = {
  configs: {
    id: string;
    owner: string;
    description?: string;
    config: T;
  }[];
}
export type CustomRoundConfigs = CustomConfig<RoundConfig>
export type CustomMiniLeagueTemplates = CustomConfig<MiniLeagueTemplate>

export type RoundInfo = Omit<Round, "races">
export type ProgressionStage = Exclude<Stage, "stage1">;
export type RoundDetails = {
  league: League;
  round: string;
  venue: string;
  season: string;
  description: string;
}
export type KrmEngine = {
  clearLocalData(): void;
  saveLeagueConfig(league: League, config: LeagueData): void;
  getLeagueConfig(league: League): LeagueData | null;
  createRound(details: RoundDetails, teams: RoundSeeding, raceConfigs: Record<number, RoundConfig>, distributionOrder?: RoundSeeding): Round;
  saveRound(round: Round): void;
  getRounds(league?: string): RoundInfo[];
  getRound(id: string): Round | null;
  deleteRound(id: string): void;
  updateRace(id: string, race: Race): void;
  progressRound(id: string): ProgressionStage;
  reopenStage(id: string, stage: RaceStage, user: string): void;
  getCustomRoundConfigs(): Promise<CustomRoundConfigs>;
  getCustomMiniLeagueConfigs(): Promise<CustomMiniLeagueTemplates>;
}

