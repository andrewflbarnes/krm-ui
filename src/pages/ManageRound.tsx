import { useParams } from "@solidjs/router";
import ManageConfigRound from "../components/ManageConfigRound";
import { raceConfig } from "../kings";

export default function ManageRound() {
  const p = useParams<{ round: string; }>()
  const config = () => raceConfig[p.round]
  return (
    <ManageConfigRound title={`${p.round} teams`} config={config()} />
  )
}

