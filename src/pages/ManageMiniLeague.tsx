import { useParams } from "@solidjs/router";
import ManageConfigMiniLeague from "../components/ManageConfigMiniLeague";
import { miniLeagueTemplates } from "../kings";

export default function ManageMiniLeague() {
  const p = useParams<{ ml: string; }>()
  const template = () => miniLeagueTemplates[p.ml]
  return (
    <ManageConfigMiniLeague name={p.ml} template={template()} />
  )
}
