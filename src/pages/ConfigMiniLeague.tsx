import { useNavigate, useParams } from "@solidjs/router";
import { DownhillSkiing } from "@suid/icons-material";
import { createMemo } from "solid-js";
import ManageConfigMiniLeague from "../components/ManageConfigMiniLeague";
import { useCustomMinileagues } from "../hooks/custom-config";
import { miniLeagueTemplates, MiniLeagueTemplate } from "../kings";
import ConfigLayout, { SidebarItem, SidebarSection } from "../ui/ConfigLayout";

type StructureLabel = {
  label: string;
  color: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning";
}

function getStructureLabel(t: MiniLeagueTemplate): StructureLabel {
  if (t.teams <= 1) return { label: "bye", color: "default" }
  const singleElim = t.races.length === 1
  if (singleElim) return { label: "knockout", color: "primary" }
  const halfRobin = t.teams * (t.teams - 1) / 2
  if (t.races.length === halfRobin) return { label: "half-robin", color: "secondary" }
  if (t.races.length === halfRobin * 2) return { label: "full-robin", color: "primary" }
  if (t.races.length === halfRobin * 3) return { label: "mega-robin", color: "primary" }
  return { label: "custom", color: "warning" }
}

function racesLabel(count: number): string {
  if (count === 0) return "no races"
  if (count === 1) return "1 race"
  return `${count} races`
}

type TeamGroup = {
  teamCount: number;
  keys: string[];
}

function buildTeamGroups(keys: string[]): TeamGroup[] {
  const map = new Map<number, string[]>()
  for (const k of keys) {
    const t = miniLeagueTemplates[k].teams
    if (!map.has(t)) map.set(t, [])
    map.get(t).push(k)
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a - b)
    .map(([teamCount, ks]) => ({ teamCount, keys: ks }))
}

const STANDARD_KEYS = Object.keys(miniLeagueTemplates).sort((a, b) => {
  const diff = miniLeagueTemplates[a].teams - miniLeagueTemplates[b].teams
  return diff !== 0 ? diff : a.localeCompare(b)
})

export default function ConfigMiniLeague() {
  const p = useParams<{ ml?: string }>()
  const nav = useNavigate()
  const customMls = useCustomMinileagues()

  const selectedTemplate = (): MiniLeagueTemplate =>
    miniLeagueTemplates[p.ml] ?? customMls()?.configs?.find(c => c.id === p.ml)?.config

  const selectedLabel = (): string => p.ml ?? ""

  const handleSelect = (value: string) => {
    nav(value, { resolve: true })
  }

  const sections = createMemo<SidebarSection[]>(() =>
    buildTeamGroups(STANDARD_KEYS).map(({ teamCount, keys }): SidebarSection => ({
      label: teamCount === 1 ? "1 team" : `${teamCount} teams`,
      items: keys.map((id): SidebarItem => {
        const tmpl = miniLeagueTemplates[id]
        const structure = getStructureLabel(tmpl)
        return {
          id,
          label: id,
          chip: structure,
          secondary: racesLabel(tmpl.races.length),
        }
      }),
    }))
  )

  const customItems = createMemo<SidebarItem[]>(() =>
    (customMls()?.configs ?? []).map(({ id, config: tmpl }): SidebarItem => ({
      id,
      label: id,
      chip: getStructureLabel(tmpl),
      secondary: racesLabel(tmpl.races.length),
      accentColor: "secondary",
    }))
  )

  return (
    <ConfigLayout
      selectedId={p.ml}
      sections={sections()}
      customItems={customItems()}
      onSelect={handleSelect}
      footerIcon={<DownhillSkiing sx={{ fontSize: 12, color: "primary.main" }} />}
      selectedLabel={selectedLabel()}
      emptyIcon={<DownhillSkiing sx={{ fontSize: 64, color: "text.disabled" }} />}
      emptyHeading="Select a minileague config"
      emptyDescription={`Choose from ${Object.keys(miniLeagueTemplates).length} standard configs on the left`}
    >
      <ManageConfigMiniLeague
        name={selectedLabel()}
        template={selectedTemplate()}
      />
    </ConfigLayout>
  )
}
