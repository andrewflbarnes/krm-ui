import {
  Button,
  Menu,
  MenuItem,

} from "@suid/material";
import { createEffect, createSignal, For } from "solid-js";
import { useKings } from "../hooks/kings";
import kings, { leagues, type League } from "../config";

export default function LeagueSelector() {
  const [anchorEl, setAnchorEl] = createSignal<null | HTMLElement>(null);
  const [k, { setLeague }] = useKings()
  const open = () => Boolean(anchorEl());
  const handleClose = () => (league?: League) => {
    if (league) {
      setLeague(league)
    }
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="league-selector-button"
        size="small"
        color="inherit"
        aria-controls={open() ? "league-selector-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open() ? "true" : undefined}
        onClick={(event) => {
          setAnchorEl(event.currentTarget);
        }}
      >
        {k.config().name}
      </Button>
      <Menu
        id="league-selector-menu"
        anchorEl={anchorEl()}
        open={open()}
        onClose={handleClose}
        MenuListProps={{ "aria-labelledby": "league-selector-button" }}
      >
        <For each={leagues}>{(league) => {
          return <MenuItem onClick={[handleClose(), league]}>{kings[league].name}</MenuItem>
        }}
        </For>
      </Menu>
    </div>
  );
}
