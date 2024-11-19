import { useSearchParams } from "@solidjs/router";
import { batch, createContext, createMemo, createSignal, ParentProps, useContext } from "solid-js"
import { leagues, type League } from "./config"
import kings from "./config"
import { LeagueData } from "./types";

function getStorageKeyLeague() {
  return "kings-selected-league"
}

function getStorageKeyLeagueConfig(league: League) {
  return `kings-${league}-config`
}

function getStoredLeagueConfig(league: League): LeagueData | null {
  return JSON.parse(localStorage.getItem(getStorageKeyLeagueConfig(league)))
}

const makeContext = (initLeague?: League) => {
  const league = initLeague ?? localStorage.getItem(getStorageKeyLeague()) as League ?? leagues[0]
  localStorage.setItem(getStorageKeyLeague(), league)
  const [key, setKey] = createSignal(league);
  const [config, setConfig] = createSignal(kings[league]);
  const lc = getStoredLeagueConfig(league)
  const [leagueConfig, setLeagueConfig] = createSignal(lc)
  const setLeague = (newLeague: League) => {
    batch(() => {
      setKey(newLeague)
      const newConfig = kings[newLeague]
      setConfig(newConfig)
    })
  }
  return [{ league: key, config, leagueConfig }, { setLeague, setLeagueConfig }] as const
}

const KingsContext = createContext(makeContext())

export function KingsProvider(props: ParentProps<{}>) {
  const qps = new URLSearchParams(window.location.search)
  const l = qps.get("league")?.toLowerCase() as League | undefined
  const ctx = makeContext(l)

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
    actions.setLeague(league)
    localStorage.setItem(getStorageKeyLeague(), league)
    const lc = getStoredLeagueConfig(league)
    actions.setLeagueConfig(lc)
    setSearchParams({ league })
  }
  const setLeagueConfigEnhanced = (config: LeagueData) => {
    localStorage.setItem(getStorageKeyLeagueConfig(state.league()), JSON.stringify(config))
    actions.setLeagueConfig(config)
  }
  const enhancedActions = {
    ...actions,
    setLeague: setLeagueEnhanced,
    setLeagueConfig: setLeagueConfigEnhanced,
  }
  return [state, enhancedActions] as const
}

export function useKingsLeagueChanger() {
  const [, { setLeague }] = useKings()
  return setLeague
}
