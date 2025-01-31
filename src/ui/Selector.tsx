import {
  Button,
  FormControl,
  InputLabel,
  Menu,
  MenuItem,
  Select,
} from "@suid/material";
import { SelectChangeEvent } from "@suid/material/Select";
import { createSignal, createUniqueId, JSX, Switch, For, Match } from "solid-js";

type SelectorProps<T> = {
  title?: string;
  type?: "input" | "menu";
  current: T;
  onClose?: (v: T) => void;
  disabled?: boolean;
  options: {
    label: string;
    value: T;
  }[];
  containerProps?: JSX.HTMLAttributes<HTMLDivElement>;
}

export default function Selector<T>(props: SelectorProps<T>) {
  const [anchorEl, setAnchorEl] = createSignal<null | HTMLElement>(null);
  const open = () => Boolean(anchorEl());
  const handleClose = (v?: T) => {
    props.onClose?.(v);
    setAnchorEl(null);
  };

  const id = createUniqueId();

  return (
    <div {...props.containerProps}>
      <Switch>
        <Match when={props.type == "input" || !props.type}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">{props.title}</InputLabel>
            <Select
              size="small"
              labelId={`${id}-select-label`}
              id={`${id}-select`}
              value={props.current}
              label={props.title}
              onChange={(e: SelectChangeEvent) => props.onClose?.(props.options.find(v => v.label == e.target.value as T)?.value)}
              disabled={props.disabled}
            >
              <For each={props.options}>{(opt) => {
                return <MenuItem value={opt.label}>{opt.label}</MenuItem>
              }}
              </For>
            </Select>
          </FormControl>
        </Match>
        <Match when={props.type == "menu"}>
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
        </Match>
      </Switch>
    </div>
  );
}
