import { ExpandLess } from "@suid/icons-material";
import { IconButton } from "@suid/material";
import { IconButtonProps } from "@suid/material/IconButton";

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
  onClick?: IconButtonProps["onClick"];
};

export default function ExpandMoreLess(props: ExpandMoreProps) {
  return (
    <IconButton onClick={props.onClick} aria-expanded={props.expand} aria-label="show more">
      <ExpandLess fontSize="small" sx={{
        transform: props.expand ? "rotate(0deg)" : "rotate(180deg)",
        transition: "transform 0.2s ease",
      }} />
    </IconButton>
  )
}
