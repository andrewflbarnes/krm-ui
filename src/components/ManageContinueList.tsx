import { createSignal } from "solid-js";
import ModalConfirmAction from "../ui/ModalConfirmAction";
import { RoundInfo } from "../api/krm";
import download from "downloadjs";
import krmApi from "../api/krm"
import { useAuth } from "../hooks/auth";
import ModalRoundInfo from "../ui/ModalRoundInfo";
import RoundInfoList from "../ui/RoundInfoList";

type ManageContinueListProps = {
  rounds: RoundInfo[];
  onDeleteRound: (id: string) => void;
  onUploadRound: (id: string) => void;
}

export default function ManageContinueList(props: ManageContinueListProps) {
  const [deleteRound, setDeleteRound] = createSignal<string | null>();
  const { userId, authenticated } = useAuth()
  const handleConfirmExport = (id: string) => {
    const round = krmApi.getRound(id);
    const blob = new Blob([JSON.stringify(round, null, 2)], { type: "application/json" })
    download(blob, `${round.id}.json`)
  }
  const handleConfirmDelete = (id: string) => {
    setDeleteRound(id)
  }
  const handleDeleteRound = () => {
    props.onDeleteRound(deleteRound())
    setDeleteRound()
  }
  const [info, setInfo] = createSignal<RoundInfo | null>();

  return (
    <div>
      <ModalConfirmAction
        open={!!deleteRound()}
        onDiscard={() => setDeleteRound()}
        confirmLabel="Delete"
        confirmColor="error"
        discardLabel="Cancel"
        onConfirm={handleDeleteRound}
      >
        Are you sure you want to delete this round? This action cannot be undone!
      </ModalConfirmAction>
      <ModalRoundInfo
        open={!!info()}
        round={info()}
        onClose={() => setInfo()}
      />
      <RoundInfoList
        rounds={props.rounds}
        handleConfirmDelete={handleConfirmDelete}
        handleConfirmExport={handleConfirmExport}
        handleUploadRound={props.onUploadRound}
        handleInfo={(roundInfo) => setInfo(roundInfo)}
        canUpload={authenticated()}
        userId={userId()}
      />
    </div>
  )
}
