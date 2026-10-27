import { Box, Button, IconButton, Popover, Typography } from "@suid/material";
import { createSignal, For, JSX, Show } from "solid-js";

type PopoverButtonProps = {
  title: string;
  messages: string[];
  color?: "inherit" | "primary" | "secondary" | "error" | "success" | "warning" | "info";
} & ({
  variant: "icon";
  noPadding?: boolean;
  icon: JSX.Element;
} | {
  variant?: "text" | "outlined" | "contained";
  startIcon?: JSX.Element;
  endIcon?: JSX.Element;
})

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
      <Show
        when={props.variant == "icon" ? props : null}
      >{(iconVariant) => (
        <Box sx={{
          display: "flex",
          alignItems: "center",
          alignSelf: "center",
          justifyContent: "center",
          height: iconVariant().noPadding ? "1em" : undefined,
          width: iconVariant().noPadding ? "1em" : undefined,
        }}>
          <IconButton
            aria-describedby={id()}
            onClick={handleClick}
            color={props.color || "primary"}
          >
            {iconVariant().icon}
          </IconButton>
        </Box>
      )}</Show>

      <Show
        when={props.variant != "icon" ? props : null}
      >{(buttonVariant) => (
        <Button
          aria-describedby={id()}
          onClick={handleClick}
          color={props.color || "primary"}
          startIcon={buttonVariant().startIcon}
          endIcon={buttonVariant().endIcon}
          variant={buttonVariant().variant}
        >
          {props.title}
        </Button>
      )}</Show>

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
