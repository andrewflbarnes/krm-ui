import { useSearchParams } from "@solidjs/router";
import { batch, createContext, createSignal, ParentProps, useContext } from "solid-js"
import { leagues, type League } from "./config"
import kings from "./config"
import { LeagueData } from "./types";
import krmApi from "../api/krm"

const makeContext = (initLeague?: League) => {
  let league = initLeague
  if (!kings[league]) {
    league = krmApi.getSelectedLeague()
  }
  if (!kings[league]) {
    league = leagues[0]
  }
  krmApi.saveSelectedLeague(league)
  const [lock, setLock] = createSignal(false)
  const [selectedLeague, setSelectedLeague] = createSignal(league);
  const [config, setConfig] = createSignal(kings[league]);
  const lc = krmApi.getLeagueConfig(league)
  const [leagueConfig, setLeagueConfig] = createSignal(lc)
  const setLeague = (newLeague: League) => {
    batch(() => {
      setSelectedLeague(newLeague)
      const newConfig = kings[newLeague]
      setConfig(newConfig)
    })
  }
  return [{ league: selectedLeague, config, leagueConfig, lock }, { setLock, setLeague, setLeagueConfig }] as const
}

const KingsContext = createContext(makeContext())

export function KingsProvider(props: ParentProps) {
  const qps = new URLSearchParams(window.location.search)
  const l = qps.get("league")?.toLowerCase() as League | undefined
  const ctx = makeContext(l)
  // TODO rather than defaulting show error message to user
  const ctxLeague = ctx[0].league()
  if (ctxLeague != l) {
    const qpstr = qps.toString()
    history.replaceState({}, "", qpstr.length ? "?" + qps.toString() : "")
  }

  return (
    <KingsContext.Provider value={ctx}>
      {props.children}
    </KingsContext.Provider>
  )
}

export function useKings() {
  const [state, actions] = useContext(KingsContext)
  const [, setSearchParams] = useSearchParams()
  const setLeagueEnhanced = (league: League) => {
    if (state.lock()) {
      // TODO alert?
      return
    }
    if (!kings[league]) {
      // TODO alert?
      return
    }
    actions.setLeague(league)
    krmApi.saveSelectedLeague(league)
    const lc = krmApi.getLeagueConfig(league)
    actions.setLeagueConfig(lc)
    setSearchParams({ league })
  }
  const setLeagueConfigEnhanced = (config: LeagueData) => {
    krmApi.saveLeagueConfig(state.league(), config)
    actions.setLeagueConfig(config)
  }
  const addLeagueTeams = (teams: { club: string, division: string, team: string }[]) => {
    const lc = state.leagueConfig() ?? {}
    const newLC = { ...lc }
    teams.forEach(({ club, division, team }) => {
      if (!newLC[club]) {
        newLC[club] = { teams: {} }
      }
      const teams = newLC[club].teams
      if (!teams[division]) {
        teams[division] = {}
      }
      teams[division][team] = {
        results: [
          [null, null],
          [null, null],
          [null, null],
          [null, null],
        ],
        total: null,
      }
    })
    setLeagueConfigEnhanced(newLC)
  }

  const lock = () => actions.setLock(true)
  const unlock = () => actions.setLock(false)
  const enhancedActions = {
    ...actions,
    lock,
    unlock,
    setLeague: setLeagueEnhanced,
    setLeagueConfig: setLeagueConfigEnhanced,
    addLeagueTeams,
  }
  return [state, enhancedActions] as const
}

export function useKingsLeagueChanger() {
  const [, { setLeague }] = useKings()
  return setLeague
}
