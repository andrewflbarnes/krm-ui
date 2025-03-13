import { createSignal, Show } from "solid-js";
import ManageConfigMiniLeague from "../components/ManageConfigMiniLeague";
import { miniLeagueTemplates } from "../kings";
import Selector from "../ui/Selector";

type TemplateId = keyof typeof miniLeagueTemplates

const options: { label: string; value: TemplateId }[] = Object.keys(miniLeagueTemplates).map((id: TemplateId) => ({
  label: id,
  value: id,
})).sort((a, b) => a.label.localeCompare(b.label))

export default function ManageConfigure() {
  const [selected, setSelected] = createSignal<TemplateId>(options[0].value)
  const template = () => miniLeagueTemplates[selected()]
  return (
    <>
      <Selector
        type="input"
        title="Template"
        current={selected()}
        options={options}
        onClose={(v: TemplateId) => setSelected(old => v || old)}
        containerProps={{ style: { "max-width": "10em" } }}
      />
      <Show when={selected()} fallback={<div>Select a template</div>}>
        <ManageConfigMiniLeague name={selected()} template={template()} />
      </Show>
    </>
  )
}
