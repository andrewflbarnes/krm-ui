import { useSearchParams } from "@solidjs/router";
import { batch, createContext, createSignal, ParentProps, useContext } from "solid-js"
import kings, { leagues, type League } from "../config"

const makeContext = (league: League) => {
  const [key, setKey] = createSignal(league);
  const [config, setConfig] = createSignal(kings[league]);
  const setLeague = (newLeague: League) => {
    batch(() => {
      setKey(newLeague)
      const newConfig = kings[newLeague]
      setConfig(newConfig)
    })
  }
  return [{ key, config }, { setLeague }] as const
}

const KingsContext = createContext(makeContext(leagues[0]))

export function KingsProvider(props: ParentProps<{}>) {
  const qps = new URLSearchParams(window.location.search)
  const l = qps.get("league")?.toLowerCase() as League | undefined
  const ctx = makeContext(l ?? leagues[0])

  return (
    <KingsContext.Provider value={ctx}>
      {props.children}
    </KingsContext.Provider>
  )
}

export function useKings() {
  const [state, actions] = useContext(KingsContext)
  const setLeague = actions.setLeague
  const [, setSearchParams] = useSearchParams()
  const setLeagueWithSearch = (league: League) => {
    setLeague(league)
    setSearchParams({ league })
  }
  const updatedActions = { ...actions, setLeague: setLeagueWithSearch }
  return [state, updatedActions] as const
}

export function useKingsLeagueChanger() {
  const [, { setLeague }] = useKings()
  return setLeague
}
