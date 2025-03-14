import { useLocation } from "@solidjs/router";
import { ExpandLess, ExpandMore } from "@suid/icons-material";
import { Box, Grow, List, ListItemButton, ListItemText, ListSubheader, Paper } from "@suid/material";
import { createSignal, For, ParentProps, Show } from "solid-js";
import Link from "../components/Link";
import { miniLeagueTemplates, raceConfig } from "../kings";

export default function Manage(props: ParentProps) {
  const [expConf, setExpConf] = createSignal(false)
  const handleExpandConfigure = () => {
    setExpConf(old => !old)
    setExpRound(false)
  }
  const [expRound, setExpRound] = createSignal(false)
  const handleExpandRounds = () => {
    setExpRound(old => !old)
    setExpConf(false)
  }
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
          <ListItemButton onClick={handleExpandConfigure}>
            <ListItemText primary="Mini Leagues" />
            {expConf() ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Show when={expConf()}>
            <For each={Object.keys(miniLeagueTemplates)}>{(ml) => (
              <Grow in={expConf()}>
                <NavigationListItem path={`minileague/${ml}`}>{ml}</NavigationListItem>
              </Grow>
            )}</For>
          </Show>
          <ListItemButton onClick={handleExpandRounds}>
            <ListItemText primary="Rounds" />
            {expRound() ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Show when={expRound()}>
            <For each={Object.keys(raceConfig)}>{(numTeams) => (
              <Grow in={expRound()}>
                <NavigationListItem path={`round/${numTeams}`}>{numTeams} Teams</NavigationListItem>
              </Grow>
            )}</For>
          </Show>
        </List>
      </Paper>
      <Paper sx={{ flexGrow: 1, height: "100%", padding: "8px", overflow: "scroll" }} elevation={4} >
        {props.children}
      </Paper>
    </Box>
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
