import { createComputed, createSignal } from "solid-js";
import krmApi, { RoundInfo } from "../api/krm";
import ManageContinueList from "../components/ManageContinueList";
import { useKings } from "../kings";
import notification from "../hooks/notification";
import { Button } from "@suid/material";
import ModalConfirmAction from "../ui/ModalConfirmAction";

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

  const handleUploadRound = (id: string) => {
    notification.info("Uploading round...")
    krmApi.uploadRound(id)
      .then(() => notification.success("Round uploaded"))
      .then(() => setRounds(getSortedRounds(k.league())))
      .catch(e => {
        console.error(e)
        notification.error(e.message)
      })
  }

  const [download, setDownload] = createSignal(false)
  const handleDownload = async () => {
    setDownload(false)
    await krmApi.syncRounds(k.league())
    setRounds(getSortedRounds(k.league()))
    notification.success("Rounds downloaded")
  }

  return (
    <>
      <ModalConfirmAction
        open={download()}
        onConfirm={handleDownload}
        onDiscard={() => setDownload(false)}
      >
        This will overwrite any tracked rounds which have not been uploaded/synced, are you sure?
      </ModalConfirmAction>
      <Button onClick={[setDownload, true]}>
        Download
      </Button>
      <ManageContinueList rounds={rounds()} onDeleteRound={handleDeleteRound} onUploadRound={handleUploadRound} />
    </>
  )
}
