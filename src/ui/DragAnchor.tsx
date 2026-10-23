import { DragIndicator } from "@suid/icons-material"
import { Box } from "@suid/material"

export default function DragAnchor(props: {
  dragging?: boolean;
  cursorHover?: string;
  cursorDrag?: string;
  dragActivators?: Record<string, (event: HTMLElementEventMap[keyof HTMLElementEventMap]) => void>;
  "data-testid"?: string;
}) {
  return (
    <Box sx={{
      cursor: props.dragging ? props.cursorDrag ?? "grabbing" : props.cursorHover ?? "grab",
      display: "flex",
      alignItems: "center",
      touchAction: "none",
    }}>
      <DragIndicator
        data-testid={props["data-testid"]}
        fontSize="small"
        {...props.dragActivators}
        sx={{ color: "text.disabled" }}
      />
    </Box>
  )
}
