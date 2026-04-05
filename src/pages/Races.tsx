import { createComputed, createSignal, Show } from "solid-js";
import krmApi, { RoundInfo } from "../api/krm";
import ManageContinueList from "../components/ManageContinueList";
import { useKings } from "../kings";
import notification from "../hooks/notification";
import { Box, Typography } from "@suid/material";
import ModalConfirmAction from "../ui/ModalConfirmAction";
import BasicErrorBoundary from "../ui/BasicErrorBoundary";
import { useNavigate } from "@solidjs/router";
import { AddCircleOutlined, ArrowCircleDown } from "@suid/icons-material";
import ButtonCard from "../ui/ButtonCard";

function getSortedRounds(league: string) {
  const unsortedRounds = krmApi.getRounds(league);
  return unsortedRounds.sort((a, b) => b.details.date.getTime() - a.details.date.getTime())
}

export default function Races() {
  return (
    <BasicErrorBoundary message="Failed to render">
      <RacesInternal />
    </BasicErrorBoundary>
  )
}

function RacesInternal() {
  const [k] = useKings()
  const [rounds, setRounds] = createSignal<RoundInfo[]>([])
  createComputed(() => {
    setRounds(getSortedRounds(k.league()))
  })

  // TODO we should use a render prop equivalent, below is getting
  //   out of hand
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
    try {
      await krmApi.syncRounds(k.league())
      setRounds(getSortedRounds(k.league()))
      notification.success("Rounds downloaded")
    } catch (e) {
      notification.error(`Failed to download data from server, check you are online and try again`)
      console.error("Failed to download data", e)
    }
  }

  const handleCopyToClipboard = (id: string) => {
    try {
      const data = krmApi.getRound(id)
      navigator.clipboard.writeText(JSON.stringify(data, null, 2))
      notification.info("Data copied")
    } catch (e) {
      notification.error(`Failed to copy data to clipboard: ${e.message}`)
      console.error("Failed to copy data to clipboard", e)
    }
  }

  const nav = useNavigate()

  return (
    <>
      <ModalConfirmAction
        open={download()}
        onConfirm={handleDownload}
        onDiscard={() => setDownload(false)}
      >
        This will overwrite any tracked rounds which have not been uploaded/synced, are you sure?
      </ModalConfirmAction>
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column", gap: 3 }}>
        <Show
          when={rounds().length > 0}
          fallback={(
            <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Typography variant="h2" color="text.secondary">
                No races found
              </Typography>
            </Box>
          )}
        >
          <ManageContinueList
            rounds={rounds()}
            onDeleteRound={handleDeleteRound}
            onUploadRound={handleUploadRound}
            onCopyToClipboard={handleCopyToClipboard}
          />
        </Show>
        <Box sx={{ mt: "auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(20em, 1fr))", gap: 1 }}>
          <ButtonCard
            label="New"
            description="Start a new race"
            icon={<AddCircleOutlined fontSize="large" />}
            onClick={[nav, "/races/new"]}
          />
          <ButtonCard
            label="Download"
            description={"Download rounds from the server, this will overwrite any tracked rounds which have not been uploaded/synced"}
            onClick={[setDownload, true]}
            icon={<ArrowCircleDown fontSize="large" />}
          />
        </Box>
      </Box>
    </>
  )
}
