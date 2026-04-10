import { useNavigate, useParams } from "@solidjs/router";
import { Tune } from "@suid/icons-material";
import { createMemo, createSignal } from "solid-js";
import ManageConfigRound from "../components/ManageConfigRound";
import { useCustomRounds } from "../hooks/custom-config";
import { raceConfig, RoundConfig } from "../kings";
import ConfigLayout from "../ui/ConfigLayout";
import ConfigSidebar, { SidebarItem, SidebarSection } from "../ui/ConfigSidebar";

type Tier = {
  label: string;
  min: number;
  max: number;
  description: string;
}

const TIERS: Tier[] = [
  { label: "Micro", min: 0, max: 3, description: "0 – 3 teams" },
  { label: "Small", min: 4, max: 8, description: "4 – 8 teams" },
  { label: "Medium", min: 9, max: 16, description: "9 – 16 teams" },
  { label: "Large", min: 17, max: 32, description: "17 – 32 teams" },
]

function getComplexityLabel(config: RoundConfig): { label: string; color: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" } {
  const hasKnockout = !!config.knockout?.length
  const hasStage2 = !!config.stage2?.length
  if (hasKnockout) return { label: "knockout", color: "secondary" }
  if (hasStage2) return { label: "2-stage", color: "primary" }
  return { label: "1-stage", color: "default" }
}

function getGroupCount(config: RoundConfig): number {
  return config.stage1?.length ?? 0
}

function groupsLabel(groups: number): string {
  if (groups === 0) return "no groups"
  if (groups === 1) return "1 group"
  return `${groups} groups`
}

const STANDARD_KEYS = Object.keys(raceConfig).map(Number).sort((a, b) => a - b)

export default function ConfigRound() {
  const p = useParams<{ round?: string }>()
  const nav = useNavigate()
  const customRounds = useCustomRounds()

  const [search, setSearch] = createSignal("")

  const selectedConfig = (): RoundConfig => {
    const standardConfig = raceConfig[p.round]
    if (standardConfig) return standardConfig
    return customRounds()?.configs?.find(c => c.id === p.round)?.config
  }

  const selectedLabel = (): string => {
    if (!p.round) return ""
    const n = Number(p.round)
    if (!isNaN(n) && raceConfig[n] != null) {
      return `${p.round} team${p.round === "1" ? "" : "s"}`
    }
    return p.round
  }

  const handleSelect = (value: string) => {
    nav(value, { resolve: true })
  }

  const filteredStandardKeys = createMemo(() => {
    const q = search().trim().toLowerCase()
    if (!q) return STANDARD_KEYS
    return STANDARD_KEYS.filter(n => String(n).includes(q))
  })

  const sections = createMemo<SidebarSection[]>(() =>
    TIERS.map(tier => ({
      label: tier.label,
      description: tier.description,
      items: filteredStandardKeys()
        .filter(n => n >= tier.min && n <= tier.max)
        .map((n): SidebarItem => {
          const cfg = raceConfig[n]
          const complexity = getComplexityLabel(cfg)
          const groups = getGroupCount(cfg)
          return {
            id: String(n),
            label: n === 0 ? "0 teams" : `${n} team${n === 1 ? "" : "s"}`,
            chip: complexity,
            secondary: `${groupsLabel(groups)} · ${cfg.results?.length ?? 0} ranked`,
          }
        }),
    }))
  )

  const customItems = createMemo<SidebarItem[]>(() => {
    const q = search().trim().toLowerCase()
    const all = customRounds()?.configs ?? []
    const filtered = q ? all.filter(c => c.id.toLowerCase().includes(q)) : all
    return filtered.map(({ id }): SidebarItem => ({
      id,
      label: id,
      accentColor: "secondary",
    }))
  })

  const sidebar = (
    <ConfigSidebar
      search={search()}
      onSearchChange={setSearch}
      sections={sections()}
      customItems={customItems()}
      selectedId={p.round}
      onSelect={handleSelect}
      footerIcon={<Tune sx={{ fontSize: 12, color: "primary.main" }} />}
      selectedLabel={selectedLabel()}
    />
  )

  return (
    <ConfigLayout
      selectedId={p.round}
      sidebar={sidebar}
      emptyIcon={<Tune sx={{ fontSize: 64, color: "text.disabled" }} />}
      emptyHeading="Select a round config"
      emptyDescription={`Choose from ${Object.keys(raceConfig).length} standard configs on the left`}
    >
      <ManageConfigRound
        title={selectedLabel()}
        config={selectedConfig()}
      />
    </ConfigLayout>
  )
}
