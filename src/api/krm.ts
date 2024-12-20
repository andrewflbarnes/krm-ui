import { Division, League, LeagueData, Race, raceConfig, RoundConfig, RoundSeeding } from "../kings"

export type SetRaces = {
  [division in Division]: {
    [group: string]: Race[]
  }
}

export type Round = {
  id: string;
  league: League;
  status: string;
  date: Date;
  description: string;
  venue: string;
  teams: RoundSeeding;
  config: {
    [division in Division]: RoundConfig;
  };
  races: {
    set1: SetRaces;
    set2?: SetRaces;
    knockout?: unknown;
  }
}

export type RoundInfo = Omit<Round, "races">

// TODO transition to async so we can support indexedDB and an eventual API
// TODO transition to tanstack query
export type KrmApi = {
  saveLeagueConfig(league: League, config: LeagueData): void;
  getLeagueConfig(league: League): LeagueData | null;
  createRound(league: League, teams: RoundSeeding): Round;
  getRounds(league?: string): RoundInfo[];
  getRound(id: string): Round;
  deleteRound(id: string): void;
  updateRace(id: string, race: Race): void;
}

export default (function krmApiLocalStorage(): KrmApi {
  function getStorageKeyRounds() {
    return "kings-round-ids"
  }

  function getStorageKeyLeagueConfig(league: League) {
    return `kings-${league}-config`
  }

  function newStorageKeyRound(league: League) {
    return `${league}-${new Date().getTime()}`
  }

  function saveRound(round: Round) {
    localStorage.setItem(round.id, JSON.stringify(round))
    const keyRoundIds = getStorageKeyRounds()
    let roundIds = JSON.parse(localStorage.getItem(keyRoundIds) ?? "[]") as string[]
    roundIds = roundIds.filter(rid => rid !== round.id)
    roundIds.push(round.id)
    localStorage.setItem(keyRoundIds, JSON.stringify(roundIds))
  }

  return {
    saveLeagueConfig(league: League, config: LeagueData) {
      localStorage.setItem(getStorageKeyLeagueConfig(league), JSON.stringify(config))
    },
    getLeagueConfig(league: League): LeagueData | null {
      return JSON.parse(localStorage.getItem(getStorageKeyLeagueConfig(league)))
    },
    createRound(league: League, teams: RoundSeeding): Round {
      const config = Object.entries(teams).reduce((acc, [division, seeds]) => {
        acc[division] = raceConfig[seeds.length]
        return acc
      }, {} as {
        [division in Division]: RoundConfig;
      })

      const races = Object.entries(config).reduce((acc, [division, divisionConf]) => {
        acc[division] = divisionConf.set1.reduce((accd, { template, name, seeds }) => {
          accd[name] = template.races.map((race, i) => ({
            set: "set1",
            group: name,
            groupRace: i,
            // both race indexes and seeds are 1-indexed
            teamMlIndices: race,
            team1: teams[division][seeds[race[0] - 1] - 1],
            team2: teams[division][seeds[race[1] - 1] - 1],
            division: division as Division,
          }))
          return accd
        }, {} as {
          [group: string]: Race[]
        })
        return acc
      }, {} as {
        [division in Division]: {
          [group: string]: Race[]
        }
      })
      // TODO details
      const round: Round = {
        id: newStorageKeyRound(league),
        league,
        date: new Date(),
        description: "Round 2",
        venue: "Gloucester",
        status: "In Progress",
        config,
        races: {
          set1: races,
        },
        teams,
      }
      saveRound(round)
      return round
    },
    getRounds(league?: string): RoundInfo[] {
      const ids = JSON.parse(localStorage.getItem(getStorageKeyRounds()) ?? "[]") as string[]
      // Wasteful but should be fine - can always convert to async for perf
      return ids
        .map(id => this.getRound(id) as Round)
        .filter(round => !!round)
        .filter(round => !league || round.league === league)
        .map(round => {
          return {
            ...round,
            date: new Date(round.date),
            races: undefined,
          }
        })
    },
    getRound(id: string): Round {
      const r = JSON.parse(localStorage.getItem(id))
      return {
        ...r,
        date: r.date ? new Date(r.date) : r,
      }
    },
    deleteRound(id: string) {
      localStorage.removeItem(id)
      const keyRoundIds = getStorageKeyRounds()
      const roundIds = JSON.parse(localStorage.getItem(keyRoundIds) ?? "[]") as string[]
      const updated = roundIds.filter(rid => rid !== id)
      localStorage.setItem(keyRoundIds, JSON.stringify(updated))
    },
    updateRace(id, race) {
      const { set, division, group, groupRace } = race
      const round: Round = this.getRound(id)
      const groupRaces = round.races[set]?.[division]?.[group]
      if (!groupRaces || !groupRaces[groupRace]) {
        console.error(`No race exists for ${set} ${division} ${group} ${groupRace}`, round.races)
        throw new Error(`No race exists for ${set} ${division} ${group} ${groupRace}`)
      }
      groupRaces[groupRace] = race
      saveRound(round)
    },
  }
})()
