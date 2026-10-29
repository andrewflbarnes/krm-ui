import { initialisableAtomWithStorage } from "@/utils/jotai-utils"
import { View } from "./results"

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
