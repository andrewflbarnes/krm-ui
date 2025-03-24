import { Lock } from "@suid/icons-material";
import { Badge, Button, FormControl, InputLabel, Menu, MenuItem, Select, styled, } from "@suid/material";
import { SelectChangeEvent } from "@suid/material/Select";
import { createSignal, createUniqueId, Switch, For, Match, ComponentProps } from "solid-js";

type SelectorProps<T> = {
  title?: string;
  type?: "input" | "menu";
  current?: T;
  onClose?: (v: T) => void;
  disabled?: boolean;
  locked?: boolean;
  options: {
    label: string;
    value: T;
  }[];
} & ({
  type: "input" | undefined;
  containerProps?: ComponentProps<typeof Select>;
} | {
  type: "menu";
  containerProps?: ComponentProps<typeof Button>;
})

const StyledSelect = styled(Select)({
  color: "inherit",
  "&:before, &:after": {
    borderColor: "inherit !important" // important to cover other states
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "inherit"
  },
  "& .MuiSelect-icon": {
    color: "inherit"
  }
});

const StyledInputLabel = styled(InputLabel)({
  color: "inherit",
  "&.Mui-focused": {
    color: "inherit"
  }
});

const StyledBadge = styled(Badge)({
  "& .MuiBadge-badge": {
    top: "50%",
    right: "1.5em",
    "& .MuiSvgIcon-root": {
      width: "0.5em",
      height: "0.5em",
    },
  }
});

export default function Selector<T>(props: SelectorProps<T>) {
  const [anchorEl, setAnchorEl] = createSignal<null | HTMLElement>(null);
  const open = () => Boolean(anchorEl());
  const handleClose = (v?: T) => {
    props.onClose?.(v);
    setAnchorEl(null);
  };

  const id = createUniqueId();

  return (
    <div>
      <Switch>
        <Match when={props.type == "input" || !props.type}>
          <FormControl fullWidth sx={{
            "&& .Mui-disabled": {
              color: props.locked ? "inherit" : undefined,
              WebkitTextFillColor: props.locked ? "inherit" : undefined,
            },
            "&& .Mui-disabled .MuiOutlinedInput-notchedOutline": {
              borderColor: props.locked ? "inherit" : undefined,
            }
          }}>
            <StyledInputLabel id={`${id}-select-label`}>{props.title}</StyledInputLabel>
            <StyledBadge invisible={!props.locked} badgeContent={<Lock />}>
              <StyledSelect
                size="small"
                {...props.containerProps}
                labelId={`${id}-select-label`}
                id={`${id}-select`}
                value={props.current}
                label={props.title}
                onChange={(e: SelectChangeEvent) => props.onClose?.(props.options.find(v => v.label == e.target.value as T)?.value)}
                disabled={props.disabled || props.locked}
                IconComponent={props.locked ? () => "" : undefined}
              >
                <For each={props.options}>{(opt) => {
                  return <MenuItem value={opt.label}>{opt.label}</MenuItem>
                }}
                </For>
              </StyledSelect>
            </StyledBadge>
          </FormControl>
        </Match>
        <Match when={props.type == "menu"}>
          <div>
            <Button
              sx={{
                "&:disabled": {
                  color: props.locked ? "inherit" : undefined,
                  opacity: props.locked ? 0.6 : undefined,
                }
              }}
              size="small"
              color="inherit"
              {...props.containerProps}
              id={`${id}-selector-button`}
              aria-controls={open() ? `${id}-selector-menu` : undefined}
              aria-haspopup="true"
              aria-expanded={open() ? "true" : undefined}
              disabled={props.disabled || props.locked}
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
        </Match>
      </Switch>
    </div>
  );
}
