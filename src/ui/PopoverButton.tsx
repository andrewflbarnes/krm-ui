import { Button, Popover, Typography } from "@suid/material";
import { createSignal, For, JSX } from "solid-js";

type PopoverButtonProps = {
  title: string;
  messages: string[];
  startIcon?: JSX.Element;
  endIcon?: JSX.Element;
  variant?: "text" | "outlined" | "contained";
  color?: "inherit" | "primary" | "secondary" | "error" | "success" | "warning" | "info";
}

export default function PopoverButton(props: PopoverButtonProps) {

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
  const id = () => (open() ? `${props.title}-popover` : undefined);

  return (
    <>
      <Button
        aria-describedby={id()}
        onClick={handleClick}
        color={props.color || "primary"}
        startIcon={props.startIcon}
        endIcon={props.endIcon}
      >
        {props.title}
      </Button>

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
