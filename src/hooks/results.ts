import { useNavigate, useParams } from "@solidjs/router"
import { useQuery } from "@tanstack/solid-query"
import { Round, Stage } from "../kings"
import krmApi from "../api/krm"
import { atom, useAtom } from "solid-jotai"

export const stages: {
  [s in Stage]: string
} = {
  "stage1": "Stage 1",
  "stage2": "Stage 2",
  "knockout": "Knockouts",
  "complete": "Results",
} as const

export const views = {
  "list": "Race List",
  "mini": "Mini Leagues",
  "side-by-side": "Side by side",
  "printable": "Printable",
} as const
export type View = keyof typeof views

const viewAtom = atom<View>("list")
const liveAtom = atom(false)
const collapseAtom = atom(false)
const northernAtom = atom(false)
const roundAtom = atom<Round>()

export const useRaceOptions = () => {
  const [view, setView] = useAtom(viewAtom)
  const [live, setLive] = useAtom(liveAtom)
  const switchLive = () => setLive(v => !v)
  const [collapse, setCollapse] = useAtom(collapseAtom)
  const switchCollapse = () => setCollapse(v => !v)
  const [northern, setNorthern] = useAtom(northernAtom)
  const switchNorthern = () => setNorthern(v => !v)
  const [round, setRound] = useAtom(roundAtom)

  const navigate = useNavigate()
  const params = useParams<{ raceid: string, stage?: string }>()
  const updateStage = (s: Stage) => {
    if (s && s != params.stage) {
      navigate(`/races/${params.raceid}/${s}`)
    }
  }
  const useRound = () => useQuery<Round | null>(() => ({
    queryKey: [params.raceid],
    queryFn: async () => new Promise((res, rej) => {
      try {
        res(krmApi.getRound(params.raceid))
      } catch (e) {
        console.error("Failed to fetch round data", e)
        rej(e)
      }
    }),
    staleTime: 1000 * 60 * 5,
  }))
  return {
    useRound,
    raceid: () => params.raceid,
    stage: () => params.stage,
    round,
    setRound,
    setStage: updateStage,
    view,
    setView,
    live,
    setLive,
    switchLive,
    collapse,
    setCollapse,
    switchCollapse,
    northern,
    setNorthern,
    switchNorthern,
  }
}
