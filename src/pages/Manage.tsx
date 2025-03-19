import { useLocation } from "@solidjs/router";
import { ExpandLess, ExpandMore } from "@suid/icons-material";
import { Box, Grow, List, ListItemButton, ListItemText, ListSubheader, Paper } from "@suid/material";
import { createSelector, createSignal, For, ParentProps, Show } from "solid-js";
import Link from "../components/Link";
import { miniLeagueTemplates, raceConfig } from "../kings";

export default function Manage(props: ParentProps) {
  const [openSubList, setOpenSubList] = createSignal("")
  const updateSubList = (v:string) => {
    setOpenSubList(old => old == v ? "" : v)
  }
  const selectedSubList = createSelector(openSubList)

  return (
    <Box sx={{
      display: "flex",
      flexDirection: "row",
      gap: "8px",
      height: "100%",
    }}>
      <Paper sx={{ width: "fit-content", height: "fit-content" }} elevation={4} >
        <List>
          <ListSubheader>Race</ListSubheader>
          <NavigationListItem path="new">New</NavigationListItem>
          <NavigationListItem path="continue">Continue</NavigationListItem>

          <ListSubheader>Configure</ListSubheader>

          <CollapsibleNavItems
            title="Mini Leagues"
            id="ml"
            open={selectedSubList("ml")}
            onExpand={updateSubList}
            navs={Object.keys(miniLeagueTemplates).map(ml => ({
              label: `${ml}`,
              href: `minileague/${ml}`,
            }))}
          />

          <CollapsibleNavItems
            title="Rounds"
            id="round"
            open={selectedSubList("round")}
            onExpand={updateSubList}
            navs={Object.keys(raceConfig).map(num => ({
              label: `${num} Teams`,
              href: `round/${num}`,
            }))}
          />
        </List>
      </Paper>
      <Paper sx={{ flexGrow: 1, height: "100%", padding: "8px", overflow: "scroll" }} elevation={4} >
        {props.children}
      </Paper>
    </Box>
  )
}

function CollapsibleNavItems(props: {
  id: string;
  open: boolean;
  onExpand: (selector: string) => void;
  title: string;
  navs: {
    label: string;
    href: string;
  }[],
}) {
  const handleExpandRounds = () => {
    props.onExpand(props.id)
  }

  return (
    <>
      <ListItemButton onClick={handleExpandRounds}>
        <ListItemText primary={props.title} />
        {props.open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Show when={props.open}>
        <For each={props.navs}>{({ label, href }) => (
          <Grow in={props.open}>
            <NavigationListItem path={href}>{label}</NavigationListItem>
          </Grow>
        )}</For>
      </Show>
    </>
  )
}

function NavigationListItem(props: ParentProps<{ path: string }>) {
  // This feels hacky and useMatch doesn't support regex/wildcard
  // Consider uses a more traditional nav approach
  const location = useLocation()
  const selected = () => location.pathname.endsWith(props.path)
  return (
    <Link href={props.path} start>
      <ListItemButton selected={selected()}>
        <ListItemText>
          {props.children}
        </ListItemText>
      </ListItemButton>
    </Link>
  )
}
