import { ExpandLess, ExpandMore } from "@suid/icons-material";
import { IconButton } from "@suid/material";
import { IconButtonProps } from "@suid/material/IconButton";
import { splitProps, Show } from "solid-js";

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
};

export default function ExpandMoreLess(props: ExpandMoreProps) {
  const [_, other] = splitProps(props, ["expand"]);
  return (
    <IconButton {...other}>
      <Show when={props.expand} fallback={<ExpandMore />}>
        <ExpandLess />
      </Show>
    </IconButton>
  )
}
