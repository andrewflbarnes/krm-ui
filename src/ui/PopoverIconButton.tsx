import { Button, IconButton, Popover, Typography } from "@suid/material";
import { createSignal, createUniqueId, For, JSX } from "solid-js";

type PopoverIconButtonProps = {
  messages: string[];
  icon: JSX.Element;
  color?: "inherit" | "primary" | "secondary" | "error" | "success" | "warning" | "info";
}

export default function PopoverIconButton(props: PopoverIconButtonProps) {

  const [anchorEl, setAnchorEl] = createSignal<HTMLButtonElement | null>(null);

  const handleClick = (
    event: MouseEvent & { currentTarget: HTMLButtonElement }
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = () => Boolean(anchorEl());
  const uniq = createUniqueId()
  const id = () => (open() ? `${uniq}-popover` : undefined);

  return (
    <>
      <IconButton
        aria-describedby={id()}
        onClick={handleClick}
        color={props.color || "primary"}
      >
        {props.icon}
      </IconButton>

      <Popover
        id={id()}
        open={open()}
        anchorEl={anchorEl()}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <For each={props.messages}>{(error) => (
          <Typography sx={{ p: 2 }}>{error}</Typography>
        )}</For>
      </Popover>
    </>
  )
}
