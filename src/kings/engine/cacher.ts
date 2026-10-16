import type { League, LeagueData, Round } from "../"
import { leagues } from "../"

export default (function() {
  function getStorageKeyRounds() {
    return "kings-round-ids"
  }

  function getStorageKeyLeagueConfig(league: League) {
    return `kings-${league}-config`
  }

  function saveRound(round: Round) {
    localStorage.setItem(round.id, JSON.stringify(round))
    const keyRoundIds = getStorageKeyRounds()
    let roundIds = JSON.parse(localStorage.getItem(keyRoundIds) ?? "[]") as string[]
    roundIds = roundIds.filter(rid => rid !== round.id)
    roundIds.push(round.id)
    localStorage.setItem(keyRoundIds, JSON.stringify(roundIds))
  }

  function getRoundsIds() {
    return JSON.parse(localStorage.getItem(getStorageKeyRounds()) ?? "[]") as string[]
  }

  function getRound(id: string): Round | null {
    const r = JSON.parse(localStorage.getItem(id))
    if (!r) {
      return null
    }
    const { details } = r
    return {
      ...r,
      details: {
        ...details,
        date: details.date ? new Date(details.date) : new Date(),
      }
    }
  }

  function saveLeagueConfig(league: League, config: LeagueData) {
    localStorage.setItem(getStorageKeyLeagueConfig(league), JSON.stringify(config))
  }

  function getLeagueConfig(league: League): LeagueData | null {
    return JSON.parse(localStorage.getItem(getStorageKeyLeagueConfig(league)))
  }

  function clearData() {
    const ids = JSON.parse(localStorage.getItem(getStorageKeyRounds()) ?? "[]") as string[]
    ids.forEach(id => {
      localStorage.removeItem(id)
    })
    for (const league of leagues) {
      localStorage.removeItem(getStorageKeyLeagueConfig(league))
    }
    localStorage.removeItem(getStorageKeyRounds())
    localStorage.removeItem("kings-selected-league")
  }

  function deleteRound(id: string) {
    localStorage.removeItem(id)
    const keyRoundIds = getStorageKeyRounds()
    const roundIds = JSON.parse(localStorage.getItem(keyRoundIds) ?? "[]") as string[]
    const updated = roundIds.filter(rid => rid !== id)
    localStorage.setItem(keyRoundIds, JSON.stringify(updated))
  }

  return {
    saveRound,
    getRound,
    getRoundsIds,
    deleteRound,
    saveLeagueConfig,
    getLeagueConfig,
    clearData,
  }
})()
