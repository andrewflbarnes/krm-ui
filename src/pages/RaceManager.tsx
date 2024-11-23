import { useNavigate } from "@solidjs/router";
import { Box, List, ListItemButton, ListItemText, Paper } from "@suid/material";
import { createSignal, ParentProps, Show } from "solid-js";

export default function RaceManager(props: ParentProps) {
  const navigate = useNavigate()
  const [sub, setSub] = createSignal()
  const goto = (path: string) => {
    setSub(path)
    navigate(path, { resolve: true })
  }

  function NavigationListItem(props: ParentProps<{ path: string }>) {
    return (
      <ListItemButton selected={sub() == props.path} onClick={[goto, props.path]} >
        <ListItemText primary={props.children} />
      </ListItemButton>
    )
  }

  return (
    <Box sx={{
      display: "flex",
      flexDirection: "row",
      gap: "8px",
      height: "100%",
    }}>
      <Paper sx={{ width: "10%", height: "fit-content" }} elevation={4} >
        <List>
          <NavigationListItem path="start">Start</NavigationListItem>
          <NavigationListItem path="continue">Continue</NavigationListItem>
          <NavigationListItem path="configure">Configure</NavigationListItem>
        </List>
      </Paper>
      <Show when={sub()}>
        <Paper sx={{ flexGrow: 1, height: "100%", padding: "8px", overflow: "scroll" }} elevation={4} >
          {props.children}
        </Paper>
      </Show>
    </Box>
  )
}
