import { useSearchParams } from "@solidjs/router";
import { batch, createContext, createSignal, ParentProps, useContext } from "solid-js"
import { leagueConfigs } from "../kings"
import type { League, LeagueData } from "../kings";
import { leagues } from "../kings";
import krmEngine from "../kings/engine";
import notification from "../hooks/notification";
import tracker from "../api/tracker";
import { atomWithStorage } from "solid-jotai/utils";
import { useAtom } from "solid-jotai";
import { defaultStorage, initialisableAtomWithStorage } from "../utils/jotai-utils";

const qps = new URLSearchParams(window.location.search)
let league = qps.get("league")?.toLowerCase() as League | undefined
if (!league || !leagueConfigs[league]) {
  league = undefined
}
const useSelectedLeague = initialisableAtomWithStorage<League>('kings-selected-league', leagues[0], league)

const configLoadedAtom = atomWithStorage('krm-config-loaded', [], defaultStorage<League[]>(), { getOnInit: true })

const makeContext = () => {
  const [selectedLeague, setSelectedLeague] = useSelectedLeague()
  const [lock, setLock] = createSignal(false)
  const [config, setConfig] = createSignal(leagueConfigs[selectedLeague()]);
  const lc = krmEngine.getLeagueConfig(selectedLeague())
  const [leagueConfig, setLeagueConfig] = createSignal(lc)
  const setLeague = (newLeague: League) => {
    batch(() => {
      setSelectedLeague(newLeague)
      const newConfig = leagueConfigs[newLeague]
      setConfig(newConfig)
    })
  }
  const [internalConfigLoaded, internalSetConfigLoaded] = useAtom(configLoadedAtom)
  const setConfigLoaded = (inLeague: League) => {
    const league = inLeague ?? selectedLeague()
    if (internalConfigLoaded().includes(league)) {
      return
    }
    internalSetConfigLoaded((prev) => [...prev, selectedLeague()])
  }
  const isConfigLoaded = (league?: League) => internalConfigLoaded().includes(league ?? selectedLeague())
  const clearLocalData = () => {
    batch(() => {
      krmEngine.clearLocalData()
      internalSetConfigLoaded([])
      const resetConfig = krmEngine.getLeagueConfig(selectedLeague())
      setLeagueConfig(resetConfig)
    })
  }

  return [
    {
      league: selectedLeague,
      config,
      leagueConfig,
      lock,
    },
    {
      setLock,
      setLeague,
      setLeagueConfig,
      clearLocalData,
      isConfigLoaded,
      setConfigLoaded,
    }
  ] as const
}

const KingsContext = createContext(makeContext())

export function KingsProvider(props: ParentProps) {
  const ctx = makeContext()
  const ctxLeague = ctx[0].league()
  if (ctxLeague != league) {
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
      console.error("Attempt to change league but lock in place", state.league(), league)
      return
    }
    if (!leagueConfigs[league]) {
      console.error("No config exists for requested league", league, Object.keys(leagueConfigs))
      return
    }
    batch(() => {
      actions.setLeague(league)
      const lc = krmEngine.getLeagueConfig(league)
      actions.setLeagueConfig(lc)
      setSearchParams({ league })
    })
  }
  const setLeagueConfigEnhanced = (config: LeagueData) => {
    const newConfig = { ...state.leagueConfig(), ...config }
    krmEngine.saveLeagueConfig(state.league(), newConfig)
    actions.setLeagueConfig(newConfig)
  }
  const [loadingConfig, setLoadingConfig] = createSignal(false)
  const loadConfig = (trackingUrl: string = null) => {
    const league = state.league()
    notification.info(`Loading config for ${league} league...`)
    setLoadingConfig(true)
    tracker.getLeagueData(league, trackingUrl)
      .then(data => {
        if (Object.keys(data).length === 0) {
          notification.error(`No config found for ${league} league`)
          return
        }

        setLeagueConfigEnhanced(data)
        actions.setConfigLoaded(league)
        notification.success(`Config loaded for ${league} league`)
      })
      .catch(e => {
        notification.error(e.message)
      })
      .finally(() => {
        setLoadingConfig(false)
      })
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
        isNew: true,
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
    loadConfig,
  }
  const enhancedState = {
    ...state,
    loadingConfig,
  }
  return [enhancedState, enhancedActions] as const
}

export function useKingsLeagueChanger() {
  const [, { setLeague }] = useKings()
  return setLeague
}
