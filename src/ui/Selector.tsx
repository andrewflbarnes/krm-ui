import { Lock } from "@suid/icons-material";
import { Badge, Button, FormControl, InputLabel, Menu, MenuItem, Select, styled, } from "@suid/material";
import { SelectChangeEvent } from "@suid/material/Select";
import { createSignal, createUniqueId, Switch, For, Match, JSX } from "solid-js";

type SelectorProps<T extends string | number> = {
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
  containerProps?: JSX.HTMLAttributes<HTMLDivElement>
  // implementation specific
  small?: boolean;
}

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

export default function Selector<T extends string | number>(props: SelectorProps<T>) {
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
                sx={{
                  '& .MuiSelect-select': {
                    py: props.small ? '3px' : undefined,
                  }
                }}
                labelId={`${id}-select-label`}
                id={`${id}-select`}
                value={props.current}
                label={props.title}
                onChange={(e: SelectChangeEvent<T>) => props.onClose?.(e.target.value)}
                disabled={props.disabled || props.locked}
                IconComponent={props.locked ? () => "" : undefined}
              >
                <For each={props.options}>{(opt) => {
                  return <MenuItem value={opt.value}>{opt.label}</MenuItem>
                }}
                </For>
              </StyledSelect>
            </StyledBadge>
          </FormControl>
        </Match>
        <Match when={props.type == "menu"}>
          <div {...props.containerProps}>
            <Button
              sx={{
                width: "100%",
                "&:disabled": {
                  color: props.locked ? "inherit" : undefined,
                  opacity: props.locked ? 0.6 : undefined,
                }
              }}
              size="small"
              variant="outlined"
              color="inherit"
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
