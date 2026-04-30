import { useCurrentMatches, useNavigate } from "@solidjs/router";
import { ArrowBack, Assignment, CircleOutlined, Create, DownhillSkiing, EmojiEvents, ListAlt, TaskAlt } from "@suid/icons-material";
import { Box, Button, Typography } from "@suid/material";
import { createMemo, For, JSX, ParentProps, Show } from "solid-js";
import { useFeatureFlags } from "../hooks/flags";
import ButtonCard from "../ui/ButtonCard";

const basePath = "/config"

type Option = {
  label: string;
  description: string;
  href: string;
  icon: JSX.Element;
  experimental?: boolean;
} | {
  label: string;
  description: string;
  onClick: () => void;
  active: boolean;
}

const data: Option[] = [
  {
    label: "Results Data",
    description: "View the latest results tables from kingsski.club",
    href: "tracker",
    icon: <EmojiEvents fontSize="large" />
  },
  {
    label: "Site Results",
    description: "View the the latest results in kingsski.club",
    href: "portal",
    icon: <DownhillSkiing fontSize="large" />
  },
]

const configs: Option[] = [
  {
    label: "View Round",
    description: "Round configurations determining how teams progress through stages",
    href: "round",
    icon: <Assignment fontSize="large" />,
  },
  {
    label: "View Minileague",
    description: "Mini league configurations determining how teams race in a group",
    href: "minileague",
    icon: <ListAlt fontSize="large" />,
  },
  {
    label: "Create Round",
    description: "Custom round configuration determining how teams progress through stages",
    href: "round/create",
    icon: <Create fontSize="large" />,
    experimental: true,
  },
]

function SubMenu(props: {
  options: Option[],
  label?: string,
  onSelected?: (option: Option) => void,
  preferences?: boolean;
}) {
  const flags = useFeatureFlags()
  const nav = useNavigate()

  const handleClick = (option: Option) => {
    props.onSelected?.(option)
    if ('onClick' in option) {
      option.onClick()
    } else {
      nav(option.href)
    }
  }

  return (
    <>
      <Show when={props.label}>
        <Box sx={{ display: "flex", alignItems: "center", my: 1 }}>
          <Typography variant="overline" color="text.disabled" sx={{ ml: 1, lineHeight: 1 }}>
            {props.label}
          </Typography>
          <Box sx={{ flex: 1, height: "1px", bgcolor: "divider" }} />
        </Box>
      </Show>
      <Box sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: `repeat(1, 1fr)`,
          md: `repeat(2, 1fr)`,
          lg: `repeat(3, 1fr)`,
        },
        gap: 1,
      }}>
        <For each={props.options}>{(opt) => {
          const { label, description } = opt
          const enabled = 'active' in opt && opt.active
          const cardIcon = 'icon' in opt
            ? opt.icon
            : enabled
            ? <TaskAlt fontSize="large" />
            : <CircleOutlined fontSize="large" color="action" />
          const experimental = 'experimental' in opt && opt.experimental
          const fullLabel = 'active' in opt
              ? `${label} (${enabled ? "On" : "Off"})`
              : experimental
                ? `${label} (Experimental)`
                : label
          return (
            <Show when={!experimental || flags.experimental()}>
              <ButtonCard
                label={fullLabel}
                description={description}
                icon={cardIcon}
                onClick={[handleClick, opt]}
              />
            </Show>
          )
        }}</For>
      </Box>
    </>
  )
}

export default function Config(props: ParentProps) {
  const m = useCurrentMatches()
  const nested = () => {
    const matches = m()
    if (matches?.length < 1) {
      return false
    }
    return !matches[matches.length - 1].path.endsWith(basePath)
  }
  const flags = useFeatureFlags()

  const prefs = createMemo<Option[]>(() => ([
    {
      label: "Developer Mode",
      description: "Enable developer tools and features",
      onClick: () => flags.setDeveloper(v => !v),
      active: flags.developer(),
    },
    {
      label: "Experimental Features",
      description: "Enable features still in development which may be buggy",
      onClick: () => flags.setExperimental(v => !v),
      active: flags.experimental(),
    },
  ]))

  const nav = useNavigate()

  return (
    <>
      <Show when={nested()} fallback={
        <Box sx={{
          display: "flex",
          flexDirection: "column",
          mx: {
            xs: 0,
            sm: 5,
          },
          my: {
            xs: 0,
            sm: 5,
          }
        }}>
          <SubMenu options={configs} label="Configuration" />
          <SubMenu options={data} label="Data" />
          <SubMenu options={prefs()} label="Options" />
        </Box>
      }>
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <Button sx={{ flexShrink: 0 }} startIcon={<ArrowBack />} onClick={[nav, basePath]}>
            Back
          </Button>
          <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
            {props.children}
          </Box>
        </Box>
      </Show>
    </>
  )
}
