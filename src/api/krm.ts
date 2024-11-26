import { League, LeagueData, RoundSeeding } from "../kings"

function getStorageKeyRounds() {
  return "kings-round-ids"
}

function getStorageKeyLeague() {
  return "kings-selected-league"
}

function getStorageKeyLeagueConfig(league: League) {
  return `kings-${league}-config`
}

function newStorageKeyRound(league: League) {
  return `${league}-${new Date().getTime()}`
}

type Round = {
  id: string;
  league: League;
  status: string;
  date: Date;
  description: string;
  venue: string;
  teams: RoundSeeding;
  races: unknown;
}

type RoundInfo = Omit<Round, "races">

// TODO transition to async so we can support indexedDB and an eventual API
export default {
  saveSelectedLeague(league: League) {
    localStorage.setItem(getStorageKeyLeague(), league)
  },
  getSelectedLeague(): League | null {
    return localStorage.getItem(getStorageKeyLeague()) as League | null
  },
  saveLeagueConfig(league: League, config: LeagueData) {
    localStorage.setItem(getStorageKeyLeagueConfig(league), JSON.stringify(config))
  },
  getLeagueConfig(league: League): LeagueData | null {
    return JSON.parse(localStorage.getItem(getStorageKeyLeagueConfig(league)))
  },
  createRound(league: League, teams: RoundSeeding): Round {
    const round: Round = {
      id: newStorageKeyRound(league),
      league,
      date: new Date(),
      description: "Round 2",
      venue: "Gloucester",
      status: "In Progress",
      races: {},
      teams,
    }
    localStorage.setItem(round.id, JSON.stringify(round))
    const keyRoundIds = getStorageKeyRounds()
    const roundIds = JSON.parse(localStorage.getItem(keyRoundIds) ?? "[]") as string[]
    roundIds.push(round.id)
    localStorage.setItem(keyRoundIds, JSON.stringify(roundIds))
    return round
  },
  getRounds(): RoundInfo[] {
    const ids = JSON.parse(localStorage.getItem(getStorageKeyRounds()) ?? "[]") as string[]
    // Wasteful but should be fine - can always convert to async for perf
    return ids
      .map(id => this.getRound(id))
      .filter(round => !!round)
      .map(round => {
        return {
          ...round,
          date: new Date(round.date),
          races: undefined,
        }
      })
  },
  getRound(id: string): Round {
    return JSON.parse(localStorage.getItem(id))
  },
  deleteRound(id: string) {
    localStorage.removeItem(id)
    const keyRoundIds = getStorageKeyRounds()
    const roundIds = JSON.parse(localStorage.getItem(keyRoundIds) ?? "[]") as string[]
    const updated = roundIds.filter(rid => rid !== id)
    localStorage.setItem(keyRoundIds, JSON.stringify(updated))
  }
}
