import { Card, Modal, Typography } from "@suid/material";
import { ParentProps } from "solid-js";

/**
  * A sensible defaulted modal which renders within an 80% width and height card,
  * wraps in typography and enables scroll
  */
export default function KingsModal(props: ParentProps<{
  open: boolean;
  onClose: () => void;
  container?: Element;
}>) {
  return (
    <Modal
      container={props.container}
      open={props.open}
      onClose={props.onClose}
      style={{
        display: "grid",
        height: "100%",
        width: "100%",
        "place-items": "center",
      }}
    >
      <Card
        sx={{
          width: "80%",
          maxHeight: "80%",
          padding: "1em",
          overflow: "scroll",
        }}
      >
        <Typography>
          {props.children}
        </Typography>
      </Card>
    </Modal>
  )
}
