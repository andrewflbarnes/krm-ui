import { useCurrentMatches, useNavigate } from "@solidjs/router";
import { ArrowBack, Assignment, Create, DownhillSkiing, EmojiEvents, ListAlt } from "@suid/icons-material";
import { Box, Button, Card, CardActionArea, CardContent, Typography } from "@suid/material";
import { For, JSX, ParentProps, Show } from "solid-js";
import { useFeatureFlags } from "../hooks/flags";

const basePath = "/config"

type Option = {
  label: string;
  description: string;
  href: string;
  icon: JSX.Element;
  experimental?: boolean;
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

function SubMenu(props: { options: Option[], onSelected?: (option: Option) => void }) {
  const flags = useFeatureFlags()
  const nav = useNavigate()

  const handleClick = (option: Option) => {
    props.onSelected?.(option)
    nav(option.href)
  }

  return (
    <>
      <Box sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(20em, 1fr))",
        gap: 1,
        mb: 1,
      }}>
        <For each={props.options}>{(opt) => {
          const { label, description, icon, experimental } = opt
          return (
            <Show when={!experimental || flags.experimental}>
              <Card variant="outlined">
                <CardActionArea sx={{ height: "100%" }} onClick={[handleClick, opt]}>
                  <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box color="primary.main">
                      {icon}
                    </Box>
                    <Box>
                      <Typography variant="h6">{label}</Typography>
                      <Typography variant="body2" color="text.secondary">{description}</Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
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

  const nav = useNavigate()

  return (
    <>
      <Show when={nested()} fallback={
        <>
          <SubMenu options={configs} />
          <SubMenu options={data} />
        </>
      }>
        <Box>
          <Button startIcon={<ArrowBack />} onClick={[nav, basePath]}>
            Back
          </Button>
        </Box>
        {props.children}
      </Show>
    </>
  )
}
