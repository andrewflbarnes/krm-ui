import { createSignal } from "solid-js"

export const stages = {
  "stage1": "Stage 1",
  "stage2": "Stage 2",
  "knockout": "Knockouts",
  "complete": "Results",
} as const
export type Stage = keyof typeof stages

export const views = {
  "list": "Race List",
  "mini": "Mini Leagues",
  "side-by-side": "Side by side",
  "printable": "Printable",
} as const
export type View = keyof typeof views

const [stage, setStage] = createSignal<Stage>("knockout")
const [view, setView] = createSignal<View>("list")
const [live, setLive] = createSignal(false)
const switchLive = () => setLive(v => !v)
const [collapse, setCollapse] = createSignal(false)
const switchCollapse = () => setCollapse(v => !v)
const [northern, setNorthern] = createSignal(false)
const switchNorthern = () => setNorthern(v => !v)

export const useRaceOptions = () => {
  return {
    stage,
    setStage,
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
