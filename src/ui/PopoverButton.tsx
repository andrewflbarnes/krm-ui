import { Warning } from "@suid/icons-material";
import { Button, Popover, Typography } from "@suid/material";
import { createSignal, For, ParentProps } from "solid-js";

// TODO make this more general rather than specific for warning/errors

type PopoverButtonProps = ParentProps<{
  errors: string[];
}>

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
  const id = () => (open() ? `${props.children}-popover` : undefined);

  return (
    <>
      <Button
        aria-describedby={id()}
        onClick={handleClick}
        color="warning"
        variant="outlined"
        startIcon={<Warning />}
      >
        {props.children || "Errors"}
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
        <For each={props.errors}>{(error) => (
          <Typography sx={{ p: 2 }}>{error}</Typography>
        )}</For>
      </Popover>
    </>
  )
}
