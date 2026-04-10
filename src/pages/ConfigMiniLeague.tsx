import { useNavigate, useParams } from "@solidjs/router";
import { DownhillSkiing } from "@suid/icons-material";
import { createMemo, createSignal } from "solid-js";
import ManageConfigMiniLeague from "../components/ManageConfigMiniLeague";
import { useCustomMinileagues } from "../hooks/custom-config";
import { miniLeagueTemplates, MiniLeagueTemplate } from "../kings";
import ConfigLayout from "../ui/ConfigLayout";
import ConfigSidebar, { SidebarItem, SidebarSection } from "../ui/ConfigSidebar";

type StructureLabel = {
  label: string;
  color: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning";
}

function getStructureLabel(t: MiniLeagueTemplate): StructureLabel {
  if (t.teams <= 1) return { label: "bye", color: "default" }
  const singleElim = t.races.length === 1
  if (singleElim) return { label: "knockout", color: "info" }
  const halfRobin = t.teams * (t.teams - 1) / 2
  if (t.races.length === halfRobin) return { label: "half-robin", color: "primary" }
  if (t.races.length === halfRobin * 2) return { label: "full-robin", color: "info" }
  if (t.races.length === halfRobin * 3) return { label: "mega-robin", color: "info" }
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

  const [search, setSearch] = createSignal("")

  const selectedTemplate = (): MiniLeagueTemplate =>
    miniLeagueTemplates[p.ml] ?? customMls()?.configs?.find(c => c.id === p.ml)?.config

  const selectedLabel = (): string => p.ml ?? ""

  const handleSelect = (value: string) => {
    nav(value, { resolve: true })
  }

  const filteredStandardKeys = createMemo(() => {
    const q = search().trim().toLowerCase()
    if (!q) return STANDARD_KEYS
    return STANDARD_KEYS.filter(k => k.toLowerCase().includes(q))
  })

  const sections = createMemo<SidebarSection[]>(() =>
    buildTeamGroups(filteredStandardKeys()).map(({ teamCount, keys }): SidebarSection => ({
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

  const customItems = createMemo<SidebarItem[]>(() => {
    const q = search().trim().toLowerCase()
    const all = customMls()?.configs ?? []
    const filtered = q ? all.filter(c => c.id.toLowerCase().includes(q)) : all
    return filtered.map(({ id }): SidebarItem => {
      const tmpl = customMls()?.configs?.find(c => c.id === id)?.config
      const structure = getStructureLabel(tmpl)
      return {
        id,
        label: id,
        chip: structure,
        secondary: racesLabel(tmpl.races.length),
        accentColor: "secondary",
      }
    })
  })

  const sidebar = (
    <ConfigSidebar
      search={search()}
      onSearchChange={setSearch}
      sections={sections()}
      customItems={customItems()}
      selectedId={p.ml}
      onSelect={handleSelect}
      footerIcon={<DownhillSkiing sx={{ fontSize: 12, color: "primary.main" }} />}
      selectedLabel={selectedLabel()}
    />
  )

  return (
    <ConfigLayout
      selectedId={p.ml}
      sidebar={sidebar}
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
