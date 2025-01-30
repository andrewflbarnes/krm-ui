import {
  Button,
  Menu,
  MenuItem,

} from "@suid/material";
import { createSignal, createUniqueId, For } from "solid-js";

type SelectorProps<T> = {
  current: T;
  onClose: (v: T) => void;
  disabled: boolean;
  options: {
    label: string;
    value: T;
  }[];
}

export default function Selector<T>(props: SelectorProps<T>) {
  const [anchorEl, setAnchorEl] = createSignal<null | HTMLElement>(null);
  const open = () => Boolean(anchorEl());
  const handleClose = (v?: T) => {
    props.onClose(v);
    setAnchorEl(null);
  };

  const id = createUniqueId();

  return (
    <div>
      <Button
        id={`${id}-selector-button`}
        size="small"
        color="inherit"
        aria-controls={open() ? `${id}-selector-menu` : undefined}
        aria-haspopup="true"
        aria-expanded={open() ? "true" : undefined}
        disabled={props.disabled}
        onClick={(event) => {
          setAnchorEl(event.currentTarget);
        }}
      >
        {props.current?.toString()}
      </Button>
      <Menu
        id={`${id}-selector-menu`}
        anchorEl={anchorEl()}
        open={open()}
        onClose={() => handleClose(null)}
        MenuListProps={{ "aria-labelledby": `${id}-selector-button` }}
      >
        <For each={props.options}>{(opt) => {
          return <MenuItem onClick={() => handleClose(opt.value)}>{opt.label}</MenuItem>
        }}
        </For>
      </Menu>
    </div>
  );
}
