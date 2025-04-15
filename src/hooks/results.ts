import { useNavigate, useParams } from "@solidjs/router"
import { useQuery } from "@tanstack/solid-query"
import { createSignal } from "solid-js"
import { Round, Stage } from "../kings"
import krmApi from "../api/krm"

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

const [view, setView] = createSignal<View>("list")
const [live, setLive] = createSignal(false)
const switchLive = () => setLive(v => !v)
const [collapse, setCollapse] = createSignal(false)
const switchCollapse = () => setCollapse(v => !v)
const [northern, setNorthern] = createSignal(false)
const switchNorthern = () => setNorthern(v => !v)
const [round, setRound] = createSignal<Round>()

export const useRaceOptions = () => {
  const navigate = useNavigate()
  const params = useParams<{ raceid: string, stage?: string }>()
  const updateStage = (s: Stage) => {
    if (s && s != params.stage) {
      navigate(`/races/${params.raceid}/${s}`)
    }
  }
  const useRound = () => useQuery<Round>(() => ({
    queryKey: [params.raceid],
    queryFn: async () => new Promise((res) => {
      res(krmApi.getRound(params.raceid))
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
