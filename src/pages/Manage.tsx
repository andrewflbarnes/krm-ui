import { useLocation } from "@solidjs/router";
import { Box, List, ListItemButton, ListItemText, Paper } from "@suid/material";
import { ParentProps } from "solid-js";
import Link from "../components/Link";

export default function Manage(props: ParentProps) {
  return (
    <Box sx={{
      display: "flex",
      flexDirection: "row",
      gap: "8px",
      height: "100%",
    }}>
      <Paper sx={{ width: "10%", height: "fit-content" }} elevation={4} >
        <List>
          <NavigationListItem path="new">New</NavigationListItem>
          <NavigationListItem path="continue">Continue</NavigationListItem>
          <NavigationListItem path="configure">Configure</NavigationListItem>
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
