import { useParams } from "@solidjs/router";
import ManageConfigRound from "../components/ManageConfigRound";
import { useCustomRounds } from "../hooks/custom-config";
import { raceConfig, RoundConfig } from "../kings";

export default function ManageRound() {
  const p = useParams<{ round: string; }>()
  const customRounds = useCustomRounds()
  const config = (): RoundConfig => {
    const standardConfig = raceConfig[p.round]
    if (standardConfig) {
      return standardConfig
    }
    return customRounds()?.configs?.find(c => c.id == p.round)?.config
  }
  return (
    <ManageConfigRound title={`${p.round} teams`} config={config()} />
  )
}

