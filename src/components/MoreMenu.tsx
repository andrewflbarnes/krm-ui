import { MoreVert } from "@suid/icons-material";
import { IconButton, Menu } from "@suid/material";
import { createSignal, FlowProps, JSX } from "solid-js";

export default function MoreMenu(props: FlowProps<{ id: string }, (onClose: () => void) => JSX.Element>) {
  const buttonId = () => `more-menu-button-${props.id}`
  const menuId = () => `more-menu-menu-${props.id}`
  const [anchorEl, setAnchorEl] = createSignal<null | HTMLElement>(null);
  const handleMore = (e: MouseEvent & { currentTarget: HTMLButtonElement }) => {
    e.stopPropagation()
    setAnchorEl(e.currentTarget);
  }
  const handleClose = () => setAnchorEl(null)
  const open = () => !!anchorEl()
  return (
    <>
      <IconButton
        id={buttonId()}
        size="small"
        onClick={handleMore}
        aria-controls={menuId()}
        aria-haspopup="true"
        aria-expanded={open()}
      >
        <MoreVert />
      </IconButton>
      <Menu
        id={menuId()}
        anchorEl={anchorEl()}
        open={open()}
        onClose={() => setAnchorEl(null)}
        MenuListProps={{ "aria-labelledby": buttonId() }}
      >
        {props.children(handleClose)}
      </Menu>
    </>
  )
}
