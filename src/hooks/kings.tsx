import { batch, createContext, createSignal, ParentProps, useContext } from "solid-js"
import kings, { leagues, type League } from "../config"

const makeContext = (league: League) => {
  const [key, setKey] = createSignal(league);
  const [config, setConfig] = createSignal(kings[league]);
  const setLeague = (newLeague: League) => {
    batch(() => {
      setKey(newLeague)
      setConfig(kings[newLeague])
    })
  }
  return [{ key, config }, { setLeague }] as const
}

const KingsContext = createContext(makeContext(leagues[0]))

export function KingsProvider(props: ParentProps<{ league?: League }>) {
  const l = props.league ?? leagues[0]
  const ctx = makeContext(l)

  return (
    <KingsContext.Provider value={ctx}>
      {props.children}
    </KingsContext.Provider>
  )
}

export function useKings() {
  return useContext(KingsContext)
}

export function useKingsLeagueChanger() {
  const [, { setLeague }] = useKings()
  return setLeague
}
