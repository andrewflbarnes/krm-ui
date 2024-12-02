import { createComputed, createSignal } from "solid-js";
import krmApi, { RoundInfo } from "../api/krm";
import ManageContinueList from "../components/ManageContinueList";
import { useKings } from "../kings";

function getSortedRounds(league: string) {
  const unsortedRounds = krmApi.getRounds(league);
  return unsortedRounds.sort((a, b) => b.date.getTime() - a.date.getTime())
}

export default function ManageContinue() {
  const [k] = useKings()
  const [rounds, setRounds] = createSignal<RoundInfo[]>()
  createComputed(() => {
    setRounds(getSortedRounds(k.league()))
  })

  const handleDeleteRound = (id: string) => {
    krmApi.deleteRound(id)
    setRounds(getSortedRounds(k.league()))
  }

  return (
    <>
      <ManageContinueList rounds={rounds()} onDeleteRound={handleDeleteRound} />
    </>
  )
}
