import { initialisableAtomWithStorage } from "@/utils/jotai-utils"
import { Receipt, VerticalSplit, ViewHeadline, ViewStream } from "@suid/icons-material"
import { JSX } from "solid-js";

export const views: Record<string, {
  label: string;
  icon: JSX.Element;
}> = {
  "list": {
    label: "Race List",
    icon: <ViewHeadline />,

  },
  "side-by-side": {
    label: "Side by side",
    icon: <VerticalSplit />,
  },
  "mini": {
    label: "Mini Leagues",
    icon: <ViewStream />,
  },
  "printable": {
    label: "Printable",
    icon: <Receipt />,
  },
} as const
export type View = keyof typeof views

const useView = initialisableAtomWithStorage<View>("race-view", "list")
const useLive = initialisableAtomWithStorage("race-minileague-live", false)
const useCollapse = initialisableAtomWithStorage("race-minileague-collapsed", false)
const useNorthern = initialisableAtomWithStorage("race-list-northern", false)
const useListStyle = initialisableAtomWithStorage<"v1" | "v2">("race-list-style", "v1")

export function usePreferences() {
  const [view, setView] = useView()

  const [listStyle, setListStyle] = useListStyle()
  const toggleListStyle = () => setListStyle(v => v == "v1" ? "v2" : "v1")

  const [live, setLive] = useLive()
  const switchLive = () => setLive(v => !v)

  const [collapse, setCollapse] = useCollapse()
  const switchCollapse = () => setCollapse(v => !v)

  const [northern, setNorthern] = useNorthern()
  const switchNorthern = () => setNorthern(v => !v)

  return {
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
    listStyle,
    setListStyle,
    toggleListStyle,
  }
}
